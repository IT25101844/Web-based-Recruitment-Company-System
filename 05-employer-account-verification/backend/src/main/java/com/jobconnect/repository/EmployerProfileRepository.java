package com.jobconnect.repository;

import com.jobconnect.entity.EmployerProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployerProfileRepository extends JpaRepository<EmployerProfile, Long> {
    Optional<EmployerProfile> findByUserId(Long userId);
    Optional<EmployerProfile> findByUserEmail(String email);
    Page<EmployerProfile> findByVerificationStatus(EmployerProfile.VerificationStatus status, Pageable pageable);
    long countByVerificationStatus(EmployerProfile.VerificationStatus status);
}
