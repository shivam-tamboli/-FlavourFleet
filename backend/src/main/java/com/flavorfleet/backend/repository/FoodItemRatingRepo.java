package com.flavorfleet.backend.repository;

import com.flavorfleet.backend.models.FoodItemRating;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FoodItemRatingRepo extends CrudRepository<FoodItemRating, Integer> {
}
