# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for Blue Seed Solutions (blueseedsolutions.com), a digital marketing agency. Built with Bootstrap Studio.

## Critical: Bootstrap Studio Requirement

**All HTML/CSS/JS edits MUST be made through [Bootstrap Studio](https://bootstrapstudio.io/).** Direct file edits will be overwritten when the `.bsdesign` file is re-exported. The design file `New BSS Website 3.bsdesign` is the source of truth.

## Running Locally

No build step required. Serve with any HTTP server:
```bash
python -m http.server 8000
```
Then visit http://localhost:8000

## Architecture

- **Static HTML site** - No framework, no build process, no npm
- **Bootstrap 5** - CSS framework via `assets/bootstrap/`
- **Smart Forms** - Contact form uses Bootstrap Studio's form handler (`smart-forms.min.js`)

### Page Structure
```
index.html          # Homepage
services.html       # Services overview
services/*.html     # Individual service pages (seo, website-development, marketing, brand-strategy)
about-us.html       # About page
contacts.html       # Contact form
pricing.html        # Pricing
projects.html       # Portfolio
404.html            # Error page
```

### Key Assets
- `assets/css/styles.min.css` - Custom styles (pre-minified)
- `assets/js/script.min.js` - Navigation shrink, parallax effects
- `assets/js/smart-forms.min.js` - Form validation/submission

## Contact Form Integration

Forms submit to Bootstrap Studio's handler. Key data attributes:
- `data-bss-recipient` - Email recipient
- `data-bss-redirect-url` - Post-submit redirect URL

## Deployment

Deployed via GitHub Pages from the `main` branch. CNAME file points to blueseedsolutions.com. Push to `main` to deploy.
