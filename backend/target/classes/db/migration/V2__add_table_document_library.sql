CREATE TABLE document_library (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- 🎯 ĐÃ SỬA: Đồng bộ sang CHAR(36) để làm khóa ngoại liên kết với bảng users
    user_id CHAR(36) NOT NULL,
    
    -- 🎯 ĐÃ SỬA: Đồng bộ sang CHAR(36) nếu bảng chat_sessions của ông cũng xài UUID String
    session_id CHAR(36) DEFAULT NULL,
    
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(512) DEFAULT NULL,
    category VARCHAR(100) DEFAULT NULL,
    extracted_text LONGTEXT DEFAULT NULL,
    file_size BIGINT DEFAULT NULL,
    created_at DATETIME NOT NULL,
    
    -- Gác cổng ràng buộc khóa ngoại để bảo vệ toàn vẹn dữ liệu
    CONSTRAINT fk_doc_library_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    -- CONSTRAINT fk_doc_library_session FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id) ON DELETE SET NULL
);