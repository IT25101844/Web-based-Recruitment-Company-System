package com.jobconnect.repository;

import com.jobconnect.entity.EmployerDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployerDocumentRepository extends JpaRepository<EmployerDocument, Long> {
    List<EmployerDocument> findByEmployerId(Long employerId);
}
