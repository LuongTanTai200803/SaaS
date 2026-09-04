export interface FieldHelp {
  id: string;
  title: string;
  description: string;
  examples?: string[];
  note?: string;
}

export const contextualHelpData: Record<string, FieldHelp> = {
  // 🏛️ PHÂN HỆ I: TRỢ LÝ VĂN KIỆN ĐẢNG [MỤC 1 - 17]
  '1': {
    id: '1',
    title: 'Tên văn bản muốn ban hành (Đảng)',
    description: 'Tên loại và trích yếu nội dung văn bản phải ngắn gọn, phản ánh chính xác, rõ ràng nội dung chủ yếu của văn bản Đảng.',
    examples: ['Báo cáo sơ kết 1 năm thực hiện Nghị quyết số 5-NQ/TU ngày 12/6/2025', 'Về việc triển khai nhiệm vụ chính trị năm 2026', 'Về việc sơ kết công tác Đảng 6 tháng đầu năm'],
    note: 'Không dùng các từ ngữ đa nghĩa, không viết tắt trong tên trích yếu văn bản.',
  },
  '2': {
    id: '2',
    title: 'Tổ chức Đảng cấp trên trực tiếp',
    description: 'Là tên cơ quan, tổ chức Đảng cấp trên quản lý trực tiếp của tổ chức Đảng ban hành văn bản.',
    examples: ['Tỉnh uỷ', 'Đảng uỷ Khối các cơ quan tỉnh', 'Huyện uỷ'],
  },
  '3': {
    id: '3',
    title: 'Tổ chức Đảng ban hành văn bản',
    description: 'Là tên chính thức của cơ quan, tổ chức Đảng ban hành văn bản theo thẩm quyền quy định.',
    examples: ['Tỉnh uỷ', 'Ban Thường vụ Tỉnh uỷ', 'Ban Chấp hành Đảng bộ tỉnh', 'Đảng uỷ', 'Ban Thường vụ Đảng uỷ', 'Ban Chấp hành Đảng uỷ', 'Chi bộ', 'Ban Tuyên giáo và Dân vận', 'Uỷ ban Kiểm tra'],
  },
  '4': {
    id: '4',
    title: 'Địa danh nơi ban hành văn bản',
    description: 'Địa danh ghi trên văn bản là tên gọi chính thức của đơn vị hành chính nơi cơ quan ban hành văn bản đóng trụ sở.',
    examples: ['TP. Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng'],
  },
  '5': {
    id: '5',
    title: 'Số, ký hiệu văn bản (Đảng)',
    description: 'Số thứ tự văn bản ghi liên tục từ số 01 bắt đầu từ ngày 01/01 đến hết ngày 31/12 của năm ban hành. Ký hiệu gồm chữ viết tắt tên loại văn bản và chữ viết tắt tên cơ quan Đảng ban hành.',
    examples: ['15-CV/TU', '30-KL/ĐU', '123-KH/TU', '45-NQ/ĐU'],
  },
  '6': {
    id: '6',
    title: 'Nơi nhận văn bản (Đảng)',
    description: 'Liệt kê cụ thể tên các cơ quan, tổ chức, đơn vị, cá nhân trực tiếp nhận văn bản để giải quyết công việc, phối hợp thực hiện, để biết hoặc để lưu trữ.',
    examples: ['Đồng chí Bí thư Tỉnh ủy (để b/c)', 'Các ban Đảng, Văn phòng Tỉnh ủy', 'Các đảng uỷ, chi bộ trực thuộc', 'Lưu Văn phòng Tỉnh ủy.'],
  },
  '7': {
    id: '7',
    title: 'Kính gửi (báo cáo / biết / thực hiện)',
    description: 'Cấp trên, đơn vị phối hợp; Đơn vị chịu trách nhiệm triển khai, thực hiện.',
    examples: ['Nghị quyết Đại hội đại biểu toàn quốc lần thứ XIII của Đảng', 'Chỉ thị số 05-CT/TW ngày 15/5/2016 của Bộ Chính trị', 'Ban Thường vụ Tỉnh uỷ/Đảng uỷ'],
  },
  '8': {
    id: '8',
    title: 'Sử dụng văn bản này để làm gì?',
    description: 'Sử dụng văn bản này để: Bám sát / tổng hợp / tham khảo / Trích yếu văn bản làm căn cứ / đối chiếu / trích ý / theo yêu cầu chỉ đạo',
    examples: ['Bám sát', 'Tổng hợp', 'Tham khảo', 'Trích yếu văn bản làm căn cứ', 'Đối chiếu', 'Trích ý', 'theo yêu cầu chỉ đạo'],
  },
  '9': {
    id: '9',
    title: 'Văn bản hướng dẫn, cần nghiên cứu để  lồng ghép liên quan trực tiếp đến nội dung',
    description: 'Sử dụng văn bản này để: Bám sát / tổng hợp / tham khảo / Trích yếu văn bản làm căn cứ / đối chiếu / trích ý / nghiên cứu để lồng ghép / Trích dẫn trực tiếp, tham khảo nội dung, tổng hợp ý chính',
    examples: ['Bám sát ', 'tổng hợp', 'tham khảo', 'Trích yếu văn bản làm căn cứ', 'Đối chiếu', 'Trích ý', 'Nghiên cứu để lồng ghép', 'Trích dẫn trực tiếp, tham khảo nội dung, tổng hợp ý chính'],
  },
  '10': {
    id: '10',
    title: 'Nội dung chính, kết quả thực hiện',
    description: 'Nội dung chính; Đặc điểm tình hình chung; công tác lãnh đạo, chỉ đạo; Kết quả thực hiện; hạn chế, khó khăn; Nguyên nhân Chủ quan, khách quan; nhiệm vụ trọng tâm; Đề xuất, kiến nghị,...',
    examples: ['Đặc điểm tình hình chung', 'công tác lãnh đạo', 'chỉ đạo', 'Kết quả thực hiện; hạn chế, khó khăn', 'Nguyên nhân Chủ quan, khách quan'],
  },
  '11': {
    id: '11',
    title: 'Tài liệu minh chứng, Phụ lục này dùng để làm gì?',
    description: 'Tài liệu, bảng biểu, phụ lục,... dùng để: minh chứng, kèm theo, tổng hợp vào...',
    examples: ['Nội dung hoặc File phụ lục', 'bảng biểu', 'ảnh', 'biên bản', 'báo cáo con'],
  },
  '12': {
    id: '12',
    title: 'Tải văn bản thực tế chuẩn bạn đã dùng trước đó để sử dụng làm mẫu',
    description: 'Yêu cầu: Văn bản mới Sử dụng mẫu đó làm chuẩn về bố cục, dàn ý, thể thức, phong cách trình bày và văn phong.',
    examples: ['Sử dụng mẫu đó làm chuẩn về bố cục', 'dàn ý', 'thể thức', 'phong cách trình bày', 'văn phong'],
  },
  '13': {
    id: '13',
    title: 'Mẫu dàn ý, đề cương khung nội dung văn bản',
    description: 'Tải văn bản thực tế chuẩn bạn đã dùng trước đó để sử dụng làm mẫu. AI sẽ dùng mẫu đó làm chuẩn về bố cục, dàn ý, thể thức, phong cách trình bày và văn phong.',
  },
  '14': {
    id: '14',
    title: 'Văn bản khác liên quan để tổng hợp, bổ sung thông tin',
    description: 'Yêu cầu theo từng văn bản: \n- ưu tiên Văn bản nào ?\n- Dùng để: Tổng hợp, đối chiếu, trích ý, làm phụ lục, Trích dẫn trực tiếp, tham khảo nội dung, tổng hợp ý chính,...',
  },
  '15': {
    id: '15',
    title: 'Yêu cầu tinh chỉnh theo từng văn bản',
    description: 'Phong cách trình bày theo Văn phong Chính luận, phải trang trọng, chính xác, mạch lạc, chuẩn văn phong công tác Đảng',
    examples: ['Văn phong Chính luận, phải trang trọng', 'chính xác', 'mạch lạc', 'chuẩn văn phong công tác Đảng.'],
  },
  '16': {
    id: '16',
    title: 'Văn phong trình bày văn kiện Đảng',
    description: 'Ngắn gọn, trung bình, đầy đủ, chi tiết; khoảng ....... từ (560 từ - 580 từ = 1 trang A4)',
    examples: ['Ngắn gọn (1-2 trang)', 'Trung bình (3-5 trang)', 'Đầy đủ (6-10 trang)', 'Chi tiết'],
  },
  '17': {
    id: '17',
    title: 'Độ dài văn bản muốn khởi tạo',
    description: 'Tạo Bản nháp, bản rút gọn, bản hoàn chỉnh, bản trình ký',
    examples: [''],
  },

  // 🏢 PHÂN HỆ II: TRỢ LÝ VĂN BẢN NHÀ NƯỚC (HÀNH CHÍNH) [MỤC 18 - 34]
  '18': {
    id: '18',
    title: 'Tên văn bản muốn ban hành',
    description: 'VD: Báo cáo kết quả thực hiện phát triển kinh tế - xã hội,... 6 tháng đầu năm,....',
    examples: ['Báo cáo kết quả thực hiện phát triển kinh tế - xã hội 6 tháng đầu năm', 'Kế hoạch triển khai công tác phòng cháy chữa cháy năm 2026'],
  },
  '19': {
    id: '19',
    title: 'Cơ quan quản lý NN cấp trên trực tiếp',
    description: 'Cơ quan quản lý NN cấp trên trực tiếp của cơ quan mình. VD: Hội đồng Nhân dân, Uỷ ban nhân dân tỉnh, Uỷ ban nhân dân xã, sở ngành...',
    examples: ['Hội đồng Nhân dân tỉnh', 'Ủy ban Nhân dân thành phố', 'Bộ Giáo dục và Đào tạo', 'Sở Nội vụ'],
  },
  '20': {
    id: '20',
    title: 'Cơ quan NN ban hành văn bản',
    description: 'VD: UBND tỉnh; UBND xã; sở; phòng; đơn vị sự nghiệp,....',
    examples: ['Ủy ban Nhân dân tỉnh', 'Ủy ban Nhân dân xã', 'Sở Tư pháp', 'Phòng Giáo dục và Đào tạo', 'Đơn vị sự nghiệp'],
  },
  '21': {
    id: '21',
    title: 'Địa danh nơi ban hành văn bản',
    description: 'VD: TP Hà Nội,...',
    examples: ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng'],
  },
  '22': {
    id: '22',
    title: 'Số, ký hiệu văn bản (Nhà nước)',
    description: 'VD: 15-CV/UBND; 30-KL/HĐND,...',
    examples: ['15-CV/UBND', '30-KL/HĐND', '545-QĐ/SGDĐT', '12-KH/UBND'],
  },
  '23': {
    id: '23',
    title: 'Liệt kê Cơ quan, đơn vị, cá nhân nhận văn bản',
    description: 'VD: Đồng chí ...... UBND các xã,....',
    examples: ['Đồng chí Chủ tịch UBND tỉnh', 'UBND các xã', 'Các phòng, ban, ngành', 'Lưu: VT, TH.'],
  },
  '24': {
    id: '24',
    title: 'Nơi nhận (báo cáo / biết / thực hiện)',
    description: 'Gồm: Cấp trên, đơn vị phối hợp; Đơn vị chịu trách nhiệm triển khai, thực hiện\nVD: Ban Thường vụ Tỉnh uỷ/Đảng uỷ,...',
    examples: ['Ban Thường vụ Tỉnh uỷ', 'Đảng uỷ', 'Sở ban ngành liên quan'],
  },
  '25': {
    id: '25',
    title: 'Mục đích sử dụng văn bản chỉ đạo',
    description: 'Sử dụng văn bản này để: Bám sát / tổng hợp / tham khảo / Trích yếu văn bản làm căn cứ / đối chiếu / trích ý / theo yêu cầu chỉ đạo',
    examples: ['Bám sát', 'Tổng hợp', 'Tham khảo', 'Trích yếu văn bản làm căn cứ', 'Đối chiếu', 'Trích ý', 'Theo yêu cầu chỉ đạo'],
  },
  '26': {
    id: '26',
    title: 'Mục đích sử dụng văn bản pháp lý',
    description: 'Sử dụng văn bản này để: Bám sát / tổng hợp / tham khảo / Trích yếu văn bản làm căn cứ / đối chiếu / trích ý / nghiên cứu để lồng ghép / Trích dẫn trực tiếp, tham khảo nội dung, tổng hợp ý chính',
    examples: ['Bám sát ', 'Tổng hợp', 'Tham khảo', 'Trích yếu văn bản làm căn cứ', 'Đối chiếu', 'Trích ý', 'Nghiên cứu để lồng ghép', 'Trích dẫn trực tiếp', 'Tham khảo nội dung', 'Tổng hợp ý chính'],
  },
  '27': {
    id: '27',
    title: 'Nội dung chính của văn bản',
    description: 'Nội dung chính; Đặc điểm tình hình chung; công tác lãnh đạo, chỉ đạo; Kết quả thực hiện; hạn chế, khó khăn; Nguyên nhân Chủ quan, khách quan; nhiệm vụ trọng tâm; Đề xuất, kiến nghị,...',
    examples: ['Đặc điểm tình hình chung', 'Công tác lãnh đạo, chỉ đạo', 'Kết quả thực hiện', 'Hạn chế, khó khăn', 'Nhiệm vụ trọng tâm', 'Đề xuất, kiến nghị'],
  },
  '28': {
    id: '28',
    title: 'Tài liệu phụ lục đính kèm (Nhà nước)',
    description: 'Nội dung hoặc File phụ lục, bảng biểu, ảnh, biên bản, báo cáo con',
    examples: ['Nội dung hoặc File phụ lục', 'Bảng biểu', 'Ảnh', 'Biên bản', 'Báo cáo con'],
  },
  '29': {
    id: '29',
    title: 'Mẫu văn bản áp dụng làm chuẩn',
    description: 'Tải văn bản thực tế chuẩn bạn đã dùng trước đó để sử dụng làm mẫu. Yêu cầu: Sử dụng mẫu đó làm chuẩn về bố cục, dàn ý, thể thức, phong cách trình bày, văn phong.',
  },
  '30': {
    id: '30',
    title: 'Đề cương khung nội dung',
    description: 'Sử dụng đề cương đó làm khung nội dung chính.',
  },
  '31': {
    id: '31',
    title: 'Yêu cầu xử lý văn bản chuyên biệt',
    description: 'Yêu cầu theo từng văn bản dùng để làm gì:\n- ưu tiên Văn bản nào ?\n- Dùng để: Tổng hợp, đối chiếu, trích ý, làm phụ lục, Trích dẫn trực tiếp, tham khảo nội dung, tổng hợp ý chính,...',
    examples: ['Tổng hợp ', 'đối chiếu', 'trích ý', 'Làm phụ lục', 'Trích dẫn trực tiếp', 'Tham khảo nội dung', 'Tổng hợp ý chính'],
  },
  '32': {
    id: '32',
    title: 'Yêu cầu tinh chỉnh theo từng văn bản',
    description: 'Cấu hình chi tiết về thứ tự ưu tiên của văn bản đầu vào, hoặc chỉ định hành động xử lý chuyên biệt đối với từng tệp tài liệu.',
    examples: ['Văn phong Chính luận, phải trang trọng', 'chính xác', 'mạch lạc', 'chuẩn văn phong công tác Đảng.'],
  },
  '33': {
    id: '33',
    title: 'Văn phong trình bày',
    description: 'Ngắn gọn, trung bình, đầy đủ, chi tiết; khoảng ....... từ (560 từ - 580 từ = 1 trang A4)',
    examples: ['Ngắn gọn (1-2 trang)', 'Trung bình (3-5 trang)', 'Đầy đủ (6-10 trang)', 'Chi tiết'],
  },
  '34': {
    id: '34',
    title: 'Mức độ hoàn chỉnh của đầu ra',
    description: 'Tạo Bản nháp, bản rút gọn, bản hoàn chỉnh, bản trình ký.',
    examples: ['Bản nháp', 'Bản rút gọn', 'Bản hoàn chỉnh', 'Bản trình ký'],
  },

  // 🎓 PHÂN HỆ III: TRỢ LÝ QUẢN LÝ GIÁO DỤC [MỤC 35 - 52]
  '35': {
    id: '35',
    title: 'Tên văn bản muốn ban hành',
    description: 'VD: Báo cáo kết quả thực hiện năm học 2027 - 2028,....',
    examples: ['Báo cáo kết quả thực hiện năm học 2027 - 2028'],
  },
  '36': {
    id: '36',
    title: 'Cơ quan quản lý NN cấp trên trực tiếp',
    description: 'Cơ quan quản lý NN cấp trên trực tiếp của cơ quan mình. VD: Uỷ ban nhân dân tỉnh, Uỷ ban nhân dân xã...',
    examples: ['Uỷ ban nhân dân tỉnh', 'Uỷ ban nhân dân xã'],
  },
  '37': {
    id: '37',
    title: 'Cơ quan NN ban hành văn bản',
    description: 'VD: Sở GD&ĐT; Trường Tiểu học....',
    examples: ['Sở GD&ĐT', 'Trường Tiểu học'],
  },
  '38': {
    id: '38',
    title: 'Địa danh nơi ban hành văn bản',
    description: 'VD: TP Hà Nội,...',
    examples: ['TP Hà Nội'],
  },
  '39': {
    id: '39',
    title: 'Số, ký hiệu văn bản',
    description: 'VD: 15-CV/SGD; 30-KH/TH,...',
    examples: ['15-CV/SGD', '30-KH/TH', '545-QĐ/SGDĐT', '12-KH/UBND'],
  },
  '40': {
    id: '40',
    title: 'Liệt kê Cơ quan, đơn vị, cá nhân nhận văn bản',
    description: 'VD: Đồng chí ...... UBND các xã,....',
    examples: ['Đồng chí ......', 'UBND các xã'],
  },
  '41': {
    id: '41',
    title: 'Thành phần nhận (báo cáo / biết / thực hiện)',
    description: 'Gồm: Cấp trên, đơn vị phối hợp; Đơn vị chịu trách nhiệm triển khai, thực hiện',
    examples: ['- Chi bộ trường,...', '- Tổ chuyên môn....'],
  },
  '42': {
    id: '42',
    title: 'Mục đích sử dụng văn bản chỉ đạo trực tiếp',
    description: 'Sử dụng văn bản này để: Bám sát / tổng hợp / tham khảo / Trích yếu văn bản làm căn cứ / đối chiếu / trích ý / theo yêu cầu chỉ đạo',
    examples: ['Bám sát', 'Tổng hợp', 'Tham khảo', 'Trích yếu văn bản làm căn cứ', 'Đối chiếu', 'Trích ý', 'Theo yêu cầu chỉ đạo'],
  },
  '43': {
    id: '43',
    title: 'Mục đích sử dụng văn bản pháp lý',
    description: 'Sử dụng văn bản này để: Bám sát / tổng hợp / tham khảo / Trích yếu văn bản làm căn cứ / đối chiếu / trích ý / nghiên cứu để lồng ghép / Trích dẫn trực tiếp, tham khảo nội dung, tổng hợp ý chính',
    examples: ['Bám sát', 'Tổng hợp', 'Tham khảo', 'Trích yếu văn bản làm căn cứ', 'Đối chiếu', 'Trích ý', 'Nghiên cứu để lồng ghép', 'Trích dẫn trực tiếp', 'Tham khảo nội dung', 'Tổng hợp ý chính'],
  },
  '44': {
    id: '44',
    title: 'Cấp học áp dụng cấu hình',
    description: 'Mầm non, Tiểu học, THCS, THPT, GDTX',
    examples: ['Mầm non', 'Tiểu học', 'THCS', 'THPT', 'GDTX'],
  },
  '45': {
    id: '45',
    title: 'Nội dung chính và số liệu',
    description: 'Nội dung chính; Tình hình nhà trường, số liệu lớp, học sinh, giáo viên, kết quả giáo dục, thi đua; hạn chế, khó khăn; Nguyên nhân Chủ quan, khách quan; nhiệm vụ, giải pháp; đề xuất, kiến nghị,...',
    examples: [' Tình hình nhà trường',' số liệu lớp, học sinh', 'giáo viên', 'kết quả giáo dục', 'thi đua' , 'hạn chế, khó khăn','Nguyên nhân Chủ quan, khách quan', 'nhiệm vụ', 'giải pháp','đề xuất', 'kiến nghị,...'],
  },
  '46': {
    id: '46',
    title: 'Nội dung hoặc File phụ lục đính kèm',
    description: 'Nội dung hoặc File phụ lục, bảng biểu, ảnh, biên bản, báo cáo con',
    examples: ['Nội dung hoặc File phụ lục', 'bảng biểu', 'ảnh', 'biên bản', 'báo cáo con'],
  },
  '47': {
    id: '47',
    title: 'Mẫu văn bản giáo dục chuẩn áp dụng',
    description: 'Tải văn bản thực tế chuẩn bạn đã dùng trước đó để sử dụng làm mẫu. Yêu cầu: Sử dụng mẫu đó làm chuẩn về bố cục, dàn ý, thể thức, phong cách trình bày, văn phong.',
    examples: ['Văn bản mẫu trường đã dùng trước đó', 'Văn bản giáo dục chính thức để lấy chuẩn về bố cục', 'Văn bản tham khảo về dàn ý, thể thức, phong cách trình bày, văn phong'],
  },
  '48': {
    id: '48',
    title: 'Khung đề cương chuyên môn áp dụng',
    description: 'Sử dụng đề cương đó làm khung nội dung chính.',
    examples: ['Đề cương mẫu dùng làm khung nội dung chính', 'Đề cương chi tiết đã chuẩn hóa', 'Đề cương theo cấu trúc nội dung báo cáo/đề án'],
  },
  '49': {
    id: '49',
    title: 'Yêu cầu xử lý theo từng văn bản',
    description: 'Yêu cầu theo từng văn bản:\n- ưu tiên Văn bản nào ?\n- Dùng để: Tổng hợp, đối chiếu, trích ý, làm phụ lục, Trích dẫn trực tiếp, tham khảo nội dung, tổng hợp ý chính,...',
    examples: ['Ưu tiên văn bản chính thức nhất', 'Dùng để tổng hợp', 'Dùng để đối chiếu', 'Dùng để trích ý', 'Dùng làm phụ lục', 'Dùng để trích dẫn trực tiếp', 'Dùng để tham khảo nội dung', 'Dùng để tổng hợp ý chính'],
  },
  '50': {
    id: '50',
    title: 'Văn phong quản lý ngành giáo dục',
    description: 'Văn phong phải chuẩn hành chính, trang trọng, chính xác, mạch lạc, phù hợp với ngành giáo dục và nhà trường.',
    examples: ['Văn phong hành chính trang trọng', 'Văn phong chính xác, mạch lạc', 'Văn phong phù hợp với ngành giáo dục và nhà trường', 'Ngôn ngữ chuẩn mực, không biểu cảm quá mức'],
  },
  '51': {
    id: '51',
    title: 'Độ dài văn bản muốn khởi tạo',
    description: 'Trình bày: Ngắn gọn, trung bình, đầy đủ, chi tiết; khoảng ....... từ (560 từ - 580 từ = 1 trang A4)',
    examples: ['Ngắn gọn (560 - 580 từ)', 'Trung bình (560 - 580 từ)', 'Đầy đủ (560 - 580 từ)', 'Chi tiết (560 - 580 từ)', 'Khoảng 560 - 580 từ = 1 trang A4'],
  },
  '52': {
    id: '52',
    title: 'Mức độ hoàn chỉnh của đầu ra',
    description: 'Tạo Bản nháp, bản rút gọn, bản hoàn chỉnh, bản trình ký',
    examples: ['Bản nháp', 'bản rút gọn', 'bản hoàn chỉnh', 'bản trình ký'],
  },

  // 📚 PHÂN HỆ IV: TRỢ LÝ BIÊN TẬP & PHÁT BIỂU [MỤC 53 - 59]
  '53': {
    id: '53',
    title: 'Lĩnh vực, cương vị người phát biểu',
    description: 'Lãnh đạo: Đảng / Nhà nước / Giáo dục / Nhà trường',
    examples: ['Đảng', 'Nhà nước', 'Giáo dục', 'Nhà trường'],
  },
  '54': {
    id: '54',
    title: 'Tính chất, thể loại bài phát biểu',
    description: 'Phát biểu: Khai mạc / Chỉ đạo / Kết luận / Bế mạc / Chào mừng / Tổng kết',
    examples: ['Khai mạc', 'Chỉ đạo', 'Kết luận', 'Bế mạc', 'Chào mừng', 'Tổng kết'],
  },
  '55': {
    id: '55',
    title: 'Phong cách trình bày bài nói',
    description: 'Trình bày theo phong cách: Trang trọng / Chính luận / Hành chính / Sư phạm / Truyền cảm hứng',
    examples: ['Trang trọng', 'Chính luận', 'Hành chính', 'Sư phạm', 'Truyền cảm hứng'],
  },
  '56': {
    id: '56',
    title: 'Đối tượng người nghe (Thính giả)',
    description: 'Người nghe gồm: Đại biểu, cán bộ, giáo viên, học sinh, phụ huynh, nhân dân,...',
    examples: ['Đại biểu', 'cán bộ', 'giáo viên', 'học sinh', 'phụ huynh', 'nhân dân...'],
  },
  '57': {
    id: '57',
    title: 'Từ khóa, thông điệp cốt lõi bài diễn văn',
    description: 'Mục đích bài phát biểu để? Bối cảnh/tình hình thông tin chung? Kết quả nổi bật (Thành tích, kết quả, điểm nhấn)? Hạn chế/khó khăn? Nhiệm vụ trọng tâm? Thông điệp chính (tinh thần, định hướng chỉ đạo)? Lời cảm ơn/chúc mừng?',
    examples: ['Mục đích bài phát biểu để?',' Bối cảnh/tình hình thông tin chung?',' Kết quả nổi bật (Thành tích, kết quả, điểm nhấn)?',' Hạn chế/khó khăn?',' Nhiệm vụ trọng'],
  },
  '58': {
    id: '58',
    title: 'Định dạng hiển thị kết quả',
    description: 'Trình bày thành: Đoạn văn / Gạch đầu dòng / Bảng lỗi / Bản chỉnh sửa hoàn chỉnh',
    examples: ['Đoạn văn', 'Gạch đầu dòng', 'Bảng lỗi', 'Bản chỉnh sửa hoàn chỉnh'],
  },
  '59': {
    id: '59',
    title: 'Độ dài bài phát biểu',
    description: 'Trình bày: Ngắn gọn, trung bình, đầy đủ, chi tiết',
    examples: ['Ngắn gọn', 'trung bình', 'đầy đủ', 'chi tiết'],
  },

  // 📖 PHÂN HỆ V: TRỢ LÝ SOẠN GIÁO ÁN (CTGDPT 2018) [MỤC 60 - 72]
  '60': {
    id: '60',
    title: 'Cấp học biên soạn giáo án',
    description: 'Cấp học: Mầm non; Tiểu học; THCS; THPT; GDTX',
    examples: ['Mầm non', 'Tiểu học', 'THCS', 'THPT', 'GDTX'],
  },
  '61': {
    id: '61',
    title: 'Môn học / Hoạt động giáo dục',
    description: 'Môn: Toán; Ngữ văn; Tiếng Anh; KHTN (vật lý, hoá học, sinh học); Lịch sử & Địa lí; Tin học; Công nghệ; GDCD; Âm nhạc; Mỹ thuật; GDTC',
    examples: ['Toán', 'Ngữ văn', 'Tiếng Anh', 'KHTN', 'Lịch sử & Địa lí', 'Tin học', 'Công nghệ', 'GDCD', 'Âm nhạc', 'Mỹ thuật', 'GDTC'],
  },
  '62': {
    id: '62',
    title: 'Tên bài học / Tiết học cụ thể',
    description: 'Bài học cụ thể áp dụng',
    examples: ['Bài 7 - Sự tuần hoàn của nước ...'],
  },
  '63': {
    id: '63',
    title: 'Yêu cầu mục tiêu bài học',
    description: 'Yêu cầu: Kiến thức, năng lực, phẩm chất',
    examples: ['Kiến thức', 'Năng lực', 'Phẩm chất'],
  },
  '64': {
    id: '64',
    title: 'Đối tượng học sinh mục tiêu',
    description: 'Áp dụng đối với: Đối tượng học sinh: Trung bình; khá; giỏi',
    examples: ['Trung bình', 'Khá', 'Giỏi'],
  },
  '65': {
    id: '65',
    title: 'Tài nguyên sư phạm kèm theo',
    description: 'Tạo ra kèm giáo án: Phiếu học tập, bài tập, câu hỏi, rubric, trò chơi, slide,...',
    examples: ['Phiếu học tập', 'Bài tập', 'Câu hỏi', 'Rubric', 'Trò chơi', 'Slide'],
  },
  '66': {
    id: '66',
    title: 'Phương pháp & Phong cách dạy học',
    description: 'Phong cách dạy hoc: Phát triển năng lực, lấy học sinh làm trung tâm, hoạt động nhóm, STEM',
    examples: ['Phát triển năng lực', 'Lấy học sinh làm trung tâm', 'Hoạt động nhóm', 'STEM'],
  },
  '67': {
    id: '67',
    title: 'Bộ sách học áp dụng',
    description: 'Bộ sách học áp dụng thực tế',
    examples: ['Sách kết nối tri thức với cuộc sống', 'Chân trời sáng tạo', 'Cánh diều'],
  },
  '68': {
    id: '68',
    title: 'Nội dung lồng ghép tích hợp',
    description: 'Tích hợp: giáo dục kỹ năng sống, lịch sử địa phương, ứng dụng AI,...',
    examples: ['Giáo dục kỹ năng sống', 'Lịch sử địa phương', 'Ứng dụng AI'],
  },
  '69': {
    id: '69',
    title: 'Nội dung chi tiết bài học thô',
    description: 'Nhập nội dung hoặc tải file bài học',
    examples: ['Nhập nội dung bài học', 'Tải file bài học đính kèm'],
  },
  '70': {
    id: '70',
    title: 'Mẫu giáo án chuẩn áp dụng',
    description: 'Mẫu của Bộ, Sở, nhà trường hoặc mẫu cá nhân đang thực hiện (nếu có)',
    examples: ['Mẫu của Bộ', 'Mẫu của Sở', 'Mẫu nhà trường', 'Mẫu cá nhân đang thực hiện'],
  },
  '71': {
    id: '71',
    title: 'Phong cách trình bày giáo án',
    description: 'Phong cách trình bày: Hành chính – sư phạm, Trung tính.\nMô tả hoạt động, không biểu cảm,\nKhông dùng “tôi / chúng ta”,\nKhông dùng cảm thán',
    examples: ['Hành chính – sư phạm', 'Trung tính', 'Mô tả hoạt động, không biểu cảm', 'Không dùng “tôi / chúng ta”', 'Không dùng cảm thán'],
  },
  '72': {
    id: '72',
    title: 'Mức độ chi tiết của giáo án',
    description: 'Trình bày giáo án: Ngắn gọn, trung bình, đầy đủ, chi tiết; đầy đủ, hoàn chỉnh',
    examples: ['Ngắn gọn', 'Trung bình', 'Đầy đủ', 'Chi tiết', 'Hoàn chỉnh'],
  },

  // 📝 PHÂN HỆ VI: TRỢ LÝ MA TRẬN & ĐỀ KIỂM TRA [MỤC 73 - 81]
  '73': {
    id: '73',
    title: 'Môn học kiểm tra',
    description: 'Môn học: Toán; Ngữ văn; Tiếng Anh; KHTN; Lịch sử & Địa lí; Tin học; Công nghệ; GDCD',
    examples: ['Toán', 'Ngữ văn', 'Tiếng Anh', 'KHTN', 'Lịch sử & Địa lí', 'Tin học', 'Công nghệ', 'GDCD'],
  },
  '74': {
    id: '74',
    title: 'Thời gian làm bài quy định',
    description: 'Thời gian làm bài cụ thể',
    examples: ['45 phút', '60 phút', '90 phút', '120 phút,...'],
  },
  '75': {
    id: '75',
    title: 'Hình thức cấu trúc đề thi',
    description: 'Hình thức: Trắc nghiệm; tự luận; kết hợp',
    examples: ['Trắc nghiệm', 'tự luận', 'kết hợp'],
  },
  '76': {
    id: '76',
    title: 'Mục đích của kỳ kiểm tra',
    description: 'Mục tiêu để: Kiểm tra thường xuyên, giữa kỳ, cuối kỳ, luyện thi',
    examples: ['Kiểm tra thường xuyên', 'Giữa kỳ', 'Cuối kỳ', 'Luyện thi'],
  },
  '77': {
    id: '77',
    title: 'Kiến thức giới hạn (Ma trận)',
    description: 'Kiến thức gồm: Tên bài, Tên chương, phạm vị kiến thức',
    examples: ['Tên bài', 'Tên chương', 'Phạm vi kiến thức'],
  },
  '78': {
    id: '78',
    title: 'File đề mẫu chuẩn đính kèm',
    description: 'Upload File mẫu chuẩn: Đề của sở GD, của trường, đề năm học cũ của mình, đề thi thật',
    examples: ['Đề của sở GD', 'Đề của trường', 'Đề năm học cũ', 'Đề thi thật'],
  },
  '79': {
    id: '79',
    title: 'Mức độ phân hóa học sinh',
    description: 'Cho học sinh: Trung bình; khá; giỏi; phân hóa; luyện thi thật',
    examples: ['Trung bình', 'Khá', 'Giỏi', 'Phân hóa', 'Luyện thi thật'],
  },
  '80': {
    id: '80',
    title: 'Tỷ lệ % cấu trúc hình thức',
    description: 'Tỷ lệ %: Trắc nghiệm / Tự luận / Kết hợp',
    examples: ['Tỷ lệ: 40/40/20'],
  },
  '81': {
    id: '81',
    title: 'Tỷ lệ % mức độ nhận thức',
    description: 'Tỷ lệ %: Nhận biết / Thông hiểu / Vận dụng / Vận dụng cao',
    examples: ['Tỷ lệ: 20/30/40/10'],
  },

  // 📊 PHÂN HỆ VII: TRỢ LÝ CHẤM & ĐÁNH GIÁ [MỤC 82 - 86]
  '82': {
    id: '82',
    title: 'Môn học thực hiện chấm bài',
    description: 'Môn: Toán; Ngữ văn; Tiếng Anh; KHTN; Lịch sử & Địa lí; Tin học; Công nghệ; GDCD',
    examples: ['Toán', 'Ngữ văn', 'Tiếng Anh', 'KHTN', 'Lịch sử & Địa lí', 'Tin học', 'Công nghệ', 'GDCD'],
  },
  '83': {
    id: '83',
    title: 'File bài làm của học sinh đầu vào',
    description: 'Tải File bài làm của HS',
    examples: ['Tải file bài làm của HS'],
  },
  '84': {
    id: '84',
    title: 'File Đáp án & Hướng dẫn chấm chuẩn',
    description: 'Tải Đáp án & Hướng dẫn chấm hay bảng điểm hoặc kết quả học tập của học sinh',
    examples: ['Đáp án & Hướng dẫn chấm', 'Bảng điểm', 'Kết quả học tập'],
  },
  '85': {
    id: '85',
    title: 'File danh sách học sinh lớp học',
    description: 'Tải Danh sách Học sinh của Lớp học',
    examples: ['Danh sách Học sinh của Lớp học'],
  },
  '86': {
    id: '86',
    title: 'Yêu cầu đánh giá học sinh',
    description: 'Yêu cầu đánh giá học sinh: Đầy đủ / ngắn gọn / rõ ràng / mạch lạt',
    examples: ['Đầy đủ', 'ngắn gọn', 'rõ ràng', 'mạch lạt'],
  },

  // 🏆 PHÂN HỆ VIII: TRỢ LÝ BÁO CÁO THÀNH TÍCH & THI ĐUA [MỤC 87 - 96]
  '87': {
    id: '87',
    title: 'Phân loại nghiệp vụ đánh giá thi đua',
    description: 'Đánh giá công chức, viên chức; Đánh giá đảng viên; Báo cáo thành tích; Sáng kiến kinh nghiệm',
    examples: ['Đánh giá công chức, viên chức', 'Đánh giá đảng viên', 'Báo cáo thành tích', 'Sáng kiến kinh nghiệm'],
  },
  '88': {
    id: '88',
    title: 'Tiêu đề biểu mẫu thi đua cụ thể',
    description: 'Tiêu đề: Phiếu đánh giá, xếp loại chất lượng cán bộ; Phiếu đánh giá, xếp loại chất lượng công chức; Phiếu đánh giá, xếp loại chất lượng viên chức; Báo cáo thành tích; Sáng kiến kinh nghiệm',
    examples: ['Phiếu đánh giá, xếp loại chất lượng cán bộ', 'Phiếu đánh giá, xếp loại chất lượng công chức', 'Phiếu đánh giá, xếp loại chất lượng viên chức', 'Báo cáo thành tích', 'Sáng kiến kinh nghiệm'],
  },
  '89': {
    id: '89',
    title: 'Văn bản của đối tượng nào',
    description: 'Văn bản của: Tập thể / Cá nhân / Đảng viên / Cán bộ / Công chức / Viên chức',
    examples: ['Tập thể', 'Cá nhân', 'Đảng viên', 'Cán bộ', 'Công chức', 'Viên chức'],
  },
  '90': {
    id: '90',
    title: 'Nội dung kết quả thành tích thô',
    description: 'Trình bày: Kết quả thực hiện; Thành tích đạt được; Danh hiệu thi đua, hình thức khen thường đã nhận; hạn chế, khó khăn; Nguyên nhân Chủ quan, khách quan; Đề xuất, kiến nghị,...',
    examples: ['Kết quả thực hiện', 'Thành tích đạt được', 'Danh hiệu thi đua', 'Hình thức khen thưởng đã nhận', 'Hạn chế, khó khăn', 'Nguyên nhân chủ quan', 'Nguyên nhân khách quan', 'Đề xuất, kiến nghị'],
  },
  '91': {
    id: '91',
    title: 'Mức tự nhận xếp loại chất lượng',
    description: 'Tự nhận: Hoàn thành xuất sắc nhiệm vụ / Hoàn thành tốt nhiệm vụ / Hoàn thành nhiệm vụ / Không hoàn thành nhiệm vụ',
    examples: ['Hoàn thành xuất sắc nhiệm vụ', 'Hoàn thành tốt nhiệm vụ', 'Hoàn thành nhiệm vụ', 'Không hoàn thành nhiệm vụ'],
  },
  '92': {
    id: '92',
    title: 'Mẫu văn bản thi đua chuẩn áp dụng',
    description: 'Tải văn bản thực tế chuẩn bạn đã dùng trước đó để sử dụng làm mẫu. Yêu cầu: Sử dụng mẫu đó làm chuẩn về bố cục, dàn ý, thể thức, phong cách trình bày, văn phong.',
    examples: ['Sử dụng mẫu đó làm chuẩn về bố cục', 'Mẫu chuẩn về dàn ý', 'Mẫu chuẩn về thể thức', 'Phong cách trình bày', 'Văn phong chuẩn'],
  },
  '93': {
    id: '93',
    title: 'Khung đề cương nội dung áp dụng',
    description: 'Sử dụng đề cương đó làm khung nội dung chính.',
    examples: ['Sử dụng đề cương đó làm khung nội dung chính'],
  },
  '94': {
    id: '94',
    title: 'Văn phong báo cáo thi đua cán bộ',
    description: 'Văn phong phải chuẩn hành chính, trang trọng, chính xác, mạch lạc, phù hợp với ngành giáo dục và nhà trường.',
    examples: ['Chuẩn hành chính', 'Trang trọng', 'Chính xác', 'Mạch lạc', 'Phù hợp với ngành giáo dục và nhà trường'],
  },
  '95': {
    id: '95',
    title: 'Độ dài văn bản báo cáo thành tích',
    description: 'Trình bày: Ngắn gọn, trung bình, đầy đủ, chi tiết; khoảng ....... từ (560 từ - 580 từ = 1 trang A4)',
    examples: ['Ngắn gọn', 'Trung bình', 'Đầy đủ', 'Chi tiết', 'Khoảng 560 từ - 580 từ = 1 trang A4'],
  },
  '96': {
    id: '96',
    title: 'Mức độ hoàn chỉnh hồ sơ thi đua',
    description: 'Tạo Bản nháp, bản rút gọn, bản hoàn chỉnh, bản trình ký',
    examples: ['Bản nháp', 'bản rút gọn', 'bản hoàn chỉnh', 'bản trình ký'],
  },
};