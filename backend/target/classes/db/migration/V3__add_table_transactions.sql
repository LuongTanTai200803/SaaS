CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    
    -- 🎯 ĐÃ SỬA: Đồng bộ sang CHAR(36) để làm khóa ngoại liên kết với bảng users
    user_id CHAR(36) NOT NULL,
    
    -- 🎯 ĐÃ SỬA: Đồng bộ liên kết chuỗi UUID với bảng hóa đơn billing_invoices
    invoice_id VARCHAR(255) NOT NULL,
    
    memo_id VARCHAR(255) NOT NULL,
    amount DECIMAL(38, 2) NOT NULL, -- Đồng bộ chuẩn kiểu BigDecimal của Java dưới MySQL
    status VARCHAR(50) DEFAULT 'PENDING',
    payos_transaction_id VARCHAR(255) DEFAULT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    
    -- 🔒 GÁC CỔNG RÀNG BUỘC KHÓA NGOẠI: Đảm bảo toàn vẹn dữ liệu hệ thống SaaS
    CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    -- CONSTRAINT fk_transactions_invoice FOREIGN KEY (invoice_id) REFERENCES billing_invoices(invoice_id) ON DELETE CASCADE
);