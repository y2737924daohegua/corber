---
layout: page
title:  "Install on Windows"
---

These instructions detail getting corber builds to work on Windows PowerShell environments. Windows bash environments require no special configuration.

1. Install Chocolatey(suggested) -> [here]('https://chocolatey.org/install')

   Chocolatey is the package manager for Windows and will simplify the install of other dependencies.

2. Install Yarn -> [here]('https://yarnpkg.com/en/docs/install')

   If you follow the chocolatey instructions it should also install Node.js for you.

3. Install node and npm -> [here]('https://nodejs.org/en/download/')

   Only if you elected not to follow yarns Chocolatey install instructions.

4. Add node to the path

   example path: `C:\Program Files\nodejs`

   - Use the global Search Charm to search "Environment Variables"
   - Click "Edit system environment variables"


5. Install Corber

   ```bash
   yarn global add corber
   npm install -g corber
   ```
