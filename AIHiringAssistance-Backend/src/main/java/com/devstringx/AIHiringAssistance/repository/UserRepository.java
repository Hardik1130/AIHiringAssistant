package com.devstringx.AIHiringAssistance.repository;

import com.devstringx.AIHiringAssistance.modal.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity,Long> {

    Optional<UserEntity> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<UserEntity> findByUserId(String userId);

    // Fetch multiple users by their unique String userIds
    List<UserEntity> findByUserIdIn(List<String> userIds);


}
