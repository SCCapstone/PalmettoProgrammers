# SPA Overview

## Development

Install [npm](https://www.npmjs.com/package/npm) and [Docker](https://www.docker.com/get-started/).

## Configure the API URL

Config settings are loaded from environment variables. To automatically load environment variables from a file, create a `.env` file in this folder.

Set the `VITE_API_URL` environment variable by adding the following to `.env`.

    VITE_API_URL=http://localhost:5278/api

If there are CORS errors, change the URL to match `http://` instead of `https://` and this may resolve the issue.

## Running with docker

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

To add initial testing data, add API calls to `tests/setup-tests.js`. The file can be run manually with `node tests/setup-tests.js`.

To run behavioral tests with a API and SPA already running, run

    npm run selenium-test

or

    selenium-side-runner tests/*.side -c browserName=firefox

You can also change the browserName option to chrome/chromium if you want to test that browser engine instead.

### Coding Style

Prettier and ESLint are used to enforce a consistent coding style.
