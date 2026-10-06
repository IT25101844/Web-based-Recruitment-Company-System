package com.jobconnect.repository;

import com.jobconnect.entity.CandidateProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateProfileRepository extends JpaRepository<CandidateProfile, Long>, JpaSpecificationExecutor<CandidateProfile> {
    
    Optional<CandidateProfile> findByUserId(Long userId);
    Optional<CandidateProfile> findByUserEmail(String email);

    @Query("SELECT DISTINCT cp FROM CandidateProfile cp " +
           "LEFT JOIN cp.candidateSkills cs " +
           "LEFT JOIN cs.skill s " +
           "LEFT JOIN cp.educationList edu " +
           "LEFT JOIN cp.experienceList exp " +
           "WHERE (:keyword IS NULL OR " +
           "       LOWER(cp.user.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "       LOWER(cp.headline) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "       LOWER(cp.professionalSummary) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:location IS NULL OR LOWER(cp.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "AND (:skillName IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :skillName, '%'))) " +
           "AND (:education IS NULL OR LOWER(edu.qualification) LIKE LOWER(CONCAT('%', :education, '%')) OR LOWER(edu.institution) LIKE LOWER(CONCAT('%', :education, '%'))) " +
           "AND (:experienceTitle IS NULL OR LOWER(exp.jobTitle) LIKE LOWER(CONCAT('%', :experienceTitle, '%')) OR LOWER(exp.company) LIKE LOWER(CONCAT('%', :experienceTitle, '%')))")
    Page<CandidateProfile> searchCandidates(
            @Param("keyword") String keyword,
            @Param("location") String location,
            @Param("skillName") String skillName,
            @Param("education") String education,
            @Param("experienceTitle") String experienceTitle,
            Pageable pageable
    );

    @Query("SELECT cp FROM CandidateProfile cp LEFT JOIN FETCH cp.user WHERE cp.id = :id")
    Optional<CandidateProfile> findByIdWithUser(@Param("id") Long id);
}
