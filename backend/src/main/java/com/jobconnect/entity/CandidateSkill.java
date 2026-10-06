package com.jobconnect.entity;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "candidate_skills")
public class CandidateSkill {

    @EmbeddedId
    private CandidateSkillId id = new CandidateSkillId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("candidateId")
    @JoinColumn(name = "candidate_id")
    private CandidateProfile candidate;

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("skillId")
    @JoinColumn(name = "skill_id")
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(name = "proficiency_level", length = 30)
    private ProficiencyLevel proficiencyLevel = ProficiencyLevel.INTERMEDIATE;

    public enum ProficiencyLevel {
        BEGINNER,
        INTERMEDIATE,
        ADVANCED,
        EXPERT
    }

    @Embeddable
    public static class CandidateSkillId implements Serializable {
        private Long candidateId;
        private Long skillId;

        public CandidateSkillId() {}

        public CandidateSkillId(Long candidateId, Long skillId) {
            this.candidateId = candidateId;
            this.skillId = skillId;
        }

        public Long getCandidateId() { return candidateId; }
        public void setCandidateId(Long candidateId) { this.candidateId = candidateId; }

        public Long getSkillId() { return skillId; }
        public void setSkillId(Long skillId) { this.skillId = skillId; }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof CandidateSkillId that)) return false;
            return Objects.equals(candidateId, that.candidateId) && Objects.equals(skillId, that.skillId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(candidateId, skillId);
        }
    }

    public CandidateSkill() {}

    public CandidateSkill(CandidateProfile candidate, Skill skill, ProficiencyLevel proficiencyLevel) {
        this.candidate = candidate;
        this.skill = skill;
        this.proficiencyLevel = proficiencyLevel;
        this.id = new CandidateSkillId(candidate.getId(), skill.getId());
    }

    public CandidateSkillId getId() { return id; }
    public void setId(CandidateSkillId id) { this.id = id; }

    public CandidateProfile getCandidate() { return candidate; }
    public void setCandidate(CandidateProfile candidate) {
        this.candidate = candidate;
        if (candidate != null && skill != null) {
            this.id = new CandidateSkillId(candidate.getId(), skill.getId());
        }
    }

    public Skill getSkill() { return skill; }
    public void setSkill(Skill skill) {
        this.skill = skill;
        if (candidate != null && skill != null) {
            this.id = new CandidateSkillId(candidate.getId(), skill.getId());
        }
    }

    public ProficiencyLevel getProficiencyLevel() { return proficiencyLevel; }
    public void setProficiencyLevel(ProficiencyLevel proficiencyLevel) { this.proficiencyLevel = proficiencyLevel; }
}
