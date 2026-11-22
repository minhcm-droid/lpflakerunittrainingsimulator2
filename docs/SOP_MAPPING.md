> **CẢNH BÁO AN TOÀN HỆ THỐNG:** **TRAINING SIMULATION ONLY – NOT FOR ACTUAL PLANT OPERATION**

# BẢNG ÁNH XẠ QUY TRÌNH VẬN HÀNH CHUẨN (`SOP_MAPPING.md`)

## 1. Quy trình Khởi động — `HD-W-7800-02-001` (Start-Up LP Flaker Unit)
- **Giai đoạn 1 (`pre-startup`):** Kiểm tra hoàn tất cơ khí, điện, IA, MS/HS, CW, Brine, LN và bình dầu làm kín Seal Plan 02/53A (`LG-7108A/B`, `PCV-717A/B = 12.6 kg/cm²g`). Đóng van xả `V7, V8`.
- **Giai đoạn 2 (`warm-up`):** Mở hơi gia nhiệt `MS` (`V2`, `V15b-c`, `V22a-c`), xả nước ngưng qua `V13`, `V19a-c`, `V26a-c` rồi đóng lại. Giữ `V15a` đóng cho đến khi Assistant Roller chạy.
- **Giai đoạn 3 (`flaker-prep`):** Xác nhận quạt `C-770` đang chạy (`PIC-705 = 0.02 kg/cm²g`); mở `LN` (`V14, V21`, `V28, V29`), kiểm tra `PI-766A/B` (`100–300 mmH2O`), `FZI-7607A/B >= 18 Nm³/h`, `AZI-761A/B < 3.5%`; mở `CW` (`V16a-c`, `V23a-c`, `V20a-b`, `V27a-b`), xả khí qua `V30, V31` (`40,000 kg/h`, `TZI-795A/B = 27–33 °C`).
- **Giai đoạn 4 (`lp-circulation`):** Kiểm tra mức `D-717` (`LI-781 > 10%`), đặt tốc độ bơm `HC-717A/B` tối thiểu, mở `V1, V4`, khởi động `P-717A/B` tuần hoàn LP qua bypass `V6`.
- **Giai đoạn 5 (`packing-startup`):** Lắp bao Big Bag, kẹp dây tiếp địa đồng chống tĩnh điện, kiểm tra 3 đèn Packing Permissives, nhấn `HS-765A/B` chạy chuỗi: `RF-763A/B` -> `20-HEV-761A/B OPEN` -> `FD-762A/B`.
- **Giai đoạn 6 (`flaker-startup`):** Kiểm tra 6 đèn Flaker Permissives, Boardman nhấn `PERMISSIVE` trên DCS -> Field Operator nhấn Start `20-ZZM-761A/B` -> Trống `M-761A/B` chạy ở `2 RPM` -> Mở `V5`, mở nạp LP `V17/V24`, đóng bypass `V6` -> Dao gạt `20-HEV-763A/B` ép sát (`CONTACT`).
- **Giai đoạn 7 (`normal-operation`):** Tăng tải bơm tới `45%` cho đến khi `TI-796A/B > 200 °C` rồi giảm về dải vận hành (`15–25%` cho LP8110F; `10–18%` cho LP0100F); tăng tốc độ trống theo 5 cấp (`< 5 rpm`); thay bao Big Bag qua `HS-766A/B` -> `HS-765A/B`; lấy mẫu định kỳ `1h`, `2h`, `4h`.

## 2. Quy trình Dừng máy — `HD-W-7800-06-001` (Shutdown LP Flaker Unit)
- **Giai đoạn 1 (`stop-feeding`):** Giảm từ từ `HC-717A/B` về `0%`, dừng `P-717A/B`, đóng `V7, V8` (P&ID 712), `V9, V10` (P&ID 717) và hơi jacket `V11, V12`.
- **Giai đoạn 2 (`empty-flaker`):** Giảm tốc độ trống về `2 RPM`; đặt `TZA-797A/B LL` sang `OOS`; mở van xả đáy `V3, V4` (Shutdown) xả cạn chảo rồi đóng lại; nhấn `AUTO STOP` trên DCS -> nhả dao gạt `HEV-763A/B` -> dừng trống -> nhấn Acknowledge còi `20-YA-795A/B` -> dừng Assistant Roller -> dừng `ZZ-761A/B` và đóng hơi `MS` (`V13–V18`).
- **Giai đoạn 3 (`shutdown-packing`):** Chạy không tải vít tải `FD-762A/B` 5 phút, nhấn `HS-766A/B` dừng `FD-762A/B`, đóng `20-HEV-761A/B` (`De-energize CLOSE`) và dừng `RF-763A/B`.
- **Giai đoạn 4 (`shutdown-vent`):** Purge Nitơ, dừng quạt `C-770`, giữ áp dương `PI-766A/B = 0.03 kg/cm²g`, đóng `V1, V2, V5, V6, V27, V28`; đặt `PIC-705` sang `MAN` với `PV-705.MV = 0%`; đóng `V29–V34` trên P&ID 718; giữ `CW` (`V19–V26`) đến khi thiết bị nguội về nhiệt độ môi trường.
