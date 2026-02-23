package com.flavorfleet.backend.controller;

import com.flavorfleet.backend.models.FoodItem;
import com.flavorfleet.backend.models.RestaurantDetails;
import com.flavorfleet.backend.service.RestaurantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "/flavorfleet")
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService){
        this.restaurantService = restaurantService;
    }

    @GetMapping(value = "get-restaurants")
    public ResponseEntity<ArrayList<RestaurantDetails>> getRestaurants(){
        return restaurantService.getRestaurants();
    }

    @GetMapping(value = "get-fooditems")
    public ResponseEntity<List<FoodItem>> getFoodItems(@RequestParam("restaurantId") Integer restaurantId) {
        return restaurantService.getFoodItems(restaurantId);
    }



}
