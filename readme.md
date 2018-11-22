# Hochschul Active Directory Lookup Tool (HALT)

## Project members
- Bichlmeier Christoph [Master]: UI, Electron, Angular, LDAP, Auth
- Bielang Michael [Bachelor]: DB, ORM, API
- Schmid Steffen [Bachelor]: Testing, VPN


## Project description
A Tool to simplify the college LDAP search.

Users should not need to know long and complicated LDAP commands. This tool therefore will enable them to only type in e. g. a firstname, lastname, or the college email address or a combination of them to perform the actual lookup. This includes additional search limitations for study subject, faculty, gender, or degree (Bachelor or Master) as well as limitation onto a specific college or university. With given input, the tool will then automatically look for fitting identities in the Active Directories of a preset list of colleges and universities. If at first a connection is not possible or no search result was found, it will try to establish a vpn connection to said list of colleges and universities.


## Requirements
- Testdriven Development
- integrated database driver
- included API
- automated vpn handling
- automated LDAP lookup
- simple installation binary


## Used collaboration tools
- GitLab tickets
- draw.io (broken, sockets do no longer work)
- google docs
- discord
- teamspeak
- teamviewer
- whatsapp


## How to start this tool, How to use it
- ...


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
- ...

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








# ADDITIONAL

{
  "name": "halt",
  "version": "0.0.0",
  "description": "Hochschul Active Directory Lookup Tool",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Bichlmeier Christoph, Bielang Michael, Schmid Steffen",
  "license": "UNLICENSED"
}


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
