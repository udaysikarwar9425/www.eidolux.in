# Eidolux Publicity — Complete Integrated App

One unified React app combining the **premium landing page** with **full authentication + dashboard system**.

---

## 📁 Project Structure

```
eidolux-integrated/
│
├── backend/                        ← Node.js / Express API
│   ├── config/
│   │   └── db.js                   ← MongoDB connection
│   ├── middleware/
│   │   └── auth.js                 ← JWT protect + adminOnly guards
│   ├── models/
│   │   ├── User.js                 ← User schema (bcrypt passwords)
│   │   └── Booking.js              ← Booking schema
│   ├── routes/
│   │   ├── auth.js                 ← /api/auth/*
│   │   ├── bookings.js             ← /api/bookings/*
│   │   └── admin.js                ← /api/admin/*
│   ├── server.js                   ← Express entry point
│   ├── .env                        ← Environment variables
│   └── package.json
│
└── frontend/                       ← React app
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx  ← Auth guard for routes
    │   │   ├── Sidebar.jsx         ← Dashboard sidebar (collapsible)
    │   │   └── StatusBadge.jsx     ← Booking status pill
    │   ├── context/
    │   │   └── AuthContext.jsx     ← Global JWT auth state
    │   ├── pages/
    │   │   ├── LandingPage.jsx     ← Full landing page (auth-aware navbar)
    │   │   ├── Login.jsx           ← Login page
    │   │   ├── Signup.jsx          ← Signup page
    │   │   ├── DashboardLayout.jsx ← Customer layout wrapper
    │   │   ├── DashboardOverview.jsx
    │   │   ├── MyBookings.jsx
    │   │   ├── BookingHistory.jsx
    │   │   ├── Profile.jsx
    │   │   ├── AdminLayout.jsx     ← Admin layout wrapper
    │   │   ├── AdminOverview.jsx
    │   │   ├── AdminBookings.jsx   ← Inline edit + status update
    │   │   ├── AdminCreateBooking.jsx
    │   │   └── AdminUsers.jsx
    │   ├── utils/
    │   │   └── api.js              ← Axios + JWT interceptor
    │   ├── App.jsx                 ← All routes in one place
    │   ├── index.js
    │   └── index.css               ← Global styles (landing + dashboard)
    ├── package.json
    └── tailwind.config.js
```

---

## ⚙️ Prerequisites

```bash
node --version    # v18+ required
npm --version     # v9+
mongod --version  # MongoDB 6+ (local) or use Atlas free tier
```

---

## 🚀 Installation

### Step 1 — Backend

```bash
cd eidolux-integrated/backend

# Install dependencies
npm install
```

Edit `.env` if needed (defaults work for local MongoDB):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/eidolux
JWT_SECRET=eidolux_super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d
```

**Using MongoDB Atlas instead of local:**
```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/eidolux
```

---

### Step 2 — Frontend

```bash
cd eidolux-integrated/frontend

# Install React dependencies
npm install

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## ▶️ Running the App

Open **3 terminals**:

### Terminal 1 — MongoDB (skip if using Atlas)
```bash
mongod
# Mac with Homebrew:
brew services start mongodb-community
```

### Terminal 2 — Backend API
```bash
cd eidolux-integrated/backend
npm run dev

# Output:
# ✅ MongoDB Connected: localhost
# 🚀 Eidolux API running on http://localhost:5000
```

### Terminal 3 — Frontend
```bash
cd eidolux-integrated/frontend
npm start

# Opens automatically at http://localhost:3000
```

---

## 🌐 App Routes

| URL | Who sees it | Description |
|-----|-------------|-------------|
| `/` | Everyone | Full landing page |
| `/login` | Public | Login page → redirects on success |
| `/signup` | Public | Signup page → redirects to dashboard |
| `/dashboard` | Logged-in customers | Overview with active campaigns |
| `/dashboard/bookings` | Customers | All bookings with status filters |
| `/dashboard/history` | Customers | Completed/cancelled history |
| `/dashboard/profile` | Customers | Account info |
| `/admin` | Admins only | Stats + recent bookings |
| `/admin/bookings` | Admins only | All bookings + inline edit |
| `/admin/create-booking` | Admins only | Create booking for customer |
| `/admin/users` | Admins only | All users + role management |

---

## 🔐 How the Navbar Works

The navbar is **auth-aware** and shows different buttons depending on login state:

**Not logged in:**
```
[Login]  [Sign Up]  [📞 Call Now]
```

**Logged in as Customer:**
```
[📊 Dashboard]  [Logout]  [📞 Call Now]
```

**Logged in as Admin:**
```
[🛡 Admin Panel]  [Logout]  [📞 Call Now]
```

Mobile hamburger menu also adapts — shows Dashboard/Logout when logged in, Login/Signup when not.

---

## 👤 Creating Your First Admin

1. Open `http://localhost:3000/signup` and register normally
2. That creates a **customer** account
3. Manually set your role to admin in MongoDB:

**Using MongoDB Compass:**
- Connect → `eidolux` DB → `users` collection
- Find your user → change `"role": "customer"` → `"role": "admin"`

**Using Mongo Shell:**
```js
use eidolux
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

4. Log out and log back in → you'll land on `/admin`

---

## 🔗 Backend API Reference

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/signup` | Public | Register + get JWT |
| POST | `/api/auth/login` | Public | Login + get JWT |
| GET | `/api/auth/me` | Private | Verify token / get user |

### Customer Bookings
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/bookings/my` | Customer | All my bookings |
| GET | `/api/bookings/my/active` | Customer | Active only |

### Admin Bookings
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/bookings/admin/all` | Admin | All bookings |
| POST | `/api/bookings/admin/create` | Admin | Create for customer |
| PUT | `/api/bookings/admin/:id` | Admin | Update status/details |
| DELETE | `/api/bookings/admin/:id` | Admin | Delete booking |

### Admin Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/users` | Admin | All users |
| GET | `/api/admin/stats` | Admin | Dashboard stats |
| PUT | `/api/admin/users/:id/role` | Admin | Change role |

---

## 🔑 JWT Flow

1. User signs up / logs in → server returns JWT
2. JWT stored in `localStorage` as `eidolux_token`
3. Every API request sends `Authorization: Bearer <token>` automatically
4. On page refresh → token rehydrated from localStorage → verified via `/api/auth/me`
5. 401 response → token cleared → redirected to `/login`

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| Background | `#04080f` (deep navy) |
| Card background | `rgba(10,20,40,.5)` |
| Accent blue | `#1a6bff` |
| Cyan glow | `#00cfff` |
| Muted text | `#6a8cb0` |
| Font | Syne (Google Fonts) |
| Border | `rgba(0,207,255,.14)` |

---

## 🧪 Testing the Full Flow

1. **Sign up** at `/signup` as a customer
2. You're redirected to `/dashboard` — empty state shown
3. **Make yourself admin** (MongoDB step above)
4. Log out → log in → land on `/admin`
5. Go to `/admin/create-booking` → select yourself as customer → fill form → save
6. Log out → sign in with your customer account
7. `/dashboard` now shows the booking you created for yourself
8. Back to admin → edit booking → change status to **Active**
9. Customer dashboard shows it in **Active Campaigns** ✅

---

## 📞 Support

**Eidolux Publicity** — Jayendraganj Nadi Gate, Gwalior, MP
- Phone / WhatsApp: **9171982377**
- Email: **ads@eidolux.in**
- Hours: 9:00 AM – 11:00 PM daily
