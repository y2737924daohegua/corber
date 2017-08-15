---
layout: page
title:  "Vue"
---

Vue support is limited to vue-cli webpack users.

corber will detect vue-cli projects and run accordingly. The following custom changes are required to your Vue application - but the CLI will warn you if anything is missing.

- In `config/index.js`: assetsPublicPath must not have a leading slash;
