package com.guidance.repository;

import com.guidance.model.Profile;
import com.guidance.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Optional<Profile> findByUser(User user);

    @Query("SELECT p FROM Profile p JOIN p.user u WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            "LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.skills) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Profile> searchPotentialMentors(@Param("search") String search);
}
