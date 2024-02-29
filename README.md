# TempusLibre
TempusLibre is a web app for quick time tracking.

This is a web app that will allow users to track in and out times quickly without requiring lengthy client or job setups before use. It works entirely in the user's browser.

The initial purpose was to creat an app for myself to use to track time, then to allow others to use it.

v0.1.0 is officially a pre-release version. It has all the functionality it is intended to have, although some page styling has been left incomplete.

This app does not connect to an external database. It uses the browser's local storage. If a user clears their cache including local storage, the data will be lost. Additionally, a user can't punch in on one device or browser and out on another.

The benefit is that all the data remains local and private, never being transmitted to the Internet.

The app doesn't use cookies. The only things it does accross the network is to fetch the html/css/javascript files, and to load a web font.

Roadmap:
v1.0.0 (in progress):
- Persistent client/project/job lists and the ability to mange them
- Data backup
- Data import
- More options for fitering punches for viewing and export
- The ability to edit punches
- More granular control of data management

Future:
- Data restore from backup
- Archive clients/projects/jobs
- Export options/reports
- Punch Description field

Far future:
- Database-driven version
- Multi-user
- Integration with other apps and cms's