🐳 CloudService BTL Nhóm 7 — Docker Setup

1. Mục đích

Project CloudService được cấu hình Docker Compose để chạy toàn bộ hệ thống:

SQL Server 2022 — Database

ASP.NET Core .NET 9 — Backend API

Next.js — Frontend

Thành viên trong nhóm không cần cài riêng SQL Server, .NET SDK hoặc Node.js nếu chạy project bằng Docker.

2. Kiến trúc hệ thống

                    Docker Compose
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
      SQL Server       Backend       Frontend
      Container        Container      Container
          │              │              │
        :1433          :8080          :3000
          │              │              │
          ▼              ▼              ▼
   localhost:1433   localhost:5000   localhost:3000

Thành phần

Container

Port máy tính

SQL Server

cloudservice_db

1433

Backend API

cloudservice_api

5000

Frontend

cloudservice_frontend

3000

Backend mapping:

localhost:5000 → container:8080

3. Yêu cầu

Cần cài:

Docker Desktop

Git

Kiểm tra:

docker --version
docker compose version

4. Clone project

git clone https://github.com/TrungHauNguyen4/CloudService-BTL-Nhom7.git
cd CloudService-BTL-Nhom7

5. Kiểm tra Docker Compose

docker compose config

Kiểm tra service:

docker compose config --services

Kết quả dự kiến:

sqldb
backend
frontend

6. Build và chạy toàn bộ project

docker compose up -d --build

Lệnh này sẽ build Backend, build Frontend, tạo SQL Server container và khởi động toàn bộ hệ thống.

Lần đầu chạy có thể mất vài phút.

7. Kiểm tra container

docker compose ps

Cần có:

cloudservice_db
cloudservice_api
cloudservice_frontend

Trạng thái cần là Up.

8. Truy cập hệ thống

Frontend

http://localhost:3000

Backend Swagger

http://localhost:5000/swagger

Backend API

http://localhost:5000

SQL Server

localhost:1433

9. Kiểm tra Backend

docker compose logs backend --tail=50

Backend chạy bình thường khi log có:

Application started

Backend trong container sử dụng port 8080, Docker expose ra máy host tại port 5000.

10. Kiểm tra Frontend

docker compose logs frontend --tail=50

Sau khi chạy thành công:

http://localhost:3000

Lưu ý Node.js

Next.js hiện tại yêu cầu Node.js >= 20.9.

frontend/Dockerfile phải sử dụng:

FROM node:20-alpine

Không đổi về node:18-alpine.

11. Kiểm tra SQL Server

docker compose logs sqldb --tail=50

Backend kết nối Database thông qua Docker service name:

Server=sqldb
Database=CloudServiceDb
User=sa

Trong Backend container không dùng:

Server=localhost

mà dùng:

Server=sqldb

12. API URL của Frontend

Frontend được build với:

NEXT_PUBLIC_API_URL=http://localhost:5000/api

Trình duyệt gọi:

http://localhost:5000/api

Nếu một container gọi Backend thì sử dụng:

http://backend:8080/api

Không dùng localhost để container này gọi container khác.

13. Các lệnh thường dùng

Khởi động

docker compose up -d

Build lại

docker compose up -d --build

Kiểm tra

docker compose ps

Xem toàn bộ log

docker compose logs

Log Backend

docker compose logs backend --tail=50

Log Frontend

docker compose logs frontend --tail=50

Log Database

docker compose logs sqldb --tail=50

Restart Backend

docker compose restart backend

Restart Frontend

docker compose restart frontend

Restart Database

docker compose restart sqldb

14. Khi sửa Backend

docker compose up -d --build backend

Hoặc build lại toàn bộ:

docker compose up -d --build

15. Khi sửa Frontend

docker compose up -d --build frontend

16. Dừng project

docker compose down

Lệnh này dừng và xóa container nhưng giữ Database volume.

Chạy lại:

docker compose up -d

17. Xóa cả Database volume

docker compose down -v

⚠️ CẢNH BÁO: Lệnh này xóa volume sql_data và có thể làm mất dữ liệu Database hiện tại. Chỉ dùng khi muốn tạo Database từ đầu.

18. Troubleshooting

Docker không nhận lệnh

Nếu gặp:

docker : The term 'docker' is not recognized

Hãy cài Docker Desktop, khởi động Docker Desktop và mở PowerShell mới.

Backend không kết nối Database

Kiểm tra:

docker compose ps
docker compose logs sqldb --tail=50
docker compose logs backend --tail=50

Connection string trong Docker phải sử dụng:

Server=sqldb

Frontend build lỗi Node.js

Kiểm tra:

frontend/Dockerfile

Phải có:

FROM node:20-alpine

Sau đó:

docker compose up -d --build frontend

Port 5000 bị chiếm

netstat -ano | findstr :5000

Port 3000 bị chiếm

netstat -ano | findstr :3000

Port 1433 bị chiếm

netstat -ano | findstr :1433

19. Quy trình chạy cho thành viên mới

Sau khi clone project:

cd CloudService-BTL-Nhom7
docker compose up -d --build
docker compose ps

Nếu cả 3 container đều Up, mở:

Frontend:
http://localhost:3000

Backend Swagger:
http://localhost:5000/swagger

20. Quy trình làm việc hằng ngày

Nếu không thay đổi source/Dockerfile:

docker compose up -d

Nếu có thay đổi source:

docker compose up -d --build

Kiểm tra:

docker compose ps

Dừng:

docker compose down

21. Các file Docker quan trọng

CloudService-BTL-Nhom7/
│
├── docker-compose.yml
│
├── backend/
│   └── Dockerfile
│
├── frontend/
│   └── Dockerfile
│
└── README_DOCKER.md

docker-compose.yml

Quản lý:

SQL Server

Backend

Frontend

Port

Environment variables

Database volume

backend/Dockerfile

Build ASP.NET Core Backend image.

frontend/Dockerfile

Build Next.js Frontend image.

README_DOCKER.md

Hướng dẫn thành viên cài đặt và chạy project bằng Docker.

22. Trạng thái Docker

✅ SQL Server 2022

✅ ASP.NET Core .NET 9

✅ Next.js Frontend

✅ Docker Compose

✅ Backend 5000 → 8080

✅ Frontend 3000 → 3000

✅ SQL Server 1433 → 1433

✅ Frontend build với Node.js 20

✅ Backend Docker build thành công

✅ Frontend Docker build thành công

23. Lệnh nhanh

docker compose up -d --build
docker compose ps

Mở:

http://localhost:3000

Swagger:

http://localhost:5000/swagger

Dừng:

docker compose down

24. Lưu ý bảo mật

Không commit mật khẩu, API key hoặc secret production lên GitHub.

Nếu repository là public, nên chuyển thông tin nhạy cảm sang .env, Docker secrets hoặc cơ chế quản lý secret phù hợp trước khi dùng production.

👥 CloudService BTL — Nhóm 7

Mục tiêu của Docker setup:

Clone project → chạy Docker Compose → Backend + Frontend + Database cùng hoạt động.