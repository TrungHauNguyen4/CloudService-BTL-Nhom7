IN4211 – Phát triển phần mềm hướng đối tượng 

Bài tập lớn cuối kỳ 

TRƯỜNG ĐẠI HỌC ĐỒNG THÁP KHOA CÔNG NGHỆVÀ KỸTHUẬT BỘMÔN KHOA HỌC MÁY TÍNH 

# **ĐỀBÀI LỚN CUỐI KỲ TẬP** 

### **Website Bán Dịch vụCloud (VPS, Hosting, Domain...)** 

Học phần: **Phát triển phần mềm hướng đối tượng (IN4211)** 

– **Hình thức đánh giá** HĐ9.5 Báo cáo cuối môn, **trọng số0.5 Chuẩn đầu ra** 5.1, 5.2, 5.3 **Hình thức làm bài** Nhóm 3–4 sinh viên (giữnguyên nhóm chủđề) **Thời hạn** Báo cáo và demo tại **Buổi 12** 

## **1. Bối cảnh đềbài** 

Một doanh nghiệp **cung cấp dịch vụcloud** (tương tự `https://vietnix.vn/` ) cần xây dựng website chính thức để: 

-  Giới thiệu doanh nghiệp, hạtầng datacenter và các dịch vụ: **VPS, Hosting, Domain, Email doanh nghiệp, SSL, Firewall chống DDoS. . .** ; 

-  Công bố **bảng giá các gói dịch vụ** theo chu kỳthanh toán (tháng/năm) và chương trình khuyến mãi; 

-  Tiếp nhận yêu cầu **đăng ký dịch vụ/ tư vấn** từkhách hàng cá nhân và doanh nghiệp; 

-  Đăng tin tức, blog kiến thức (hướng dẫn kỹthuật, khuyến mãi, thông báo bảo trì. . . ). 

Nhóm sinh viên đóng vai trò đội phát triển, xây dựng hệthống gồm **Backend Web API (.NET)** và **Frontend (Next.js hoặc Blazor)** . 

## **2. Kiến trúc và công nghệ bắt buộc** 

### **– 2.1. Backend ASP.NET Core Web API (.NET 10)** 

-  Tổchức solution theo **Clean Architecture** 4 tầng: `Domain` , `Application` , `Infrastructure` , `WebApi` (buổi 4); 

-  Áp dụng **SOLID principles** và tối thiểu 3 **Design Patterns** (Repository, Unit of Work, – 

- Factory/Singleton/Observer. . . ) chỉrõ trong báo cáo áp dụng ởđâu (buổi 2, 3); 

-  **ORM** : Entity Framework Core hoặc Dapper (hoặc hybrid – khuyến khích, buổi 5), CSDL SQL Server; 

-  **REST API** đúng chuẩn: danh từ số nhiều, status code hợp lý, pagination/filtering/sorting, ProblemDetails cho lỗi, Swagger/OpenAPI (buổi 6); 

-  **Bảo mật** (buổi 7): 

1 

IN4211 – Phát triển phần mềm hướng đối tượng 

Bài tập lớn cuối kỳ 

- JWT authentication + refresh token cho khu vực quản trị; 

- Phân quyền theo role: `Admin` , `Editor` (tối thiểu 2 role); 

- Password hash bằng Bcrypt/PBKDF2; 

- Sinh **mã QR** cho mỗi gói dịch vụ(quét ra trang chi tiết gói / trang đặt hàng). 

### **– 2.2. Frontend chọn MỘT trong hai** 

|**Lựa**<br>**chọn**|**Công nghệ**||**Ghi chú**|
|---|---|---|---|
|Option A|**Next.js**<br><br>App Router)|(React,<br>|Gọi API bằng fetch/axios, SSR/SSG cho landing page|
|Option B|**Blazor**<br>bAssembly<br>Server)|(We-<br>hoặc|Gọi API bằng HttpClient|



Yêu cầu chung: responsive (desktop + mobile), có trang quản trịđăng nhập bằng JWT. 

### **2.3. Quy trình phát triển** 

-  **Git/GitHub** (buổi 9): làm việc trên feature branch, merge qua **Pull Request có review** , tối thiểu **10 PR** và commit đều của **tất cảthành viên** ; 

-  **Unit Testing** (buổi 8): xUnit + Moq, tối thiểu **15 test cases** cho Domain/Application, báo cáo coverage; 

-  **CI/CD** (buổi 10): GitHub Actions tựđộng build + test khi push/PR; có `Dockerfile` cho API và `docker-compose.yml` (API + SQL Server); 

-  **Triển khai** (buổi 11, khuyến khích – điểm cộng): deploy lên Azure/AWS hoặc VPS, có logging bằng Serilog. 

## **3. Yêu cầu chức năng** 

2 

IN4211 – Phát triển phần mềm hướng đối tượng 

Bài tập lớn cuối kỳ 

### **3.1. Trang công khai (Landing Page)** 

|**#**|**Chức năng**|**Mô tả**|
|---|---|---|
|1|Trang chủ|Hero banner, gói dịch vụnổi bật, khuyến mãi đang chạy, cam kết<br>uptime, tin mới nhất|
|2|Giới thiệu|Lịch sử, hạtầng datacenter, chứng chỉ(ISO. . . ), cam kết<br>SLA/uptime 99.9%|
|3|Dịch vụ|Danh mục: VPS (nhiều cấu hình), Hosting, Domain, Email doanh<br>nghiệp, SSL, Firewall chống DDoS. . . kèm mô tả, thông sốkỹ<br>thuật|
|4|**Bảng giá**|So sánh các gói theo cấu hình (CPU/RAM/SSD/băng thông), giá<br>theo chu kỳtháng/năm, **khuyến mãi có thời hạn**, nút đặt hàng<br>từng gói|
|5|Khách hàng|Đánh giá/testimonial, logo khách hàng tiêu biểu,**mã QR** từng gói<br>dịch vụ|
|6|Tin tức / Blog|Danh sách + chi tiết bài viết, phân trang, tìm kiếm, phân loại<br>(hướng dẫn, khuyến mãi. . . )|
|7|Liên hệ/ Đặt dịch<br>vụ|Form đăng ký: chọn dịch vụ, gói/cấu hình, chu kỳthanh toán,<br>thông tin khách hàng; lưu vào DB|
|8|Đối tác / Affiliate|Trang thông tin chính sách hoa hồng + form đăng ký làm đối<br>tác/affiliate|



### **3.2. Trang quản trị(yêu cầu đăng nhập JWT)** 

|**#**|**Chức năng**|**Role**|
|---|---|---|
|1|Đăng nhập, refresh token, đổi mật khẩu|Tất cả|
|2|CRUD gói dịch vụ+ bảng giá/khuyến mãi (tựđộng cập nhật giá<br>ngoài trang chủ)|Admin|
|3|CRUD danh mục dịch vụ, gói cấu hình (kèm sinh lại mã QR)|Admin|
|4|CRUD tin tức/blog (soạn thảo rich text hoặc markdown)|Admin, Editor|
|5|Quản lý yêu cầu đặt dịch vụ/ đăng ký affiliate: xem, đổi trạng thái<br>(Mới _→_Đang xửlý _→_Hoàn tất/Từchối)|Admin, Editor|
|6|Thống kê: sốyêu cầu theo tháng, gói dịch vụđược quan tâm – biểu đồ|Admin|
|7|Xuất danh sách yêu cầu đặt dịch vụra **Excel** (EPPlus/ClosedXML)|Admin|
|8|Audit log: ghi lại ai đăng nhập, ai sửa giá, khi nào|Admin|



### **3.3. Gợi ý mô hình dữliệu (tối thiểu)** 

`ServiceCategory` (VPS/Hosting/Domain. . . ), `ServicePlan` (gói dịch vụ), `PlanPrice` (giá theo chu kỳtháng/năm), `Promotion` (khuyến mãi), `NewsArticle` , `OrderRequest` (yêu cầu đặt dịch vụ), `AffiliateApplication` , `AppUser` , `Role` , `AuditLog` . 

_Nhóm được tựmởrộng mô hình, nhưng phải có sơ đồERD trong báo cáo._ 

3 

IN4211 – Phát triển phần mềm hướng đối tượng 

Bài tập lớn cuối kỳ 

## **4. Sản phẩm nộp** 

1. **Source code** trên GitHub repository của nhóm (mời GV vào repo): 

   -  README: mô tảkiến trúc, hướng dẫn chạy ( `docker compose up` phải chạy được), tài khoản demo; 

   -  Lịch sửcommit/PR thểhiện đóng góp từng thành viên. 

2. **Báo cáo** (PDF, 15–25 trang): phân tích yêu cầu, ERD, sơ đồkiến trúc Clean Architecture, các Design Pattern đã áp dụng (kèm trích code), ảnh chụp màn hình, phân công công việc, kết quảtest coverage. 

3. **Slides + Demo trực tiếp** tại buổi 12 (15 phút/nhóm + 5 phút hỏi đáp): demo end-toend cảtrang công khai và trang quản trị, demo pipeline CI chạy trên GitHub Actions. 

## **5. điểm điểm** _→_ **Thang (100 quy vềtrọng số0.5)** 

|**Tiêu chí**|**Điểm**|
|---|---|
|Kiến trúc Clean Architecture + SOLID + Design Patterns đúng và có giải thích|20|
|Backend API: đầy đủchức năng, đúng chuẩn REST, ORM hợp lý|20|
|Frontend: đầy đủchức năng, responsive, trải nghiệm tốt|15|
|Bảo mật: JWT + role, hash password, QR code|10|
|Unit Testing (_≥_15 tests, có coverage)|10|
|Git teamwork (PR, review, đóng góp đều) + CI/CD + Docker|10|
|Báo cáo + thuyết trình, demo trôi chảy|10|
|Trảlời vấn đáp (hỏi từng thành viên vềphần mình làm)|5|
|**Điểm cộng**: deploy thực tếlên cloud có link chạy được|**+5**|



### **5.1. Quy định trừđiểm** 

-  `docker compose up` không chạy được: **–10** ; 

-  Thành viên không có commit/PR đáng kể: thành viên đó bịtrừtới **50% điểm cá nhân** ; 

-  Sao chép code nhóm khác hoặc dựán có sẵn không khai báo nguồn: **0 điểm toàn nhóm** (theo quy định học phần); 

-  Nộp trễ: –10%/ngày. 

_Mọi thắc mắc vềđềbài liên hệgiảng viên qua email hoặc kênh lớp học. Đềbài có thểđược điều chỉnh nhỏvà sẽthông báo trước tối thiểu 1 tuần._ 

4 

