ShreenShots->
 <img width="1920" height="874" alt="image" src="https://github.com/user-attachments/assets/bd507759-c769-4b14-a7e1-4b78ab6c0635" />
 
 
 <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/723c1ea4-b75f-4e4a-b7dd-a27781e0b543" />



# MERN_Assessment

Zoronal is a full-stack MERN company review platform for adding company profiles
and writing reviews.

## Project Structure

```text
zoronal/
|- backend/          # Express + MongoDB API
|  |- controllers/
|  |- middleware/
|  |- models/
|  |- routes/
|  `- server.js
`- frontend/         # React + Vite UI
   `- src/
      |- components/
      |- pages/
      `- utils/
```

## Prerequisites

- Node.js v18+
- MongoDB running locally or a MongoDB Atlas URI

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The API runs at `http://localhost:5000`.

### Environment Variables

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `5000` | Server port |
| `MONGO_URI` | `mongodb://localhost:27017/zoronal` | MongoDB connection URI |
| `CLIENT_URL` | `http://localhost:5173` | Allowed CORS origin |

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

Vite proxies `/api` and `/uploads` to the backend automatically.

## API Reference

### Companies

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/companies` | List companies with search, filter, and sort support |
| GET | `/api/companies/:id` | Get a single company |
| POST | `/api/companies` | Create a company with multipart form data |
| PUT | `/api/companies/:id` | Update a company |
| DELETE | `/api/companies/:id` | Delete a company and its reviews |

Query params for `GET /api/companies`:
- `search`: text search across name, description, and city
- `city`: filter by city
- `industry`: filter by industry
- `sortBy`: `createdAt`, `name`, `averageRating`, `totalReviews`, or `foundedOn`
- `order`: `asc` or `desc`
- `page` and `limit`: pagination

### Reviews

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/reviews?companyId=` | List reviews for a company |
| POST | `/api/reviews` | Create a review |
| POST | `/api/reviews/:id/like` | Like or unlike a review |
| DELETE | `/api/reviews/:id` | Delete a review |

Query params for `GET /api/reviews`:
- `companyId` (required): company ID
- `sortBy`: `createdAt`, `rating`, or `likes`
- `order`: `asc` or `desc`
- `page` and `limit`: pagination

## Features

- Add companies with logo upload, location, city, founded date, description, website, and industry
- Browse companies with search, city filtering, sorting, and pagination
- View company details with rating summaries and review breakdowns
- Add, list, like, share, and delete reviews
- Delete companies together with their reviews
- Responsive UI with backend upload handling
