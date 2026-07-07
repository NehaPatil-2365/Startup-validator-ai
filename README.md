# 🚀 Startup Validator AI (Indian Market Focused)

Startup Validator AI is a premium, high-fidelity startup intelligence platform built to validate, analyze, and grade startup ideas in minutes. Tailored specifically for the **Indian startup ecosystem**, it generates 10-tab venture-capital-level reports complete with local unit economics, Indian competitor benchmarks, FSSAI/GST regulatory checkpaths, and visual projection charts.

---

## 🌟 Key Features

* **Multi-Step AI Generation Pipeline**: Powered by Groq's **Llama 3.3 70B** model. It streams sections (SWOT, TAM/SAM/SOM, roadmap, financials) in real-time as they resolve.
* **Indian Ecosystem Focus**:
  * Sizing represented in Indian Rupees (₹) and Crores (e.g. ₹5,000 Cr).
  * Benchmarked against leading Indian startups (e.g. Wow! Momo, Chaayos, Zerodha).
  * Roadmaps address local compliance (FSSAI licenses, GST, trade certificates).
* **Vibrant Light-Themed Dashboard**: Clean dashboard containing:
  * 6 score-card metrics (Overall, Innovation, Market Potential, Scalability, Investment Readiness, Risk Mitigation).
  * SWOT quadrant layouts.
  * Interactive financial charts (3-year revenue projections, use of funds allocation).
* **Interactive AI Startup Advisor**: Collapsible chat drawer pre-loaded with full report context for follow-up guidance.
* **Anonymous Access & 2-Attempt Limit**: Zero auth complexity. Restricts browsers to exactly 2 free attempts tracked in `localStorage`, with attempt refunds upon report deletion.
* **One-Click Export**: Download reports directly as formatted Markdown files or launch print-styled optimization layouts.

---

## 🛠️ Tech Stack

* **Frontend/Backend**: Next.js 14 (App Router), Tailwind CSS, TypeScript
* **Database**: Prisma ORM (defaults to local SQLite for development, Postgres compatible for production)
* **AI Engine**: Groq SDK (`llama-3.3-70b-versatile`)
* **Visualization**: Recharts (with SSR hydration protections)
* **Formatting**: React Markdown & GitHub-style prose

---

## 🚀 Local Installation & Setup

### 1. Clone & Install Dependencies
Navigate to the project folder and run:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
GROQ_API_KEY="your-groq-api-key"
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3001"
DATABASE_URL="file:./prisma/dev.db"
```
*(If no `GROQ_API_KEY` is provided, the app runs in **Fail-Safe Mock Mode** using a pre-generated Indian food startup dataset, making it 100% demo-ready).*

### 3. Initialize the Database
Generate Prisma client files and push schemas to your local SQLite database:
```bash
npx prisma db push
```

### 4. Run the Development Server
Start the local Next.js dev server:
```bash
npm run dev
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## ☁️ Deploying to Vercel

Next.js is natively supported on Vercel. 

### 1. Import Repository
Import your pushed GitHub repository into Vercel.

### 2. Configure Environment Variables in Vercel
Add the following keys in Vercel's Project Settings:
* `GROQ_API_KEY`: *Your Groq API key*
* `NEXTAUTH_SECRET`: *Any secure random string*
* `NEXTAUTH_URL`: *Your Vercel deployment URL (e.g. `https://your-app.vercel.app`)*
* `DATABASE_URL`: *Your Cloud Database Connection String (see note below)*

### ⚠️ Critical Note on Database Persistence (PostgreSQL)
SQLite uses a local file (`dev.db`). Because Vercel serverless containers are ephemeral and have a read-only filesystem, any reports saved in SQLite will be lost when Vercel containers spin down.

To make your database persistent in production:
1. Create a free PostgreSQL database on **[Neon.tech](https://neon.tech/)** or **[Supabase](https://supabase.com/)**.
2. Open `prisma/schema.prisma` and change `provider = "sqlite"` to `provider = "postgresql"`.
3. Set your Vercel `DATABASE_URL` to point to the Postgres connection string.
4. Vercel's build scripts will automatically handle the compilation!

---

## 📜 License
This project is licensed under the MIT License.
