---
layout: page
title:  "Ember"
---

Corber will detect Ember projects and run accordingly.

The following changes to your Ember application are required:

- In `config/environment.js`, set `locationType` to `hash`.
- In `config/environment.js`, ensure {% raw %}`{{rootURL}}` or `{{baseURL}}`{% endraw %} does not have a leading slash.

The CLI will warn you if anything is missing.
