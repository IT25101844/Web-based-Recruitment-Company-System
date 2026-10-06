package com.jobconnect.repository;

import com.jobconnect.entity.CandidateSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateSkillRepository extends JpaRepository<CandidateSkill, CandidateSkill.CandidateSkillId> {
    List<CandidateSkill> findByCandidateId(Long candidateId);
    Optional<CandidateSkill> findByCandidateIdAndSkillId(Long candidateId, Long skillId);
    void deleteByCandidateIdAndSkillId(Long candidateId, Long skillId);
}
