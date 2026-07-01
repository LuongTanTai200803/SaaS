-- =========================================================================
-- 1. BẢNG CẤU HÌNH GÓI DỊCH VỤ ĐỘNG (ADMIN_PACKAGES)
-- =========================================================================
CREATE TABLE IF NOT EXISTS admin_packages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    package_type VARCHAR(50) NOT NULL,
    price BIGINT NOT NULL,
    credit_limit DOUBLE NOT NULL,
    allowed_models JSON,
    description VARCHAR(255),
    storage_quota_mb BIGINT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    UNIQUE INDEX idx_admin_packages_type (package_type)
);

-- =========================================================================
-- 2. BẢNG NGƯỜI DÙNG (USERS)
-- =========================================================================
CREATE TABLE IF NOT EXISTS users (
    user_id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    agency VARCHAR(255),
    role VARCHAR(50) NOT NULL,
    package_id BIGINT, -- Khóa ngoại trực tiếp trỏ sang admin_packages
    credit_balance DOUBLE,
    expire_date DATETIME,
    affiliate_code VARCHAR(255),
    affiliate_link VARCHAR(255),
    total_earnings DOUBLE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    UNIQUE INDEX idx_users_email (email),
    CONSTRAINT fk_users_package FOREIGN KEY (package_id) REFERENCES admin_packages(id) ON DELETE SET NULL
);

-- =========================================================================
-- 3. BẢNG PHIÊN CHAT (CHAT_SESSIONS)
-- =========================================================================
CREATE TABLE IF NOT EXISTS chat_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,   
    session_uuid VARCHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    session_name VARCHAR(255) NOT NULL DEFAULT 'Phiên làm việc mới',
    tag_id VARCHAR(36),
    status VARCHAR(50) DEFAULT 'DRAFT',
    wizard_state_json JSON,
    chat_history_json JSON,
    editor_content LONGTEXT,
    html_content LONGTEXT,
    export_format VARCHAR(50),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_chat_sessions_user_id (user_id)
);

-- =========================================================================
-- 4. BẢNG MÃ LÀM MỚI TOKEN (REFRESH_TOKENS)
-- =========================================================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expiry_date DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE INDEX idx_refresh_tokens_token (token)
);

-- =========================================================================
-- 5. BẢNG HÓA ĐƠN THANH TOÁN (BILLING_INVOICES)
-- =========================================================================
CREATE TABLE IF NOT EXISTS billing_invoices (
    invoice_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    package_id BIGINT, -- Khóa ngoại trực tiếp trỏ sang admin_packages
    duration_months INT,
    original_amount BIGINT,
    discount_amount BIGINT,
    final_amount BIGINT,
    memo_id VARCHAR(255),
    qr_code_url VARCHAR(255),
    status VARCHAR(50),
    created_at DATETIME NOT NULL,
    payment_date DATETIME,
    INDEX idx_billing_invoices_user_id (user_id),
    CONSTRAINT fk_billing_invoices_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_billing_invoices_package FOREIGN KEY (package_id) REFERENCES admin_packages(id) ON DELETE SET NULL
);

-- =========================================================================
-- 6. BẢNG NHẬT KÝ GIAO DỊCH CREDITS (CREDIT_TRANSACTIONS)
-- =========================================================================
CREATE TABLE IF NOT EXISTS credit_transactions (
    transaction_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    input_credit DOUBLE,
    output_credit DOUBLE,
    total_credit_hold DOUBLE,
    actual_credit_deducted DOUBLE,
    refunded_credit DOUBLE,
    type VARCHAR(50),
    description LONGTEXT,
    created_at DATETIME NOT NULL,
    INDEX idx_credit_transactions_user_id (user_id),
    CONSTRAINT fk_credit_transactions_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- =========================================================================
-- 7. BẢNG QUẢN LÝ TẬP TIN UPLOAD (FILES)
-- =========================================================================
CREATE TABLE IF NOT EXISTS files (
    file_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    file_size BIGINT,
    category VARCHAR(50) NOT NULL DEFAULT 'INPUT_DIRECTIVE',
    mime_type VARCHAR(255),
    uploaded_at DATETIME NOT NULL,
    INDEX idx_files_user_id (user_id),
    CONSTRAINT fk_files_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- =========================================================================
-- 8. BẢNG THỐNG KÊ HỆ THỐNG (SYSTEM_STATS)
-- =========================================================================
CREATE TABLE IF NOT EXISTS system_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    total_revenue BIGINT DEFAULT 0,
    new_users_count BIGINT DEFAULT 0,
    active_affiliates BIGINT DEFAULT 0,
    total_credit_consumed DOUBLE DEFAULT 0.0,
    active_sessions_count BIGINT DEFAULT 0,
    total_documents_generated BIGINT DEFAULT 0,
    updated_at DATETIME NOT NULL
);