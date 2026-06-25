# Collaboration Log
**Project S3:**  Topic: Cybersecurity Incident Response Chatbot  
**Team:** Makuo, Muhammed Javed, Hassan  
**School:** EPITA Paris  
**Year:** 2025–2026  

---

## How to use this log

This isn't just a task list. We want to carry the professor along so he understands how each person *thought* through their part, so we include dead ends, things that didn't work, why we made certain decisions, what is gave, tradeoffs if there is one."


##### So teammates
we fill this as we go. Every time you finish something meaningful, add a row. Don't wait until the end or you'll forget the details and the reasoning.

**Each entry should answer:**
- What did you do?
- Why did you make the decisions you made?
- Did anything go wrong or surprise you?
- What would you do differently?

---

## Team Members

| Name | Role / Ownership |
|------|-----------------|
| Member 1 -- Makuo| Backend (Node.js endpoints) + GenAI integration + benchmarking |
| Member 2 -- Muhammad Saad Javed | Frontend (React, 3 pages) + Three.js visuals + UX |
| Member 3 -- Hassan | Documentation (Innovation, Privacy, Security) + GenAI log tracking |



---

## Log Entries

| Member | Task | Description | Decisions Made | Date |
|--------|------|-------------|----------------|------|
| All | Idea selection | Picked the Cybersecurity Incident Response Chatbot as our project idea after comparing 5 options. | Chose this over language learning and student wellness bots because it ties directly into our SSI specialization and the innovation gap (no student-facing guided IR tool exists) gave us a stronger research story. | 21/06/2025 |
| All | Innovation research | Searched Google Scholar, GitHub, and Product Hunt for existing incident response chatbots. Found 3 academic papers and several enterprise tools (Jeli.io, HackBot, IntellBot). | Decided to position as Niche but argue toward Innovative because nothing exists for students specifically. Used Claude to help summarize search results — logged in GenAI-log.docx. | 21/06/2025 |
| Member 1 | Got the server running | I tested with groq api key and curl from the terminal and i got a response | We decided to use groq because it is free, and i am testing over terminal because frontend is not yet ready | 23/06/2026 |
| Member 2 | Cloned repo and set up frontend | Cloned the repository, created `feat/frontend` branch, installed dependencies with `npm install`, and got the dev server running on `http://localhost:5173`. | Used `feat/frontend` branch to keep frontend work isolated from `main`. Asked Makuo for `.env` values privately instead of committing them to Git. | 23/06/2026 |
| Member 2 | Styled Home.jsx (landing page) | Replaced the plain login form with a styled dark theme card. Added loading state to the button. Kept `handleLogin` fetch logic unchanged. | Chose dark theme (`#0a0a1a`) with green accent (`#A6E3A1`) to reinforce the cybersecurity theme. Placed the globe at the top as a visual hook. Added demo credentials hint at the bottom. | 23/06/2026 |
| Member 2 | Styled Chat.jsx (main chat interface) | Styled the chat page with a dark header, scrollable message area, and input bar at the bottom. Added `logout` to the `useAuth` destructuring. | Put the input bar at the bottom because it's industry standard for chat apps. Added a placeholder message when no messages exist. The auto-scroll behavior was already working — I kept it. | 23/06/2026 |
| Member 2 | Improved ChatBubble.jsx | Added labels ("You" / "CyberGuide") above each bubble. Changed AI bubble to dark theme (`#12121f`) with border to match the app. | Labels improve accessibility and clarity in long conversations. Dark AI bubbles match the overall theme better than the original light grey. | 23/06/2026 |
| Member 2 | Styled Report.jsx | Added loading and error states. Styled the report content in a code-style card. The download function was already working — I just styled the button. | Used `Courier New, monospace` font for the report to make it look like a technical document. Added "Back to chat" button for easy navigation. | 23/06/2026 |
| Member 2 | Built ThreatGlobe.jsx with Three.js | Built a 3D globe with wireframe, 25 random red threat dots, atmosphere glow layer, and a pulsing equator ring. Added cleanup function to prevent memory leaks. | Chose Three.js over static images because it's interactive, visually distinctive, and demonstrates actual frontend skill. The globe with red dots reinforces the cybersecurity theme. | 23/06/2026 |
| Member 2 | Git merge and conflict resolution | Merged `main` into `feat/frontend` and resolved `package-lock.json` conflicts by regenerating the lock file. Opened Pull Request. | Regenerated lock file instead of manually editing it because lock files are auto-generated and manual edits are error-prone. | 23/06/2026 |

---

## Individual Sections

Each team member writes their own section below. This is where you go deeper than the table — explain your thought process, what you tried, what failed, what you learned.

---

### [Member 1 — Makuo] — Backend + GenAI Integration

**[Start date: 21/06/2025]**

**Overview**

I owned the entire server/ folder — the Express server, all three API 
routes, the JWT middleware, the AI provider switcher, and the system 
prompt. I also handled the GenAI integration and benchmarking between 
two providers.

---

**Day 1 — Project setup and backend scaffold (21/06/2025)**

We started by reading the project brief together as a team and picking 
our idea. We compared 5 options before settling on the Cybersecurity 
Incident Response Chatbot. The main reason was that our SSI 
specialization gave us credibility on the topic, and research showed no 
student-facing guided IR tool exists — which positioned us as Niche 
leaning toward Innovative on the grading scale.

I also did the innovation research on Google Scholar, GitHub, and 
Product Hunt. Found papers like IntellBot (arXiv 2024) and enterprise 
tools like Jeli.io and HackBot — all built for professionals, not 
students. That gap is what we built into.

---

**Day 2 — Server setup and first AI response (23/06/2025)**

I set up the backend from the scaffold. The first issue I hit was 
dotenv not finding the .env file. The server was running from inside 
server/ but the .env was in the root. Fixed it by changing:

  require('dotenv').config()
  
to:

  require('dotenv').config({ path: '../.env' })

This was a small fix but it took a while to figure out why the terminal 
was showing "AI provider: undefined" when the .env was clearly filled 
in. Lesson learned: dotenv resolves paths relative to where the process 
runs, not where the file is.

After that fix, health check at localhost:3001/api/health returned:
  { "status": "ok", "provider": "groq" }

Then I tested the full auth + chat flow using curl:

  Step 1 — got a JWT token from POST /api/auth/login
  Step 2 — sent a chat message with the token in Authorization header
  Step 3 — got back an AI reply following the system prompt structure

First AI response came back in under 3 seconds on Groq. It followed 
the 6-option incident type structure from the system prompt correctly.


---

**Day 3 — Session persistence bug fix (24/06/2025)**

After Javed pushed the frontend, we tested the full flow together. 
Found two bugs:

Bug 1 — "View report" said "no session found"
The session ID was being generated fresh every page load but never 
saved to localStorage so the Report page couldn't find it.

Fix: added localStorage.setItem('cg_session', SESSION_ID) right after 
generating the ID.

Bug 2 — "Back to chat" after viewing report started a new conversation
The SESSION_ID was declared outside the component so it regenerated on 
every navigation. Also the messages array was empty on return because 
useState([]) always starts fresh.

Fix: moved SESSION_ID inside the component and added a useEffect that 
fetches the conversation history from GET /api/chat/history/:sessionId 
on page load. Now navigating back to chat restores the full 
conversation.

Both fixes were small but the second one required understanding how 
React's component lifecycle works — useState resets on every mount, so 
you have to re-fetch from the backend to restore state.

---

**Day 4 — OpenRouter integration + benchmarking (25/06/2025)**

Originally the scaffold had Mistral as the second provider. I switched 
it to OpenRouter because I already had an account and it gives access 
to multiple models through one API key — better for benchmarking.

Added callOpenRouter() to server/services/llm.js using fetch() instead 
of an SDK. OpenRouter uses the same format as OpenAI's API, just a 
different base URL. The provider switch still works by changing one 
line in .env — no code changes needed.

**Dead end 1:** mistralai/mistral-7b-instruct:free — model no longer 
available on OpenRouter free tier. Got error: "No endpoints found."

**Dead end 2:** meta-llama/llama-3.1-8b-instruct:free — also removed 
from free tier. Error: "This model is unavailable for free."

**What worked:** poolside/laguna-xs.2:free — currently available free 
model on OpenRouter. Responses were slower (30+ seconds vs Groq's 2-3 
seconds) but the quality was comparable.

**Benchmarking observations (Groq vs OpenRouter):**

| Criterion | Groq (llama-3.1-8b-instant) | OpenRouter (poolside/laguna-xs.2) |
|-----------|----------------------------|-----------------------------------|
| Response speed | ~2-3 seconds | 30+ seconds |
| Opened with 6 options | Yes | Yes |
| One question at a time | Yes | Sometimes asked 2 at once |
| Plain language | Yes | Yes, with more emojis |
| Followed 5 phases | Yes | Yes |
| Report format | Clean | Clean |
| Overall quality | 4/5 | 3/5 |

**Decision:** Groq is the better primary provider for this app. Speed 
matters for incident response — a user dealing with a real security 
incident should not wait 30 seconds between messages. Groq also 
followed the one-question-at-a-time rule more consistently.

**Why this matters for the GDPR section:** Groq is US-based. OpenRouter 
is also US-based. Neither satisfies GDPR data residency requirements 
for EU users. This is documented in Hassan's privacy section — the 
recommendation is to switch to Mistral (EU-based) for any production 
deployment serving European students.

---

**Architecture decisions I made:**

1. Why Express over other frameworks: minimal, well-documented, lets 
you see exactly what's happening. A bigger framework like NestJS adds 
complexity we don't need for a prototype.

2. Why in-memory sessions: we store conversation history in a sessions 
object on the server. No database needed. It resets when the server 
restarts which is fine for a demo. A real product would use Redis or 
PostgreSQL.

3. Why JWT: stateless authentication means the server doesn't need to 
remember who is logged in. All the user info is packed into the token 
itself, signed with our secret. If the token is valid, we trust it.

4. Why abstract the AI provider into llm.js: the Strategy Pattern — 
the route doesn't care which AI is being used, it just calls 
getAIReply(). This is what made switching providers for benchmarking 
possible with zero code changes.

---

**Answers to key questions:**

What does middleware do in Express?
Middleware is a function that runs between the HTTP request arriving 
and the route handler running. Our verifyToken() checks the JWT before 
any protected route runs. If the token is missing or invalid, the 
request is rejected and the route handler never runs.

What is the difference between 401 and 403?
401 = no token sent, we don't know who this is.
403 = token exists but is invalid or expired.
Same as: 401 = no ID card, 403 = fake ID card.

Why JWT instead of storing a username in session?
JWT is stateless — the server stores nothing. All user info is signed 
into the token. The server just verifies the signature. Cleaner, 
scales better, no session store needed.

---

**Completion checklist:**
- [x] Server runs on port 3001
- [x] Health check returns { status: ok, provider: groq }
- [x] POST /api/auth/login returns JWT token
- [x] POST /api/chat returns AI reply following system prompt
- [x] GET /api/chat/history/:id returns conversation
- [x] GET /api/report/:id returns last AI message
- [x] Session persists across chat and report pages
- [x] OpenRouter integrated as second provider
- [x] Groq vs OpenRouter benchmarked with 5 prompts
- [x] All commits pushed to feat/backend


---

### [Member 2 — Muhammad Saad Javed] — Frontend + Three.js

*Write your section here as you go. Talk about how you structured the 3 React pages, what you built in Three.js and why, what UX decisions you made and why. Include anything you had to scrap or rethink.*

**[Start date: 23/06/2026]**

**Day 1 — Complete Frontend Implementation (23/06/2026)**

I implemented the entire frontend in one session today. The backend was already running from Makuo's work, so I could test everything end-to-end as I built it.

**What I built:**

| Component | Description |
|-----------|-------------|
| **Home.jsx** | Styled the login page with dark theme (`#0a0a1a`), green accent (`#A6E3A1`), and a clean login card. Added loading state to the button for user feedback. |
| **Chat.jsx** | Built the main chat interface with a header bar (CyberGuide brand, "View report", "Log out"), scrollable message area, and input bar at the bottom. Added `logout` to the `useAuth` destructuring. |
| **ChatBubble.jsx** | Created reusable message bubbles with labels ("You" / "CyberGuide"), purple for user messages, dark with border for AI messages. |
| **Report.jsx** | Styled the report page with loading and error states, a code-style card for the report content, and a download button that creates a `.txt` file. |
| **ThreatGlobe.jsx** | Built a 3D globe using Three.js with wireframe, red threat dots, atmosphere glow, and a pulsing equator ring. |

**UX decisions made:**

1. **Dark theme throughout** — reinforces the cybersecurity/incident response theme and makes the Three.js globe stand out
2. **Input bar at bottom of chat** — industry standard for chat apps, users expect it there
3. **Labels above chat bubbles** — helps distinguish who said what in long conversations
4. **Globe at top of login page** — visual hook that immediately communicates "this is a tech/security tool"
5. **Loading states on buttons** — prevents double-submission and gives user feedback

**Why these decisions?** I wanted the app to feel polished and professional, not like a basic academic project. The dark theme with green accents gives it a "cyber" feel that matches the incident response purpose.

**What went wrong:**

1. **Missing `loading` state in Home.jsx** — I used `loading` in the button but forgot to declare it in `useState`. Fixed by adding `const [loading, setLoading] = useState(false);` and toggling it during the login request. This broke the page initially until I caught it.

2. **package-lock.json conflicts during merge** — when merging `main` into `feat/frontend`, the lock file had conflicts. I regenerated it by checking out `main`'s version and running `npm install` again. This took a few tries to get right.

3. **ThreatGlobe positioning** — initially the globe was too large and covered the login form. I adjusted the height to `380px` and made it scale properly.

**What worked well:**

- The existing fetch logic (`handleLogin`, `sendMessage`, `downloadReport`) was already wired correctly — I didn't have to touch any API calls
- Login with `student/epita2025` worked immediately
- Auto-scroll in chat worked perfectly with `bottomRef.current?.scrollIntoView({ behavior: 'smooth' })`
- The Three.js globe rendered smoothly with all the enhancements

**What surprised me:** How quickly everything came together once I understood the structure. The scaffold was well-organized so I could focus on styling without fighting the architecture.

**What I would do differently:**

I initially considered using Tailwind CSS for faster styling, but the project was set up with inline styles. I stuck with inline styles to keep it consistent with the existing code and avoid adding extra dependencies that might cause issues for other teammates.

**Why Three.js:**

We chose Three.js over a static image or CSS animation because it is interactive, visually distinctive, and demonstrates actual frontend skill. The globe with red threat dots reinforces the cybersecurity theme and gives the landing page a professional look that sets CyberGuide apart from other chatbots.

**Technical details on the globe:**

```javascript
// Key decision: globe.add(dot) vs scene.add(dot)
globe.add(dot); // dot rotates WITH the globe
scene.add(dot); // dot stays static while globe rotates
```
I used `globe.add(dot)` so the threat dots stay fixed on the globe surface as it rotates. This made the visualization more realistic.

The cleanup function in `useEffect` cancels the animation frame and removes the canvas from the DOM — this prevents memory leaks when the component unmounts. I learned this from the Three.js documentation.

**Git workflow:**

I worked on the `feat/frontend` branch throughout. After completing each component, I committed and pushed:

- `chore: initial frontend setup running on port 5173`
- `feat: Home page styled with dark theme and login form`
- `feat: Chat page styled — dark theme with scrollable message area`
- `feat: ChatBubble improved with labels and dark theme colors`
- `feat: Report page styled — dark theme with download button`
- `feat: ThreatGlobe enhanced with dots, glow, and pulsing ring`
- `chore: update client package-lock.json`
- `Merge main into feat/frontend: regenerate package-lock.json`

**Conflict resolution:** I had to resolve `package-lock.json` conflicts when merging `main` into my branch. I regenerated the lock file instead of manually editing it.

**Final status:**

All work is pushed to `feat/frontend` branch. The branch is now 2 commits ahead of `main` and ready for review. Pull Request opened.

**Completion checklist:**

- [x] Frontend runs at localhost:5173
- [x] Home page: dark theme, globe, styled login
- [x] Login works and redirects to /chat
- [x] Chat page: header, scrollable messages, input bar
- [x] ChatBubble: labels, purple user / dark AI
- [x] Report page: loading/error states, download works
- [x] ThreatGlobe: wireframe, red dots, glow, pulsing ring
- [x] All commits pushed to feat/frontend
- [x] Pull Request opened

---

### [Member 3 — Hassan] — Documentation + Privacy + Security

**[Start date: 25/06/2026]**

**Day 1 — All Three Documents Completed (25/06/2026)**

My role was to own all written documentation for the project. I produced three documents: B-conception.docx (conception and architecture), D-privacy.docx (GDPR analysis), and E-security.docx (security analysis). I also coordinated setting up the GitHub Projects task board with the team and got the architecture diagrams embedded into the conception document.

**How I planned my work:**

I used the instruction document I was given as a checklist and worked through each document in order. Before writing anything, I read through the server files — auth.js, llm.js, chat.js, and the system prompt — so I understood what the code actually does rather than just describing it at a surface level. I worked in one focused session, completing all three documents the same day.

**What went well:**

The structure of the instruction document made the scope very clear. I never had to guess what was expected — the framework was there and I filled it with content grounded in the actual codebase. The provider abstraction in llm.js (switching between Groq and Mistral via a single environment variable) made the GDPR analysis much stronger than I expected: the compliance fix for EU deployment is literally a one-line change to .env, which is a concrete and honest argument rather than a vague recommendation.

**What did not go well:**

Setting up the GitHub Projects board took longer than it should have. I did not have write access to the repository initially, and the project visibility was set to private so I could not see it even after being added as a collaborator. This was resolved once Javed changed the project visibility to public. In future I would make sure repo and project access is sorted on day one before any work starts.

**What surprised me:**

Understanding the security implications took more thought than expected. Reading that JWT tokens are stored in localStorage and connecting that to the XSS threat — and then realising that the same fix (httpOnly cookies) appears as both a security recommendation in E-security.docx and a privacy recommendation in D-privacy.docx — made me see how security and privacy are not separate concerns but the same problem looked at from two angles.

**What I would do differently:**

Start by reading the code first, before opening any document. I spent some time early on writing about things I had not fully understood yet and had to go back and revise. If I had done a full read-through of the server files in the first 30 minutes, the writing would have been faster and more confident throughout.

**Documents produced:**

| Document | Points | Status |
|----------|--------|--------|
| B-conception.docx | 4 pts | Complete — pushed to feat/docs |
| D-privacy.docx | 4 pts | Complete — pushed to feat/docs |
| E-security.docx | 4 pts | Complete — pushed to feat/docs |

---

## Notes on how we split the work

The division of work followed our assigned roles from the start and stayed consistent throughout. Makuo owned the backend entirely — server setup, JWT auth, AI integration, and the system prompt. Javed owned the frontend — all three React pages, the ChatBubble component, and the Three.js globe. Hassan owned all written documentation — the three deliverable documents plus keeping this log and the GenAI log updated.

The main adjustment mid-project was on the documentation side: Hassan needed access to the GitHub repository and Projects board to include the task tracking screenshot in B-conception.docx. This required Javed (who managed the repo) to add Hassan as a collaborator and set the project visibility to public. It caused a short delay but was resolved the same day. Everything else proceeded as planned with no role changes or reassignments.

---

*Last updated: 25/06/2026*