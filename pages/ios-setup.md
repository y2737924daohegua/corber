---
layout: page
title:  "iOS Setup:
---

Only Apple/Mac devices can create Apple builds. There is no way to locally create an iOS build on a Windows/Linux machine.

1. Download the latest Xcode from the App Store ->
- It is important you keep Xcode up to date, so your builds work on the most recent devices

2. Once Xcode is downloaded open it and accept the licenses ->
- If you see the error `xcode-select: error: tool 'xcodebuild' requires Xcode` or `No emulators or devices found.`, run `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`

3. Xcode comes with a set of emulators pre installed. To expand the emulators available to corber create them through Xcode
- Once Xcode is open press Window, Devices + Simulators
- Press the 'Simulators' tab
- New emulators can be created
