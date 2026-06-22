package com.guidance.repository;
import com.guidance.model.ProjectGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProjectGroupRepository extends JpaRepository<ProjectGroup, Long> {

    Optional<ProjectGroup> findByGroupNameIgnoreCase(String groupName);

    // Finds groups where the user is either a member or the assigned mentor
    @Query("SELECT g FROM ProjectGroup g LEFT JOIN g.members m WHERE (m.id = :userId OR g.mentor.id = :userId) AND g.status = 'NORMAL'")
    List<ProjectGroup> findActiveGroupsByUserId(Long userId);

    @Query("SELECT g FROM ProjectGroup g WHERE g.mentor.id = :mentorId AND g.status = 'NORMAL' " +
            "AND EXISTS (SELECT 1 FROM Project p WHERE LOWER(p.groupName) = LOWER(g.groupName))")
    List<ProjectGroup> findByMentorId(Long mentorId);
}
