# Realtime EC/TDS Monitor

![Project Screenshot](https://raw.githubusercontent.com/gedxxe/readme-assets/main/realtimemonitor.png)

## Abstrak

**Realtime EC/TDS Monitor** adalah sebuah aplikasi web yang dirancang untuk memantau nilai *Electrical Conductivity* (EC) dan *Total Dissolved Solids* (TDS) dalam larutan air secara *real-time*. Proyek ini dikembangkan sebagai bagian dari program Kuliah Kerja Nyata (KKN) UNNES GIAT Angkatan 13 di Kelurahan Gunungpati, Kota Semarang.

Aplikasi ini menerima data dari sensor yang terhubung ke *microcontroller* ESP32 dan mengirimkannya ke sebuah MQTT *broker*. Selanjutnya, aplikasi web ini melakukan *subscribe* ke topik MQTT tersebut melalui WebSocket untuk memvisualisasikan data dalam bentuk grafik dan angka yang mudah dibaca. Tujuannya adalah untuk mempermudah petani hidroponik atau pengguna lainnya dalam memantau kualitas nutrisi air tanpa harus melakukan pengukuran manual berulang kali.

---

## Latar Belakang Proyek (Konteks KKN)

Proyek ini merupakan salah satu program kerja yang diimplementasikan dalam rangka **Kuliah Kerja Nyata (KKN) Reguler UNNES GIAT Angkatan 13**.

- **Lokasi KKN**: Kelurahan Gunungpati, Kecamatan Gunungpati, Kota Semarang.
- **Periode Pelaksanaan**: 30 Oktober – 30 November 2025.
- **Universitas**: Universitas Negeri Semarang (UNNES)

Tujuan utama dari program ini adalah memberikan solusi teknologi sederhana yang dapat membantu meningkatkan efisiensi dan efektivitas dalam bidang pertanian, khususnya hidroponik, yang mulai berkembang di masyarakat lokal.

---

## Fitur Utama

- **Visualisasi Real-Time**: Menampilkan data TDS terkini dalam satuan *parts per million* (ppm) yang diperbarui setiap beberapa detik.
- **Grafik Historis**: Grafik garis dinamis yang menampilkan 50 data pembacaan terakhir untuk memantau tren kualitas air dari waktu ke waktu.
- **Indikator Status Koneksi**: Memberikan informasi visual mengenai status koneksi ke MQTT *broker* (Connecting, Connected, Reconnecting, Disconnected, Error).
- **Log Diagnostik**: Menampilkan log teknis dari proses koneksi, pengiriman, dan penerimaan data MQTT untuk kemudahan *troubleshooting*.
- **Desain Responsif**: Tampilan yang dapat beradaptasi dengan baik di perangkat desktop maupun *mobile*.
- **Konfigurasi Aman**: Menggunakan *environment variables* untuk menyimpan kredensial MQTT, sehingga tidak terekspos langsung di dalam kode.

---

## Teknologi yang Digunakan

- **Frontend**:
  - [React](https://reactjs.org/) (dengan TypeScript)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Recharts](https://recharts.org/) untuk visualisasi grafik
- **Komunikasi Real-Time**:
  - [MQTT.js](https://github.com/mqttjs/MQTT.js) (koneksi melalui WebSocket)

---

## Prasyarat & Instalasi

Untuk menjalankan aplikasi ini di lingkungan lokal, Anda memerlukan:

1.  **Node.js dan npm**: Pastikan sudah terinstal di komputer Anda.
2.  **MQTT Broker**: Anda memerlukan akses ke MQTT Broker yang mendukung koneksi via WebSocket. Anda bisa menggunakan broker publik seperti `broker.hivemq.com` atau meng-hosting sendiri.
3.  **Sensor & Microcontroller**: Rangkaian perangkat keras (ESP32 + Sensor TDS) yang sudah diprogram untuk mengirim data ke MQTT broker.

### Langkah-langkah Instalasi

1.  **Clone repository ini:**
    ```bash
    git clone https://github.com/gedxxe/hydrogiat.git
    cd hydrogiat
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment Variables:**
    Buat sebuah file bernama `.env` di direktori utama proyek dan isikan dengan kredensial MQTT Broker Anda.
    ```env
    # URL WebSocket MQTT Broker (e.g., wss://broker.hivemq.com:8884/mqtt)
    MQTT_URL=wss://your-broker-url.com

    # Topik MQTT yang akan di-subscribe
    MQTT_TOPIC=your/device/topic

    # Kredensial (jika dibutuhkan oleh broker)
    MQTT_USERNAME=your_username
    MQTT_PASSWORD=your_password
    ```
    > **Penting**: Aplikasi memiliki mekanisme *fail-safe* dan tidak akan berjalan jika salah satu dari variabel di atas tidak diisi untuk menjaga keamanan kredensial.

4.  **Jalankan aplikasi:**
    ```bash
    npm run dev
    ```
    Aplikasi akan tersedia di `http://localhost:5173` atau port lain yang tersedia.

---

## Cara Kerja Sistem

Alur kerja sistem ini sangat sederhana:

1.  **Sensor**: Sensor TDS mengukur konduktivitas listrik di dalam air dan mengirimkan sinyal analog/digital.
2.  **Microcontroller (ESP32/ESP8266)**: Membaca data dari sensor, mengonversinya menjadi nilai PPM, lalu mempublikasikan (*publish*) data tersebut ke topik tertentu di MQTT Broker.
3.  **MQTT Broker**: Bertindak sebagai perantara yang menerima pesan dari *microcontroller* dan meneruskannya ke semua klien yang berlangganan topik tersebut.
4.  **Aplikasi Web (Klien)**: Terhubung ke MQTT Broker melalui WebSocket, berlangganan topik yang sama, dan secara *real-time* menerima data untuk ditampilkan kepada pengguna.

---

## Pembuat

Dibuat dengan ❤️ oleh **I Gede Bagus Jayendra** ([gedxxe](https://github.com/gedxxe)) sebagai bagian dari pengabdian kepada masyarakat melalui KKN GIAT 13 UNNES.

---

## Lisensi

Proyek ini dilisensikan di bawah [Lisensi Apache v2.0](LICENSE).
