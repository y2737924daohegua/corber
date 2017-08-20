---
layout: page
title:  "Live Reload"
---

Livereload takes your frameworks standard serve/livereload behaviour to corber apps.

Livereload apps can still access Cordova plugins and work on emulators and physical devices.

**Caveats**

- Livereload is not for production environments. It is not a solution for delivering over the air updates in a production context.

- Your computer and phone/device must be on the same network.

#### Usage

```
  corber serve
  corber --environment=staging --platform=android
```

Some whitelisting may be required in config.xml to access the serve instance. corber will add these changes - and remove them from non-livereload builds.
You will receive a warning on any build if these tags, for whatever reason, were not appropriately removed.

This command builds a cordova container app and starts a slightly modified serve process for your configured framework.
Once serve is running, deploy the newly generated app to a device/emulator as explained in [build workflow](/pages/workflow/building).

Code changes should immediately resolve on your device. If you are having further troubles, you likely need to customize the device livereload url.

#### Additional Android Steps

The whitelist plugin is also required for Android >4.0:
`corber plugin add cordova-plugin-whitelist`

#### Customize the device livereload url

Livereload works by redirecting the cordova apps window.location from file://index.html to your locally running serve instance.
corber will detect and automatically set these values for you.

There are times you may need to run livereload with a specific remote host and port, or to customize a local url because we are not detecting it correctly.
You can do so:

- Via command line arg: `corber server --reload-url="<url>"`; or
- For Ember projects, via `.ember-cli`: `reloadUrl: "<url>"`.

Where `<url>` above  refers to a fully qualified URL including protocol, host, and port (if applicable), e.g. http://localhost:4200
