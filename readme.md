# Hochschul Active Directory Lookup Tool (HALT)

## Project members
- Bichlmeier Christoph [Master]: UI (Angular), Electron (process management), Auth, Packaging and Building (Webpack, NSIS), LDAP, VPN
- Bielang Michael [Bachelor]: DB, DB-Interface, API, Testing


## Project description
**A Tool to simplify the college LDAP search.**
Previously it was required to use a linux emulation on Windows PCs within the HSA network which did provide e. g. openLDAP. Furthermore it was required to use a command like this:
```
ldapsearch -H ldap://ldap1.fh-augsburg.de -x -LLL -b "ou=People,dc=FH-Augsburg,dc=DE" "(objectClass=*)" | tee hs-augs-ldap.dump
```
After this command has been executed it will dump around 500k+ lines into the `hs-augs-ldap.dump` file, which have to search through opening that dump file. This isn't very user friendly and cannot be imposed on HSA staff that isn't very technically savvy.

**Therefore the following requirements did emerge to compensate that:**
Users should not need to know long and complicated LDAP commands. This tool therefore will enable them to only type in e. g. a firstname, lastname, or the college email address or a combination of them to perform the actual lookup. This includes additional search limitations for study subject, faculty, gender, or degree (Bachelor or Master) as well as limitation onto a specific college or university. With given input, the tool will then automatically look for fitting identities in the Active Directories of a preset list of colleges and universities. If at first a connection is not possible or no search result was found, it will try to establish a vpn connections to said list of colleges and universities.


## Requirements
- Development with Unit-Tests
- integrated database driver
- included API
- automated vpn handling
- automated LDAP lookup
- simple installation binary
- A simple UI for users


## Used collaboration tools
- GitLab tickets
- draw.io (broken, sockets do no longer work)
- Google Docs
- Discord
- Teamspeak 3
- TeamViewer
- WhatsApp


## How to start this tool, How to use it
If on windows, it's advised to use Powershell (to prevent port locking and processes from getting stuck)
- prepare dev env:
  - use latest node version (10.x)
```
npm i -g node-gyp
npm rebuild node-sass
npm i
```
- For development simply run `npm start`
-	For development api server only run: `npm run server`
-	To build production and packaging run: `npm run package:all`
- Build a win10 installer:
```
npm run package:win
```
  - then install NSIS
  - install ZipDLL plugin (../NSIS/Plugins/x86-ansi/): https://nsis.sourceforge.io/ZipDLL_plug-in
  - install AccessControl plugin: https://nsis.sourceforge.io/AccessControl_plug-in
  - open .nsi script file with NSIS and build it


## How to run Tests
If on windows, it's advised to use Powershell
- `npm run db-test` Test sqlite3 database interface
- `npm run user-test` Test if prepared mock user does get returned as expected
- `npm run searchhistory-test` Test if prepared search history entry gets returned as expected
- `npm run faculty-test` Check if faculty information gets return as expected from api controller
- `npm run healthCheck-test` If api healthCheck controller returns correct healthy info
- `npm run search-test` Will try to connect vpn and tests ldap lookup. It needs to be closed with ctrl + c due to ldap service keeping it open.


## How to install production version
- windows: simply use the installer
- linux and mac: copy corresponding package to desired folder
  - install nodejs
  - install openvpn
  - exec `npm i --save-prod` in ../HALT-linux-x64/resources/app
  - run the HALT binary



## RoadMap

### week 1
- defining requirements
- research for fitting test suit
- init of project controlling and collaboration infrastructure
- mockup of DB model
- mockup of frontend
- creation of user journey/user stories
- angular-cli with electron project init
- for further information see tickets from milestone: %"Week 1 (27.11.)"

### week 2
- create route model
- create express server route and controler boilerplate code
- writing db Interface
- compilation of study subjects at HSA
- research of electron possibilities
- create db model
- for further information see tickets from milestone: %"Week 2 (04.12.)"

### week 3
- see tickets from milestone: %"Week 3 (11.12.)"

### week 4
- see tickets from milestone: %"Week 4 (18.12.)"

### week 5
- see tickets from milestone: %"Week 5 (25.12.)"

### week 6
- see tickets from milestone: %"Week 6 (01.01.)"

### week 7
- see tickets from milestone: %"Week 7 (08.01.)"

### week 8
- see tickets from milestone: %"Week 8 (15.01.)"
- presentation of application/demo






# ADDITIONAL/OPTIONAL STUFF

## git prune old branches
http://erikaybar.name/git-deleting-old-local-branches/
```
git remote prune origin
git branch -vv | grep 'origin/.*: gone]' | awk '{print $1}' | xargs git branch -d
```

## .bashrc adjustment for Linux shell branch output
put this at the end:
```
export PS1="$PS1\033[1;34m\$(git branch 2>/dev/null | grep '^*' | colrm 1 2)\033[00m "
```

## Create a types definition
install following module globally and auto gen the .d.ts file
```
npm install -g dts-gen
dts-gen -m <your-module>
```
move the .d.ts file into the folder ./types

## Killing a windows process by name
```
taskkill /f /t /im openvpn.exe
```
