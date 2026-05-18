# DocAppoint Server — REST API

Express.js backend for the DocAppoint doctor appointment booking system, connected to MongoDB Atlas with JWT-based route protection.

## 🔗 Links

| | URL |
|---|---|
| 🌐 **Client Live** | [https://doctor-appointment-client-woad.vercel.app](https://doctor-appointment-client-woad.vercel.app) |
| 💻 **Client Repository** | [https://github.com/IM-Tamim/doctor-appointment-client](https://github.com/IM-Tamim/doctor-appointment-client) |
| 🖥️ **Server Live** | [https://doctor-appointment-server-ln61.onrender.com](https://doctor-appointment-server-ln61.onrender.com) |
| 📁 **Server Repository** | [https://github.com/IM-Tamim/doctor-appointment-server](https://github.com/IM-Tamim/doctor-appointment-server) |

## 🛠️ Tech Stack

- **Runtime** — Node.js
- **Framework** — Express.js
- **Database** — MongoDB Atlas
- **Auth** — JWT verification via JWKS (jose-cjs)
- **Deployment** — Render

## 📡 API Endpoints

### Doctors
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/doctors` | ❌ | Get all doctors |
| GET | `/doctors/:id` | ✅ | Get single doctor |
| PATCH | `/doctors/:id/review` | ✅ | Add review to doctor |

### Appointments
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/appointments` | ✅ | Book appointment |
| GET | `/appointments?email=` | ✅ | Get user's appointments |
| PATCH | `/appointments/:id` | ✅ | Update appointment |
| DELETE | `/appointments/:id` | ✅ | Delete appointment |

## ⚙️ Environment Variables

```env
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=your_client_url
PORT=8000
```