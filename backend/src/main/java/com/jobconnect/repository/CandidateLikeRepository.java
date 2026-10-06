package com.jobconnect.repository;

import com.jobconnect.entity.CandidateLike;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CandidateLikeRepository extends JpaRepository<CandidateLike, Long> {

    boolean existsByEmployerIdAndCandidateId(Long employerId, Long candidateId);
    Optional<CandidateLike> findByEmployerIdAndCandidateId(Long employerId, Long candidateId);
    void deleteByEmployerIdAndCandidateId(Long employerId, Long candidateId);

    Page<CandidateLike> findByEmployerId(Long employerId, Pageable pageable);
    Page<CandidateLike> findByCandidateId(Long candidateId, Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT cl FROM CandidateLike cl JOIN FETCH cl.employer WHERE cl.candidate.id = :candidateId")
    java.util.List<CandidateLike> findByCandidateIdWithEmployer(@org.springframework.data.repository.query.Param("candidateId") Long candidateId);

    long countByCandidateId(Long candidateId);
    long countByEmployerId(Long employerId);
}
