# 🧠 NeuroTask — Your Second Brain for Academic Survival

> Platform produktivitas digital inovatif untuk mahasiswa yang berfungsi sebagai "otak kedua digital" guna membantu menyelesaikan tugas akademik dengan lebih cerdas.

---

## 📋 Tentang Project

NeuroTask adalah website interaktif yang membantu mahasiswa mengelola tugas akademik secara efisien. Website ini memecah tugas besar menjadi langkah-langkah kecil yang dapat dikelola, melacak deadline dengan urgency meter, menyediakan focus timer, dan menampilkan analytics produktivitas — semua dalam satu platform yang premium dan modern.

### Masalah yang Diselesaikan
- ❌ Mahasiswa kewalahan mengatur banyak deadline
- ❌ Bingung memulai tugas besar
- ❌ Menunda pekerjaan karena overwhelmed
- ❌ Kesulitan membagi pekerjaan besar menjadi langkah kecil

### Solusi NeuroTask
- ✅ Smart Task Breakdown otomatis
- ✅ Deadline urgency meter real-time
- ✅ Focus timer dengan session tracking
- ✅ Productivity dashboard & insights
- ✅ Data tersimpan lokal di browser

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| **Smart Task Breakdown** | Auto-generate subtasks berdasarkan tipe tugas (essay/presentasi/coding), tingkat kesulitan, dan deadline |
| **Deadline Intelligence** | Urgency meter 4 level (Aman → Perhatikan → Mendesak → Kritis) dengan warna dinamis |
| **Focus Timer** | Pomodoro-style timer dengan SVG circular progress, mode Focus/Break/Long Break |
| **Productivity Dashboard** | Chart aktivitas mingguan & completion ring menggunakan Canvas API |
| **Productivity Insights** | Analisis waktu produktif & beban per mata kuliah dengan visualisasi data |
| **Multi-Task Support** | Buat dan kelola banyak tugas sekaligus dengan progress tracking masing-masing |
| **Auto Save** | LocalStorage persistence — semua data tersimpan otomatis |
| **Neural Background** | Animated canvas particle system dengan mouse interaction |
| **Audio Notification** | Web Audio API beep saat timer selesai + browser notification |
| **Keyboard Shortcuts** | Ctrl+K untuk quick add task |

---

## 🛠️ Teknologi

| Teknologi | Penggunaan |
|-----------|------------|
| **HTML5** | Semantic markup, SEO-friendly structure |
| **CSS3** | Custom Properties, Glassmorphism, CSS Grid, Flexbox, Keyframe Animations |
| **Vanilla JavaScript (ES6+)** | Canvas API, Web Audio API, IntersectionObserver, LocalStorage |
| **Google Fonts** | Space Grotesk, Inter, JetBrains Mono |

> ⚠️ **Zero dependencies** — Tidak menggunakan framework atau library apapun (React, Vue, jQuery, Bootstrap, Tailwind, dll.)

---

## 🎨 Design System

| Aspek | Detail |
|-------|--------|
| **Design Direction** | Neural Glassmorphism — perpaduan aesthetic neural network dengan glassmorphism modern |
| **Color Palette** | Dark theme dengan Neural Purple (#6c5ce7 → #a855f7) accent, Synapse Blue, Mint Cyan |
| **Typography** | Space Grotesk (heading) + Inter (body) + JetBrains Mono (data/mono) |
| **Spacing** | 8px grid system |
| **Animations** | Scroll reveal, counter animation, floating cards, glow effects, micro-interactions |

---

## 📱 Responsive & Mobile Support

- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (480px - 768px)
- ✅ Small Mobile (< 480px)
- ✅ iOS Safari — Safe area insets, dvh units, input zoom prevention
- ✅ Landscape orientation support
- ✅ Touch-friendly targets (min 48px)
- ✅ Body scroll lock saat mobile nav terbuka

---

## 📁 Struktur Project

```
NeuroTask/
├── index.html                # Main HTML — semua section dalam satu halaman
├── css/
│   ├── style.css             # Core design system, tokens, navigation, hero, footer
│   ├── components.css        # Features, planner, dashboard, insights, testimonials, FAQ, CTA
│   ├── animations.css        # Keyframes, scroll reveal, micro-interactions
│   └── responsive.css        # Media queries, iOS fixes, touch targets
├── js/
│   ├── storage.js            # LocalStorage CRUD module (IIFE pattern)
│   ├── neural-bg.js          # Canvas neural network particle animation
│   ├── animations.js         # Scroll reveal, counter animation, cursor glow, scroll progress
│   ├── planner.js            # Smart task planner — type detection, breakdown generation
│   ├── timer.js              # Pomodoro focus timer — SVG ring, Web Audio API
│   ├── dashboard.js          # Canvas charts — weekly bar, completion ring, insights
│   └── app.js                # Main init, navigation, carousel, FAQ accordion, toast system
└── README.md                 # Dokumentasi project
```

---

## 🚀 Cara Menjalankan

### Opsi 1: Langsung buka di browser
```
Klik 2x pada file index.html
```

### Opsi 2: Live Server (VS Code)
1. Install extension **Live Server**
2. Klik kanan pada `index.html` → **Open with Live Server**

### Opsi 3: HTTP Server
```bash
npx http-server . -p 8080
```
Buka `http://localhost:8080`

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Aksi |
|----------|------|
| `Ctrl + K` | Quick Add Task — langsung fokus ke input planner |

---

## 📊 Section Website

1. **Hero** — Neural canvas background, tagline, CTA, statistik
2. **Features** — 6 fitur utama dalam glassmorphism cards
3. **Smart Planner** — Input tugas → auto-generate subtasks (interaktif & fungsional)
4. **Dashboard** — Stats, weekly chart, completion ring, focus timer
5. **Insights** — Productive hours chart, course load chart, daily tips
6. **Testimonials** — Carousel dengan swipe support & auto-play
7. **FAQ** — Accordion dengan smooth animation
8. **CTA** — Email signup form + trust badges
9. **Footer** — Brand, navigasi, links

---

## 🏆 Dibuat untuk Lomba

**Kompetisi:** Web Design Competition  
**Tema:** "Membangun Inovasi Digital: Kreativitas Tanpa Batas dalam Dunia Web"  
**Tahun:** 2026

---

## 👤 Author

Dibuat dengan 💜 untuk mahasiswa Indonesia.

© 2026 NeuroTask. All rights reserved.
