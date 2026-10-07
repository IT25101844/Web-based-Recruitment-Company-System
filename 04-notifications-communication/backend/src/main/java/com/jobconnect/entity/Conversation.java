package com.jobconnect.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
    name = "conversations",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_participants", columnNames = {"participant_one_id", "participant_two_id"})
    }
)
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participant_one_id", nullable = false)
    private User participantOne;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participant_two_id", nullable = false)
    private User participantTwo;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt ASC")
    private List<Message> messages = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Conversation() {}

    public Conversation(User participantOne, User participantTwo) {
        this.participantOne = participantOne;
        this.participantTwo = participantTwo;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getParticipantOne() { return participantOne; }
    public void setParticipantOne(User participantOne) { this.participantOne = participantOne; }

    public User getParticipantTwo() { return participantTwo; }
    public void setParticipantTwo(User participantTwo) { this.participantTwo = participantTwo; }

    public List<Message> getMessages() { return messages; }
    public void setMessages(List<Message> messages) { this.messages = messages; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
