package com.guidance.repository;

import com.guidance.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    // Converted to LOWER case handling to ensure string matching doesn't fail on casing differences
//    @Query("SELECT p FROM Project p WHERE LOWER(p.groupName) IN :groupNames")
    List<Project> findByGroupNameInIgnoreCase(@Param("groupNames") List<String> groupNames);

    //For single group
    Optional<Project> findByGroupNameIgnoreCase(String groupName);
}