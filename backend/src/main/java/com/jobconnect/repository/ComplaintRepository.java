package com.jobconnect.repository;

import com.jobconnect.entity.Complaint;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    Optional<Complaint> findByTicketId(String ticketId);
    boolean existsByTicketId(String ticketId);

    Page<Complaint> findByReporterIdOrderByCreatedAtDesc(Long reporterId, Pageable pageable);
    Page<Complaint> findByStatus(Complaint.TicketStatus status, Pageable pageable);
    Page<Complaint> findByPriority(Complaint.Priority priority, Pageable pageable);
    Page<Complaint> findByAssignedToId(Long assignedToId, Pageable pageable);

    long countByStatus(Complaint.TicketStatus status);
}
