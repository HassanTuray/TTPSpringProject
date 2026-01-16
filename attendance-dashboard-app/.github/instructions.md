# Project: This project is a data dashboard website. This will allow students from the University of Maryland, College Park to view the attendance records of students who participate in club events from CodeBlack, ColorStack, and The Black Engineers Society 

## Features

### 1. Landing Page Leaderboard (Default, Logged-Out)
- Display a leaderboard of students with the highest event attendance.
- Aggregate attendance across Code Black, ColorStack, and Black Engineers Society.
- Show the following fields for each student:
  - First name
  - Last name
  - Major
  - Year in school
  - Affiliated club
  - Number of events attended
- Assume users are logged out by default.

---

### 2. Global Site Header
- Render a persistent header on every page.
- Place the site logo on the left.
- Link the logo to the landing page (`/`).
- Place a user account icon on the right.

---

### 3. Authentication Dropdown (Logged-Out State)
- Open a dropdown when the user icon is clicked.
- Display two actions:
  - Sign In
  - Sign Up
- Redirect to the appropriate authentication page when selected.

---

### 4. Authentication Dropdown (Logged-In State)
- Replace authentication options when the user is signed in.
- Display two actions:
  - View Profile
  - Log Out
- Redirect to the profile page when “View Profile” is selected.
- Log the user out and redirect to the landing page when “Log Out” is selected.

---

### 5. Post-Login Landing Page Behavior
- Redirect users to the landing page after successful sign-in.
- Continue displaying the leaderboard.
- Display the control panel only when the user is authenticated.

---

### 6. Control Panel (Authenticated Users Only)
- Render a sidebar control panel on the left side of the landing page.
- Provide toggleable filters for leaderboard data.
- Provide sorting controls for leaderboard display.
- Dynamically update the leaderboard based on selected controls.

---

### 7. Data Ingestion (Planned)
- Ingest attendance data from Google Sheets / Google Forms.
- Use a Python script to:
  - Authenticate with the Google API
  - Fetch attendance data
  - Serialize data as JSON
- Deliver JSON data to the frontend for rendering.

---

### 8. Database Integration (Future)
- Store selected attendance data in a SQL database.
- Use the database to:
  - Cache Google Sheets data
  - Perform pre-calculations
  - Optimize query performance
- Connect the database through the Python backend.

---

### 9. Incremental and Educational Design
- Implement features incrementally.
- Maintain modular components that can be isolated or removed.
- Use the project as a teaching tool for real-world software development workflows.


### Rules
- Read the rules before every action you take and follow them STRICTLY
- Only use typescript, react, and css. 
- Do not use tailwind css. If you think that tailwind is needed ask for persmission first. If I say no, do not use it
- Implement these features incrementally
- Do not create new files without first asking for permission from me. If I say no, do not create the new file
- Do not use inline css
- All css must be written in a separate file