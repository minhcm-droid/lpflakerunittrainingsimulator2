> **CẢNH BÁO AN TOÀN HỆ THỐNG:** **TRAINING SIMULATION ONLY – NOT FOR ACTUAL PLANT OPERATION**

# BÁO CÁO CHẤT LƯỢNG DỮ LIỆU & XUNG ĐỘT TÀI LIỆU (`DATA_QUALITY.md`)

1. **Xung đột ngưỡng `TZI-797A/B`:** SOP Start-Up ghi `L = 95 °C / LL = 90 °C`; SOP Shutdown và ảnh màn hình DCS ghi `L = 135 °C / LL = 125 °C`. Hệ thống hỗ trợ chuyển đổi trực tiếp giữa 2 cấu hình.
2. **Đánh số van tách biệt giữa 2 SOP:** `V1..V31` (Start-Up) và `V1..V34` (Shutdown) được quản lý độc lập theo trường `sopContext`.
3. **Trạng thái dừng `20-HEV-761A/B`:** SOP Shutdown ghi nhầm `ON`; mô phỏng áp dụng đúng logic kỹ thuật `De-energize CLOSE`.
4. **Dữ liệu chưa xác nhận (`NOT CONFIRMED FROM PROVIDED DOCUMENT`):** P&ID thượng nguồn (`T-703` đến `P-713A/B`), Cause & Effect `HD1-2M90-5027-031` và quy trình khởi động quạt `C-770` (`HD-W-7800-02-002`).
