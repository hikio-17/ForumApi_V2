# Forum API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


Proyek ini merupakan API untuk aplikasi forum yang memungkinkan pengguna untuk membuat thread, membalas thread, mengomentari thread dan balasan, memberi suka dan tidak suka pada konten. API ini dibangun menggunakan Node.js, framework Hapi, dan database PostgreSQL. Proyek ini mengikuti prinsip clean architecture dan mengimplementasikan autentikasi untuk akses API yang aman. Proyek ini juga mencakup pengujian otomatis menggunakan Jest dan menerapkan integrasi dan penyebaran berkelanjutan (CI/CD) dengan GitHub.

## Teknologi yang Digunakan

- Node.js
- Express.js
- Sequelize (ORM untuk koneksi dan manipulasi database)
- MySQL (Database)
- JSON Web Tokens (JWT) untuk autentikasi
- Winston (Logger untuk mencatat aktivitas aplikasi)
- Postman (Dokumentasi API)
- Swagger (Dokumentasi API)

## Deskripsi

Aplikasi Laundry API menyediakan API (Application Programming Interface) untuk mengelola entitas pelanggan (customers) dan pesanan (orders) pada bisnis laundry. API ini dapat digunakan oleh aplikasi frontend, aplikasi mobile, atau klien lain yang membutuhkan akses ke data laundry.

Aplikasi ini dibangun dengan menggunakan framework Express.js dan Sequelize untuk menghubungkan dan memanipulasi data pada database MySQL. Autentikasi dilakukan menggunakan JSON Web Tokens (JWT), sehingga setiap permintaan API harus menyertakan token yang valid untuk mendapatkan akses.

Selain itu, aplikasi ini telah dilengkapi dengan fitur logger menggunakan Winston. Logger ini berguna untuk mencatat aktivitas dan informasi penting dalam aplikasi, sehingga memudahkan pemantauan dan pemecahan masalah.

## Fitur

- API untuk CRUD (Create, Read, Update, Delete) pada entitas pelanggan (customers) dan pesanan (orders).
- Autentikasi menggunakan JSON Web Tokens (JWT).
- Setiap permintaan API harus menyertakan token untuk akses.
- API untuk login dan sign up pengguna.
- Fitur logger dengan Winston untuk mencatat aktivitas aplikasi.
## Instalasi dan Penggunaan

1. Clone repositori ini:

```bash
  https://github.com/hikio-17/ForumApi_V2.git
```

2. Pindah ke direktori proyek:

```bash
  cd ForumApi_V2
```

3. Install dependensi:

```bash
  npm install
```

4. Siapkan database:

  - Buat database PostgreSQL.
  - Ubah nama file .env.example menjadi .env.
  - Perbarui file .env dengan detail koneksi     database PostgreSQL Anda.

4. Jalankan Migrasi untuk membuat skema table dalam database:

```bash
  npm run migrate
```

5. Start the server

```bash
  npm run start
```

Secara default server akan berjalan pada `http://localhost:5000`

## Konfigurasi

Konfigurasi untuk aplikasi ini disimpan dalam file .env. Anda dapat mengubah file ini untuk menyesuaikan pengaturan seperti detail koneksi database, port, secret key JWT, dll.
## Autentikasi

API ini menggunakan JSON Web Tokens (JWT) untuk autentikasi. Untuk mengakses endpoint yang dilindungi, Anda perlu menyertakan header Authorization dengan nilai Bearer {token}. Anda dapat memperoleh token dengan melakukan permintaan POST ke endpoint /authentications dengan kredensial yang valid.
## Pengujian Otomatis

Proyek ini mencakup pengujian otomatis menggunakan Jest. Tes dapat ditemukan di direktori _test pada masing masing folder. Untuk menjalankan tes, gunakan perintah berikut:

```bash
  npm run test:watch
```

Tes ini mencakup berbagai fungsionalitas API untuk memastikan bahwa semuanya berfungsi seperti yang diharapkan dan untuk mendeteksi adanya regresi saat melakukan perubahan.
## Integrasi dan Penyebaran Berkelanjutan

Proyek ini dikonfigurasi untuk integrasi dan penyebaran berkelanjutan (CI/CD) menggunakan GitHub Actions. Alur kerja CI/CD dikonfigurasi untuk menjalankan pengujian otomatis setiap kali ada push ke repositori dan untuk mendeploy API ke lingkungan produksi jika pengujian berhasil.

Alur kerja CI/CD dapat ditemukan di direktori .github/workflows. Alur kerja tersebut mencakup langkah-langkah yang diperlukan untuk membangun, menguji, dan mendeploy aplikasi menggunakan konfigurasi yang ditentukan.
## Dokumentasi API

- Dokumentasi API dapat ditemukan di [Postman](https://documenter.getpostman.com/view/20149138/2s93zB51po)

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](https://opensource.org/licenses/MIT).



## Penulis
Fajri Muhammad Tio - [@hikio-17](https://github.com/hikio-17)
