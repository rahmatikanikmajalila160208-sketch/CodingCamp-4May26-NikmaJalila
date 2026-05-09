# Requirements Document

## Introduction

The Todo List Life Dashboard is a client-side web application that serves as a personal productivity hub. It combines a contextual greeting with the current time and date, a Pomodoro-style focus timer, a persistent to-do list, and a quick-access links panel — all in a single, minimal HTML/CSS/Vanilla JavaScript page. All data is stored in the browser's Local Storage; no backend server is required. The application must run as a standalone web page or as a browser extension in modern browsers (Chrome, Firefox, Edge, Safari).

## Glossary

- **Dashboard**: The single-page web application described in this document.
- **Greeting_Widget**: The UI component that displays the current time, date, and a time-of-day greeting message.
- **Focus_Timer**: The UI component that implements a 25-minute countdown timer with start, stop, and reset controls.
- **Todo_List**: The UI component that manages a collection of task items.
- **Task**: A single to-do item that has a text description, a completion state, and a unique identifier.
- **Quick_Links**: The UI component that displays a set of user-defined shortcut buttons that open URLs in the browser.
- **Link**: A single quick-link entry consisting of a label and a URL.
- **Local_Storage**: The browser's `localStorage` API used for all client-side data persistence.
- **Modern_Browser**: Chrome, Firefox, Edge, or Safari at their current stable release at time of deployment.

---

## Requirements

### Requirement 1: Greeting Widget

**User Story:** As a user, I want to see the current time, date, and a greeting that reflects the time of day, so that the Dashboard feels personal and contextually relevant when I open it.

#### Acceptance Criteria

1. THE Greeting_Widget SHALL display the current time in HH:MM format, updated every minute.
2. THE Greeting_Widget SHALL display the current date in a human-readable format (e.g., "Monday, 14 July 2025").
3. WHEN the local hour is between 05:00 and 11:59, THE Greeting_Widget SHALL display the greeting "Good Morning".
4. WHEN the local hour is between 12:00 and 17:59, THE Greeting_Widget SHALL display the greeting "Good Afternoon".
5. WHEN the local hour is between 18:00 and 21:59, THE Greeting_Widget SHALL display the greeting "Good Evening".
6. WHEN the local hour is between 22:00 and 04:59, THE Greeting_Widget SHALL display the greeting "Good Night".

---

### Requirement 2: Focus Timer

**User Story:** As a user, I want a 25-minute countdown timer with start, stop, and reset controls, so that I can use the Pomodoro technique to manage focused work sessions.

#### Acceptance Criteria

1. THE Focus_Timer SHALL initialise with a countdown value of 25 minutes and 00 seconds (25:00).
2. WHEN the user activates the start control, THE Focus_Timer SHALL begin counting down in one-second intervals.
3. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL update the displayed time every second.
4. WHEN the user activates the stop control, THE Focus_Timer SHALL pause the countdown and retain the current remaining time.
5. WHEN the user activates the reset control, THE Focus_Timer SHALL stop any active countdown and restore the displayed time to 25:00.
6. WHEN the countdown reaches 00:00, THE Focus_Timer SHALL stop automatically and display a visual indication that the session has ended.
7. THE Focus_Timer SHALL display the remaining time in MM:SS format at all times.

---

### Requirement 3: To-Do List — Add Tasks

**User Story:** As a user, I want to add new tasks to my to-do list, so that I can track the work I need to complete.

#### Acceptance Criteria

1. THE Todo_List SHALL provide a text input field and a submit control for entering new tasks.
2. WHEN the user submits a non-empty task description, THE Todo_List SHALL add a new Task to the list and display it immediately.
3. WHEN the user submits a non-empty task description, THE Todo_List SHALL clear the text input field after the Task is added.
4. IF the user submits an empty or whitespace-only task description, THEN THE Todo_List SHALL not add a Task and SHALL retain focus on the input field.

---

### Requirement 4: To-Do List — Edit Tasks

**User Story:** As a user, I want to edit the text of an existing task, so that I can correct or update task descriptions without deleting and re-adding them.

#### Acceptance Criteria

1. THE Todo_List SHALL provide an edit control for each Task.
2. WHEN the user activates the edit control for a Task, THE Todo_List SHALL replace the Task's display text with an editable text input pre-filled with the current task description.
3. WHEN the user confirms the edit, THE Todo_List SHALL update the Task's description to the new non-empty value and restore the display view.
4. IF the user confirms an edit with an empty or whitespace-only value, THEN THE Todo_List SHALL discard the change and restore the original task description.

---

### Requirement 5: To-Do List — Complete and Delete Tasks

**User Story:** As a user, I want to mark tasks as done and delete tasks I no longer need, so that I can track progress and keep my list tidy.

#### Acceptance Criteria

1. THE Todo_List SHALL provide a completion toggle control for each Task.
2. WHEN the user activates the completion toggle for an incomplete Task, THE Todo_List SHALL mark the Task as complete and apply a visual distinction (e.g., strikethrough text).
3. WHEN the user activates the completion toggle for a complete Task, THE Todo_List SHALL mark the Task as incomplete and remove the visual distinction.
4. THE Todo_List SHALL provide a delete control for each Task.
5. WHEN the user activates the delete control for a Task, THE Todo_List SHALL remove the Task from the list immediately.

---

### Requirement 6: To-Do List — Persistence

**User Story:** As a user, I want my tasks to be saved automatically, so that my to-do list is restored when I reopen the Dashboard.

#### Acceptance Criteria

1. WHEN a Task is added, edited, completed, or deleted, THE Todo_List SHALL write the updated task collection to Local_Storage.
2. WHEN the Dashboard loads, THE Todo_List SHALL read the task collection from Local_Storage and render all previously saved Tasks.
3. IF no task data exists in Local_Storage, THEN THE Todo_List SHALL render an empty list without error.

---

### Requirement 7: Quick Links — Display and Navigation

**User Story:** As a user, I want to see my saved favourite websites as clickable buttons, so that I can navigate to them quickly from the Dashboard.

#### Acceptance Criteria

1. THE Quick_Links SHALL display each saved Link as a labelled button.
2. WHEN the user activates a Link button, THE Quick_Links SHALL open the associated URL in a new browser tab.
3. WHEN the Dashboard loads, THE Quick_Links SHALL read the link collection from Local_Storage and render all previously saved Links.
4. IF no link data exists in Local_Storage, THEN THE Quick_Links SHALL render an empty panel without error.

---

### Requirement 8: Quick Links — Add and Delete Links

**User Story:** As a user, I want to add and remove quick-link entries, so that I can customise my shortcut panel to reflect my current favourite websites.

#### Acceptance Criteria

1. THE Quick_Links SHALL provide input fields for a link label and a URL, and a submit control for adding a new Link.
2. WHEN the user submits a non-empty label and a non-empty URL, THE Quick_Links SHALL add the new Link to the panel and display it immediately.
3. IF the user submits with an empty label or an empty URL, THEN THE Quick_Links SHALL not add the Link and SHALL display an inline validation message indicating which field is missing.
4. THE Quick_Links SHALL provide a delete control for each Link.
5. WHEN the user activates the delete control for a Link, THE Quick_Links SHALL remove the Link from the panel immediately.
6. WHEN a Link is added or deleted, THE Quick_Links SHALL write the updated link collection to Local_Storage.

---

### Requirement 9: Technical Constraints

**User Story:** As a developer, I want the Dashboard to be built with plain HTML, CSS, and Vanilla JavaScript with no backend, so that it is simple to deploy and maintain.

#### Acceptance Criteria

1. THE Dashboard SHALL be implemented using HTML, CSS, and Vanilla JavaScript with no third-party frameworks or libraries.
2. THE Dashboard SHALL contain exactly one CSS file located at `css/` and exactly one JavaScript file located at `js/`.
3. THE Dashboard SHALL operate without a backend server; all data persistence SHALL use Local_Storage exclusively.
4. THE Dashboard SHALL render and function correctly in Modern_Browser environments without requiring installation of additional software.

---

### Requirement 10: Performance and Visual Design

**User Story:** As a user, I want the Dashboard to load quickly and present a clean, readable interface, so that it does not slow me down or distract me during use.

#### Acceptance Criteria

1. THE Dashboard SHALL display its initial view within 2 seconds on a standard desktop connection.
2. WHEN the user interacts with any control (add, edit, delete, timer buttons, link buttons), THE Dashboard SHALL reflect the result of that interaction within 100 milliseconds.
3. THE Dashboard SHALL apply a clear visual hierarchy that distinguishes each widget (Greeting_Widget, Focus_Timer, Todo_List, Quick_Links) from the others.
4. THE Dashboard SHALL use typography with a minimum body font size of 14px to ensure readability.

---

### Requirement 11: Light / Dark Mode

**User Story:** As a user, I want to toggle between a light and dark visual theme, so that I can use the Dashboard comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Dashboard SHALL provide a visible theme-toggle control that is accessible at all times on the Dashboard.
2. WHEN the user activates the theme-toggle control while the light theme is active, THE Dashboard SHALL switch the entire page to the dark theme immediately.
3. WHEN the user activates the theme-toggle control while the dark theme is active, THE Dashboard SHALL switch the entire page to the light theme immediately.
4. WHEN the user activates the theme-toggle control, THE Dashboard SHALL write the selected theme value to Local_Storage.
5. WHEN the Dashboard loads, THE Dashboard SHALL read the saved theme value from Local_Storage and apply it before rendering any widget content.
6. IF no theme value exists in Local_Storage, THEN THE Dashboard SHALL apply the light theme as the default.
7. THE Dashboard SHALL apply the active theme to all widgets simultaneously so that no widget retains the previous theme's styles.

---

### Requirement 12: Custom Name in Greeting

**User Story:** As a user, I want to set a custom name that appears in the greeting message, so that the Dashboard feels personally addressed to me.

#### Acceptance Criteria

1. THE Greeting_Widget SHALL provide a control that allows the user to enter or update a custom display name.
2. WHEN the user saves a non-empty name, THE Greeting_Widget SHALL display the greeting in the format "[Greeting], [Name]!" (e.g., "Good Morning, Alex!").
3. WHEN the Dashboard loads and a non-empty name is saved in Local_Storage, THE Greeting_Widget SHALL display the personalised greeting format immediately.
4. IF no name is saved in Local_Storage, THEN THE Greeting_Widget SHALL display the greeting without a name (e.g., "Good Morning!").
5. WHEN the user saves a non-empty name, THE Greeting_Widget SHALL write the name to Local_Storage.
6. WHEN the user clears the saved name, THE Greeting_Widget SHALL remove the name from Local_Storage and revert the greeting to the format without a name.
7. IF the user attempts to save a whitespace-only string as a name, THEN THE Greeting_Widget SHALL treat it as an empty name and apply the no-name greeting format.

---

### Requirement 13: Custom Pomodoro Duration

**User Story:** As a user, I want to change the Focus Timer duration from the default 25 minutes to a custom value, so that I can adapt the timer to my preferred work-session length.

#### Acceptance Criteria

1. THE Focus_Timer SHALL provide a control that allows the user to enter a custom duration in whole minutes.
2. WHEN the user submits a valid custom duration, THE Focus_Timer SHALL reset the countdown to the new duration immediately and display the new value in MM:SS format.
3. WHEN the user submits a valid custom duration, THE Focus_Timer SHALL write the new duration value to Local_Storage.
4. WHEN the Dashboard loads, THE Focus_Timer SHALL read the saved duration value from Local_Storage and use it as the initial countdown value.
5. IF no duration value exists in Local_Storage, THEN THE Focus_Timer SHALL use 25 minutes as the default duration.
6. IF the user submits a duration outside the range of 1 to 60 minutes, THEN THE Focus_Timer SHALL not apply the change and SHALL display an inline validation message indicating the valid range.
7. WHILE the Focus_Timer state is running or paused, THE Focus_Timer SHALL not allow the duration to be changed and SHALL disable or hide the duration-change control.
8. WHEN the Focus_Timer state is idle or done, THE Focus_Timer SHALL enable the duration-change control so the user can set a new duration.
