package com.jobconnect.repository;

import com.jobconnect.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByConversationIdOrderByCreatedAtAsc(Long conversationId);
    Page<Message> findByConversationIdOrderByCreatedAtDesc(Long conversationId, Pageable pageable);

    @Modifying
    @Query("UPDATE Message m SET m.read = true WHERE m.conversation.id = :conversationId AND m.receiver.id = :receiverId AND m.read = false")
    int markConversationMessagesAsRead(@Param("conversationId") Long conversationId, @Param("receiverId") Long receiverId);

    @Modifying
    @Query("DELETE FROM Message m WHERE m.conversation.id = :conversationId")
    void deleteByConversationId(@Param("conversationId") Long conversationId);

    long countByReceiverIdAndReadFalse(Long receiverId);
}
