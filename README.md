# TaskFlow – Smart Task Tracker

TaskFlow is a production-ready, highly polished full-stack Task Tracker Web Application built with the **MERN Stack** (MongoDB, Express, React, Node.js). Engineered with a minimal, modern UI reminiscent of **Notion, Trello, or ClickUp**, it features a fully modular bento stats dashboard, live Recharts data visualizations, smart category filters, instant searching, real-time activity logs, keyboard shortcuts, and responsive desktop-first layout engines.

---

## 🎨 Visual Identity & Core Theme
TaskFlow is designed around two clean, high-contrast aesthetics:
- **Clean Light Mode**: Crisp white workspaces paired with soft slate-gray borders and high-contrast charcoal typography.
- **Cosmic Dark Mode**: Immersive deep-neutral canvases highlighted with soft glowing visual category indicator dots.

---

## 🔥 Key Features

### 💻 Frontend (Client Stage)
*   **Complete CRM & Task CRUD**: Retrieve, create, details view, edit, and delete task milestones with instant client-side updates without full-page reloads.
*   **Bento Statistics Cards**: Interactive widgets tracking Total Tasks, Pending Tasks, In Progress Tasks, Completed Sprints, High Priority alerts, and a **dynamic Completion Rate percentage dial**.
*   **Dynamic Recharts priority bar**: real-time rendering of task counts by urgency (High, Medium, Low).
*   **Instant Query Filters**: Drill down by Status (Pending/In Progress/Completed), Priority (High/Medium/Low), or Category Hubs.
*   **Unified Live Search**: Instant filtering matching Title, Description, or Category.
*   **Interactive Sidebar Drawer**: Collapsible mobile sidebar overlay with an SVG progress ring and keyboard shortcut legend.
*   **Recent Activity Tracker**: A dynamic local activity stream reporting Task mutations, deletions, or status toggles.
*   **Keyboard Shortcuts (Hotkeys)**:
    *   `N` (Create Task)
    *   `/` (Focus Search Bar)
    *   `R` (Force Sync / Fetch)
    *   `Esc` (Return Home / Close fields)

### 🔌 Backend & Database
*   **Graceful Database Fallback Connection**: Auto-detects if MongoDB Atlas is missing or fails to connect. Instantly switches into a fully-featured, file-backed local JSON fallback database (`tasks.json`) pre-seeded with starting tasks so the app operates perfectly right out of the box.
*   **Express REST API**: Fully mapped endpoints served under `/api/tasks`.
*   **Strict Validators**: Backend validators using `express-validator` to guarantee titles, description lengths (min 10 characters), and future-proof due-dates.
*   **Strict Security & CORS**: Robust sanitization on incoming JSON payloads.

---

## 🛠️ Tech Stack

**Frontend:**
*   React.js 19 (Functional Hooks & Context APIs)
*   React Router DOM (Client Routing)
*   Axios (HTTP client)
*   Tailwind CSS (Visual Design Engine)
*   React Hook Form (Strict client-side validations)
*   React Toastify (Notification alerts)
*   Recharts (Bento widgets data visualizations)
*   Motion / React (Fluid scale-in card entrances)
*   Lucide React (Minimalist vector icons)

**Backend:**
*   Node.js (Server runtime)
*   Express.js (REST routing)
*   Express Validator (Request schema enforcement)
*   Mongoose (ODM schema model mapper)

**Database:**
*   MongoDB Atlas (Production Cloud SQL fallback or local Mongo)
*   Local File-Based storage (Developer Preview Fallback)

---

## 📂 Folder Structure

```text
taskflow-smart-tracker/
├── .env.example            # Environment configurations blueprint
├── index.html              # Frontend DOM mount container
├── metadata.json           # Application metadata rules
├── package.json            # Scripts, commands, and dependencies
├── tsconfig.json           # Compiler rules
├── vite.config.ts          # Build plugin rules
├── server.ts               # Full-stack server entry & Vite middleware
├── server/                 # Backend Module Directory
│   ├── config/
│   │   └── db.ts           # Mongoose client setup & graceful fallbacks
│   ├── controllers/
│   │   └── taskController.ts # REST handlers, search, sorting filters
│   ├── middleware/
│   │   └── validator.ts    # express-validator criteria
│   ├── models/
│   │   └── Task.ts         # Mongoose schema model
│   └── routes/
│       └── taskRoutes.ts   # REST API mapping endpoints
└── src/                    # Frontend React SPA Directory
    ├── main.tsx            # React application mounting
    ├── App.tsx             # Theme engines, routes, hotkeys, bento layout
    ├── index.css           # Google Fonts imports and Tailwind configurations
    ├── types.ts            # Shared TypeScript models and stats interfaces
    ├── utils/
    │   └── activity.ts     # Activity logs dispatchers
    ├── context/
    │   └── TaskContext.tsx # Centralized State store, HTTP sync, loading dispatch
    ├── components/         # Reusable Custom Components
    │   ├── Badge.tsx       # Pill tag components
    │   ├── Button.tsx      # Multi-variant click interactives
    │   ├── FilterDropdown.tsx # Modular select-filters
    │   ├── Input.tsx       # forwardRef inputs and textareas
    │   ├── Loader.tsx      # Spinners and backdrop loaders
    │   ├── Modal.tsx       # Confirm Delete dialogs
    │   ├── Navbar.tsx      # Dark mode toggles, status indicators, and headers
    │   ├── SearchBar.tsx   # Live searches with clean controls
    │   ├── Sidebar.tsx     # Categories selection, progress rings, and hotkeys
    │   └── SortDropdown.tsx# Selection controls for sorters
    └── pages/              # Primary View Stages
        ├── Dashboard.tsx   # Analytics, recharts, controls grid, and task-cards
        ├── AddTaskPage.tsx # Creation form mount
        └── EditTaskPage.tsx# Edit form details pull and update
```

---

## ⚙️ Environment Variables

Prepare your environment variables in a `.env` file at the root:

```env
# Server Port (Defaults to 3000)
PORT=3000

# MongoDB Atlas Database connection URI string
MONGO_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskflow"

# Secret Key for JWT Token Signings
JWT_SECRET="your_jwt_signing_token_secret"

# Frontend Host URL (leave blank for local / single-host dev)
VITE_API_URL=""
```

---

## 🚀 Installation & Local Launch

### 1. Clone the project and install dependencies:
```bash
npm install
```

### 2. Launch the Development Server:
```bash
npm run dev
```
*The dev server automatically boots on port 3000. It hosts both the **Express Backend** and uses the **Vite Middleware** to compile and serve the React Client.*

### 3. Open the browser:
Open your browser of choice to: `http://localhost:3000`

---

## 📡 API Documentation (REST endpoints)

All endpoints utilize standard JSON exchange parameters.

| Method | Endpoint | Description | Query Parameters / Body |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/tasks` | Get filtered and sorted tasks | `search`, `status`, `priority`, `category`, `sortBy` |
| **GET** | `/api/tasks/:id` | Get single task details | None |
| **POST** | `/api/tasks` | Create a new task objective | Body: `{ title, description, priority, status, category, dueDate }` |
| **PUT** | `/api/tasks/:id` | Update task parameters | Body: Partial modifications on fields |
| **DELETE** | `/api/tasks/:id` | Terminate task objective | None |

### Sample Validation Response (HTTP 400):
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    {
      "field": "description",
      "message": "Description must be at least 10 characters long"
    }
  ]
}
```

---

## 📦 Deployment Guides

### Frontend SPA & Backend Bundler (Render / Heroku)
The build system is pre-configured to build the frontend assets static package and bundle the backend typescript file into a self-contained production bundle using `esbuild`.

1.  Build static and bundler:
    ```bash
    npm run build
    ```
2.  Start in production:
    ```bash
    npm run start
    ```
This runs Node on the compiled self-contained bundle `dist/server.cjs` which serves both our backend API endpoints and static React client.
