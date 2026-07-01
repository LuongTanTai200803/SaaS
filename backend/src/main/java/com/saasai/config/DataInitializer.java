package com.saasai.config;

import com.saasai.entity.User;
import com.saasai.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import com.saasai.entity.AdminPackageConfig;
import com.saasai.repository.AdminPackageConfigRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Profile("dev")
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    private final AdminPackageConfigRepository adminPackageConfigRepository;

    private final PasswordEncoder passwordEncoder; // Lôi bộ mã hóa chính chủ ra dùng
    
    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.admin.name}")
    private String adminName;

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin.tai@coquan.gov.vn";

        // 1. Kiểm tra gác cổng: Nếu tài khoản Admin này CHƯA tồn tại dưới DB thì mới xử
        // lý
        if (userRepository.findByEmail(adminEmail).isEmpty()) {

            // Tìm gói FREE thật dưới DB dựa vào packageType
            AdminPackageConfig freePackage = adminPackageConfigRepository.findByPackageType("FREE")
                    .orElseThrow(() -> new RuntimeException("Gói FREE chưa được khởi tạo dưới DB!"));

            // 2. Build đối tượng User Admin bằng Builder pattern mà Entity ông đang có
            User admin = User.builder()
                    .email(adminEmail)
                    // 🔥 ƯU ĐIỂM TỐI THƯỢNG: Băm mật khẩu thô ngay tại RAM lúc runtime, không sợ
                    // lỗi ký tự đặc biệt
                    .password(passwordEncoder.encode("MatKhauManh123@"))
                    .fullName("Lương Tấn Tài (Admin)")
                    .agency("Ban Quản Trị Hệ Thống")
                    .role(User.UserRole.ROLE_ADMIN)
                    .creditBalance(9999.0)
                    .adminPackageConfig(freePackage) // gọi ngầm freePackage.getId() để set package_id động
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            // 3. Lưu xuống database vật lý thông qua Spring Data JPA
            userRepository.save(admin);

            System.out.println("🚀 [DEV PROFILE] Khởi tạo thành công tài khoản mồi Admin: " + adminEmail);
        } else {
            System.out.println("ℹ️ [DEV PROFILE] Tài khoản Admin đã tồn tại từ trước, bỏ qua bước khởi tạo mồi.");
        }
    }
}