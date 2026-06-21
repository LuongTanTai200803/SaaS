-- 1. Bảng users: Quản lý thông tin chung và ví credit
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    agency VARCHAR(255),
    role VARCHAR(50) DEFAULT 'ROLE_USER',
    credit_balance DECIMAL(15, 2) DEFAULT 0.00, -- Ví lưu trữ số lượng credit
    package_type VARCHAR(50) DEFAULT 'FREE',
    expire_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE INDEX idx_users_email (email) -- Index để tăng tốc độ truy vấn đăng nhập
);

-- 2. Bảng chat_sessions: Lưu lịch sử phiên làm việc
CREATE TABLE IF NOT EXISTS chat_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    session_name VARCHAR(255) NOT NULL,
    tag_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'DRAFT',
    wizard_state JSON, -- Lưu trữ thông tin wizard ban đầu
    chat_history JSON, -- Lưu lịch sử chat AI dạng mảng JSON
    current_editor_content LONGTEXT, -- Nội dung editor hiện tại    html_content LONGTEXT,
    export_format VARCHAR(50),    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_chat_sessions_user_id (user_id),
    INDEX idx_chat_sessions_updated_at (updated_at DESC) -- Index để tăng tốc API lấy Danh sách Recent Documents (sắp xếp giảm dần)
);

-- 3. Bảng document_library: Quản lý file đã bóc tách chữ
CREATE TABLE IF NOT EXISTS document_library (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    session_id BIGINT,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500),
    category VARCHAR(50), -- Ví dụ: INPUT_DIRECTIVE, EVIDENCE
    extracted_text LONGTEXT, -- Dữ liệu text thuần sau khi chạy tiến trình bóc tách
    file_size BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE SET NULL,
    INDEX idx_doc_lib_user_id (user_id),
    INDEX idx_doc_lib_session_id (session_id)
);

-- 4. Bảng transactions: Lưu giao dịch và đối chiếu PayOS (VietQR)
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    invoice_id VARCHAR(100) NOT NULL,
    memo_id VARCHAR(100) NOT NULL, -- Mã đối chiếu từ PayOS (VD: NAPTIEN_10293_INV99823)
    amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING', -- Trạng thái: PENDING, SUCCESS, CANCELED, FAILED
    payos_transaction_id VARCHAR(255), -- Mã giao dịch gốc do hệ thống PayOS trả về khi Webhook gọi sang
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_trans_invoice_id (invoice_id),
    UNIQUE INDEX idx_trans_memo_id (memo_id), -- Đánh Index Unique để Webhook rà soát nhanh
    INDEX idx_trans_user_id (user_id),
    INDEX idx_trans_status (status) -- Hỗ trợ truy vấn trạng thái thanh toán hoặc job quét giao dịch treo
);

-- 5. Bảng refresh_tokens: Quản lý Refresh Token stateful để đổi Access Token
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