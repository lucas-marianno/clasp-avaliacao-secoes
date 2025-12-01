# CLASP - Avaliação das Seções
Full stack web app used by the Secretaria de Educação de São Bernardo do Campo. (PMSBC)

The web app is used by over 7000 employees across the municipality.

## Tech Stack
Yeah, I know google sheets should not be used as a data base yada yada yada... But, hear me out, PMSBC offers to the Secretaria de Educação the Enterprise plan of Google Workspace. That being said, this standard development environment.

- HTML5
- JavaScript (vanilla - clasp dropped support for typescript)
- CSS (tailwind)

### Database
- Google Sheets

### Tech stack "glue"
- CLASP (Command Line Apps Script Projects) is a tool that allows for local devolpment of App Script projects.

## How to use this project

### Local settings
- Install and log into [clasp]("https://developers.google.com/apps-script/guides/clasp")

### Appscript settings
- Create a folder and clone this repo into it
    - `mkdir my_clasp_folder && cd my_clasp_folder && git clone git@github.com:lucas-marianno/clasp-avaliacao-secoes.git`
- On the same folder, create a new [App Script](https://script.google.com/) Project
    - `clasp create`
- Push the files into your App Script project
    - `clasp push`
- Find and run the function `generateEnvironment()` on the web ide. This function will create and populate all the necessary folders, files, triggers and properties. If necessary, it can be run more than once, eventhough it's likely unnecessary
    - Accept all permission requests made by google
- Create a new deployment as Web App
    - [optional] create a new deployment as API-Executable in order to run functions on your local IDE. Otherwise, you can continue developing on your local IDE, but you'll have to use the web IDE in order to run functions.
- Embed the new deployment link to a [Google Sites](https://sites.google.com/) website (so that the users entry point web link remains the same on every new deployment)
    - When embedding the url, if you deployed the script from within a G Suite domain. Please add `/a/<your domain name>` right after `https://script.google.com`
    Example: `https://script.google.com/a/<your.company.domain.here>/macros/s/<yourNewDeploymentIdHere>/exec`
