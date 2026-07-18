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
            // 1. Exclude users who are members or the mentor of this group
            "u.id NOT IN (SELECT m.id FROM ProjectGroup pg JOIN pg.members m WHERE pg.id = :groupId) " +
            "AND (u.id != (SELECT COALESCE(pg.mentor.id, 0) FROM ProjectGroup pg WHERE pg.id = :groupId)) " +
            // 2. Existing search filter criteria
            "AND (:search IS NULL OR :search = '' OR " +
            "LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.skills) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Profile> searchPotentialMentors(
            @Param("groupId") Long groupId,
            @Param("search") String search
    );
}
