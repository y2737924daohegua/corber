---
layout: page
title:  "Ember"
---

corber will detect Ember projects and run accordingly. The following custom changes are required to your Ember application - but the CLI will warn you if anything is missing.

- In `config/environment.js` set locationType to `hash`;
- In `config/environment.js` ensure &#123;&#123;rootURL&#125;&#125; or &#123;&#123;baseURL&#125;&#125 does not have a leading slash;
