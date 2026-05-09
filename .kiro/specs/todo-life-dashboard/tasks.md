# Implementation Plan: Todo List Life Dashboard

## Overview

Build a single-page productivity dashboard as three plain files — `index.html`, `css/style.css`, and `js/app.js` — using the module-revealing pattern. Each step wires directly into the previous one so there is no orphaned code at any point.

## Tasks

- [x] 1. Scaffold the three project files with skeleton structure
  - Create `index.html` with a minimal valid HTML5 document: `<!DOCTYPE html>`, `<head>` (charset, viewport, title, stylesheet link), and an empty `<main class="dashboard-grid">` body
  - Create `css/style.css` as an empty file with a top comment block
  - Create `js/app.js` as an IIFE shell: `(function () { 'use strict'; /* modules go here */ })();`
  - _Requirements: 9.1, 9.2_

- [x] 2. Implement the Storage module in `js/app.js`
  - [x] 2.1 Add the `Storage` object inside the IIFE with `KEYS` constants (`tld_tasks`, `tld_links`), a `get(key)` method that returns `JSON.parse(localStorage.getItem(key)) ?? []`, and a `set(key, value)` method that wraps `localStorage.setItem` in a try/catch and logs a console warning on `QuotaExceededError`
    - _Requirements: 6.1, 6.2, 6.3, 7.3, 7.4, 8.6, 9.3_

- [x] 3. Implement the GreetingWidget module in `js/app.js`
  - [x] 3.1 Add `formatTime(date)` — returns a zero-padded `HH:MM` string derived from `date.getHours()` and `date.getMinutes()`
    - _Requirements: 1.1_
  - [x] 3.2 Add `formatDate(date)` — returns a human-readable string such as `"Monday, 14 July 2025"` using `toLocaleDateString` or manual weekday/month arrays
    - _Requirements: 1.2_
  - [x] 3.3 Add `getGreeting(hour)` — returns `"Good Morning"` for hours 5–11, `"Good Afternoon"` for 12–17, `"Good Evening"` for 18–21, and `"Good Night"` for all other hours (22–4)
    - _Requirements: 1.3, 1.4, 1.5, 1.6_
  - [x] 3.4 Add `render()` — writes the results of `formatTime`, `formatDate`, and `getGreeting` to their respective DOM elements (ids: `#greeting-time`, `#greeting-date`, `#greeting-message`)
    - _Requirements: 1.1, 1.2, 1.3_
  - [x] 3.5 Add `tick()` — calls `render()` with `new Date()` so the display refreshes each minute
    - _Requirements: 1.1_
  - [x] 3.6 Add `init()` — calls `render()` once immediately, then starts `setInterval(tick, 60000)`
    - _Requirements: 1.1_

- [x] 4. Implement the FocusTimer module in `js/app.js`
  - [x] 4.1 Add `formatSeconds(s)` — converts an integer number of seconds to a zero-padded `MM:SS` string
    - _Requirements: 2.7_
  - [x] 4.2 Add module-level state: `DURATION_SECONDS = 1500`, `remaining`, `intervalId`, `state` (`'idle' | 'running' | 'paused' | 'done'`)
    - _Requirements: 2.1_
  - [x] 4.3 Add `render()` — updates the `#timer-display` element with `formatSeconds(remaining)` and toggles the `.timer--done` CSS class when `state === 'done'`
    - _Requirements: 2.3, 2.6, 2.7_
  - [x] 4.4 Add `tick()` — decrements `remaining` by 1, calls `render()`, and calls `onComplete()` when `remaining` reaches 0
    - _Requirements: 2.3, 2.6_
  - [x] 4.5 Add `onComplete()` — clears the interval, sets `state = 'done'`, calls `render()`
    - _Requirements: 2.6_
  - [x] 4.6 Add `start()` — guards against double-start (`state !== 'running'`), sets `state = 'running'`, starts `setInterval(tick, 1000)`
    - _Requirements: 2.2_
  - [x] 4.7 Add `stop()` — clears the interval, sets `state = 'paused'`
    - _Requirements: 2.4_
  - [x] 4.8 Add `reset()` — clears the interval, restores `remaining = DURATION_SECONDS`, sets `state = 'idle'`, calls `render()`
    - _Requirements: 2.5_
  - [x] 4.9 Add `init()` — calls `render()` to show `25:00`, then binds click handlers on `#timer-start`, `#timer-stop`, and `#timer-reset` buttons
    - _Requirements: 2.1, 2.2, 2.4, 2.5_

- [x] 5. Implement the TodoList module in `js/app.js`
  - [x] 5.1 Add `load()` — reads `Storage.get(Storage.KEYS.TASKS)` into `this.tasks`
    - _Requirements: 6.2, 6.3_
  - [x] 5.2 Add `save()` — writes `this.tasks` to `Storage.set(Storage.KEYS.TASKS, this.tasks)`
    - _Requirements: 6.1_
  - [x] 5.3 Add `renderTask(task)` — returns a `<li>` DOM element containing: a checkbox (checked when `task.completed`), a `<span>` with the description (strikethrough class when completed), an edit button, and a delete button; wire the checkbox to `toggleTask`, the edit button to inline-edit mode, and the delete button to `deleteTask`
    - _Requirements: 4.1, 4.2, 5.1, 5.2, 5.3, 5.4_
  - [x] 5.4 Add `render()` — clears `#todo-list` and appends a `renderTask` element for each task in `this.tasks`
    - _Requirements: 3.2, 6.2_
  - [x] 5.5 Add `addTask(description)` — trims the input; if empty/whitespace-only, returns without adding; otherwise creates a `Task` object (`id`, `description`, `completed: false`, `createdAt`), pushes it to `this.tasks`, calls `save()` and `render()`
    - _Requirements: 3.2, 3.4_
  - [x] 5.6 Add `editTask(id, newDescription)` — trims `newDescription`; if whitespace-only, discards the change; otherwise finds the task by `id`, updates its `description`, calls `save()` and `render()`
    - _Requirements: 4.3, 4.4_
  - [x] 5.7 Add `toggleTask(id)` — finds the task by `id`, flips its `completed` flag, calls `save()` and `render()`
    - _Requirements: 5.2, 5.3_
  - [x] 5.8 Add `deleteTask(id)` — filters `this.tasks` to remove the task with the matching `id`, calls `save()` and `render()`
    - _Requirements: 5.5_
  - [x] 5.9 Add `init()` — calls `load()` and `render()`, then binds the `#todo-form` submit event: prevents default, reads `#todo-input` value, calls `addTask`, clears the input on success, and retains focus on the input when the description is invalid
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 6. Implement the QuickLinks module in `js/app.js`
  - [x] 6.1 Add `load()` — reads `Storage.get(Storage.KEYS.LINKS)` into `this.links`
    - _Requirements: 7.3, 7.4_
  - [x] 6.2 Add `save()` — writes `this.links` to `Storage.set(Storage.KEYS.LINKS, this.links)`
    - _Requirements: 8.6_
  - [x] 6.3 Add `validateForm(label, url)` — returns `{ valid: boolean, errors: string[] }`; adds an error entry for an empty label and a separate entry for an empty URL
    - _Requirements: 8.3_
  - [x] 6.4 Add `renderLink(link)` — returns a container element with a `<a>` or `<button>` that opens `link.url` in a new tab (`window.open` or `target="_blank"`) labelled with `link.label`, plus a delete button wired to `deleteLink`
    - _Requirements: 7.1, 7.2, 8.4_
  - [x] 6.5 Add `render()` — clears `#links-panel` and appends a `renderLink` element for each link in `this.links`
    - _Requirements: 7.1, 7.3_
  - [x] 6.6 Add `addLink(label, url)` — calls `validateForm`; if invalid, displays the error messages in `#links-error`; otherwise creates a `Link` object (`id`, `label`, `url`), pushes it to `this.links`, calls `save()` and `render()`, and clears the form inputs
    - _Requirements: 8.2, 8.3_
  - [x] 6.7 Add `deleteLink(id)` — filters `this.links` to remove the link with the matching `id`, calls `save()` and `render()`
    - _Requirements: 8.5_
  - [x] 6.8 Add `init()` — calls `load()` and `render()`, then binds the `#links-form` submit event: prevents default, reads label and URL inputs, calls `addLink`
    - _Requirements: 8.1, 8.2, 8.3_

- [x] 7. Build the full HTML structure in `index.html`
  - Replace the skeleton `<main>` with the complete four-widget layout:
    - `<section id="greeting" class="widget widget--greeting">` containing `<p id="greeting-time">`, `<p id="greeting-date">`, and `<p id="greeting-message">`
    - `<section id="timer" class="widget widget--timer">` containing `<div id="timer-display">`, and buttons `#timer-start`, `#timer-stop`, `#timer-reset`
    - `<section id="links" class="widget widget--links">` containing `<div id="links-panel">`, `<form id="links-form">` with label input, URL input, submit button, and `<p id="links-error">`
    - `<section id="todos" class="widget widget--todos">` containing `<ul id="todo-list">` and `<form id="todo-form">` with `<input id="todo-input">` and a submit button
  - Add the `<script src="js/app.js">` tag before `</body>`
  - _Requirements: 3.1, 4.1, 5.1, 5.4, 7.1, 8.1, 9.2, 10.3_

- [x] 8. Implement all visual styles in `css/style.css`
  - [x] 8.1 Add CSS custom properties (variables) for colour palette, spacing scale, border-radius, and box-shadow values
    - _Requirements: 10.3, 10.4_
  - [x] 8.2 Add base/reset styles: `box-sizing: border-box`, body font-family, minimum `font-size: 14px`, background colour, and margin reset
    - _Requirements: 10.4_
  - [x] 8.3 Add `.dashboard-grid` layout: CSS Grid with two equal columns on wide viewports (`min-width: 600px`) collapsing to a single column below that breakpoint; the greeting widget spans both columns (`grid-column: 1 / -1`) and the todos widget spans both columns
    - _Requirements: 10.3_
  - [x] 8.4 Add `.widget` card styles: background, border-radius, padding, and box-shadow to visually separate each widget
    - _Requirements: 10.3_
  - [x] 8.5 Add typography styles: heading sizes for widget titles, large monospace font for `#timer-display`, and `.task--completed` strikethrough style for completed tasks
    - _Requirements: 5.2, 5.3, 10.4_
  - [x] 8.6 Add `.timer--done` state styles: a visual indication (e.g., colour change or pulsing animation via `@keyframes`) applied when the timer reaches zero
    - _Requirements: 2.6_
  - [x] 8.7 Add button and form input styles: consistent padding, border, and focus ring for all interactive controls
    - _Requirements: 10.2, 10.4_
  - [x] 8.8 Add link panel styles: flex-wrap layout for `#links-panel` so link buttons wrap naturally; error message colour for `#links-error`
    - _Requirements: 7.1, 8.3_

- [x] 9. Wire up App bootstrap in `js/app.js`
  - Add an `App` object with an `init()` method that calls `GreetingWidget.init()`, `FocusTimer.init()`, `TodoList.init()`, and `QuickLinks.init()` in sequence
  - Register `App.init` on `DOMContentLoaded`: `document.addEventListener('DOMContentLoaded', App.init)`
  - This is the final wiring step — all modules are now connected to the DOM and to each other through `Storage`
  - _Requirements: 9.1, 9.4, 10.1_

- [x] 10. Final checkpoint
  - Open `index.html` directly in a browser (no server required) and verify all four widgets are visible and functional
  - Confirm tasks persist across page reloads, links persist across page reloads, the timer counts down and shows the done state at 00:00, and the greeting updates to reflect the current time of day
  - Ask the user if any adjustments are needed before considering the feature complete

## Notes

- All code lives in exactly three files: `index.html`, `css/style.css`, `js/app.js`
- No build tools, package managers, or external libraries are used
- Tasks are ordered so each step can be verified in the browser immediately after completion
- The `Storage` module (Task 2) must be implemented before any widget that persists data (Tasks 5, 6)
- The HTML structure (Task 7) must exist before `init()` calls can bind to DOM elements, but skeleton IDs can be added incrementally as each module is implemented
