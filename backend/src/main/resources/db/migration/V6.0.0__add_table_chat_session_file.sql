CREATE TABLE chat_session_files (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    -- Session sử dụng file
    session_id INT NOT NULL,

    -- File được gắn vào session
    file_id CHAR(36) NOT NULL,

    -- Field của form mà file thuộc về
    field_code VARCHAR(100) NOT NULL,

    -- Thứ tự ghép nếu có nhiều file trong cùng field
    sort_order INT NOT NULL DEFAULT 0,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Một file chỉ được xuất hiện một lần trong cùng field của một session
    CONSTRAINT uk_session_file_field
        UNIQUE (session_id, file_id, field_code),

    -- FK -> chat_sessions
    CONSTRAINT fk_chat_session_files_session
        FOREIGN KEY (session_id)
        REFERENCES chat_sessions(session_id)
        ON DELETE CASCADE,

    -- FK -> files
    CONSTRAINT fk_chat_session_files_file
        FOREIGN KEY (file_id)
        REFERENCES files(file_id)
        ON DELETE CASCADE
);