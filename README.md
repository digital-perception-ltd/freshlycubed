# Freshly Cubed

Static website for [freshlycubed.com](https://freshlycubed.com), built from concept direction **A · Botanical**.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home |
| `the-idea.html` | The Idea |
| `inside-the-cube.html` | Inside the Cube — the five ingredients, with a numbered photo map |
| `why.html` | Why Freshly Cubed |
| `story.html` | Our Story |
| `contact.html` | Contact Us |

Shared styles live in `css/site.css`, behaviour in `js/site.js`, photos in `images/`.
There is no build step: any static host (GitHub Pages, Netlify, Azure Static Web Apps) can serve the folder as is.

## Run locally

```sh
python -m http.server 8765
# open http://localhost:8765
```

## Newsletter sign-up

The form on `contact.html` has no backend yet. To collect sign-ups, add a `data-endpoint`
attribute to the form with a form-service URL (for example Formspree or a Mailchimp form action):

```html
<form class="card" data-signup data-endpoint="https://formspree.io/f/XXXX" novalidate>
```

Until then, submitting the form asks visitors to email hello@freshlycubed.com.

## Notes

- Copy and photos come from the current freshlycubed.com site.
- Fonts: Bodoni Moda (display) and Hanken Grotesk (body), loaded from Google Fonts.
- Checked at 320, 375, 768, 1024, 1440 and 1920 px wide: no horizontal overflow, no console errors, all images load.
