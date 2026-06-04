# FightBack ⚡

> AI-powered legal aid platform for India's 10M+ gig workers — generate complaint letters, calculate wage gaps, and know your rights.


---

## What is FightBack?

Gig workers on platforms like Zomato, Swiggy, Blinkit, Uber, Ola, and Rapido are routinely underpaid, unfairly deactivated, and unaware of their legal rights. FightBack gives them a tool to fight back.

**Key features:**
- 🤖 **AI Complaint Generator** — Paste your issue, get a legally-framed complaint letter ready to send, powered by Groq API (LLaMA 3.3-70B)
- 💰 **Wage Gap Calculator** — Input your hours and earnings; see exactly how much you're owed vs. platform promises
- 📋 **State-Specific Rights Cards** — Know your rights under labour laws in Maharashtra, Delhi, Karnataka, Tamil Nadu, and Telangana
- 🎙️ **Voice Input** — Describe your problem out loud using Web Speech API (for workers who struggle with typing)
- 🌐 **Bilingual (EN/Hindi)** — Full English and Hindi toggle throughout the app
- 📲 **WhatsApp Share** — One tap to share your complaint letter directly

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite 5 |
| Styling | Tailwind CSS, shadcn/ui |
| AI | Groq API — LLaMA 3.3-70B Versatile |
| Voice | Web Speech API |
| Testing | Vitest, React Testing Library |
| Deployment | Vercel + Docker |

---

## Architecture

```
User Input (text / voice)
        ↓
React Frontend (Vite + TypeScript)
        ↓
Groq API — LLaMA 3.3-70B
  [Dynamic prompt template with:
   - Platform type
   - Issue category  
   - State jurisdiction
   - Worker details]
        ↓
Structured complaint letter output
        ↓
WhatsApp share / Download
```

---

## Running Locally

```bash
git clone https://github.com/Akash16ten/FightBack.git
cd FightBack
cp env.example .env
# Add your VITE_GROQ_API_KEY to .env
npm install
npm run dev
```

Or with Docker:
```bash
docker build -t fightback .
docker run -p 5173:5173 --env-file .env fightback
```

---

## Project Structure

```
src/
├── components/
│   ├── ComplaintGenerator/   # AI complaint form + output
│   ├── WageCalculator/       # Wage gap calculation logic
│   ├── RightsCards/          # State-specific rights display
│   └── ui/                   # shadcn/ui base components
├── lib/
│   ├── groq.ts               # Groq API integration
│   ├── prompts.ts            # Dynamic prompt templates
│   └── wage-logic.ts         # Wage calculation utilities
├── hooks/
│   └── useSpeechInput.ts     # Web Speech API hook
└── i18n/
    └── translations.ts       # EN/Hindi translations
```

---

## Built At

**GoDaddy Airo Buildathon** — shipped in 48 hours as part of a hackathon focused on tools for Indian SMBs and gig economy workers.

---

## License

MIT
