package com.saasai.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.saasai.entity.ChatSession;
import com.saasai.entity.User;

import java.util.Optional;

@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSession, Integer> {
    Page<ChatSession> findByUser_UserIdOrderByUpdatedAtDesc(String userId, Pageable pageable);

    Optional<ChatSession> findBySessionIdAndUser_UserId(Integer sessionId, String userId);
    
    Optional<ChatSession> findBySessionUuidAndUser_UserId(String sessionUuid, String userId);

    
}
