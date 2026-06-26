-- =========================================================================
-- 1. THIẾT LẬP LIÊN KẾT GIỮA USERS VÀ ADMIN_PACKAGES
-- =========================================================================
ALTER TABLE users ADD COLUMN package_id BIGINT AFTER role;

UPDATE users u 
JOIN admin_packages p ON u.package_type = p.package_type
SET u.package_id = p.id;

ALTER TABLE users 
ADD CONSTRAINT fk_users_package 
FOREIGN KEY (package_id) REFERENCES admin_packages(id) ON DELETE SET NULL;

ALTER TABLE users DROP COLUMN package_type;


-- =========================================================================
-- 2. THIẾT LẬP LIÊN KẾT GIỮA BILLING_INVOICES VÀ ADMIN_PACKAGES (MỚI BỔ SUNG)
-- =========================================================================

-- Bước A: Thêm cột khóa ngoại package_id vào bảng hóa đơn
ALTER TABLE billing_invoices ADD COLUMN package_id BIGINT AFTER user_id;

-- Bước B: Đổ dữ liệu cũ từ chữ sang ID tương ứng để không mất lịch sử hóa đơn
UPDATE billing_invoices b 
JOIN admin_packages p ON b.package_type = p.package_type
SET b.package_id = p.id;

-- Bước C: Tạo khóa ngoại trỏ sang bảng cấu hình gói dịch vụ
ALTER TABLE billing_invoices 
ADD CONSTRAINT fk_billing_invoices_package 
FOREIGN KEY (package_id) REFERENCES admin_packages(id) ON DELETE SET NULL;

-- Bước D: Xóa cột chữ package_type cũ đi cho sạch DB
ALTER TABLE billing_invoices DROP COLUMN package_type;


-- =========================================================================
-- 3. BỔ SUNG CÁC KHÓA NGOẠI KHÁC (GIỮ NGUYÊN)
-- =========================================================================
ALTER TABLE billing_invoices 
ADD CONSTRAINT fk_billing_invoices_user 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE credit_transactions 
ADD CONSTRAINT fk_credit_transactions_user 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE files 
ADD CONSTRAINT fk_files_user 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;