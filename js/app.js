(function () {
  'use strict';

  // ── Storage ──────────────────────────────────────────────────────────────
  const Storage = {
    KEYS: {
      TASKS:          'tld_tasks',
      LINKS:          'tld_links',
      THEME:          'tld_theme',
      NAME:           'tld_name',
      TIMER_DURATION: 'tld_timer_duration',
    },

    /**
     * Retrieve a value from localStorage, deserialising from JSON.
     * Returns an empty array if the key is absent or the value is null.
     * @param {string} key
     * @returns {Array}
     */
    get(key) {
      return JSON.parse(localStorage.getItem(key)) ?? [];
    },

    /**
     * Persist a value to localStorage, serialising to JSON.
     * Logs a console warning if the storage quota is exceeded.
     * @param {string} key
     * @param {*} value
     */
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (err) {
        if (err.name === 'QuotaExceededError') {
          console.warn('Storage quota exceeded — data could not be saved.', err);
        }
      }
    },
  };

  // ── ThemeManager ─────────────────────────────────────────────────────────
  const ThemeManager = {
    /** localStorage key for the saved theme value. */
    STORAGE_KEY: 'tld_theme',

    /**
     * Reads the saved theme from localStorage (falls back to 'light'),
     * applies it to the document, and binds the toggle button.
     * Requirements: 11.1, 11.5, 11.6
     */
    init() {
      const saved = localStorage.getItem(this.STORAGE_KEY) || 'light';
      this._apply(saved);
      // 11.7 — bind toggle button
      const btn = document.getElementById('theme-toggle');
      if (btn) {
        btn.addEventListener('click', () => ThemeManager.toggle());
      }
    },

    /**
     * Flips the active theme, persists the new value, and re-applies.
     * Requirements: 11.2, 11.3, 11.4
     */
    toggle() {
      const current = document.documentElement.getAttribute('data-theme') === 'dark'
        ? 'dark'
        : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem(this.STORAGE_KEY, next);
      this._apply(next);
    },

    /**
     * Sets or removes the data-theme="dark" attribute on <html> and updates
     * the #theme-toggle button label.
     * Requirements: 11.2, 11.3, 11.7
     * @param {'light' | 'dark'} theme
     */
    _apply(theme) {
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      const btn = document.getElementById('theme-toggle');
      if (btn) {
        btn.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
      }
    },
  };

  // ── GreetingWidget ───────────────────────────────────────────────────────
  const GreetingWidget = {
    /**
     * The user's custom display name, or null if none is set.
     * Loaded from localStorage on init().
     * Requirements: 12.1, 12.3
     * @type {string | null}
     */
    name: null,

    /**
     * Returns a zero-padded HH:MM string for the given Date.
     * @param {Date} date
     * @returns {string}
     */
    formatTime(date) {
      const hh = String(date.getHours()).padStart(2, '0');
      const mm = String(date.getMinutes()).padStart(2, '0');
      return `${hh}:${mm}`;
    },

    /**
     * Returns a human-readable date string, e.g. "Monday, 14 July 2025".
     * @param {Date} date
     * @returns {string}
     */
    formatDate(date) {
      const WEEKDAYS = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday',
      ];
      const MONTHS = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
      ];
      const weekday = WEEKDAYS[date.getDay()];
      const day     = date.getDate();
      const month   = MONTHS[date.getMonth()];
      const year    = date.getFullYear();
      return `${weekday}, ${day} ${month} ${year}`;
    },

    /**
     * Returns the appropriate greeting for the given hour (0–23).
     *   05–11 → "Good Morning"
     *   12–17 → "Good Afternoon"
     *   18–21 → "Good Evening"
     *   22–04 → "Good Night"
     * @param {number} hour
     * @returns {string}
     */
    getGreeting(hour) {
      if (hour >= 5  && hour <= 11) return 'Good Morning';
      if (hour >= 12 && hour <= 17) return 'Good Afternoon';
      if (hour >= 18 && hour <= 21) return 'Good Evening';
      return 'Good Night';
    },

    /**
     * Saves a custom name. Trims the input; if non-empty, persists to
     * localStorage and re-renders. If empty/whitespace-only, delegates
     * to clearName().
     * Requirements: 12.1, 12.5, 12.7
     * @param {string} name
     */
    setName(name) {
      const trimmed = name.trim();
      if (!trimmed) {
        this.clearName();
        return;
      }
      this.name = trimmed;
      localStorage.setItem(Storage.KEYS.NAME, trimmed);
      this.render(new Date());
    },

    /**
     * Removes the saved name from localStorage, clears the in-memory name,
     * and re-renders the greeting without a name.
     * Requirements: 12.6
     */
    clearName() {
      this.name = null;
      localStorage.removeItem(Storage.KEYS.NAME);
      this.render(new Date());
    },

    /**
     * Writes the current time, date, and greeting to their DOM elements.
     * When a name is set, the greeting is personalised: "Good Morning, Alex!"
     * When no name is set, the greeting is plain: "Good Morning!"
     * Requirements: 12.2, 12.4
     * @param {Date} date
     */
    render(date) {
      document.getElementById('greeting-time').textContent = this.formatTime(date);
      document.getElementById('greeting-date').textContent = this.formatDate(date);
      const base = this.getGreeting(date.getHours());
      document.getElementById('greeting-message').textContent =
        this.name ? `${base}, ${this.name}!` : `${base}!`;
    },

    /**
     * Called by setInterval every 60 seconds to refresh the display.
     */
    tick() {
      this.render(new Date());
    },

    /**
     * Loads the saved name, renders immediately, schedules a 60-second
     * refresh, and binds the name-edit controls.
     * Requirements: 12.3
     */
    init() {
      // 12.3 — load saved name before first render
      const savedName = localStorage.getItem(Storage.KEYS.NAME);
      this.name = (savedName && savedName.trim()) ? savedName.trim() : null;

      this.render(new Date());
      setInterval(() => this.tick(), 60000);

      // 12.5 — bind name-edit controls
      const editBtn   = document.getElementById('greeting-edit-btn');
      const nameForm  = document.getElementById('greeting-name-form');
      const nameInput = document.getElementById('greeting-name-input');
      const saveBtn   = document.getElementById('greeting-name-save');
      const clearBtn  = document.getElementById('greeting-name-clear');

      if (editBtn && nameForm && nameInput && saveBtn && clearBtn) {
        // Show the form and pre-fill with the current name
        editBtn.addEventListener('click', () => {
          nameInput.value = this.name || '';
          nameForm.hidden = false;
          nameInput.focus();
        });

        // Save the entered name and hide the form
        saveBtn.addEventListener('click', () => {
          this.setName(nameInput.value);
          nameForm.hidden = true;
        });

        // Clear the saved name and hide the form
        clearBtn.addEventListener('click', () => {
          this.clearName();
          nameForm.hidden = true;
        });
      }
    },
  };

  // ── FocusTimer ───────────────────────────────────────────────────────────
  const FocusTimer = {
    /** Total session duration in seconds (default 25 minutes). Mutable. */
    DURATION_SECONDS: 1500,

    /** Current duration in whole minutes (mirrors DURATION_SECONDS / 60). */
    customDuration: 25,

    /** localStorage key for the saved timer duration. */
    STORAGE_KEY_DURATION: 'tld_timer_duration',

    /** Seconds remaining in the current session. */
    remaining: 1500,

    /** Handle returned by setInterval, or null when not running. */
    intervalId: null,

    /**
     * Current timer state.
     * @type {'idle' | 'running' | 'paused' | 'done'}
     */
    state: 'idle',

    /**
     * Converts an integer number of seconds to a zero-padded MM:SS string.
     * @param {number} s - Total seconds (0–1500)
     * @returns {string}
     */
    formatSeconds(s) {
      const mm = String(Math.floor(s / 60)).padStart(2, '0');
      const ss = String(s % 60).padStart(2, '0');
      return `${mm}:${ss}`;
    },

    /**
     * Updates the #timer-display element with the current remaining time
     * and toggles the .timer--done class based on state.
     */
    render() {
      const display = document.getElementById('timer-display');
      if (!display) return;
      display.textContent = this.formatSeconds(this.remaining);
      display.classList.toggle('timer--done', this.state === 'done');
    },

    /**
     * Called every second while the timer is running.
     * Decrements remaining, re-renders, and triggers onComplete at zero.
     */
    tick() {
      this.remaining -= 1;
      this.render();
      if (this.remaining <= 0) {
        this.onComplete();
      }
    },

    /**
     * Called when the countdown reaches zero.
     * Stops the interval and marks the timer as done.
     */
    onComplete() {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.state = 'done';
      this.render();
      this._updateDurationControls();
    },

    /**
     * Starts the countdown. Guards against double-start.
     */
    start() {
      if (this.state === 'running') return;
      this.state = 'running';
      this.intervalId = setInterval(() => this.tick(), 1000);
      this._updateDurationControls();
    },

    /**
     * Pauses the countdown, retaining the current remaining time.
     */
    stop() {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.state = 'paused';
      this._updateDurationControls();
    },

    /**
     * Stops any active countdown and restores the timer to its initial state.
     */
    reset() {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.remaining = this.DURATION_SECONDS;
      this.state = 'idle';
      this.render();
      this._updateDurationControls();
    },

    /**
     * Validates and applies a custom duration in minutes.
     * Accepts integers in [1, 60]. Shows an inline error for invalid input.
     * On success, updates DURATION_SECONDS, saves to localStorage, and resets.
     * Requirements: 13.1, 13.2, 13.3, 13.6
     * @param {string | number} minutes
     */
    setDuration(minutes) {
      const n = parseInt(minutes, 10);
      const errorEl = document.getElementById('timer-duration-error');
      if (isNaN(n) || n < 1 || n > 60) {
        if (errorEl) {
          errorEl.textContent = 'Please enter a whole number between 1 and 60.';
        }
        return;
      }
      if (errorEl) errorEl.textContent = '';
      this.DURATION_SECONDS = n * 60;
      this.customDuration = n;
      Storage.set(Storage.KEYS.TIMER_DURATION, n);
      this.reset();
    },

    /**
     * Enables or disables the duration input and set button based on the
     * current timer state. Disabled while running or paused.
     * Requirements: 13.7, 13.8
     */
    _updateDurationControls() {
      const input  = document.getElementById('timer-duration-input');
      const setBtn = document.getElementById('timer-duration-set');
      const disabled = this.state === 'running' || this.state === 'paused';
      if (input)  input.disabled  = disabled;
      if (setBtn) setBtn.disabled = disabled;
    },

    /**
     * Renders the initial display and binds button click handlers.
     * Loads saved duration from localStorage, falls back to 25 min.
     * Requirements: 13.4, 13.5
     */
    init() {
      // 13.2 — load saved duration before first render
      const saved = parseInt(localStorage.getItem(Storage.KEYS.TIMER_DURATION), 10);
      if (!isNaN(saved) && saved >= 1 && saved <= 60) {
        this.DURATION_SECONDS = saved * 60;
        this.customDuration   = saved;
        this.remaining        = this.DURATION_SECONDS;
      }

      this.render();

      document.getElementById('timer-start').addEventListener('click', () => this.start());
      document.getElementById('timer-stop').addEventListener('click',  () => this.stop());
      document.getElementById('timer-reset').addEventListener('click', () => this.reset());

      // 13.5 — bind duration-set controls
      const setBtn       = document.getElementById('timer-duration-set');
      const durationInput = document.getElementById('timer-duration-input');

      if (setBtn && durationInput) {
        // Pre-fill the input with the current duration
        durationInput.value = this.customDuration;

        setBtn.addEventListener('click', () => {
          this.setDuration(durationInput.value);
        });

        durationInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.setDuration(durationInput.value);
          }
        });
      }

      this._updateDurationControls();
    },
  };

  // ── TodoList ─────────────────────────────────────────────────────────────
  const TodoList = {
    /** @type {Array<{id: string, description: string, completed: boolean, createdAt: number}>} */
    tasks: [],

    /**
     * Loads the task collection from localStorage into this.tasks.
     * If no data exists, this.tasks is set to an empty array.
     * Requirements: 6.2, 6.3
     */
    load() {
      this.tasks = Storage.get(Storage.KEYS.TASKS);
    },

    /**
     * Persists the current task collection to localStorage.
     * Requirements: 6.1
     */
    save() {
      Storage.set(Storage.KEYS.TASKS, this.tasks);
    },

    /**
     * Builds and returns a <li> DOM element representing a single task.
     * Contains: checkbox, description span, edit button, delete button.
     * Requirements: 4.1, 4.2, 5.1, 5.2, 5.3, 5.4
     * @param {{id: string, description: string, completed: boolean, createdAt: number}} task
     * @returns {HTMLLIElement}
     */
    renderTask(task) {
      const li = document.createElement('li');
      li.className = 'todo-item';
      li.dataset.id = task.id;

      // Completion checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'todo-item__checkbox';
      checkbox.checked = task.completed;
      checkbox.setAttribute('aria-label', `Mark "${task.description}" as ${task.completed ? 'incomplete' : 'complete'}`);
      checkbox.addEventListener('change', () => this.toggleTask(task.id));

      // Description span
      const span = document.createElement('span');
      span.className = 'todo-item__description' + (task.completed ? ' task--completed' : '');
      span.textContent = task.description;

      // Edit button
      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'todo-item__btn todo-item__btn--edit';
      editBtn.textContent = 'Edit';
      editBtn.setAttribute('aria-label', `Edit task: ${task.description}`);
      editBtn.addEventListener('click', () => this._startInlineEdit(li, task));

      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'todo-item__btn todo-item__btn--delete';
      deleteBtn.textContent = 'Delete';
      deleteBtn.setAttribute('aria-label', `Delete task: ${task.description}`);
      deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);

      return li;
    },

    /**
     * Replaces a task's display view with an inline edit input.
     * Confirms on Enter or blur; discards on Escape.
     * @param {HTMLLIElement} li
     * @param {{id: string, description: string}} task
     */
    _startInlineEdit(li, task) {
      // Prevent opening a second edit input on the same item
      if (li.querySelector('.todo-item__edit-input')) return;

      const span    = li.querySelector('.todo-item__description');
      const editBtn = li.querySelector('.todo-item__btn--edit');

      span.style.display    = 'none';
      editBtn.style.display = 'none';

      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'todo-item__edit-input';
      input.value = task.description;
      input.setAttribute('aria-label', 'Edit task description');

      const confirm = () => {
        this.editTask(task.id, input.value);
      };

      const discard = () => {
        span.style.display    = '';
        editBtn.style.display = '';
        if (li.contains(input)) li.removeChild(input);
      };

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter')  { e.preventDefault(); confirm(); }
        if (e.key === 'Escape') { discard(); }
      });

      input.addEventListener('blur', () => {
        // Small timeout so Enter keydown fires before blur
        setTimeout(() => {
          if (li.contains(input)) confirm();
        }, 100);
      });

      li.insertBefore(input, editBtn.nextSibling);
      input.focus();
      input.select();
    },

    /**
     * Clears #todo-list and re-renders all tasks.
     * Requirements: 3.2, 6.2
     */
    render() {
      const list = document.getElementById('todo-list');
      if (!list) return;
      list.innerHTML = '';
      this.tasks.forEach((task) => list.appendChild(this.renderTask(task)));
    },

    /**
     * Adds a new task if the description is non-empty after trimming.
     * Silently returns (no-op) for whitespace-only input.
     * Requirements: 3.2, 3.4
     * @param {string} description
     * @returns {boolean} true if the task was added, false if rejected
     */
    addTask(description) {
      const trimmed = description.trim();
      if (!trimmed) return false;

      const task = {
        id: (typeof crypto !== 'undefined' && crypto.randomUUID)
          ? crypto.randomUUID()
          : String(Date.now()) + String(Math.random()),
        description: trimmed,
        completed: false,
        createdAt: Date.now(),
      };

      this.tasks.push(task);
      this.save();
      this.render();
      return true;
    },

    /**
     * Updates a task's description. Discards the change if newDescription
     * is whitespace-only after trimming.
     * Requirements: 4.3, 4.4
     * @param {string} id
     * @param {string} newDescription
     */
    editTask(id, newDescription) {
      const trimmed = newDescription.trim();
      const task = this.tasks.find((t) => t.id === id);
      if (!task) return;

      if (!trimmed) {
        // Discard — re-render to restore original display
        this.render();
        return;
      }

      task.description = trimmed;
      this.save();
      this.render();
    },

    /**
     * Flips the completed flag of the task with the given id.
     * Requirements: 5.2, 5.3
     * @param {string} id
     */
    toggleTask(id) {
      const task = this.tasks.find((t) => t.id === id);
      if (!task) return;
      task.completed = !task.completed;
      this.save();
      this.render();
    },

    /**
     * Removes the task with the given id from the collection.
     * Requirements: 5.5
     * @param {string} id
     */
    deleteTask(id) {
      this.tasks = this.tasks.filter((t) => t.id !== id);
      this.save();
      this.render();
    },

    /**
     * Loads tasks, renders the list, and binds the #todo-form submit handler.
     * Requirements: 3.1, 3.2, 3.3, 3.4
     */
    init() {
      this.load();
      this.render();

      const form  = document.getElementById('todo-form');
      const input = document.getElementById('todo-input');
      if (!form || !input) return;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const added = this.addTask(input.value);
        if (added) {
          input.value = '';
        }
        input.focus();
      });
    },
  };

  // ── QuickLinks ───────────────────────────────────────────────────────────
  const QuickLinks = {
    /** @type {Array<{id: string, label: string, url: string}>} */
    links: [],

    /**
     * Loads the link collection from localStorage into this.links.
     * If no data exists, this.links is set to an empty array.
     * Requirements: 7.3, 7.4
     */
    load() {
      this.links = Storage.get(Storage.KEYS.LINKS);
    },

    /**
     * Persists the current link collection to localStorage.
     * Requirements: 8.6
     */
    save() {
      Storage.set(Storage.KEYS.LINKS, this.links);
    },

    /**
     * Validates the add-link form inputs.
     * Returns { valid: boolean, errors: string[] }.
     * Adds an error entry for an empty label and a separate entry for an empty URL.
     * Requirements: 8.3
     * @param {string} label
     * @param {string} url
     * @returns {{ valid: boolean, errors: string[] }}
     */
    validateForm(label, url) {
      const errors = [];
      if (!label.trim()) errors.push('Label is required.');
      if (!url.trim())   errors.push('URL is required.');
      return { valid: errors.length === 0, errors };
    },

    /**
     * Builds and returns a container element for a single link.
     * Contains an <a> that opens link.url in a new tab and a delete button.
     * Requirements: 7.1, 7.2, 8.4
     * @param {{id: string, label: string, url: string}} link
     * @returns {HTMLDivElement}
     */
    renderLink(link) {
      const container = document.createElement('div');
      container.className = 'link-item';
      container.dataset.id = link.id;

      const anchor = document.createElement('a');
      anchor.href = link.url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.className = 'link-item__anchor';
      anchor.textContent = link.label;
      anchor.setAttribute('aria-label', `Open ${link.label} in a new tab`);

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'link-item__btn--delete';
      deleteBtn.textContent = 'Delete';
      deleteBtn.setAttribute('aria-label', `Delete link: ${link.label}`);
      deleteBtn.addEventListener('click', () => this.deleteLink(link.id));

      container.appendChild(anchor);
      container.appendChild(deleteBtn);

      return container;
    },

    /**
     * Clears #links-panel and re-renders all links.
     * Requirements: 7.1, 7.3
     */
    render() {
      const panel = document.getElementById('links-panel');
      if (!panel) return;
      panel.innerHTML = '';
      this.links.forEach((link) => panel.appendChild(this.renderLink(link)));
    },

    /**
     * Validates inputs and, if valid, creates a new Link, persists it, and
     * re-renders the panel. Displays validation errors in #links-error when
     * the inputs are invalid.
     * Requirements: 8.2, 8.3
     * @param {string} label
     * @param {string} url
     * @returns {boolean} true if the link was added, false if rejected
     */
    addLink(label, url) {
      const { valid, errors } = this.validateForm(label, url);
      const errorEl = document.getElementById('links-error');

      if (!valid) {
        if (errorEl) errorEl.textContent = errors.join(' ');
        return false;
      }

      if (errorEl) errorEl.textContent = '';

      const link = {
        id: (typeof crypto !== 'undefined' && crypto.randomUUID)
          ? crypto.randomUUID()
          : String(Date.now()) + String(Math.random()),
        label: label.trim(),
        url: url.trim(),
      };

      this.links.push(link);
      this.save();
      this.render();
      return true;
    },

    /**
     * Removes the link with the given id from the collection, then persists
     * and re-renders.
     * Requirements: 8.5
     * @param {string} id
     */
    deleteLink(id) {
      this.links = this.links.filter((l) => l.id !== id);
      this.save();
      this.render();
    },

    /**
     * Loads links, renders the panel, and binds the #links-form submit handler.
     * Requirements: 8.1, 8.2, 8.3
     */
    init() {
      this.load();
      this.render();

      const form       = document.getElementById('links-form');
      const labelInput = document.getElementById('link-label');
      const urlInput   = document.getElementById('link-url');
      if (!form) return;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const label = labelInput ? labelInput.value : '';
        const url   = urlInput   ? urlInput.value   : '';
        const added = this.addLink(label, url);
        if (added) {
          if (labelInput) labelInput.value = '';
          if (urlInput)   urlInput.value   = '';
        }
      });
    },
  };

  // ── App ──────────────────────────────────────────────────────────────────
  const App = {
    /**
     * Bootstraps all four widgets in sequence.
     * Called once on DOMContentLoaded.
     * Requirements: 9.1, 9.4, 10.1
     */
    init() {
      ThemeManager.init();
      GreetingWidget.init();
      FocusTimer.init();
      TodoList.init();
      QuickLinks.init();
    },
  };

  document.addEventListener('DOMContentLoaded', () => App.init());

})();
