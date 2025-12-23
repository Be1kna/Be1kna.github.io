# Project Hub

This repository hosts the main landing page that links to several project GitHub Pages sites.

Managed projects (hosted separately):
- https://be1kna.github.io/color-change/
- https://be1kna.github.io/resizing/
- https://be1kna.github.io/quantizer/
- https://be1kna.github.io/privacy-play/
- https://be1kna.github.io/uncertainty-calculator/

How ordering works
- The page reads `projects.json` to render cards. The first entry is displayed first (top/left).
- Use the `Edit order` button on the page to reorder locally, then `Export order JSON` to copy the new array.
- Paste the exported JSON into `projects.json` and commit to change the canonical order.

Publishing
- Create a GitHub repository named `be1kna.github.io` and push this repo to make it available at https://be1kna.github.io/.

To publish from this repo (example):

```bash
git init
git add .
git commit -m "chore: initial website"
git remote add origin git@github.com:Be1kna/be1kna.github.io.git
git branch -M main
git push -u origin main
```

If you prefer HTTPS with a PAT, use `git remote set-url origin https://github.com/Be1kna/be1kna.github.io.git` and follow the PAT instructions.
