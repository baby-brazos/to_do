(function () {
  "use strict";

  // Keys are prefixed so they don't collide with the other sites on the same github.io domain.
  var KEY_ITEMS = "todo.items";
  var KEY_THEME = "todo.theme";

  var THEMES = {
    halloween:    { emoji: "🎃", color: "#1b1026" },
    thanksgiving: { emoji: "🦃", color: "#fbf1e3" },
    christmas:    { emoji: "🎄", color: "#123a2c" }
  };

  // ---------- storage helpers (fail quietly in private mode) ----------
  function load(key, fallback) {
    try {
      var v = localStorage.getItem(key);
      return v === null ? fallback : JSON.parse(v);
    } catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  // ---------- items ----------
  // Event: { id, type: "event", text, time: "15:00", location, created }
  // To Do: { id, type: "todo",  text, done: false, created }
  var items = load(KEY_ITEMS, []);
  if (!Array.isArray(items)) items = [];

  function persist() {
    save(KEY_ITEMS, items);
    render();
  }
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  function fmtTime(hhmm) {
    var p = hhmm.split(":");
    var d = new Date();
    d.setHours(+p[0], +p[1], 0, 0);
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  function remove(id) {
    items = items.filter(function (it) { return it.id !== id; });
    persist();
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function deleteButton(item) {
    var b = el("button", "del", "×");
    b.type = "button";
    b.setAttribute("aria-label", "Delete " + item.text);
    b.addEventListener("click", function () { remove(item.id); });
    return b;
  }

  // ---------- rendering ----------
  function render() {
    var events = items
      .filter(function (it) { return it.type === "event"; })
      .sort(function (a, b) {
        if (a.time !== b.time) return a.time < b.time ? -1 : 1;  // "09:30" < "15:00"
        return a.created - b.created;
      });

    var todos = items
      .filter(function (it) { return it.type === "todo"; })
      .sort(function (a, b) {
        if (a.done !== b.done) return a.done ? 1 : -1;            // unchecked first
        return a.created - b.created;
      });

    // Events
    var evList = document.getElementById("events");
    evList.innerHTML = "";
    events.forEach(function (it) {
      var li = el("li", "event");
      li.appendChild(el("span", "when", fmtTime(it.time)));
      var what = el("div", "what");
      what.appendChild(el("span", "title", it.text));
      if (it.location) what.appendChild(el("span", "where", "📍 " + it.location));
      li.appendChild(what);
      li.appendChild(deleteButton(it));
      evList.appendChild(li);
    });
    document.getElementById("events-empty").hidden = events.length > 0;

    // To Dos
    var tdList = document.getElementById("todos");
    tdList.innerHTML = "";
    todos.forEach(function (it) {
      var li = el("li", "todo" + (it.done ? " done" : ""));
      var label = el("label");
      var box = document.createElement("input");
      box.type = "checkbox";
      box.checked = !!it.done;
      box.addEventListener("change", function () {
        it.done = box.checked;
        persist();
      });
      label.appendChild(box);
      label.appendChild(el("span", "title", it.text));
      li.appendChild(label);
      li.appendChild(deleteButton(it));
      tdList.appendChild(li);
    });
    var open = todos.filter(function (it) { return !it.done; }).length;
    var doneCount = todos.length - open;
    document.getElementById("todos-empty").hidden = todos.length > 0;
    document.getElementById("todo-count").textContent = open ? "(" + open + ")" : "";
    document.getElementById("clear-done").hidden = doneCount === 0;
  }

  document.getElementById("clear-done").addEventListener("click", function () {
    items = items.filter(function (it) { return !(it.type === "todo" && it.done); });
    persist();
  });

  // ---------- "New To Do" pop-up ----------
  var dlg = document.getElementById("new-dialog");
  var form = document.getElementById("new-form");
  var textInput = document.getElementById("item-text");
  var timeInput = document.getElementById("item-time");
  var locInput = document.getElementById("item-location");
  var eventFields = document.getElementById("event-fields");
  var kindButtons = dlg.querySelectorAll("[data-kind]");
  var kind = "todo";

  function setKind(k) {
    kind = k;
    kindButtons.forEach(function (b) {
      b.setAttribute("aria-checked", b.getAttribute("data-kind") === k ? "true" : "false");
    });
    eventFields.hidden = k !== "event";
    timeInput.required = k === "event";   // only required when it's visible
  }
  kindButtons.forEach(function (b) {
    b.addEventListener("click", function () { setKind(b.getAttribute("data-kind")); });
  });

  document.getElementById("new-btn").addEventListener("click", function () {
    form.reset();
    setKind("todo");
    dlg.showModal();
    textInput.focus();
  });
  document.getElementById("cancel-btn").addEventListener("click", function () { dlg.close(); });
  // Tapping the dimmed area outside the pop-up closes it.
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = textInput.value.trim();
    if (!text) { textInput.focus(); return; }
    if (kind === "event") {
      if (!timeInput.value) { timeInput.focus(); return; }
      items.push({
        id: uid(), type: "event", text: text,
        time: timeInput.value, location: locInput.value.trim(),
        created: Date.now()
      });
    } else {
      items.push({ id: uid(), type: "todo", text: text, done: false, created: Date.now() });
    }
    persist();
    dlg.close();
  });

  // ---------- themes ----------
  var root = document.documentElement;
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  var themeButtons = document.querySelectorAll("[data-theme-choice]");

  function applyTheme(name, remember) {
    if (!THEMES[name]) name = "halloween";
    root.setAttribute("data-theme", name);
    themeMeta.setAttribute("content", THEMES[name].color);
    document.getElementById("theme-emoji").textContent = THEMES[name].emoji;
    themeButtons.forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-theme-choice") === name ? "true" : "false");
    });
    if (remember) save(KEY_THEME, name);
  }
  themeButtons.forEach(function (b) {
    b.addEventListener("click", function () { applyTheme(b.getAttribute("data-theme-choice"), true); });
  });

  // Keep other open tabs in sync.
  window.addEventListener("storage", function (e) {
    if (e.key === KEY_ITEMS) { items = load(KEY_ITEMS, []); render(); }
    if (e.key === KEY_THEME) applyTheme(load(KEY_THEME, "halloween"), false);
  });

  // ---------- start ----------
  applyTheme(root.getAttribute("data-theme"), false);
  render();
})();
