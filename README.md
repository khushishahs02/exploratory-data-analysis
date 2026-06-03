# Veda Life AI

Insurance charge prediction with Gradient Boosting + SHAP explainability.  
React + Tailwind frontend · FastAPI backend · Deployed on Vercel + Render.

---

## File Structure

```
veda-life-ai/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx         Sticky top nav
│   │   ├── Hero.jsx           Landing section + stats bar
│   │   ├── Predict.jsx        Tab wrapper (single / batch)
│   │   ├── SingleForm.jsx     Patient form + SHAP result
│   │   ├── BatchUpload.jsx    CSV drag-drop + results table
│   │   ├── ShapChart.jsx      Horizontal SHAP bar chart
│   │   ├── HowItWorks.jsx     3-card methodology section
│   │   ├── ModelPerf.jsx      Leaderboard + fairness audit
│   │   ├── AboutModel.jsx     Model card + beeswarm mockup
│   │   ├── Author.jsx         Story + concepts covered
│   │   └── Footer.jsx
│   ├── api.js                 All fetch calls (one place)
│   ├── App.jsx                Root component
│   ├── main.jsx               ReactDOM entry
│   └── index.css              Tailwind + design tokens
├── backend/
│   ├── main.py                FastAPI app
│   └── requirements.txt
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## What to change before running

### 1. Drop your model files into `/backend/`
```
backend/
  gb_model.pkl    ← from your notebooks folder
  scaler.pkl      ← from your notebooks folder
```

### 2. Update your real metrics in `ModelPerf.jsx`
Replace the hardcoded leaderboard values with your actual notebook output.

### 3. Update your details in `Author.jsx`
```js
const AUTHOR = {
  name:     'Your Name',
  github:   'https://github.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourprofile',
  avatar:   '/your-photo.jpg',   // drop photo in /public
}
```

### 4. Update the story paragraphs in `Author.jsx`
Write your own version — the structure is there, just replace the text.

### 5. Update CORS origin in `backend/main.py`
```python
allow_origins=['http://localhost:5173', 'https://your-app.vercel.app']
```

---

## Local development

### Frontend
```bash
npm install
npm run dev        # runs on localhost:5173
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload   # runs on localhost:8000
```

The Vite proxy in `vite.config.js` forwards `/api/*` to `localhost:8000` automatically.

---

## Deploy

### Backend → Render
1. Push to GitHub
2. New Web Service on Render → connect repo → root dir: `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Copy the Render URL

### Frontend → Vercel
1. New project on Vercel → connect repo → root dir: `.` (project root)
2. Add environment variable: `VITE_API_URL` = your Render URL
3. Deploy

---

## Model files note
The `.pkl` files are NOT committed to git (add to `.gitignore`).  
For Render deployment, either:
- Use Render's persistent disk, or
- Host them on Hugging Face Hub / S3 and load at startup
