# Nền tảng AI Hành chính số (Văn phòng số)

**Domain dự kiến:** [vanphongso.ai.vn](https://vanphongso.ai.vn)

## 1. Tổng quan & Mục tiêu dự án
Đây là một nền tảng SaaS (Software as a Service) cung cấp các Trợ lý Trí tuệ Nhân tạo (AI) chuyên biệt nhằm tự động hóa quy trình soạn thảo văn kiện Đảng, văn bản Nhà nước và quản lý giáo dục.
* **Sứ mệnh:** Số hóa toàn diện văn phòng công, giúp cán bộ, công chức, giáo viên tiết kiệm 80% thời gian soạn thảo và xử lý văn bản.
* **Điểm nổi bật:** Hiểu ngữ cảnh hành chính Việt Nam, tự động bám sát căn cứ pháp lý, chuẩn hóa 100% thể thức văn bản theo quy định.

## 2. Đối tượng người dùng mục tiêu
* Cán bộ, đảng viên, công chức, viên chức tại các cơ quan Nhà nước, cơ quan Đảng.
* Ban giám hiệu, cán bộ quản lý giáo dục, và giáo viên các cấp (Mầm non đến GDTX).

## 3. Các Tính năng Chính
* **Hệ sinh thái 10 Trợ lý AI chuyên biệt:** Hỗ trợ từ soạn thảo văn kiện Đảng, văn bản Nhà nước, biên tập phát biểu, đến quản lý giáo dục, soạn giáo án, tạo ma trận đề thi và chấm điểm tự động.
* **Quản lý & Xử lý Tài liệu:** Hỗ trợ tải lên đa định dạng (Docx, PDF, Excel) làm ngữ cảnh (context) cho AI tham chiếu, bám sát các căn cứ pháp lý và bóc tách dữ liệu thông minh.
* **Hệ thống Hỗ trợ Ngữ cảnh (Contextual Help):** Cung cấp hệ thống Wizard động giải thích các thuật ngữ hành chính phức tạp và đưa ra mẫu tham khảo điền nhanh theo từng trường nhập liệu.
* **Thương mại & Tín dụng (Billing):** Tích hợp tính toán Credit tiêu hao (CreditEstimator) dựa trên độ dài Token, tạo VietQR nạp tiền động, và phân chia các gói dịch vụ (Dùng thử, Cơ bản, Chuyên nghiệp, Pro).
* **Hệ thống Affiliate:** Cấp phát link theo dõi chiến dịch cho phép đối tác, người dùng giới thiệu và nhận hoa hồng.

## 4. Công nghệ sử dụng (Tech Stack)
* **Frontend:** ReactJS, Vite, TypeScript.
* **Styling & UI:** Tailwind CSS, `lucide-react` icons.
* **Giao tiếp API:** AxiosClient mô hình kiến trúc phân lớp (API Layer).
* **Tích hợp AI:** Các model LLM tối tân như Claude 3.5 Sonnet, GPT-5.4 Mini, DeepSeek V4 (Giao tiếp thông qua Backend Provider).

## 5. Hướng dẫn cài đặt và chạy dự án

Chạy lệnh sau để cài đặt các gói phụ thuộc (Dependencies):
```bash
npm install
```

Khởi động server ở chế độ phát triển (Development):
```bash
npm run dev
```

Để build dự án ra môi trường production:
```bash
npm run build
```