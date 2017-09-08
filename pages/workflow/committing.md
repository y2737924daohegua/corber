---
layout: page
title:  "Committing & Cloning"
---

#### Comitting & .gitignore

On install, corber will update your gitignore to ignore non-essential files.

The happy path involves checking in:

- corber/config/framework.js;
- the _empty_ corber/www / plugin / platform directories. corber maintains these as empty folders with a .gitkeep to avoid problems with Cordova APIs;
- corber/cordova/config.xml should also be checked in, which is the Cordova equivalent of package.json.

Nothing else is generally required.

#### Cloning & Plugin/Platform re-installs

If you install plugins & platforms with `corber plugin/platform` commands, you will notice they are added to `corber/cordova/config.xml`.

With the above committed, new users can run `corber prepare` to install existing platforms & plugins, similar to npm install. See the [CLI
Reference](/pages/cli).
