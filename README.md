# Supershield Dashboard

A modern, responsive admin dashboard for managing contact form submissions, enquiries, and career applications. Built with Next.js 15, TypeScript, and MongoDB.

## 🚀 Features

- **Submission Management**: View and track various types of submissions (Contact, Enquiry, Career) from a centralized dashboard.
- **Real-time Filtering**: Filter submissions by category:
  - **All**: View all submissions.
  - **Contact**: General contact requests.
  - **Enquiry**: Business or service-related enquiries.
  - **Career**: Job applications and resume submissions.
- **Detailed View**: See key details like Name, Company, Contact Info, Location, and Message at a glance.
- **Responsive Design**: Optimized for desktops and tablets using Tailwind CSS.
- **Secure Access**: Simple bearer token authentication for API routes.

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Frontend**: [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) using the native Node.js driver.

## 🏁 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- **Node.js**: Ensure you have Node.js installed (v18 or higher recommended).
- **MongoDB**: You need a MongoDB instance (local or Atlas) to connect to.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Supershield-Dashboard
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

### Environment Variables

Create a `.env` or `.env.local` file in the root directory and add the following variables:

```env
# Connection string for your MongoDB database
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>

# Secret key for simple API authorization
NEXT_PUBLIC_DASHBOARD_SECRET_KEY=your_secret_key_here
```

### Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```bash
.
├── app/
│   ├── api/            # API Routes (Server-side logic)
│   ├── page.tsx        # Main Dashboard Page (Client Component)
│   ├── layout.tsx      # Root layout
│   └── globals.css     # Global styles and Tailwind directives
├── lib/
│   └── mongodb.js      # MongoDB connection helper
├── public/             # Static assets
└── package.json        # Project dependencies and scripts
```

## 📜 License

This project is private and proprietary.
