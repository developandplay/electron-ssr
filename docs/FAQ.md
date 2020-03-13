# FAQ

[中文](./FAQ-CN.md)

<details>
  <summary>我该下哪个后缀的文件？</summary>
  [Please refer to](../README.md#Download)
</details>

<details>
  <summary>Why does the application not launch?</summary>
  <p>Please check if there is a small airplane icon in the taskbar! Secondly, this problem is common in Linux systems. It is recommended to download the installation package corresponding to your system. If you have this problem, please post an issue, explain your environment and attach a log.</p>
</details>

<details>
  <summary>Why is the screen white after the app opens?</summary>
  <p>Please download and install the latest version first. This kind of problem is rarely encountered. If you do, please describe your environment and attach a log.</p>
</details>

<details>
  <summary>Why did my proxy connection not succeed?</summary>
  <p>First, make sure that there are servers available in the server configuration and select one of them. Second, verify that "Enable System Agent" is selected. Again, try to check "System proxy settings" - "General settings" and see if your browser is using the proxy. Finally click "Help" - "View Log" to see if <code>ssr-libev</code> is running normally and there are no errors in the log. If there is an error, please troubleshoot it first (such as a blocked port)</p>
  <p>Just because the browser can not connect to Google doesn't mean that the proxy doesn't work! Your browser might use another proxy mode, so please set your browser's proxy mode to "Use system proxy" and try again. How can you tell if the agent is successful? First check the http proxy in the application, then click <code>Copy proxy settings</code> in the taskbar tray and paste it in a terminal (on Windows, please use a terminal that supports Linux commands such as Git base). Use the <code>curl https://google.com</code> command to view the running results. If the content is returned successfully, the proxy is working, otherwise it doesn't.</p>
</details>

<details>
  <summary>Why does my Linux installation fail?</summary>
  <p>Please learn the basics of Linux first, we can not teach you that.</p>
</details>

<details>
  <summary>Does the application support 32-bit systems?</summary>
  <p>32-bit is only supported under Windows.</p>
</details>

<details>
  <summary>Why does my Linux system not show the airplane icon in the taskbar?</summary>
  <p>Try installing the <code>libappindicator1</code> application indicator. If that doesn't work, please use the shortcut key to switch between the main interface and the menu bar,[see details](../README.md#Shortcuts)</p>
</details>

<details>
  <summary>Why does the SSR configuration not get added after I click scan QR-code?</summary>
  <p>Please make sure there is only one SS(R) QR-code in the image. It is also possible that the SS url schema got updated. If this is the case, please open an issue.</p>
</details>

<details>
  <summary>Why are the log and the profile views so confusing?</summary>
  <p>The <code>.log</code> and <code>.json</code> files will be opened with your system default application. If you would prefer a different application, please change the default program for these file extensions.</p>
</details>

<details>
  <summary>Why does switching the system proxy mode have no effect?</summary>
  [See known bugs](../README.md#KnownBugs)
</details>

<details>	
  <summary>Exception: libsodium not found</summary>	
  <p>This error occurs if you are missing the libsodium library, on Mac please use <code>brew install libsodium</code> to install it, on Ubuntu please refer to <a href="https://gist.github.com/jonathanpmartins/2510f38abee1e65c6d92">https://gist.github.com/jonathanpmartins/2510f38abee1e65c6d92</a>, on Windows go to <a href="https://download.libsodium.org/libsodium/releases/">https://download.libsodium.org/libsodium/releases/</a>. Download <code>libsodium-{version}-msvc.zip</code>, unzip it and copy the <code>libsodium.dll</code> to <code>C:\windows\system32</code>  (check if the dll file is 64 or 32 bit), for other systems please do your own research.</p>	
</details>

<details>
  <summary>What should I do if there are no options to set the encryption method, protocol and obfuscation?</summary>
  <p>Please right-click the taskbar icon, go to General Settings, then go to the SSR settings tab and add it yourself. Of course your current SSR needs to support these options.</p>
</details>

<details>
  <summary>My linux system prompts me that there is a new update, but I clicked on the notification and didn't get to the download page?</summary>
  <p>1. It is recommended to use the AppImage. 2. See <a href="https://github.com/electron/electron/issues/9919">https://github.com/electron/electron/issues/9919</a>&nbsp; as well as &nbsp;<a href="https://github.com/electron/electron/issues/8474">https://github.com/electron/electron/issues/8474</a></p>
</details>
