# 🧾 ReceiptRadar

> AI-powered receipt scanner that extracts merchant, amount, date and sends warranty expiry alerts

![ReceiptRadar Dashboard](https://res.cloudinary.com/dwa77wptm/image/upload/v1780728364/receipt-radar/Mobile-Invoice-format-01-simple.webp.webp)

## 🌐 Live Demo

| Service | URL |
|---|---|
| Frontend | [receipt-radar-beige.vercel.app](https://receipt-radar-beige.vercel.app) |
| Backend API | [receipt-radar-production.up.railway.app/docs](https://receipt-radar-production.up.railway.app/docs) |

---

## ✨ Features

- 📤 **Upload receipts** — supports JPG, PNG, and PDF
- 🤖 **AI-powered extraction** — automatically extracts merchant, amount, date, and category using Groq Vision + LLaMA 3.3
- 🗄️ **Secure storage** — files stored on Cloudinary, data on PostgreSQL (Neon)
- ⏰ **Warranty tracker** — set expiry dates and track them per receipt
- 📧 **Email alerts** — get notified 30 days before warranty expires via Gmail SMTP
- 📊 **Spending analytics** — monthly spending bar chart + category-wise donut chart
- 🗑️ **Delete receipts** — manage your receipt history
- 🌙 **Dark / Light mode** — theme toggle built in

---

## 🛠️ Tech Stack

### Backend
| Tech | Purpose |
|---|---|
| Python + FastAPI | REST API framework |
| PostgreSQL (Neon) | Database |
| SQLAlchemy | ORM |
| Cloudinary | File storage |
| Tesseract OCR | Local text extraction |
| Groq Vision (LLaMA 4) | AI image reading fallback |
| Groq LLaMA 3.3 70B | Receipt data parsing |
| Gmail SMTP | Email alerts |

### Frontend
| Tech | Purpose |
|---|---|
| React + Vite | Frontend framework |
| Recharts | Analytics charts |
| Axios | API calls |
| React Router | Navigation |

### DevOps
| Tech | Purpose |
|---|---|
| Railway | Backend deployment |
| Vercel | Frontend deployment |
| Docker | Containerization |
| GitHub | Version control |

---

## 🏗️ Architecture

```
User uploads receipt (photo/PDF)
        ↓
Cloudinary (file storage)
        ↓
Tesseract OCR → extracts raw text
        ↓ (fallback)
Groq Vision → reads image directly
        ↓
Groq LLaMA 3.3 → parses structured data
        ↓
PostgreSQL (Neon) → stores receipt
        ↓
React Dashboard → displays data + charts
        ↓
Gmail SMTP → warranty expiry alerts
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- Tesseract OCR installed
- PostgreSQL database (Neon recommended)
- Cloudinary account
- Groq API key

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

Create `.env` file:

```env
DATABASE_URL=your_neon_postgresql_url
SECRET_KEY=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GROQ_API_KEY=your_groq_api_key
SMTP_EMAIL=your_gmail@gmail.com
SMTP_PASSWORD=your_app_password
```

Run the server:

```bash
uvicorn main:app --reload
```

API docs available at: `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App runs at: `http://localhost:5173`

---

## 📁 Project Structure

```
receipt-radar/
  backend/
    routes/
      upload.py       # File upload + OCR + AI parsing
      receipts.py     # CRUD operations
      alerts.py       # Warranty email alerts
    services/
      storage.py      # Cloudinary integration
      ocr.py          # Tesseract + Groq Vision OCR
      parser.py       # Groq LLaMA receipt parser
      email.py        # Gmail SMTP alerts
    models/
      receipt.py      # SQLAlchemy Receipt model
    main.py           # FastAPI app entry point
    database.py       # DB connection + session
  frontend/
    src/
      pages/
        Dashboard.jsx # Main dashboard with charts
        Upload.jsx    # Receipt upload page
      components/
        Navbar.jsx    # Navigation + theme toggle
      api/
        receipts.js   # Axios API calls
```

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/upload` | Upload receipt + extract data |
| GET | `/api/receipts` | Get all receipts |
| PATCH | `/api/receipts/{id}/warranty` | Update warranty date |
| DELETE | `/api/receipts/{id}` | Delete receipt |
| POST | `/api/alerts/check` | Send warranty alert emails |

---

## 🔮 Roadmap

- [ ] User authentication (JWT)
- [ ] Multi-user support
- [ ] Mobile app (React Native)
- [ ] Tax report export (PDF)
- [ ] WhatsApp warranty alerts
- [ ] Bulk receipt upload

---

## 👨‍💻 Author

**Pavan Shinde**
- GitHub: [@PavanShinde412](https://github.com/PavanShinde412)
- LinkedIn: [linkedin.com/in/pavanshinde](https://linkedin.com/in/pavanshinde412)

---

## 📄 License

MIT License — feel free to use and modify!