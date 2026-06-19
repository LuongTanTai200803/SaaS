package com.saasai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.saasai.entity.FileUpload;

import java.util.Optional;

@Repository
public interface FileUploadRepository extends JpaRepository<FileUpload, Long> {
    Optional<FileUpload> findByFileIdAndUserId(Long fileId, Long userId);

    @org.springframework.data.jpa.repository.Query("SELECT f FROM FileUpload f JOIN User u ON f.userId = u.id WHERE u.email = :email")
    org.springframework.data.domain.Page<FileUpload> findByUserEmail(@org.springframework.data.repository.query.Param("email") String email, org.springframework.data.domain.Pageable pageable);
}
