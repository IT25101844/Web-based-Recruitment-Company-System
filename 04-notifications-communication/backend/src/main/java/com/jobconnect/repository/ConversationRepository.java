package com.jobconnect.repository;

import com.jobconnect.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("SELECT c FROM Conversation c WHERE " +
           "(c.participantOne.id = :u1 AND c.participantTwo.id = :u2) OR " +
           "(c.participantOne.id = :u2 AND c.participantTwo.id = :u1)")
    Optional<Conversation> findBetweenUsers(@Param("u1") Long u1, @Param("u2") Long u2);

    @Query("SELECT c FROM Conversation c WHERE " +
           "c.participantOne.id = :userId OR c.participantTwo.id = :userId " +
           "ORDER BY c.updatedAt DESC")
    List<Conversation> findUserConversations(@Param("userId") Long userId);
}
