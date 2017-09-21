---
layout: page
title:  "Default Webviews"
---

The default Cordova WebViews are not always the most performant option. corber initializes your platform with the most performant web view if you add platforms with the `corber platform add` command.

### For iOS

In iOS, `corber platform add ios` will initialize a [WKWebView](https://developer.apple.com/reference/webkit/wkwebview) on your behalf, vs a [UIWebView](https://developer.apple.com/reference/uikit/uiwebview).

The UIWebView has been a class since iOS 2, whereas WKWebView was introduced in iOS 8. It includes the modern iOS WebView API's and considerable performance improvements for JS applications.

If you would instead like to initialize with a UIWebView, run `corber platform add ios --uiwebview`.

### For Android

By default the standard Android WebView is used.

On Android 7 and later, the Android WebView is [automatically linked to Chrome and kept up-to-date](https://developer.android.com/about/versions/nougat/android-7.0.html#webview).

A now deprecated option to use the [crosswalk webview](https://github.com/crosswalk-project/cordova-plugin-crosswalk-webview) still exist. But since [Crosswalk](https://crosswalk-project.org) itself is sunset, and newer versions of Android will auto-update the webview, we no longer recommend using it.

If you still want to use the crosswalk webview, run `corber platform add android --crosswalk`.
