# Panduan Migrasi CI/CD: GitHub Actions ke Jenkins

Dokumentasi ini mencatat proses migrasi alur CI/CD pada ekosistem bypur.my.id dari GitHub Actions ke Jenkins mandiri (*self-hosted*), optimasi performa untuk server spesifikasi hemat, serta integrasi sistem notifikasi Telegram terpusat.

---

## 1. Latar Belakang Migrasi

Alur deployment sebelumnya menggunakan GitHub Actions pada tiga repository:
* `bypur-app` (Frontend Web Next.js)
* `fe-bypur-cms` (Frontend CMS Vite React)
* `bayupur-portofolio-be` (Backend API Go)

### Masalah yang Dihadapi
* GitHub Actions terkunci akibat kendala billing akun (`account locked due to a billing issue`), sehingga seluruh pipeline otomatis terhenti.
* Ketergantungan penuh pada layanan runner pihak ketiga membuat proses deploy rentan terganggu jika ada kendala akun atau kuota.

### Solusi yang Diambil
* Memindahkan seluruh proses build, testing, dan deploy ke server VPS pribadi (`203.194.115.93`) yang sudah menjalankan Jenkins di `https://jenkins.bypur.my.id`.
* Menonaktifkan workflow GitHub Actions lama dengan mengubah nama file menjadi `ci.yml.disabled`.

---

## 2. Arsitektur Deployment & Alokasi Resource

Server berjalan dengan spesifikasi 1 vCPU, 2 GB RAM fisik, dan 4 GB swap file. Seluruh container aplikasi berjalan di dalam Docker network terpadu bernama `bypur_network`.

| Aplikasi | Port Internal | Batas RAM | Batas CPU | Live Domain |
|---|---|---|---|---|
| **bypur-web** | 3000:3000 | 512 MB | 0.5 vCPU | `https://bypur.my.id` |
| **bypur-api** | 3001:3001 | 512 MB | 0.5 vCPU | `https://api.bypur.my.id` |
| **bypur-cms** | 3002:80 | 256 MB | 0.5 vCPU | `https://cms.bypur.my.id` |
| **jenkins** | 9090 | ~400 MB (JVM) | Fleksibel | `https://jenkins.bypur.my.id` |

Host Nginx pada VPS bertindak sebagai *reverse proxy* utama dengan sertifikat SSL Let's Encrypt untuk mengarahkan domain publik ke port container masing-masing.

---

## 3. Strategi Optimasi Performa & Disk

Build Jenkins sebelumnya memakan waktu sangat lama dan menghabiskan resource server. Masalah tersebut diselesaikan melalui langkah-langkah teknis berikut:

### A. Penghapusan SonarQube
* SonarQube LTS dan database PostgreSQL bawaannya dinonaktifkan dan dihapus dari server.
* Langkah ini berhasil membebaskan ruang disk sebesar 7.12 GB (penggunaan disk turun dari 74% ke 51%) dan menghemat sekitar 1.5 GB RAM.
* Tahap download scanner dan polling Quality Gate selama 5 menit dihilangkan dari seluruh `Jenkinsfile`.

### B. Menghilangkan Double Build pada Go Backend (`bypur-api`)
* **Sebelumnya:** Host menjalankan `go build`, lalu Dockerfile mengunduh image `golang:1.25-alpine` (350+ MB), mengunduh ulang module, dan meng-compile Go untuk kedua kalinya di dalam container.
* **Sekarang:** Binary statis Linux (`main`) di-compile satu kali di host CI menggunakan flag `CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s"`. Dockerfile cukup berbasis `alpine:latest` dan langsung menyalin file binary tersebut.
* **Hasil:** Waktu build Docker terpangkas menjadi 1 sampai 2 detik, ukuran image turun drastis, dan flag `go clean -testcache` dihapus agar pengujian memanfaatkan cache lokal.

### C. Menghilangkan Double Install pada Next.js Web (`bypur-app`)
* **Sebelumnya:** `pnpm install` dijalankan dua kali (sekali di host untuk lint/test, dan sekali lagi di dalam Dockerfile).
* **Sekarang:** `pnpm build` dijalankan langsung di host memanfaatkan cache lokal dan fitur `output: "standalone"` pada `next.config.ts`. Dockerfile hanya berfungsi sebagai *runner* Alpine murni yang menyalin folder `.next/standalone` dan `.next/static`.
* **Hasil:** Waktu build Docker terpangkas menjadi 2 sampai 3 detik tanpa membebani memori server.

### D. Manajemen Disk Workspace
* Setiap `Jenkinsfile` dibatasi menyimpan hanya 3 riwayat build terakhir melalui opsi:
  `buildDiscarder(logRotator(numToKeepStr: '3'))`
* Blok `cleanup` pada pipeline secara otomatis menjalankan `docker image prune -f` dan `deleteDir()` setelah build selesai.

---

## 4. Sistem Notifikasi Telegram Terpusat

Untuk menghindari penumpukan puluhan baris script Bash/curl dan mencegah potensi *shell injection* di dalam repository, arsitektur notifikasi dipisahkan menjadi script server terpusat.

### A. Lokasi dan Pengaturan File di VPS
1. **Script Eksekutor:** `/usr/local/bin/jenkins-notify` (`chmod +x`)
   * Mengambil nama Job, nomor build, URL build, hash commit, author, dan pesan commit secara otomatis.
   * Menggunakan modul Python bawaan Linux (`urllib.parse` dan `html.escape`) untuk membersihkan karakter khusus agar aman saat dikirim ke Telegram.
2. **File Kredensial:** `/etc/jenkins-telegram.env` (`chmod 600`)
   * Berisi `TELEGRAM_BOT_TOKEN` dan `TELEGRAM_CHAT_ID`.
   * Hanya dapat dibaca oleh user root sehingga kredensial aman dari akses publik.

### B. Implementasi Bersih di `Jenkinsfile`
Seluruh repository hanya perlu memanggil satu baris perintah di bagian `post`:

```groovy
post {
  success {
    sh 'command -v jenkins-notify >/dev/null 2>&1 && jenkins-notify SUCCESS || true'
  }
  failure {
    sh 'command -v jenkins-notify >/dev/null 2>&1 && jenkins-notify FAILED || true'
  }
  cleanup {
    sh 'docker image prune -f || true'
    deleteDir()
  }
}
```

Format pesan yang diterima di Telegram:
```text
🚀 CI/CD DEPLOYMENT SUCCESS
━━━━━━━━━━━━━━━━━━
📦 Project: bypur-web
🔖 Build: #1
🌿 Branch: main
👤 Author: Bayu Purnomo
💬 Commit: refactor: simplify jenkinsfile (b172081)
🌐 Live URL: https://bypur.my.id
🔍 Logs: https://jenkins.bypur.my.id/job/bypur-web/1/console
⏱ Status: Container Healthy & Active ✅
━━━━━━━━━━━━━━━━━━
```

---

## 5. Panduan Setup Lengkap di Dashboard Jenkins

Ikuti langkah-langkah berikut untuk mengatur job pipeline di antarmuka web Jenkins (`https://jenkins.bypur.my.id`):

### Tahap 1: Verifikasi Tool NodeJS
1. Buka **Manage Jenkins** -> **Tools**.
2. Gulir ke bagian **NodeJS installations**.
3. Pastikan terdapat instalasi dengan nama: `NodeJS-20` (versi Node.js 20.x aktif).
4. Klik **Save**.

### Tahap 2: Menambahkan Secret File Credentials
File environment `.env` disimpan secara aman di Jenkins dan akan disuntikkan saat pipeline berjalan:
1. Buka **Manage Jenkins** -> **Credentials** -> **System** -> **Global credentials (unrestricted)**.
2. Klik tombol **Add Credentials**.
3. Buat tiga credential berikut:

#### Credential 1: Web Frontend
* **Kind:** Secret file
* **File:** Pilih file `.env` milik proyek `bypur-app` dari komputer Anda
* **ID:** `bypur-web-env`
* **Description:** Environment variables untuk bypur-web production

#### Credential 2: Backend API
* **Kind:** Secret file
* **File:** Pilih file `.env` milik proyek `bayupur-portofolio-be` dari komputer Anda
* **ID:** `bypur-api-env`
* **Description:** Environment variables untuk bypur-api production

#### Credential 3: CMS Frontend
* **Kind:** Secret file
* **File:** Pilih file `.env.production` milik proyek `fe-bypur-cms` dari komputer Anda
* **ID:** `bypur-cms-env`
* **Description:** Environment variables untuk bypur-cms production

### Tahap 3: Membuat Tiga Job Pipeline

Ulangi langkah ini untuk ketiga aplikasi:

1. Di halaman utama Jenkins, klik menu **New Item** di sebelah kiri.
2. Masukkan nama item dan pilih tipe **Pipeline**, lalu klik **OK**:
   * Nama job 1: `bypur-web`
   * Nama job 2: `bypur-api`
   * Nama job 3: `bypur-cms`
3. Pada halaman konfigurasi job:
   * Bagian **General**: Berikan deskripsi singkat aplikasi.
   * Bagian **Build Triggers**: Centang **GitHub hook trigger for GITScm polling** (jika menggunakan webhook GitHub).
   * Bagian **Pipeline**:
     * **Definition:** Pilih *Pipeline script from SCM*
     * **SCM:** Pilih *Git*
     * **Repository URL:** Masukkan URL Git repository Anda (misal: `https://github.com/bayupur-apps/bypur-web.git`)
     * **Credentials:** Pilih credential GitHub Anda (Personal Access Token / SSH Key)
     * **Branch Specifier:** `*/main`
     * **Script Path:** `Jenkinsfile`
4. Klik **Save**.

---

## 6. Pengaturan Webhook GitHub (Otomatis Deploy saat Git Push)

Agar Jenkins otomatis memulai build setiap kali Anda melakukan `git push origin main`:

1. Buka repository Anda di GitHub (`Settings` -> `Webhooks` -> `Add webhook`).
2. Masukkan konfigurasi berikut:
   * **Payload URL:** `https://jenkins.bypur.my.id/github-webhook/` *(pastikan garis miring di akhir disertakan)*
   * **Content type:** `application/json`
   * **Secret:** Kosongkan (atau isi jika Anda mengonfigurasi Secret Token di Jenkins)
   * **Which events would you like to trigger this webhook?:** Pilih *Just the push event*
   * **Active:** Pastikan tercentang.
3. Klik tombol **Add webhook**.

---

## 7. Pemeliharaan dan Perintah Cepat

### Mengubah Token Telegram di Server
Jika Anda mengganti bot atau chat ID:
```bash
ssh root@203.194.115.93
nano /etc/jenkins-telegram.env
# Simpan perubahan (Ctrl+O, Enter, Ctrl+X)
```

### Menguji Notifikasi Secara Manual
```bash
JOB_NAME="manual-test" /usr/local/bin/jenkins-notify SUCCESS
```

### Memeriksa Status Container yang Sedang Berjalan
```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### Memeriksa Penggunaan RAM Server
```bash
free -h
```

### Restart Jenkins dengan Aman
Akses URL browser berikut saat login sebagai admin:
`https://jenkins.bypur.my.id/safeRestart`
