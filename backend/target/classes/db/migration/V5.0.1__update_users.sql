-- Thêm các cột hỗ trợ OAuth2 / Google Login
ALTER TABLE users
    ADD COLUMN provider VARCHAR(20)
        DEFAULT 'LOCAL'
        COMMENT 'LOCAL, GOOGLE, FACEBOOK...',
    ADD COLUMN provider_id VARCHAR(255)
        COMMENT 'ID từ Google/Facebook',
    ADD COLUMN avatar_url VARCHAR(500)
        COMMENT 'Ảnh đại diện từ Google',
    ADD COLUMN password_reset_token VARCHAR(255),
    ADD COLUMN verification_token VARCHAR(255)
        COMMENT 'Token xác minh email';

-- Thêm index
CREATE INDEX idx_users_provider
    ON users(provider);

CREATE INDEX idx_users_provider_id
    ON users(provider_id);

CREATE INDEX idx_users_verification_token
    ON users(verification_token);

-- Chuẩn hóa dữ liệu cũ
UPDATE users
SET provider = 'LOCAL'
WHERE provider IS NULL;