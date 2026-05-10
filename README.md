# Dluxe Dubai — Project Transparency Dashboard

A clean, view-only project dashboard to share with the client. Dark luxury aesthetic. No login required for viewers.

---

## Deploy to Vercel (5 minutes, free)

### Step 1 — Push to GitHub
1. Go to [github.com](https://github.com) → New repository → name it `dluxe-dashboard`
2. In this folder, run:
```bash
git init
git add .
git commit -m "Initial dashboard"
git remote add origin https://github.com/YOUR_USERNAME/dluxe-dashboard.git
git push -u origin main
```

### Step 2 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → Sign up free with your GitHub account
2. Click **Add New Project** → Import your `dluxe-dashboard` repo
3. Leave all settings as default → click **Deploy**
4. Done. You get a URL like `dluxe-dashboard.vercel.app`

### Step 3 — Share with client
Send the Vercel URL. They can view everything, can't edit anything.

---

## How to update tasks

Open `public/tasks.json` — this is the only file you ever need to edit.

**Status options:** `"blocked"` · `"inprogress"` · `"completed"` · `"planned"`

**Impact options:** `"High"` · `"Medium"` · `"Low"`

### To update a task:
Edit the relevant fields in `tasks.json`, then:
```bash
git add public/tasks.json
git commit -m "Update task 1 status"
git push
```
Vercel auto-deploys in ~30 seconds. Client's URL shows the new version instantly.

### To add a new task:
Copy an existing task object in `tasks.json`, give it a new `"id"`, and fill in the fields.

### To mark a task complete:
Change `"status": "blocked"` to `"status": "completed"`.

---

## Run locally (optional)
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)
