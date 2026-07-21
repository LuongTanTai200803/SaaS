INSERT INTO admin_packages (id, package_type, price, credit_limit, allowed_models, description, storage_quota_mb, created_at, updated_at)
VALUES 
(1, 'FREE', 0, 50.0, '["gpt-4o-mini", "claude-3-haiku"]', 'Gói dùng thử miễn phí cho người dùng mới', 100, NOW(), NOW()),
(2, 'STANDARD', 199000, 500.0, '["gpt-4o-mini", "gpt-4o", "claude-3-haiku", "claude-3-5-sonnet"]', 'Gói tiêu chuẩn phù hợp cá nhân', 2048, NOW(), NOW()),
(3, 'PREMIUM', 499000, 1500.0, '["gpt-4o", "claude-3-5-sonnet", "gemini-1.5-pro"]', 'Gói cao cấp không giới hạn tính năng', 10240, NOW(), NOW());