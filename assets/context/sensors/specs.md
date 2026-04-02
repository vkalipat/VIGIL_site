# Sensor Specs

## Product

| Field | Value |
|-------|-------|
| Name | VIGIL |
| Tagline | Continuous ICU-grade monitoring at ultra-low cost. |
| Description | Multi-modal wearable headband for continuous vital sign monitoring in hospital general wards |
| Weight | <45g (battery, PCB, sensors, housing) |
| PCB | 2-layer flex, 185mm × 35mm, 0.11mm thick, 22 components |
| SoC | Nordic nRF52840 (ARM Cortex-M4F 64MHz, 1MB flash, 256KB RAM) |
| Battery | 500mAh LiPo, 3.7V |
| Battery life | 18–24 hrs observed (1.00mA avg draw, 16+ days theoretical with 400mAh) |
| Charging | USB-C, 5V/500mA, ~90 min to full |
| Connectivity | BLE 5.0 (27m range, 22dB margin at 5m bedside) |
| Power management | TPS62840 ultra-low-power buck converter |
| Signal conditioning | AD8606 dual precision op-amp |
| Charge management | BQ24072 |
| Housing | Medical-grade silicone elastic headband (planned) |
| Data output | 17,280 multi-parameter data points per 24hrs vs 3–6 manual checks |
| License | CERN Open Hardware Licence v2 |

## BOM Cost

| Volume | Unit Cost |
|--------|-----------|
| 5 units (prototype) | $46 |
| 1,000 units | $19 |
| 10,000 units | $13 |

## Sensors

| ID | Sensor | Part | Modality | Sample Rate | Measures | Key Metric | Position | Lucide Icon |
|----|--------|------|----------|-------------|----------|------------|----------|-------------|
| 1 | Bilateral PVDF Piezoelectric (×2) | TE LDT1-028K (28μm, 16mm active) | Temporal pulse | 200 Hz | Heart rate, pulse pressure, arterial waveform | ±2.0 bpm accuracy (95th pctl), 58.6 dB SNR | Both temples, 15mm anterior to tragus | `HeartPulse` |
| 2 | Digital Temperature | TI TMP117 | Contact thermal | 1 Hz | Core body temperature estimate | ±0.15°C accuracy (95th pctl), 16-bit resolution | Center forehead | `Thermometer` |
| 3 | MEMS Accelerometer | ST LIS3DH (tri-axis) | Micro-vibration | 200 Hz | BCG cardiac signal, fall detection | 4mg/bit resolution, 3.5g fall threshold | Rear module | `Activity` |
| 4 | MEMS Microphone | TDK ICS-43434 | Acoustic | 16 kHz | Respiratory rate, breath sounds | 65 dBA SNR, -26 dBFS sensitivity | Rear module | `AudioLines` |

## Signal Processing

4-stage on-device pipeline:
1. Bandpass filtering
2. Bilateral motion artifact rejection (cross-correlation r>0.70)
3. Feature extraction (peak detection, J-wave, Hilbert envelope)
4. SNR-weighted multi-sensor fusion

Latency: <50ms per cycle.

## Stats Bar Values

| Value | Label |
|-------|-------|
| 4 | Sensors |
| <45g | Weight |
| $46 | BOM |
| ±2.0 bpm | Accuracy |
| 17,280 | pts/day |

## Full Spec Table

| Category | Spec | Value |
|----------|------|-------|
| Sensors | PVDF piezoelectric | TE LDT1-028K ×2, bilateral |
| Sensors | Temperature | TI TMP117, ±0.15°C |
| Sensors | Accelerometer | ST LIS3DH, tri-axis |
| Sensors | Microphone | TDK ICS-43434, 65 dBA SNR |
| Performance | Pulse sampling rate | 200 Hz |
| Performance | Temperature sampling | 1 Hz |
| Performance | Acoustic sampling | 16 kHz |
| Performance | Processing latency | <50ms |
| Performance | Data points per 24hrs | 17,280 |
| Performance | Battery life | 18–24 hours |
| Performance | Charge time | ~90 min |
| Design | Weight | <45g |
| Design | PCB | 2-layer flex, 185mm × 35mm |
| Design | Housing | Medical-grade silicone |
| Design | SoC | Nordic nRF52840 |
| Connectivity | BLE | 5.0 |
| Connectivity | Range | 27m (22dB margin at 5m) |
| Cost | Prototype (5 units) | $46/unit |
| Cost | 1K volume | $19/unit |
| Cost | 10K volume | $13/unit |
| License | Hardware | CERN OHL v2 |

## Target Populations

| Population | Clinical Need |
|------------|---------------|
| Elderly patients | Unwitnessed falls (3–5 per 1,000 patient-days) |
| Post-operative patients | Opioid-induced respiratory depression |
| Non-verbal patients | Dementia, TBI, delirium, language barriers |
| High-ratio wards | Resource-limited settings, high nurse-to-patient ratio |

## Competitive Landscape

| Device | Cost | Modalities | Form Factor |
|--------|------|------------|-------------|
| VIGIL | $46 | 4 (pulse, temp, motion, acoustic) | Single headband, no adhesive |
| Masimo SafetyNet | $1,500 | 1 (PPG only) | — |
| Philips BX100 | $3,500 | Chest patch | Adhesive, skin breakdown risk |
| Sotera ViSi Mobile | $5,000+ | Multi-component | Cumbersome |
| Standard bedside monitor | $5,000–$15,000 | Multi-parameter | Fixed, wired |
