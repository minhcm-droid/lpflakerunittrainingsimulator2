export type FaultScenarioId =
  | 'NONE'
  | 'FAULT-PIC705-HIGH'
  | 'FAULT-PIC705-LOW'
  | 'FAULT-PI766-HIGH'
  | 'FAULT-LSHH762-HOPPER'
  | 'FAULT-M761-SPEED-DROP'
  | 'FAULT-LN-LOSS-O2-HIGH';

export interface FaultScenarioDefinition {
  id: FaultScenarioId;
  title: { vi: string; en: string };
  sourceDocument: string;
  triggerDescription: { vi: string; en: string };
  expectedOperatorActions: string[];
  targetEquipment: string[];
}

export const FAULT_SCENARIOS: Record<Exclude<FaultScenarioId, 'NONE'>, FaultScenarioDefinition> = {
  'FAULT-PIC705-HIGH': {
    id: 'FAULT-PIC705-HIGH',
    title: {
      vi: 'Áp suất hút quạt C-770 (PIC-705) tăng cao (>= 0.04 kg/cm²g)',
      en: 'Vent Blower C-770 Suction Pressure High (PIC-705 >= 0.04 kg/cm²g)',
    },
    sourceDocument: 'HD-W-7800-02-001 & 06-001 (Deviation Analysis)',
    triggerDescription: {
      vi: 'Van SDV-711 đóng bất thường hoặc van bypass PV-705 mở quá lớn làm áp suất hút C-770 tăng chạm ngưỡng cảnh báo cao.',
      en: 'SDV-711 closed unexpectedly or PV-705 opened excessively causing C-770 suction pressure to spike.',
    },
    expectedOperatorActions: [
      'Xác nhận (Acknowledge) cảnh báo PIC-705 High trên DCS',
      'Kiểm tra trạng thái mở của SDV-711 (tuyến đi D-882)',
      'Chuyển PIC-705 sang MAN và giảm dần độ mở PV-705.MV về 0.02 kg/cm²g',
    ],
    targetEquipment: ['C-770', 'SDV-711', 'PV-705'],
  },
  'FAULT-PIC705-LOW': {
    id: 'FAULT-PIC705-LOW',
    title: {
      vi: 'Áp suất hút quạt C-770 (PIC-705) giảm thấp (<= 0.01 kg/cm²g)',
      en: 'Vent Blower C-770 Suction Pressure Low (PIC-705 <= 0.01 kg/cm²g)',
    },
    sourceDocument: 'HD-W-7800-02-001 & 06-001 (Deviation Analysis)',
    triggerDescription: {
      vi: 'Van PV-705 bị kẹt đóng hoặc lưu lượng khí LN vào hệ thống giảm làm xuất hiện nguy cơ hút chân không cục bộ.',
      en: 'PV-705 stuck closed or LN makeup dropped, risking air ingress into the vent system.',
    },
    expectedOperatorActions: [
      'Xác nhận cảnh báo PIC-705 Low trên DCS',
      'Chuyển PIC-705 sang MAN và tăng dần độ mở PV-705.MV',
      'Kiểm tra nguồn cấp LN qua PCV-7181 / PCV-761A/B',
    ],
    targetEquipment: ['C-770', 'PV-705'],
  },
  'FAULT-PI766-HIGH': {
    id: 'FAULT-PI766-HIGH',
    title: {
      vi: 'Áp suất buồng trống M-761A (PI-766A) tăng cao (>= 400 mmH2O)',
      en: 'Drum Flaker M-761A Chamber Pressure High (PI-766A >= 400 mmH2O)',
    },
    sourceDocument: 'HD-W-7800-02-001 & 06-001 (Deviation Analysis)',
    triggerDescription: {
      vi: 'Van điều áp tự động PCV-761A kẹt mở hoàn toàn hoặc đường thoát khí vent sang E-770 bị nghẽn.',
      en: 'Self-acting regulator PCV-761A stuck wide open or vent line to E-770 restricted.',
    },
    expectedOperatorActions: [
      'Xác nhận cảnh báo PI-766A High trên DCS',
      'Yêu cầu FO điều tiết van chặn trước/sau PCV-761A tại hiện trường',
      'Kiểm tra hoạt động của quạt hút C-770 và tuyến sang E-770',
    ],
    targetEquipment: ['M-761A', 'C-770'],
  },
  'FAULT-LSHH762-HOPPER': {
    id: 'FAULT-LSHH762-HOPPER',
    title: {
      vi: 'Mức phễu Flaker Hopper tăng cao khi thay bao Big Bag (LAH-762A -> LSHH-762A)',
      en: 'Flaker Hopper Level High During Big Bag Changeover (LAH-762A)',
    },
    sourceDocument: 'HD-W-7800-02-001 (Step 7.2 - Loading LP Flaker)',
    triggerDescription: {
      vi: 'Bao Big Bag đã đầy nhưng chưa dừng cụm đóng gói HS-766A kịp thời khiến mảnh LP dồn ứ lên phễu chứa.',
      en: 'Big Bag full without timely HS-766A stop, causing flake accumulation in hopper.',
    },
    expectedOperatorActions: [
      'Nhấn nút dừng gói đóng bao HS-766A tại hiện trường',
      'Tháo dây tiếp địa, di chuyển bao đầy, lắp bao mới và kẹp tiếp địa',
      'Nhấn HS-765A khởi động lại gói đóng bao trước khi mức chạm LSHH-762A',
    ],
    targetEquipment: ['RF-763A', 'FD-762A', 'M-761A'],
  },
  'FAULT-M761-SPEED-DROP': {
    id: 'FAULT-M761-SPEED-DROP',
    title: {
      vi: 'Giảm tốc độ trống M-761A đột ngột gây quá tải & Trip Motor',
      en: 'Sudden Drum Flaker Speed Drop Causing Motor Trip',
    },
    sourceDocument: 'HD-W-7800-06-001 (Deviation Analysis)',
    triggerDescription: {
      vi: 'Boardman giảm tốc độ HCM-761A quá nhanh khi chảo còn nhiều LP lỏng làm tăng mô-men cản và trip motor.',
      en: 'Abrupt HCM-761A speed reduction with molten LP in pan tripped main & assistant motors.',
    },
    expectedOperatorActions: [
      'Dừng cấp liệu LP (dừng P-717A / đóng van nạp LP V17)',
      'Mở van xả đáy chảo melting pan làm rỗng LP trước khi reset và khởi động lại',
    ],
    targetEquipment: ['M-761A', 'P-717A'],
  },
  'FAULT-LN-LOSS-O2-HIGH': {
    id: 'FAULT-LN-LOSS-O2-HIGH',
    title: {
      vi: 'Sụt giảm lưu lượng Nitơ (FZI-7607A) & Hàm lượng Oxy AZI-761A tăng cao (>= 3.5%)',
      en: 'Nitrogen Flow Low & Oxygen Analyzer High (AZI-761A >= 3.5%)',
    },
    sourceDocument: 'HD-W-7800-02-001 (Safe Operating Limits)',
    triggerDescription: {
      vi: 'Lưu lượng Nitơ làm trơ giảm dưới 18 Nm3/h làm nồng độ Oxy tăng tiệm cận ngưỡng nổ hơi Hexane (5.0% HH ESD).',
      en: 'Inerting LN flow dropped below 18 Nm3/h causing O2 concentration to rise toward 5.0% ESD.',
    },
    expectedOperatorActions: [
      'Kiểm tra và mở hoàn toàn tuyến cấp LN (V14)',
      'Nếu AZI-761A chạm 5.0% kích hoạt ESD-761, cô lập tuyến cấp LP và purge lại hệ thống',
    ],
    targetEquipment: ['M-761A'],
  },
};
