
# GoogleHackathon App

## Overview
This project is a web application built for the Google Hackathon. It is structured as a React app and includes authentication, protected routes, and a basic dashboard and login page.


## Project Structure

- **public/**: Static files and assets (favicon, images, manifest, etc.)
- **src/**: Main source code
	- **App.js**: Main application component
	- **index.js**: Entry point for React
	- **components/**: Shared components
		- `AuthContext.js`: Provides authentication context for the app
		- `initialise.js`: Handles initialization logic (e.g., Firebase or other services)
		- `PrivateRoute.js`: Component for protecting routes that require authentication
		- `SelectedPageContext.js`: Context for managing the currently selected page
	- **pages/**: Main pages
		- `dashboard.jsx`: Dashboard page (protected)
		- `login.jsx`: Login page
		- `main.jsx`: Main landing or navigation page


## Features Implemented

1. **Authentication Context**: Centralized authentication state using React Context API (`AuthContext.js`).
2. **Protected Routes**: `PrivateRoute.js` ensures only authenticated users can access certain pages (like the dashboard).
3. **Selected Page Context**: `SelectedPageContext.js` manages the state of the currently selected page for navigation or UI logic.
4. **Login Page**: Basic login form and logic in `login.jsx`.
5. **Dashboard Page**: Accessible only after login, implemented in `dashboard.jsx`.
6. **Main Page**: `main.jsx` serves as the main landing or navigation page.
7. **Initialization**: `initialise.js` sets up any required services (e.g., Firebase, APIs).
8. **Styling**: Basic CSS in `App.css` and `index.css`.
9. **Testing**: Basic test setup in `App.test.js` and `setupTests.js`.

## How to Run

1. Install dependencies:
	 ```bash
	 npm install
	 ```
2. Start the development server:
	 ```bash
	 npm start
	 ```

## Next Steps

- Add more features to the dashboard
- Improve authentication (e.g., OAuth, error handling)
- Enhance UI/UX

---
This README will be updated as more features are added.
