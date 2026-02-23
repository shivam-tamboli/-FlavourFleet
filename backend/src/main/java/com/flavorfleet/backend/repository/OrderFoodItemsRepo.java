package com.flavorfleet.backend.repository;

import com.flavorfleet.backend.models.OrderFoodItems;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderFoodItemsRepo extends CrudRepository<OrderFoodItems, Integer> {
}
