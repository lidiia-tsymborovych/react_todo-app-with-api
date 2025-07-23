# React Todo App with API

This is a multi-stage Todo application built with React and TypeScript, designed to interact with a backend API to manage todos in real-time. The project is split into three parts, each adding incremental features and improving the user experience.

---

## Project Overview

The app allows users to:

- Load todos from the API based on a user ID  
- Add new todos and delete existing ones  
- Toggle todo completion status and rename todos  

It emphasizes simplicity, responsiveness, and robust error handling to ensure smooth user interactions.

---

## Features by Part

### Part 1: Load Todos

- Fetch todos from API using user ID (which you register via email)
- Display todos with status filtering (All / Active / Completed)
- Show error notifications on API failures, auto-hide after 3 seconds
- Disable or hide UI elements when no todos exist
- Focus input fields automatically for faster typing
- Show loading spinners for ongoing API actions

### Part 2: Add and Delete Todos

- Add todos with trimmed titles via form submit
- Disable input and show loading indicator while saving new todos
- Handle API errors with notifications and input state management
- Delete single todos with loading overlays until confirmed by API
- Bulk delete all completed todos with parallel API calls
- Enable/disable clear button depending on completed todos count

### Part 3: Toggle and Rename Todos

- Toggle individual todo completion status with loading states
- Toggle all todos at once via a master toggle checkbox
- Rename todos inline on double-click, with editing cancel/save behaviors
- Delete todos by clearing title during rename or via delete button
- Show notifications on update or deletion errors
- Avoid unnecessary API calls for unchanged todos

---

## Technologies Used

- **React** — UI library for building interactive components  
- **TypeScript** — typed JavaScript for safer and more maintainable code  
- **React Hooks** — for state management and lifecycle  
- **fetch API / custom fetchClient** — for server communication  
- **Prettier** — code formatter to maintain consistent style  
- **Cypress** — end-to-end testing framework (tests provided)  

---

## Getting Started

1. **Clone the repository:**
   git clone <your_repository_address>
   cd react-todo-app
2. Install dependencies:
   npm install
   Register your user:

3. Register your email to get a userId (follow the API instructions)

4.Update api/todos.ts with your userId to load your todos

5. Run the app:
   npm start

#Try it live

Demo: [(https://lidiia-tsymborovych.github.io/react_todo-app-with-api/)]

