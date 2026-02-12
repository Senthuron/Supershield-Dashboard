# Technical & Functional Documentation - Supershield Dashboard

## High-Level System Architecture

The **Supershield Dashboard** is a web-based administrative interface built using the **Next.js 15** framework. It acts as a centralized hub for viewing and managing form submissions (enquiries, contact requests, career applications) from the main Supershield website.

### Architecture Components:
1.  **Frontend (Client-Side):**
    -   Built with **React 19** and **Next.js App Router**.
    -   Styled using **Tailwind CSS 4**.
    -   Fetches data from the backend API via secure HTTP requests.
    -   Provides a responsive UI with filtering capabilities.

2.  **Backend (Server-Side):**
    -   Hosted as **Next.js API Routes** (Serverless Functions).
    -   Handles data retrieval and simple authentication.
    -   Connects to the database to fetch records.

3.  **Database:**
    -   **MongoDB** is used as the persistent data store.
    -   Data is stored in the `supershield` database within the `enquire-management` collection.

---

## Folder and File Structure

The project follows the standard Next.js 15 App Router structure:

```
Supershield-Dashboard/
├── app/                        # Main application logic (App Router)
│   ├── api/                    # API Route definitions
│   │   └── enquiries/
│   │       └── route.js        # GET endpoint for fetching dashboard data
│   ├── layout.tsx              # Root layout file (HTML structure, fonts)
│   ├── page.tsx                # Main dashboard page (UI & Logic)
│   └── globals.css             # Global styles and Tailwind directives
├── lib/                        # Shared utility libraries
│   └── mongodb.js              # MongoDB connection client (Singleton pattern)
├── public/                     # Static assets (images, fonts, icons)
├── package.json                # Project dependencies and scripts
└── next.config.ts              # Next.js configuration
```

### Key Files:
-   **`app/page.tsx`**: The core dashboard view. It handles state management (loading, error, filtering), fetches data from the API, and renders the submissions table.
-   **`app/api/enquiries/route.js`**: The server-side API endpoint that securely connects to MongoDB and returns sorted enquiry data.
-   **`lib/mongodb.js`**: A critical utility that establishes and caches the MongoDB connection to ensure performance reuse across serverless invocations.

---

## Core Logic Areas

### 1. Authentication & Security
-   **Mechanism**: Bearer Token Authentication.
-   **Implementation**:
    -   The API route (`/api/enquiries`) checks for an `Authorization` header.
    -   It validates the token against the server-side environment variable `DASHBOARD_SECRET_KEY`.
    -   The frontend sends this token using `NEXT_PUBLIC_DASHBOARD_SECRET_KEY`.
    -   **Note**: This effectively restricts access to clients that "know" the key, but since the key is exposed to the browser via `NEXT_PUBLIC_`, it allows any user visiting the site to potentially access the API if they inspect the network traffic.

### 2. Dashboards & Data Visualization
-   **Data Fetching**: Data is fetched on component mount using `useEffect`. The fetches are secured by the secret key.
-   **Filtering**: Client-side filtering allows users to toggle between 'All', 'Enquiry', 'Contact', and 'Career' types without re-fetching data from the server.
-   **Display**: Data is presented in a responsive table including fields like Name, Company, Email, Phone, Location, and Submission Date.

### 3. Database Integration
-   **Connection**: Uses the native `mongodb` Node.js driver.
-   **Optimization**: Implements a caching mechanism (`global._mongoClientCache`) in `lib/mongodb.js` to prevent creating a new connection for every API request, which is vital for serverless performance.
-   **Querying**: Fetches all documents from the `enquire-management` collection, sorted by `createdAt` in descending order (newest first).

---

## Deployment and Rollback Procedure

### Prerequisites
-   Node.js (v18+ recommended)
-   MongoDB Instance (URI required)

### Environment Variables
The following variables must be set in your deployment environment (e.g., Vercel, .env.local):

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/
DASHBOARD_SECRET_KEY=your_secure_backend_key
NEXT_PUBLIC_DASHBOARD_SECRET_KEY=your_secure_backend_key
```

### Deployment Steps (Standard Vercel/Node)
1.  **Clone/Pull Code**: Retrieve the latest code from the repository.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Build Application**:
    ```bash
    npm run build
    ```
4.  **Start Server**:
    ```bash
    npm run start
    ```

### Rollback Procedure
If a deployment fails or introduces critical bugs:
1.  **Identify Last Stable Commit**: user `git log` to find the previous stable hash.
2.  **Revert Code**:
    ```bash
    git revert <bad-commit-hash>
    git push origin main
    ```
3.  **Redeploy**: Trigger a new deployment with the reverted codebase.
4.  **Verify**: Check that the dashboard loads and data fetching works correctly.

---

## Known Risks and Technical Debt

### 1. Security Risk: Exposed API Key
-   **Issue**: The authentication allows the frontend to send the secret key (`NEXT_PUBLIC_DASHBOARD_SECRET_KEY`). Since this variable is prefixed with `NEXT_PUBLIC_`, it is embedded in the client-side JavaScript bundle. Use strict **CORS** policies or move to HttpOnly cookies/NextAuth.js for robust security.
-   **Impact**: Technically savvy users can extract this key and access the raw API data directly.

### 2. Scalability: No Pagination
-   **Issue**: The API fetches **all** records (`collection.find({})`) in a single request.
-   **Impact**: As the database grows to thousands of entries, this will drastically slow down the application and potentially crash the browser/server due to memory limits.
-   **Remediation**: Implement server-side pagination (e.g., `skip` and `limit`) in the API route.

### 3. Type Safety
-   **Issue**: The project is a mix of TypeScript (`.tsx`) and JavaScript (`.js`). Specifically, the API route is in JS, and the frontend uses `any` type for filter logic (`enquiry:any`).
-   **Impact**: higher chance of runtime errors if data structures change.

### 4. Error Handling
-   **Issue**: Error handling is basic.
-   **Impact**: If the database connection fails or the schema is mismatched, the user sees a generic error. More granular error reporting (e.g., "Database timeout" vs "Invalid key") would help debugging.
