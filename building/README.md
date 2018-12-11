# How to build a Win10 installer
1. Build the windows electron application:
```
npm run package:win
```
  - then install NSIS
  - install ZipDLL plugin (../NSIS/Plugins/x86-ansi/): https://nsis.sourceforge.io/ZipDLL_plug-in
  - install AccessControl plugin: https://nsis.sourceforge.io/AccessControl_plug-in
  - open .nsi script file with NSIS and build it
