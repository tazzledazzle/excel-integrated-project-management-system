# Excel-Integrated Project Management System

A modern, TypeScript-based web application for managing projects, tasks, teams, and timesheets—integrated with Microsoft Excel for seamless timesheet submissions. Built for project managers and teams that want to track projects and collaborate through a user-friendly, spreadsheet-powered interface.

## Features

- **Project & Task Management:** Create, view, and manage multiple projects and their tasks.
- **Team Collaboration:** Assign project managers, track team members, and monitor project progress.
- **Excel Integration:** Download an Excel template, fill timesheet data, and submit it directly from Excel using an Office JS Add-In and project-specific authentication token.
- **Status Tracking:** Filter and search projects by name, description, and status ("Upcoming", "In Progress", "Completed").
- **Dashboard:** Visual overview of ongoing projects, recent tasks, and timesheet entries.
- **Mock API:** Runs with in-memory mock data for easy local development and testing.

## Use Cases

- **Project Managers:** Organize projects, assign tasks, and monitor team performance.
- **Team Members:** Submit timesheets and track hours worked on tasks via Excel.
- **Organizations:** Centralize project and time tracking while leveraging familiar spreadsheet workflows.
- **Developers:** Extend or integrate with real APIs for production use.

## Installation & Running Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

### Steps

1. **Clone the Repository**
    ```bash
    git clone https://github.com/tazzledazzle/excel-integrated-project-management-system.git
    cd excel-integrated-project-management-system
    ```

2. **Install Dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3. **Start the Development Server**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

4. **Access the App**
    Open your browser and navigate to [http://localhost:5173](http://localhost:5173) (or the port indicated in your terminal).

5. **Try Excel Integration**
    - Download the Excel template from the "Excel Integration" section in the app.
    - Enable the Office Add-In inside Excel.
    - Generate a token for your project in the web app and paste it into the Excel Add-In.
    - Fill timesheet data and submit directly from Excel.

## Troubleshooting

- **Install/Run Problems**
    - Ensure Node.js (v18+) and npm/yarn are installed and up-to-date.
    - If the development server does not start, try deleting `node_modules` and running `npm install` again.
- **Excel Add-In Not Working**
    - Confirm your version of Excel supports Office JS Add-Ins.
    - Make sure the project token is copied correctly from the web app.
- **Mock API Data**
    - The app uses in-memory mock data by default. For persistent data or production use, integrate with a real backend/API.

## Contributing

Contributions are welcome! To get started:

1. **Fork the repository** and create a new branch for your feature or bugfix.
2. **Follow best practices:** Use clear commit messages, add comments, and write clean, maintainable TypeScript/React code.
3. **Run linting before submitting:**  
    ```bash
    npm run lint
    ```
4. **Open a Pull Request** describing your changes and referencing any related issues.

Please see the source for code structure and API mocks. For major changes, open an issue to discuss your proposed changes first.

---

### License

This project is open-source. See [LICENSE](LICENSE) for details (if available).
