---
layout: page
title:  "Ember"
---

corber will detect Ember projects and run accordingly. The following custom changes are required to your Ember application. The CLI will warn you if anything is missing.

- In `config/environment.js`, set `locationType` to `hash`.
- In `config/environment.js`, ensure {% raw %}`{{rootURL}}` or `{{baseURL}}`{% endraw %} does not have a leading slash.
