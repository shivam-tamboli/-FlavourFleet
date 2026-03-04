package com.flavorfleet.backend.service;

import com.flavorfleet.backend.models.*;
import com.flavorfleet.backend.repository.*;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserInfoRepo userInfoRepo;
    private final RestaurantInfoRepo restaurantInfoRepo;
    private final FoodItemRepo foodItemRepo;
    private final OrderFoodItemsRepo orderFoodItemsRepo;
    private final OrderInfoRepo orderInfoRepo;
    private final RestaurantRatingRepo restaurantRatingRepo;
    private final FoodItemRatingRepo foodItemRatingRepo;


    public UserService(UserInfoRepo userInfoRepo, RestaurantInfoRepo restaurantInfoRepo, FoodItemRepo foodItemRepo,
                       OrderFoodItemsRepo orderFoodItemsRepo, OrderInfoRepo orderInfoRepo, RestaurantRatingRepo restaurantRatingRepo,
                       FoodItemRatingRepo foodItemRatingRepo) {
        this.userInfoRepo = userInfoRepo;
        this.restaurantInfoRepo = restaurantInfoRepo;
        this.foodItemRepo = foodItemRepo;
        this.orderFoodItemsRepo = orderFoodItemsRepo;
        this.orderInfoRepo = orderInfoRepo;
        this.restaurantRatingRepo = restaurantRatingRepo;
        this.foodItemRatingRepo = foodItemRatingRepo;
    }

    public ResponseEntity<String> signUp(Map<String, String> signup) {

        // Check if phone number already exists
        Optional<UserInfo> existing = userInfoRepo.findByPhoneNumber(signup.get("phonenumber"));
        if (existing.isPresent()) {
            return new ResponseEntity<>("phone", HttpStatus.OK);
        }

        UserInfo userInfo = new UserInfo();
        userInfo.setName(signup.get("name"));
        userInfo.setPhoneNumber(signup.get("phonenumber"));
        userInfo.setSecretQuestion(signup.get("secretquestion"));
        userInfo.setAddress(signup.get("address"));
        userInfo.setAnswer(signup.get("answer"));
        userInfo.setPassword(signup.get("password"));
        userInfo.setLoginStatus(Boolean.FALSE);

        // Admin signup: if admincode matches, set role to 0 (admin)
        String adminCode = signup.get("admincode");
        if (adminCode != null && adminCode.equals("FLAVOURFLEET2026")) {
            userInfo.setRole(0);
        }

        userInfo = userInfoRepo.save(userInfo);

        return new ResponseEntity<>("success", HttpStatus.OK);
    }

    public ResponseEntity<String> login(Map<String, String> login) {

        Optional<UserInfo> userInfo = userInfoRepo.findByPhoneNumber(login.get("phonenumber"));
        UserInfo userInfo1 = userInfo.get();
        if (userInfo1.getRole() == 0) {
            userInfo1.setLoginStatus(Boolean.TRUE);
            userInfo1 = userInfoRepo.save(userInfo1);

            return new ResponseEntity<>("Success_admin", HttpStatus.OK);
        } else {
            userInfo1.setLoginStatus(Boolean.TRUE);
            userInfo1 = userInfoRepo.save(userInfo1);
            return new ResponseEntity<>("Success_user", HttpStatus.OK);
        }
    }


    public ResponseEntity<String> logout(Map entity) {
        Optional<UserInfo> userInfo = userInfoRepo.findByPhoneNumber((String) entity.get("phonenumber"));
        UserInfo userInfo1 = userInfo.get();
        userInfo1.setLoginStatus(Boolean.FALSE);
        userInfo1 = userInfoRepo.save(userInfo1);
        return ResponseEntity.ok().body("success");
    }


    public ResponseEntity<String> forgotPassword(Map<String, String> forgot) {
        Optional<UserInfo> userInfo = userInfoRepo.findByPhoneNumber(forgot.get("phonenumber"));
        UserInfo userInfo1 = userInfo.get();
        return new ResponseEntity<>(userInfo1.getSecretQuestion(), HttpStatus.OK);
    }


    public ResponseEntity<String> resetPassword(Map<String, String> forgotPassword) {
        Optional<UserInfo> userInfo = userInfoRepo.findByPhoneNumber(forgotPassword.get("phonenumber"));

        if (userInfo.isEmpty()) {
            return new ResponseEntity<>("user_not_found", HttpStatus.OK);
        }

        UserInfo userInfo1 = userInfo.get();

        if (!userInfo1.getSecretQuestion().equals(forgotPassword.get("secretquestion"))) {
            return new ResponseEntity<>("invalid_question", HttpStatus.OK);
        }

        if (!userInfo1.getAnswer().equals(forgotPassword.get("answer"))) {
            return new ResponseEntity<>("answer", HttpStatus.OK);
        }

        String newPassword = forgotPassword.get("newpassword");
        if (newPassword == null || newPassword.isEmpty()) {
            newPassword = forgotPassword.get("password");
        }
        if (newPassword == null || newPassword.isEmpty()) {
            return new ResponseEntity<>("password_required", HttpStatus.OK);
        }

        userInfo1.setPassword(newPassword);
        userInfoRepo.save(userInfo1);

        return new ResponseEntity<>("success", HttpStatus.OK);
    }


    public ResponseEntity<List<RestaurantInfo>> searchByName(Map<String, String> entity) {
        String search = entity.get("search");
        String[] words = search.split(" ");

        ArrayList<RestaurantInfo> common = new ArrayList<>();
        for (int i = 0; i < words.length; i++) {
            if (words[i].isEmpty()) {
                continue;
            }
            common.addAll(restaurantInfoRepo.findByRestaurantNameContaining(words[i],
                    Sort.by(Sort.Direction.DESC, "restaurantRating")));
        }

        Set<RestaurantInfo> set = new LinkedHashSet<>(common);
        List<RestaurantInfo> restaurant = new ArrayList<>(set);

        return ResponseEntity.ok().body(restaurant);
    }


    public ResponseEntity<List<SearchFoodItem>> searchByFoodItem(Map<String, String> entity) {

        String search = entity.get("search");
        String[] words = search.split(" ");

        List<FoodItem> common = new ArrayList<FoodItem>();
        for (int i = 0; i < words.length; i++) {
            if (words[i] == "") {
                continue;
            }
            common.addAll(foodItemRepo.findByFoodNameContaining(words[i],
                    Sort.by(Sort.Direction.DESC, "foodItemRating")));
        }
        List<FoodItem> foodItems = common;
        ListIterator<FoodItem> itr = foodItems.listIterator();
        List<SearchFoodItem> sfooditem = new ArrayList<>();
        while (itr.hasNext()) {
            FoodItem food = itr.next();
            RestaurantInfo rest = food.getRestaurantInfo();
            SearchFoodItem searchFood = new SearchFoodItem(rest.getRestaurantId(), rest.getRestaurantName(),
                    rest.getRestaurantAddress(), rest.getRestaurantRating(), food);
            sfooditem.add(searchFood);
        }
        Set<SearchFoodItem> set = new LinkedHashSet<>(sfooditem);
        List<SearchFoodItem> food = new ArrayList<>(set);

        return ResponseEntity.ok().body(food);

    }


    public ResponseEntity<String> placeOrder(Map entity) {

        System.out.println("=== PLACE ORDER DEBUG ===");
        entity.forEach((key, value) ->
                System.out.println("Key: " + key + " Value: " + value));
        System.out.println("=========================");

        // ---------- RESTAURANT ----------
        Integer restaurantId = (Integer) entity.get("restaurantid");

        RestaurantInfo rest = restaurantInfoRepo.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        // ---------- USER ----------
        String phoneNumber = (String) entity.get("phonenumber");

        UserInfo user = userInfoRepo.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ---------- CREATE ORDER ----------
        OrderInfo orderInfo = new OrderInfo();
        orderInfo.setRestaurantId(rest.getRestaurantId());
        orderInfo.setRestaurantName(rest.getRestaurantName());
        orderInfo.setUserId(user.getUserId());
        orderInfo.setDeliveryAddress((String) entity.get("deliveryaddress"));

        // ---------- ARRAYS ----------
        ArrayList<String> fooditemid = (ArrayList<String>) entity.get("fooditemid");
        ArrayList<String> foodname = (ArrayList<String>) entity.get("foodname");
        ArrayList<String> quantity = (ArrayList<String>) entity.get("quantity");

        if (fooditemid == null || quantity == null || fooditemid.isEmpty()) {
            return new ResponseEntity<>("Invalid order data", HttpStatus.BAD_REQUEST);
        }

        int totalAmount = 0;

        // ---------- PROCESS ITEMS ----------
        for (int i = 0; i < fooditemid.size(); i++) {

            Integer foodId = Integer.parseInt(fooditemid.get(i));
            Integer qty = Integer.parseInt(quantity.get(i));

            FoodItem foodItem = foodItemRepo.findById(foodId)
                    .orElseThrow(() -> new RuntimeException("Food item not found"));

            OrderFoodItems orderFoodItems = new OrderFoodItems();

            orderFoodItems.setFoodItemId(foodId);
            orderFoodItems.setFoodName(foodItem.getFoodName());
            orderFoodItems.setQuantity(qty);

            // ✅ CALCULATE AMOUNT FROM DATABASE (SECURE)
            int amount = foodItem.getPrice() * qty;
            orderFoodItems.setAmount(amount);

            totalAmount += amount;

            orderFoodItems.setOrderInfo(orderInfo);
            orderInfo.getOrderFoodItems().add(orderFoodItems);
        }

        // ---------- SET TOTAL ----------
        orderInfo.setTotalAmount(totalAmount);

        // ---------- SAVE ONCE ----------
        orderInfoRepo.save(orderInfo);

        System.out.println("Order Saved Successfully: " + orderInfo);

        return ResponseEntity.ok("success");
    }

    public ResponseEntity<String> rateOrder(Map<String, Object> entity) {
        Integer restaurantId = (Integer) entity.get("restaurantId");
        RestaurantInfo rest = restaurantInfoRepo.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        String phoneNumber = (String) entity.get("phonenumber");
        UserInfo user = userInfoRepo.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Fetch order (REMOVED the setOrderFlag line)
        Integer orderId = (Integer) entity.get("orderId");
        OrderInfo orderInfo = orderInfoRepo.findByUserIdAndOrderId(user.getUserId(), orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Mark order as rated
        orderInfo.setOrderFlag(1);
        orderInfoRepo.save(orderInfo);

        // Update restaurant rating
        Float ratingValue = ((Number) entity.get("restaurantRating")).floatValue();
        if (rest.getRestaurantRating() == 0.0f) {
            rest.setRestaurantRating(ratingValue);
            rest.setNumOfRating(rest.getNumOfRating() + 1);
        } else {
            Float newRating = (float) (((rest.getRestaurantRating() * rest.getNumOfRating()) + ratingValue)
                    / (rest.getNumOfRating() + 1));
            rest.setRestaurantRating(newRating);
            rest.setNumOfRating(rest.getNumOfRating() + 1);
        }
        restaurantInfoRepo.save(rest);

        RestaurantRating restaurantRating = new RestaurantRating();
        restaurantRating.setName(user.getName());
        restaurantRating.setRestaurantId(restaurantId);
        restaurantRating.setRestaurantName(rest.getRestaurantName());
        restaurantRating.setRestaurantRating(rest.getRestaurantRating());
        restaurantRating.setRestaurantReview((String) entity.get("restaurantReview"));
        restaurantRatingRepo.save(restaurantRating);

        // Save food item ratings
        List<String> foodItemIds = (List<String>) entity.get("foodItemIds");
        List<String> foodItemRatings = (List<String>) entity.get("foodItemRatings");
        List<String> foodItemReviews = (List<String>) entity.get("foodItemReviews");

        if (foodItemIds != null && !foodItemIds.isEmpty()) {
            for (int i = 0; i < foodItemIds.size(); i++) {
                Integer foodId = Integer.parseInt(foodItemIds.get(i));
                Double foodRatingValue = Double.parseDouble(foodItemRatings.get(i));
                String foodReview = foodItemReviews.get(i);

                FoodItem foodItem = foodItemRepo.findById(foodId)
                        .orElseThrow(() -> new RuntimeException("Food item not found"));

                // Update FoodItemRating entity
                FoodItemRating foodItemRating = new FoodItemRating();
                foodItemRating.setName(user.getName());
                foodItemRating.setRestaurantId(restaurantId);
                foodItemRating.setRestaurantName(rest.getRestaurantName());
                foodItemRating.setFoodItemId(foodId);
                foodItemRating.setFoodName(foodItem.getFoodName());
                foodItemRating.setFoodItemRating(foodRatingValue);
                foodItemRating.setFoodItemReview(foodReview);
                foodItemRatingRepo.save(foodItemRating);

                // Update FoodItem aggregate rating
                if (foodItem.getFoodItemRating() == 0.0) {
                    foodItem.setFoodItemRating(foodRatingValue);
                    foodItem.setNumOfRating(foodItem.getNumOfRating() + 1);
                } else {
                    Double newFoodRating = ((foodItem.getFoodItemRating() * foodItem.getNumOfRating())
                            + foodRatingValue) / (foodItem.getNumOfRating() + 1);
                    foodItem.setFoodItemRating(newFoodRating);
                    foodItem.setNumOfRating(foodItem.getNumOfRating() + 1);
                }
                foodItemRepo.save(foodItem);
            }
        }

        return ResponseEntity.ok("success");
    }

    public ResponseEntity<List<FoodItemDetails>> getAllFoodItems(){
        List<FoodItem> foodItem =  foodItemRepo.findAll();
        ListIterator<FoodItem> itr = foodItem.listIterator();

        List<FoodItemDetails> fid = new ArrayList<FoodItemDetails>();

        while (itr.hasNext()){
            FoodItem foodItem1 = itr.next();

            RestaurantInfo ri = foodItem1.getRestaurantInfo();
            FoodItemDetails fs = new FoodItemDetails(ri.getRestaurantId(), foodItem1, ri.getRestaurantName());
            fid.add(fs);
        }
        return ResponseEntity.ok().body(fid);
    }

    public ResponseEntity<List<OrderInfo>> getAllOrderDetails(Map entity) {

        String phoneNumber = (String) entity.get("phonenumber");

        if (phoneNumber == null || phoneNumber.isEmpty()) {
            System.out.println("Phone number is null or empty in getAllOrderDetails");
            return ResponseEntity.ok().body(new ArrayList<>());
        }

        Optional<UserInfo> userInfo = userInfoRepo.findByPhoneNumber(phoneNumber);


        if (userInfo.isEmpty()) {
            System.out.println("User not found for phone: " + phoneNumber);
            return ResponseEntity.ok().body(new ArrayList<>());
        }

        UserInfo user = userInfo.get();
        int id = user.getUserId();
        List<OrderInfo> oi = orderInfoRepo.findAllByUserid(id);

        return ResponseEntity.ok().body(oi);
    }

    public ResponseEntity<List<RestaurantInfo>> getAllRestaurants() {
        List<RestaurantInfo> restaurants = restaurantInfoRepo.findAll();
        return ResponseEntity.ok().body(restaurants);
    }

    public ResponseEntity<List<FoodItem>> getFoodItemsByRestaurant(Map<String, Integer> entity) {
        Integer restaurantId = entity.get("restaurantid");

        // Get all food items and filter by restaurant ID
        List<FoodItem> allFoodItems = foodItemRepo.findAll();
        List<FoodItem> restaurantFoods = allFoodItems.stream()
                .filter(food -> food.getRestaurantInfo().getRestaurantId().equals(restaurantId))
                .collect(Collectors.toList());

        return ResponseEntity.ok().body(restaurantFoods);
    }

    public ResponseEntity<Map<String, String>> getProfile(Map<String, String> entity) {
        String phoneNumber = entity.get("phonenumber");
        Optional<UserInfo> userInfo = userInfoRepo.findByPhoneNumber(phoneNumber);
        if (userInfo.isEmpty()) {
            return new ResponseEntity<>(Map.of("error", "User not found"), HttpStatus.NOT_FOUND);
        }
        UserInfo user = userInfo.get();
        Map<String, String> profile = new java.util.HashMap<>();
        profile.put("name", user.getName());
        profile.put("phone", user.getPhoneNumber());
        profile.put("address", user.getAddress());
        profile.put("role", String.valueOf(user.getRole()));
        return ResponseEntity.ok().body(profile);
    }

}