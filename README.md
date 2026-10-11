# To-Do Lists

A tiny Jekyll site for GitHub Pages with two lists:

- **Events** have a time and an optional location, and are sorted from earliest to latest.
- **To Do** items can be checked off. Checked items move to the bottom, and
  "Clear checked items" removes them.

Tap **+ New To Do**, pick **Event** or **To Do**, and fill in the details.

Three themes: 🎃 Halloween (default), 🦃 Thanksgiving, and 🎄 Christmas. Tap
the buttons at the top to switch. The site remembers your choice.

## Files

- `_config.yml` – site title, home-screen name, and default theme
- `index.html` – the page and the "New To Do" pop-up
- `apple-touch-icon.png` – the iPhone home-screen icon (180×180)
- `assets/app.js` – lists, sorting, check-off, and theme switching
- `assets/style.css` – colors and layout for all three themes
- `assets/halloween.svg`, `assets/thanksgiving.svg`, `assets/christmas.svg` – background patterns

## Publish on GitHub Pages

1. Create a new repository on GitHub (for example `todo`) and upload these files, keeping the folder structure.
2. Go to **Settings → Pages**, set the source to **Deploy from a branch**, pick `main` and `/ (root)`, and save.
3. After a minute, the site is live at `https://<your-username>.github.io/todo/`.

## Change settings

Edit `_config.yml`:

```yaml
title: To-Do Lists
short_title: Lists
default_theme: halloween   # or thanksgiving, christmas
```

## Notes

There's no password on this site, so anyone with the link can open it.
Items are saved in the browser you add them in (localStorage), so each phone
or computer keeps its own lists. They're stored separately from the Bottle
Times and Pump Times sites.
