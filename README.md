
1. Download the Project
First, get the code from Replit:

Click the three dots menu (⋮) in Replit's top right
Select "Download as zip"
Extract the files to your desired folder
2. Set Up VS Code Environment
Open the project folder in VS Code and install the required dependencies:

# Install Node.js dependencies
npm install
# Install TypeScript globally (if not already installed)
npm install -g typescript tsx
3. Environment Setup
The project uses these key technologies:

Frontend: React + TypeScript + Vite + Tailwind CSS
Backend: Express.js + TypeScript + Drizzle ORM
Database: PostgreSQL (you'll need to set this up)
4. Database Configuration
For the database, you have two options:

Option A: Use In-Memory Storage (Simplest)
The project already includes in-memory storage that works immediately without any database setup.

Option B: Set Up PostgreSQL
If you want persistent data:

Install PostgreSQL locally
Create a database
Set the DATABASE_URL environment variable
5. Running the Application
Start the development server:

npm run dev
This will:

Start the Express backend on port 5000
Start the Vite frontend development server
Enable hot module replacement for development
6. VS Code Extensions (Recommended)
Install these extensions for the best development experience:

TypeScript and JavaScript Language Features (built-in)
Tailwind CSS IntelliSense
ES7+ React/Redux/React-Native snippets
Prettier - Code formatter
ESLint
7. Available Scripts
npm run dev - Start development server
npm run build - Build for production
npm run preview - Preview production build
The application will be available at http://localhost:5000 and includes all the micro-investing features: user authentication, portfolio management, round-up calculations, investment goals, and connected accounts simulation.
