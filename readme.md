# Hochschul Active Directory Lookup Tool (HALT)

## Project members
- Bichlmeier Christoph [Master]: UI (Angular), Electron (processmanagement), Auth, packaging (webpack)
- Bielang Michael [Bachelor]: DB, DB-Interface, API
- Schmid Steffen [Bachelor]: Testing, VPN, LDAP


## Project description
A Tool to simplify the college LDAP search.

Users should not need to know long and complicated LDAP commands. This tool therefore will enable them to only type in e. g. a firstname, lastname, or the college email address or a combination of them to perform the actual lookup. This includes additional search limitations for study subject, faculty, gender, or degree (Bachelor or Master) as well as limitation onto a specific college or university. With given input, the tool will then automatically look for fitting identities in the Active Directories of a preset list of colleges and universities. If at first a connection is not possible or no search result was found, it will try to establish a vpn connections to said list of colleges and universities.


## Requirements
- Development with Unit-Tests
- integrated database driver
- included API
- automated vpn handling
- automated LDAP lookup
- simple installation binary
- A simple UI for users
- ...


## Used collaboration tools
- GitLab tickets
- draw.io (broken, sockets do no longer work)
- google docs
- discord
- teamspeak
- teamviewer
- whatsapp


## How to start this tool, How to use it
- simply run: `npm start`
- For development simply run `npm start`
-	For development api server only run: `npm run server`
-	To build production and packaging run: `npm run package:all`



## RoadMap

### week 1
- defining requirements
- research for fitting test suit
- init of project controlling and collaboration infrastructure
- mockup of DB model
- mockup of frontend
- creation of user journey/user stories
- angular-cli with electron project init
- ...

### week 2
- test

### week 3
- ...

### week 4
- ...

### week 5
- ...

### week 6
- ...

### week 7
- ...

### week 8
- ...
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



# Halt

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
