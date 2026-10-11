# To-Do Lists

A tiny Jekyll site for GitHub Pages with two lists:

- **Events** have a time and an optional location, and are sorted from earliest to latest.
- **To Do** items can be checked off. Checked items move to the bottom, and
  "Clear checked items" removes them.

Tap **+ New To Do**, pick **Event** or **To Do**, and fill in the details.

The theme changes automatically every month:

| Month | Theme |
|---|---|
| January | ❄️ Winter – snowflakes, icy blues |
| February | 💖 Valentine's Day – hearts, reds and pinks |
| March | 🐣 Baby animals – chicks, bunnies, calves |
| April | 🌼 Texas wildflowers – bluebonnets, paintbrush, firewheels |
| May | 🌹 May Day / International Workers' Day – roses, stars, gears, maypole |
| June | 🏳️‍🌈 Pride – rainbows, hearts |
| July | 🇺🇸 Summer, pool, America – fireworks, pool floats, stars |
| August | 🏖️ Beach – umbrellas, sun, shells, starfish |
| September | 🍂 Autumn – pumpkin spice lattes, fall leaves |
| October | 🎃 Halloween – pumpkins, bats, ghosts |
| November | 🦃 Thanksgiving – leaves, acorns, wheat |
| December | 🎄 Christmas – snowflakes, trees, candy canes |

To preview another month, add `?month=` and a number (1–12) to the address,
for example `.../todo/?month=6` for June.

## Files

- `_config.yml` – site title and home-screen name
- `index.html` – the page, the "New To Do" pop-up, and the month → theme list
- `apple-touch-icon.png` – the iPhone home-screen icon (180×180)
- `assets/app.js` – lists, sorting, and check-off
- `assets/style.css` – colors, fonts, and layout for all 12 themes
- `assets/*.svg` – one background pattern per month

## Publish on GitHub Pages

1. Create a new repository on GitHub (for example `todo`) and upload these files, keeping the folder structure.
2. Go to **Settings → Pages**, set the source to **Deploy from a branch**, pick `main` and `/ (root)`, and save.
3. After a minute, the site is live at `https://<your-username>.github.io/todo/`.

## Change settings

Edit `_config.yml`:

```yaml
title: To-Do Lists
short_title: Lists
```

## Notes

There's no password on this site, so anyone with the link can open it.
Items are saved in the browser you add them in (localStorage), so each phone
or computer keeps its own lists. They're stored separately from the Bottle
Times and Pump Times sites.
