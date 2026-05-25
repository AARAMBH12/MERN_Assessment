# Zoronal – MERN Company Review Platform

A full-stack MERN application for adding company profiles and writing reviews.

## Project Structure

```
zoronal/
├── backend/          # Express + MongoDB API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── frontend/         # React + Vite UI
    └── src/
        ├── components/
        ├── pages/
        └── utils/
```

## Prerequisites

- Node.js v18+
- MongoDB running locally **or** a MongoDB Atlas URI

---

## Backend Setup

```bash
cd backend
npm install

# Copy env and edit if needed
cp .env.example .env

# Start dev server
npm run dev
```

The API will run at **http://localhost:5000**

### Environment Variables (`backend/.env`)

| Variable     | Default                              | Description              |
|-------------|--------------------------------------|--------------------------|
| `PORT`      | `5000`                               | Server port              |
| `MONGO_URI` | `mongodb://localhost:27017/zoronal`  | MongoDB connection URI   |
| `CLIENT_URL`| `http://localhost:5173`              | Allowed CORS origin      |

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will run at **http://localhost:5173**

> Vite proxies `/api` and `/uploads` to the backend automatically.

---

## API Reference

### Companies

| Method | Endpoint              | Description                        |
|--------|-----------------------|------------------------------------|
| GET    | `/api/companies`      | List companies (search/filter/sort)|
| GET    | `/api/companies/:id`  | Get single company                 |
| POST   | `/api/companies`      | Create company (multipart/form-data)|
| PUT    | `/api/companies/:id`  | Update company                     |
| DELETE | `/api/companies/:id`  | Delete company + all reviews       |

**Query params for GET /api/companies:**
- `search` – text search across name, description, city
- `city` – filter by city
- `industry` – filter by industry
- `sortBy` – `createdAt` | `name` | `averageRating` | `totalReviews` | `foundedOn`
- `order` – `asc` | `desc`
- `page`, `limit` – pagination

### Reviews

| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| GET    | `/api/reviews?companyId=` | List reviews for company |
| POST   | `/api/reviews`            | Create review            |
| POST   | `/api/reviews/:id/like`   | Like/unlike a review     |
| DELETE | `/api/reviews/:id`        | Delete a review          |

**Query params for GET /api/reviews:**
- `companyId` *(required)* – company ID
- `sortBy` – `createdAt` | `rating` | `likes`
- `order` – `asc` | `desc`
- `page`, `limit` – pagination

---

## Features Implemented

- ✅ Add Company with logo upload (name, location, city, foundedOn, description, website, industry)
- ✅ Company listing with search, filter by city, sort, pagination
- ✅ Company detail page with logo, metadata, rating summary with distribution bars
- ✅ Add Review (full name, subject, review text, star rating)
- ✅ Review listing with sort by date / rating / likes
- ✅ Average rating auto-calculated and displayed prominently
- ✅ Like / unlike reviews (prevents double-liking via client ID)
- ✅ Share review (copies link to clipboard)
- ✅ Delete review / delete company
- ✅ Responsive dark-mode UI
