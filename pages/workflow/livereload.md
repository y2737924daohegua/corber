---
layout: page
title:  "Live Reload"
---

Live reload takes your framework's standard serve/live-reloading behaviour to Corber apps.

Live reload apps can still access Cordova plugins and work on emulators and physical devices.

**Caveats**

- Live reload is not for production environments. It is not a solution for delivering over the air updates in a production context.
- Your computer and phone/device must be on the same network.

#### Usage

```
  corber serve
  corber --environment=staging --platform=android
```

Some whitelisting may be required in config.xml to access the serve instance. Corber will add these changes and remove them from non-live-reload builds. You will receive a warning on any build if these tags, for whatever reason, were not appropriately removed.

This command builds a cordova container app and starts a slightly modified serve process for your configured framework.

Once serve is running, *deploy* the newly generated app to a device/emulator as explained in the [build workflow](/pages/workflow/building) section _Deploying to a device or emulator_. You do not want to re-run `corber build`, this will rebuild the static, not live-reloading app.

Code changes should immediately resolve on your device. If you are having further troubles, you likely need to customize the device live reload url.

#### Additional Android Steps

The whitelist plugin is also required for Android >4.0:
`corber plugin add cordova-plugin-whitelist`

#### Customize the device live reload url

Live reload works by redirecting the cordova apps window.location from file://index.html to your locally running serve instance.
Corber will detect and automatically set these values for you.

There are times you may need to run live reload with a specific remote host and port, or to customize a local url because we are not detecting it correctly.
You can do so:

- Via command line arg: `corber server --reload-url="<url>"`.
- For Ember projects, via `.ember-cli`: `reloadUrl: "<url>"`.

Where `<url>` above  refers to a fully qualified URL including protocol, host, and port (if applicable), e.g. http://localhost:4200
