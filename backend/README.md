# Web Assist AI Backend - Spring Boot

Hệ thống backend cho ứng dụng Trợ lý AI Văn phòng sử dụng Spring Boot 3.3.0 + MySQL 8.0

## Cấu trúc Dự án

```
src/main/java/com/assistai/
├── AssistAIApplication.java          # Main application class
├── config/
│   ├── CorsConfig.java               # CORS configuration
│   └── SecurityConfig.java           # Spring Security configuration
├── controller/                       # REST API Controllers
│   ├── UserController.java
│   ├── ChatSessionController.java
│   ├── FileController.java
│   ├── CreditController.java
│   ├── AIController.java
│   ├── BillingController.java
│   └── AdminController.java
├── service/                          # Business Logic Services
│   ├── UserService.java
│   ├── ChatSessionService.java
│   ├── FileService.java
│   ├── CreditService.java
│   ├── BillingService.java
│   ├── AIService.java
│   └── AdminService.java
├── entity/                           # JPA Entities
│   ├── User.java
│   ├── ChatSession.java
│   ├── FileUpload.java
│   ├── CreditTransaction.java
│   ├── BillingInvoice.java
│   ├── AdminPackageConfig.java
│   └── SystemStats.java
├── repository/                       # JPA Repositories
│   ├── UserRepository.java
│   ├── ChatSessionRepository.java
│   ├── FileUploadRepository.java
│   ├── CreditTransactionRepository.java
│   ├── BillingInvoiceRepository.java
│   ├── AdminPackageConfigRepository.java
│   └── SystemStatsRepository.java
└── dto/                              # Data Transfer Objects
    ├── UserProfileDTO.java
    ├── DocumentDTO.java
    ├── ChatSessionDTO.java
    ├── FileUploadResponseDTO.java
    ├── CreditEstimateDTO.java
    ├── AICompletionRequestDTO.java
    ├── BillingInvoiceDTO.java
    └── AdminStatsResponseDTO.java

src/main/resources/
├── application.properties            # Application configuration
└── schema.sql                        # Database schema & sample data
```

## Yêu cầu

- Java 17+
- Maven 3.8+
- MySQL 8.0+

## Cài đặt

### 1. Tạo MySQL Database

```bash
mysql -u root -p < src/main/resources/schema.sql
```

### 2. Cài Đặt Dependencies

```bash
mvn clean install
```

### 3. Chạy Application

```bash
mvn spring-boot:run
```

Ứng dụng sẽ chạy tại: `http://localhost:8080`

## API Endpoints

### 1. Authentication & User Profile

**GET** `/api/v1/users/profile`
- Lấy thông tin hồ sơ người dùng

**GET** `/api/v1/users/documents?page=0&size=10`
- Lấy danh sách tài liệu gần đây

### 2. Chat Sessions

**POST** `/api/v1/chat-sessions`
- Khởi tạo phiên chat mới

**PUT** `/api/v1/chat-sessions/{sessionId}/editor`
- Cập nhật nội dung editor

### 3. File Upload

**POST** `/api/v1/files/upload`
- Upload tài liệu (multipart/form-data)

### 4. Credit

**POST** `/api/v1/credits/estimate`
- Tính toán credit tiêu thụ

### 5. AI Operations

**POST** `/api/v1/ai/completions`
- Gửi lệnh AI (Server-Sent Events)

**POST** `/api/v1/ai/exporter/export`
- Xuất tài liệu (.docx, .pdf, .xlsx)

### 6. Billing

**POST** `/api/v1/billing/invoice`
- Tạo hóa đơn nạp tiền (VietQR)

### 7. Admin

**PUT** `/api/v1/admin/packages/{packageType}`
- Cập nhật cấu hình gói

**GET** `/api/v1/admin/stats/finance`
- Lấy thống kê tài chính

## Cấu hình

Chỉnh sửa `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/web_assist_ai
spring.datasource.username=root
spring.datasource.password=root
jwt.secret=your_secret_key_here
jwt.expiration=86400000
```

## Notes

- Hiện tại JWT authentication được tắt, userId được hardcode là `10293L`
- Tích hợp Claude API cần thêm dependency và implementation
- File upload lưu tại thư mục `uploads/`
- Server-Sent Events đang mock data

## License

MIT
