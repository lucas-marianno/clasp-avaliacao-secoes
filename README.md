# CLASP - Avaliação das Seções
Full stack web app used by the Secretaria de Educação de São Bernardo do Campo. (PMSBC)

The web app is used by over 7000 employees across the municipality.

## Tech Stack
Yeah, I know google sheets should not be used as a data base yada yada yada... But, hear me out, PMSBC offers to the Secretaria de Educação the Enterprise plan of Google Workspace. That being said, this standard development environment.

### Front End
- HTML5
- JavaScript (vanilla)
- CSS (tailwind)

### Back End
- TypeScript (will be converted to `.gs` - Google App Script)

### Database
- Google Sheets

### Tech stack "glue"
- CLASP (Command Line Apps Script Projects) is a tool that allows for local devolpment of App Script projects.

## How to use this project

### Local settings
- Install and log into [clasp]("https://developers.google.com/apps-script/guides/clasp")

### Appscript settings
- Create a new [Google Sheets](https://docs.google.com/spreadsheets/) document
- Create a new [App Script](https://script.google.com/) Project
- Save the GSheets document ID to `PropertiesService` under the key `db_id`;
- In the new GSheets doc:
    - Create 3 tabs with the names according to `constants.ts`
    - Create the headers according to the indexes in `constants.ts`
    - Enter the questions in the `PERGUNTAS` sheet following the example in `MOCK_PERGUNTAS` in `test/test.ts`
- Create a new deployment
- Embed the new deployment link to a [Google Sites](https://sites.google.com/) website (so that the users entry point web link remains the same on every new deployment)
    - When embedding the url, if you deployed the script from within a G Suite domain. Please add `/a/<your domain name>` right after `https://script.google.com`
    Example: `https://script.google.com/a/<your.company.domain.here>/macros/s/<yourNewDeploymentIdHere>/exec`
