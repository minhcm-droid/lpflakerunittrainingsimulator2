> **CẢNH BÁO AN TOÀN HỆ THỐNG:** **TRAINING SIMULATION ONLY – NOT FOR ACTUAL PLANT OPERATION**

# LP Flaker Unit Training Simulator (`LP Flaker Unit-operation-simulator`)

Hệ thống mô phỏng đào tạo vận hành công nghệ **LP Flaker Unit (Section 700 – Low Polymer Handling)** tích hợp không gian **3D tương tác (Three.js / React Three Fiber)**, **Sơ đồ P&ID động (`712`, `717`, `718`)**, **Bảng điều khiển DCS Faceplate**, **Biểu đồ Trend thời gian thực** và **Lõi chấm điểm 100 điểm** dành cho **Field Operator (FO)** và **Boardman / DCS Operator (BM)**.

## Tính năng Chính
- **Phân quyền Vận hành Thực tế (`FIELD` vs `DCS`):** Chặn thao tác van tay (`V1..V31` Start-Up, `V1..V34` Shutdown) từ màn hình DCS; yêu cầu phối hợp đúng vai trò theo SOP `HD-W-7800-02-001` và `HD-W-7800-06-001`.
- **Chuỗi Khởi động & Liên động An toàn (`ESD-761`):** Mô phỏng đầy đủ 3 điều kiện Permissive cụm đóng gói (`PK-761A/B`), 6 điều kiện Permissive cụm tạo vảy (`M-761A/B`), chuỗi tự động `HS-765A/B`, `HS-766A/B`, `PERMISSIVE`, `AUTO STOP` và chế độ `OOS` cho `TZA-797A/B LL`.
- **6 Kịch bản Sự cố Bất thường (`Deviation Analysis`):** Luyện tập xử lý sai lệch `PIC-705 High/Low`, `PI-766A/B High`, `LSHH-762A/B` khi thay bao Big Bag, sụt tốc độ trống `M-761A` và mất Nitơ làm tăng Oxy `AZI-761A`.
- **3 Chế độ Đào tạo:** `Guided Mode`, `Practice Mode` và `Assessment Mode` kèm báo cáo chấm điểm 100 điểm.

## Cài đặt & Chạy cục bộ
```bash
npm install
npm run type-check
npm run lint
npm run dev
```
Truy cập `http://localhost:3000`.
