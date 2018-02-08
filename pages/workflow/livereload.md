---
layout: page
title:  "Live Reload"
---

Live reload takes your framework's standard serve/live-reloading behaviour to Corber apps.

Live reload apps can still access Cordova plugins and work on emulators and physical devices.

Live reload is supported by `corber start` and `corber serve` - with
long term plans to deprecate `serve` in favor of extending `start`.

In both cases, live reload is achieved by building a containter application pointed towards a modified serve process from your configured framework. The changes to your serve process are automatic and done to achieve cordova plugin support. Some whitelisting may be required in config.xml to access the development server (allow-navigation tags). Corber will add these changes and remove them from non-live-reload builds. You will receive a warning on any build if these tags, for whatever reason, were not appropriately removed.

**Caveats**

- Live reload is not for production environments. It is not a solution for delivering over the air updates in a production context.
- Your computer and phone/device must be on the same network.

#### corber start (beta)

```
  corber start
  corber start --platform=android
```

`start` boots an emulator of your choosing, installs / launches the container application and boots your frameworks serve
process - with special handling to also support cordova plugins.

There are no further manual steps required to start developing. `start`
currently only supports emulators - we are now working on adding device
support.


#### corber serve

```
  corber serve
  corber --environment=staging --platform=android
```

`serve` compiles the special cordova application and boots
your modified development server. It does not deploy the built cordova
application to a device or emulator. If you are working on emulators we
suggest the `start` command.

Once serve is running, *deploy* the newly generated app to a device/emulator as explained in the [build workflow](/pages/workflow/building) section _Deploying to a device or emulator_. You do not want to re-run `corber build`, this will rebuild the static, not live-reloading app.

Code changes should immediately resolve on your device. If you are having further troubles, you likely need to customize the device live reload url.

#### Additional Android Steps

The whitelist plugin is also required for Android >4.0:
`corber plugin add cordova-plugin-whitelist`

You will be prompted if it is not installed.

#### Customize the device live reload url

Live reload works by redirecting the cordova apps window.location from file://index.html to your locally running serve instance.
Corber will detect and automatically set these values for you.

There are times you may need to run live reload with a specific remote host and port, or to customize a local url because we are not detecting it correctly.
You can do so:

- Via command line arg: `corber server --reload-url="<url>"`.

Where `<url>` above  refers to a fully qualified URL including protocol, host, and port (if applicable), e.g. http://localhost:4200
