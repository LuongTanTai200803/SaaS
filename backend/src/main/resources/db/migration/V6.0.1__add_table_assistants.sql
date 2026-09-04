CREATE TABLE assistants (
    assistant_id INT PRIMARY KEY ,
    assistant_name VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO assistants (assistant_id, assistant_name)
VALUES
(1, 'Trợ lý Văn Bản Đảng'),
(2, 'Trợ lý Văn bản Nhà nước'),
(3, 'Trợ lý Quản lý Giáo dục'),
(4, 'Trợ lý Rút gọn Kiểm tra')


-- ALTER TABLE chat_sessions
-- ADD COLUMN assistant_id INT NOT NULL;

-- ALTER TABLE chat_sessions
-- ADD CONSTRAINT fk_chat_sessions_assistant
-- FOREIGN KEY (assistant_id)
-- REFERENCES assistants(assistant_id)
-- ON DELETE RESTRICT;
