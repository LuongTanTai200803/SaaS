ALTER TABLE files
    ADD COLUMN raw_text LONGTEXT NULL COMMENT 'Nội dung gốc sau khi extract',
    ADD COLUMN normalized_text LONGTEXT NULL COMMENT 'Nội dung sau khi normalize',
    ADD COLUMN word_count INT NOT NULL DEFAULT 0 COMMENT 'Số lượng từ',
    ADD COLUMN character_count INT NOT NULL DEFAULT 0 COMMENT 'Số lượng ký tự',
    ADD COLUMN extraction_status VARCHAR(30) NOT NULL DEFAULT 'UPLOADED' COMMENT 'Trạng thái xử lý file',
    ADD COLUMN extracted_at DATETIME NULL COMMENT 'Thời điểm hoàn thành extract';