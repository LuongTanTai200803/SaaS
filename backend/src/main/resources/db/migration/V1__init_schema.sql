-- 1. Bảng users: Quản lý thông tin chung và ví credit
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,             -- 🎯 Sửa thành NOT NULL theo Entity
    agency VARCHAR(255),
    role VARCHAR(50) NOT NULL,                   -- 🎯 Bỏ DEFAULT vì Entity ép nullable = false
    credit_balance DOUBLE,                       -- 🎯 Sửa DECIMAL thành DOUBLE theo Java (Double)
    package_type VARCHAR(50),
    expire_date DATETIME,
    
    -- 🎯 Thêm các trường Affiliate còn thiếu trong SQL cũ:
    affiliate_code VARCHAR(255),
    affiliate_link VARCHAR(255),
    total_earnings DOUBLE,
    
    -- 🎯 Sửa TIMESTAMP thành DATETIME để khớp hoàn toàn với LocalDateTime trong Java
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    
    -- Tạo Index duy nhất cho Email để tối ưu tìm kiếm và đăng nhập
    UNIQUE INDEX idx_users_email (email)
);

-- [SỬA TRONG V1] 2. Bảng chat_sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
    session_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    session_name VARCHAR(255) NOT NULL DEFAULT 'Phiên làm việc mới',
    tag_id VARCHAR(36), -- 🎯 Chuẩn hóa UUID String ngay tại đây
    status VARCHAR(50) DEFAULT 'DRAFT',
    wizard_state_json JSON,     -- Đổi sang kiểu JSON cho chuẩn
    chat_history_json JSON,     -- Đổi sang kiểu JSON cho chuẩn
    editor_content LONGTEXT,
    html_content LONGTEXT,
    export_format VARCHAR(50),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_chat_sessions_user_id (user_id),
    INDEX idx_chat_sessions_updated_at (updated_at DESC)
);

-- [SỬA TRONG V1] 3. Bảng document_library
CREATE TABLE IF NOT EXISTS document_library (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    session_id BIGINT,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500),
    category VARCHAR(50) NOT NULL DEFAULT 'INPUT_DIRECTIVE',
    extracted_text LONGTEXT,
    file_size BIGINT,
    created_at DATETIME NOT NULL, -- Đồng bộ kiểu DATETIME
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    -- 🎯 SỬA KHÓA NGOẠI: Khớp khít với cột session_id của bảng chat_sessions bên trên
    FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id) ON DELETE SET NULL, 
    INDEX idx_doc_lib_user_id (user_id),
    INDEX idx_doc_lib_session_id (session_id)
);

-- 4. Bảng transactions: Lưu giao dịch và đối chiếu PayOS (VietQR)
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    invoice_id VARCHAR(100) NOT NULL,
    memo_id VARCHAR(100) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    payos_transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_trans_invoice_id (invoice_id),
    UNIQUE INDEX idx_trans_memo_id (memo_id),
    INDEX idx_trans_user_id (user_id),
    INDEX idx_trans_status (status)
);

-- 5. Bảng refresh_tokens: Quản lý Refresh Token stateful
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    expiry_date DATETIME NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE INDEX idx_refresh_tokens_token (token),
    INDEX idx_refresh_tokens_user_email (user_email)
);

-- 6. Bảng admin_packages: Cấu hình gói dịch vụ
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
    UNIQUE INDEX idx_admin_packages_package_type (package_type)
);

-- 7. Bảng billing_invoices: Lưu hoá đơn billing
CREATE TABLE IF NOT EXISTS billing_invoices (
    invoice_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    package_type VARCHAR(50),
    duration_months INT,
    original_amount BIGINT,
    discount_amount BIGINT,
    final_amount BIGINT,
    memo_id VARCHAR(255),
    qr_code_url VARCHAR(255),
    status VARCHAR(50),
    created_at DATETIME NOT NULL,
    payment_date DATETIME,
    INDEX idx_billing_invoices_user_id (user_id)
);

-- 8. Bảng credit_transactions: Lưu lịch sử trừ/ghi credit
CREATE TABLE IF NOT EXISTS credit_transactions (
    transaction_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    input_credit DOUBLE,
    output_credit DOUBLE,
    total_credit_hold DOUBLE,
    actual_credit_deducted DOUBLE,
    refunded_credit DOUBLE,
    type VARCHAR(50),
    description LONGTEXT,
    created_at DATETIME NOT NULL,
    INDEX idx_credit_transactions_user_id (user_id)
);

-- 9. Bảng files: Lưu metadata file upload
CREATE TABLE IF NOT EXISTS files (
    file_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    file_size BIGINT,
    -- 🎯 CHỈNH TẠI ĐÂY: Khai báo tường minh đầy đủ 7 danh mục Enum giống hệt file Java
    category ENUM(
        'INPUT_DIRECTIVE', 
        'EVIDENCE', 
        'LEGAL', 
        'CONTENT', 
        'TEMPLATE', 
        'RELATED', 
        'OUTPUT_DOCUMENT'
    ) NOT NULL DEFAULT 'INPUT_DIRECTIVE',
    mime_type VARCHAR(255),
    uploaded_at DATETIME NOT NULL,
    INDEX idx_files_user_id (user_id)
);

-- 10. Bảng system_stats: Thống kê hệ thống
CREATE TABLE IF NOT EXISTS system_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    total_revenue BIGINT,
    new_users_count INT,
    active_affiliates INT,
    total_credit_consumed DOUBLE,
    active_sessions_count INT,
    total_documents_generated INT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME
);
