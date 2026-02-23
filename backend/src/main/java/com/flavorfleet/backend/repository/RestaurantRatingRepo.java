package com.flavorfleet.backend.repository;

import com.flavorfleet.backend.models.RestaurantRating;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantRatingRepo extends CrudRepository<RestaurantRating, Integer> {
}
