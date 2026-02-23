package com.flavorfleet.backend.repository;

import com.flavorfleet.backend.models.UserInfo;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface UserInfoRepo extends CrudRepository<UserInfo, Integer> {

    public Optional<UserInfo> findByPhoneNumber(String phoneNumber);
}
