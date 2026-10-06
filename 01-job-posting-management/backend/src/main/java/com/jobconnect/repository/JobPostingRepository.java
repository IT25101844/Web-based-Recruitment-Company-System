package com.jobconnect.repository;

import com.jobconnect.entity.JobPosting;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Long>, JpaSpecificationExecutor<JobPosting> {

    Page<JobPosting> findByEmployerId(Long employerId, Pageable pageable);
    Page<JobPosting> findByEmployerIdAndStatus(Long employerId, JobPosting.JobStatus status, Pageable pageable);

    @Query("SELECT DISTINCT jp FROM JobPosting jp " +
           "LEFT JOIN jp.requiredSkills s " +
           "WHERE (:status IS NULL OR jp.status = :status) " +
           "AND (:keyword IS NULL OR LOWER(jp.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(jp.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:location IS NULL OR LOWER(jp.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "AND (:skillName IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :skillName, '%'))) " +
           "AND (:jobType IS NULL OR jp.jobType = :jobType) " +
           "AND (:expLevel IS NULL OR jp.experienceLevel = :expLevel) " +
           "AND (:minSalary IS NULL OR jp.salaryMax >= :minSalary)")
    Page<JobPosting> searchJobs(
            @Param("status") JobPosting.JobStatus status,
            @Param("keyword") String keyword,
            @Param("location") String location,
            @Param("skillName") String skillName,
            @Param("jobType") JobPosting.JobType jobType,
            @Param("expLevel") JobPosting.ExperienceLevel expLevel,
            @Param("minSalary") BigDecimal minSalary,
            Pageable pageable
    );

    @Query("SELECT jp FROM JobPosting jp WHERE jp.status = 'APPROVED' AND jp.deadline < :now")
    List<JobPosting> findExpiredJobs(@Param("now") LocalDateTime now);

    @Modifying
    @Query("UPDATE JobPosting jp SET jp.status = 'EXPIRED' WHERE jp.status = 'APPROVED' AND jp.deadline < :now")
    int expireJobsPastDeadline(@Param("now") LocalDateTime now);

    long countByStatus(JobPosting.JobStatus status);
    long countByEmployerId(Long employerId);
    long countByEmployerIdAndStatus(Long employerId, JobPosting.JobStatus status);
}
