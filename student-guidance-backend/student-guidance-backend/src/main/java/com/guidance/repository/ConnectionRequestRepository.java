package com.guidance.repository;
import com.guidance.model.ConnectionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
public interface ConnectionRequestRepository extends JpaRepository<ConnectionRequest, Long> {
    @Query("SELECT r FROM ConnectionRequest r WHERE r.mentor.email = :email AND r.status = -1")
    List<ConnectionRequest> findPendingRequestsByMentorEmail(@Param("email") String email);
    List<ConnectionRequest> findByGroupIdAndStatus(Long groupId, Integer status);
}
