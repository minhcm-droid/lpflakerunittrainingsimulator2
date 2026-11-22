> **CẢNH BÁO AN TOÀN HỆ THỐNG:** **TRAINING SIMULATION ONLY – NOT FOR ACTUAL PLANT OPERATION**

# ĐẶC TẢ LOGIC ĐIỀU KHIỂN & MÔ PHỎNG (`CONTROL_LOGIC.md`)

## 1. Phân quyền Điều khiển (Field Operator vs DCS Operator)
- **Manual / Isolation / Drain / Vent / Bypass Valves (`V1..V31` Start-Up, `V1..V34` Shutdown):** Chỉ thao tác tại `FIELD`. Mọi lệnh từ `DCS` bị chặn và trả về mã `FIELD_OPERATOR_REQUIRED`.
- **Control Valves & Controllers (`PIC-705 / PV-705`, `HC-717A/B`, `HCM-761A/B`):** Chỉ thao tác tại `DCS`.
- **Pushbuttons:** `HS-765A/B` và `HS-766A/B` thao tác tại `FIELD`; `PERMISSIVE`, `AUTO STOP` và `OOS` của `TZA-797A/B LL` thao tác tại `DCS`.

## 2. Liên động An toàn `ESD-761`
Kích hoạt khi:
- `FZALL-7607A/B <= 8 Nm³/h`
- `AZAHH-761A/B >= 5.0%`
- `TZAHH-795A/B >= 52 °C`
- `TZAHH-798A/B >= 90 °C`
- `TZALL-797A/B <= Low-Low Setpoint` (khi chưa đặt `OOS`)
- `PIC-705 >= 0.05 kg/cm²g`
