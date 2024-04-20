# SPA Overview

## Tech Stack

- SPA is built with React
- - Material UI is used for common components, some components are custom or modified versions of MUI components
- - Vite is used for local development hosting of the SPA and building the SPA for deployment
- npm for package management and scripting of installed packages

### Understanding Components

Components are rendered and displayed on the page. They integrate JavaScript code and React's JSX syntax to allow for complex functionality to be added to webpages.
Components are displayed in the Document Object Model, or DOM. Each component is a child of the root of the DOM, and components can be children of other comopnents.
This allows passing properties and information down to components, such as passing a title/username from a parent component down to a child.

### Understanding Contexts

Contexts are a way to pass data through the component tree/DOM without having to do it at every level. This simplifies a lot of logic for several different scenarios.
Things like a username, authentication token, login status, and more are not easily passed down through the DOM. For example, our `UserContext` looks like this:

```
const UserContext = createContext({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  refreshUser: () => {},
});
```

This allows us to keep track of the user and call its properties at any level, as well as the user's authentication token.

### Understanding Services

Services are just thin wrappers used by the SPA to ease calling the API and allow for reuse of common API calls.
See the (API services)[https://github.com/SCCapstone/PalmettoProgrammers/blob/main/FU.API/README.md#understanding-services] for understanding of how they work.

## Development

Install [npm](https://www.npmjs.com/package/npm) and [Docker](https://www.docker.com/get-started/).

### Configure the API URL

Config settings are loaded from environment variables. To automatically load environment variables from a file, create a `.env` file in this folder.

Set the `VITE_API_URL` environment variable by adding the following to `.env`.

    VITE_API_URL=http://localhost:5278/api

If there are CORS errors, change the URL to match `http://` instead of `https://` and this may resolve the issue.

### Running with Docker

Add the following to your `hosts` file (`/etc/hosts` on Linux and `C:\Windows\System32\drivers\etc` on Windows).

    127.0.0.1	storage
    127.0.0.1	fu-api
    127.0.0.1	fu-spa

To test with a clean API and SPA run

    npm run selenium-test:clean

To startup a clean API and SPA for test development, run

    npm run container-setup

To stop run

    npm run container-teardown

To start just the API for SPA development, run

    npm run api-start

To pause the container press `CTRL-C`. To resume it run the above command. To stop and remove the container run

    npm run api-teardown

### Developing Selenium Tests

Tests are located in `FU.SPA/tests`.

To add initial testing data, add API calls to `tests/setup-tests.js`. The file can be run manually with `node tests/setup-tests.js`. If run manually, the `API_BASE_URL` environment variable must be set. See [here](https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs) for details.

To run behavioral tests with a API and SPA already running, run

    npm run selenium-test

or

    selenium-side-runner tests/*.side -c browserName=firefox

You can also change the browserName option to chrome/chromium if you want to test that browser engine instead.

### Coding Style

Prettier and ESLint are used to enforce a consistent coding style.
