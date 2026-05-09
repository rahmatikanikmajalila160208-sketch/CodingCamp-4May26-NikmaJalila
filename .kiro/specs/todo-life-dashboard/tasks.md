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

- [x] 11. Implement Light / Dark Mode
  - [x] 11.1 Add `THEME`, `NAME`, and `TIMER_DURATION` keys to `Storage.KEYS` in `js/app.js`
    - Extend the existing `KEYS` object with `THEME: 'tld_theme'`, `NAME: 'tld_name'`, and `TIMER_DURATION: 'tld_timer_duration'`
    - _Requirements: 11.4, 11.5, 12.5, 13.3_

  - [x] 11.2 Implement `ThemeManager` module in `js/app.js`
    - Add `ThemeManager` object inside the IIFE with `STORAGE_KEY = 'tld_theme'`
    - Add `init()`: reads `tld_theme` from localStorage (falls back to `'light'`), calls `_apply()`
    - Add `toggle()`: flips the active theme, saves to localStorage, calls `_apply()`
    - Add `_apply(theme)`: sets `data-theme="dark"` on `document.documentElement` when theme is `'dark'`, removes the attribute for `'light'`; updates `#theme-toggle` button label to `"🌙 Dark"` (light active) or `"☀️ Light"` (dark active)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

  - [x] 11.3 Add `<header class="app-header">` with `<button id="theme-toggle">` to `index.html` above `<main>`
    - Insert `<header class="app-header"><button id="theme-toggle" aria-label="Toggle dark mode">🌙 Dark</button></header>` immediately before the `<main class="dashboard-grid">` element
    - _Requirements: 11.1_

  - [x] 11.4 Add CSS custom property variables for light and dark themes in `css/style.css`
    - Declare `--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-border`, and `--color-accent` (and any other colour tokens needed) on `:root` for the light theme
    - Add a `[data-theme="dark"]` block that overrides those same properties with dark-theme values
    - Update all existing hard-coded colour references in `css/style.css` to use the corresponding `var(--color-*)` tokens so they respond to the theme switch automatically
    - _Requirements: 11.2, 11.3, 11.7_

  - [x] 11.5 Add `.app-header` styles in `css/style.css`
    - Style the header with `display: flex`, appropriate padding, and positioning so `#theme-toggle` is visually accessible (e.g., aligned to the right)
    - _Requirements: 11.1_

  - [x] 11.6 Call `ThemeManager.init()` as the first call inside `App.init()` in `js/app.js`
    - Insert `ThemeManager.init()` before `GreetingWidget.init()` so the correct theme is applied before any widget paints
    - _Requirements: 11.5_

  - [x] 11.7 Bind `ThemeManager.toggle` to the `#theme-toggle` button click event inside `ThemeManager.init()`
    - Add `document.getElementById('theme-toggle').addEventListener('click', () => ThemeManager.toggle())` inside `ThemeManager.init()`
    - _Requirements: 11.2, 11.3_

- [x] 12. Implement Custom Name in Greeting
  - [x] 12.1 Extend `GreetingWidget` in `js/app.js` with `name` state and `setName`/`clearName` methods
    - Add `name: null` property to `GreetingWidget`
    - Add `setName(name)`: trims the input; if non-empty, saves to `localStorage` under `tld_name` and calls `render()`; if empty or whitespace-only, calls `clearName()`
    - Add `clearName()`: removes `tld_name` from localStorage, sets `this.name = null`, calls `render()`
    - _Requirements: 12.1, 12.5, 12.6, 12.7_

  - [x] 12.2 Update `GreetingWidget.render()` in `js/app.js` to compose the personalised greeting
    - When `this.name` is set, compose greeting as `` `${base}, ${this.name}!` ``
    - When `this.name` is null or empty, compose greeting as `` `${base}!` ``
    - _Requirements: 12.2, 12.4_

  - [x] 12.3 Update `GreetingWidget.init()` in `js/app.js` to load the saved name before first render
    - Read `tld_name` from localStorage and assign to `this.name` before calling `render()` for the first time
    - _Requirements: 12.3_

  - [x] 12.4 Add name-edit controls to the greeting section in `index.html`
    - Add `<button id="greeting-edit-btn" aria-label="Edit name">✏️</button>` next to `#greeting-message`
    - Add `<div id="greeting-name-form" hidden>` containing `<input id="greeting-name-input" type="text" placeholder="Your name" maxlength="50" />`, `<button id="greeting-name-save">Save</button>`, and `<button id="greeting-name-clear">Clear</button>`
    - _Requirements: 12.1_

  - [x] 12.5 Bind name-edit events in `GreetingWidget.init()` in `js/app.js`
    - `#greeting-edit-btn` click: show `#greeting-name-form` and pre-fill `#greeting-name-input` with the current name (or empty string if none)
    - `#greeting-name-save` click: call `setName()` with the input value, hide `#greeting-name-form`
    - `#greeting-name-clear` click: call `clearName()`, hide `#greeting-name-form`
    - _Requirements: 12.1, 12.5, 12.6_

  - [x] 12.6 Add CSS styles for the name-edit controls in `css/style.css`
    - Style `#greeting-name-form` (hidden by default, flex layout when visible)
    - Style `#greeting-edit-btn` (small, unobtrusive, positioned inline with the greeting message)
    - Style `#greeting-name-input` and the save/clear buttons for consistent appearance with the rest of the dashboard
    - _Requirements: 12.1_

- [x] 13. Implement Custom Pomodoro Duration
  - [x] 13.1 Extend `FocusTimer` in `js/app.js` with `customDuration` state and duration methods
    - Add `customDuration` property and `STORAGE_KEY_DURATION = 'tld_timer_duration'`
    - Add `setDuration(minutes)`: parses input as integer; if outside [1, 60] or NaN, sets `#timer-duration-error` text to `'Please enter a whole number between 1 and 60.'` and returns; otherwise clears the error, updates `DURATION_SECONDS = n * 60`, saves to localStorage under `tld_timer_duration`, and calls `reset()`
    - Add `_updateDurationControls()`: disables `#timer-duration-input` and `#timer-duration-set` when `state` is `'running'` or `'paused'`; enables them when `state` is `'idle'` or `'done'`
    - _Requirements: 13.1, 13.2, 13.3, 13.6, 13.7, 13.8_

  - [x] 13.2 Update `FocusTimer.init()` in `js/app.js` to load the saved duration
    - Read `tld_timer_duration` from localStorage; fall back to `25` if absent or invalid
    - Set `DURATION_SECONDS` and `remaining` accordingly before calling `render()`
    - Call `_updateDurationControls()` at the end of `init()`
    - _Requirements: 13.4, 13.5_

  - [x] 13.3 Update `FocusTimer.start()`, `stop()`, `reset()`, and `onComplete()` in `js/app.js` to call `_updateDurationControls()`
    - Add `this._updateDurationControls()` (or `FocusTimer._updateDurationControls()`) as the last statement in each of the four methods
    - _Requirements: 13.7, 13.8_

  - [x] 13.4 Add the duration-setting row to the timer section in `index.html`
    - Inside `<section id="timer">`, after the existing `.timer-controls` div, add:
      ```html
      <div class="timer-duration-row">
        <label for="timer-duration-input">Duration (min):</label>
        <input id="timer-duration-input" type="number" min="1" max="60" value="25" />
        <button id="timer-duration-set">Set</button>
      </div>
      <p id="timer-duration-error" class="error-message" aria-live="polite"></p>
      ```
    - _Requirements: 13.1_

  - [x] 13.5 Bind duration-set events in `FocusTimer.init()` in `js/app.js`
    - `#timer-duration-set` click: call `setDuration()` with the value of `#timer-duration-input`
    - `#timer-duration-input` keydown `Enter`: call `setDuration()` with the current input value
    - _Requirements: 13.1, 13.2_

  - [x] 13.6 Add CSS styles for the duration controls in `css/style.css`
    - Style `.timer-duration-row` with flex layout and appropriate spacing
    - Style `#timer-duration-input` for consistent appearance with other inputs
    - Style `#timer-duration-error` with an error colour (e.g., red) using a `var(--color-error)` token or direct value
    - Add disabled-state styles for `#timer-duration-input:disabled` and `#timer-duration-set:disabled` (reduced opacity or muted colour) to visually indicate the controls are inactive while the timer is running or paused
    - _Requirements: 13.6, 13.7, 13.8_
