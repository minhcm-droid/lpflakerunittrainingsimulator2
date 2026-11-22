> **CẢNH BÁO AN TOÀN HỆ THỐNG:** **TRAINING SIMULATION ONLY – NOT FOR ACTUAL PLANT OPERATION**

# HƯỚNG DẪN TRIỂN KHAI (`DEPLOYMENT.md`)

## 1. Kiểm thử Cục bộ
```bash
npm install
npm run type-check
npm run lint
npm run build
```

## 2. Triển khai lên GitHub Private & Vercel
1. Tạo repository **Private** trên GitHub (`LP Flaker Unit-operation-simulator`).
2. Đẩy toàn bộ mã nguồn lên nhánh `main` (đảm bảo không đính kèm tệp `.pdf` / `.docx` tài liệu gốc).
3. Kết nối repository trên **Vercel**, chọn Framework Preset `Next.js`, khai báo biến môi trường từ `.env.example` và kích hoạt **Deployment Protection**.
