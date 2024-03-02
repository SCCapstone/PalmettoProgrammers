# Forces Unite
The Forces Unite website is a platform designed to bring gamers together, form groups, and connect over their favorite gaming interests.
Read our [wiki](https://github.com/SCCapstone/PalmettoProgrammers/wiki/Project-Description)!

## External Requirements
In order to build this project you first have to install:
* [ASP.NET Core 7](https://learn.microsoft.com/en-us/aspnet/core/introduction-to-aspnet-core?view=aspnetcore-7.0)
* [npm](https://www.npmjs.com/package/npm)
* [Docker](https://www.docker.com/get-started/)
* [PostgreSQL](https://www.postgresql.org/download/)
* [Entity Framework Core tools for .NET 7](https://learn.microsoft.com/en-us/ef/core/cli/)

### Backend Environment Setup
Config settings are loaded from the environment variables. To automatically load the environment variable from a file, create a `.env` file in the `FU.API` parent folder.
### Jwt Secret
A random string of 32+ characters is required in the `JWT_SECRET` environment variable as a Jwt Secret.
```
JWT_SECRET="my-32-character-ultra-secure-and-ultra-long-secret"
```
### Starting Postgres
Install and start the database by installing Docker and running the following command.
```
docker run --name postgres-490 -e POSTGRES_DB=fu_dev -e POSTGRES_PASSWORD=dev -e POSTGRES_USER=dev -p 5432:5432 postgres:alpine
```
To run the container at a later time, run:
```
docker container start postgres-490
```

Alternatively, install and start a PostgreSQL database manually.

### Updating Postgres
Run the following command to apply the latest database changes.
Make sure you have the Entity Framework tool installed.
```
dotnet tool install --global dotnet-ef --version 7.0.16
dotnet ef database update
```

### Connect to Postgres
Set the `CONNECTION_STRING` environment variable.
```
CONNECTION_STRING="Host=localhost; Database=fu_dev; Username=dev; Password=dev"
```

### SPA Environment Setup
Config settings are loaded from the environment variables. To automatically load the environment variable from a file, create a `.env` file in the `FU.SPA` parent folder.

Then set the `VITE_API_URL` environment variable
```
VITE_API_URL=https://localhost:PORT/api
```
where `PORT` is the port number the API is running on. If there are CORS errors, change the URL to match `http://` instead of `https://` and this may resolve the issue.

## Running
### Running Web API
```
cd FU.API/FU.API
dotnet run
```
Alternativly, start the web app  with the Visual studio IDE
### Running SPA
```
cd FU.SPA
npm install
npm run dev
```

# Coding styles
## FU.API
Follow Google's C# [style guide](https://google.github.io/styleguide/csharp-style.html)
## FU.SPA
Follow Prettier's HTML, CSS, JavaScript/JSX [style formatting](https://prettier.io/docs/en/)

# Deployment
Deployed to Azure using GitHub Actions.

# Testing
## Unit Tests
To run unit tests on the backend:
```
cd FU.API
dotnet test
```
Tests are located in `FU.API/FU.API.Tests`.
The tests are ran on every commit made.

## Behavioral Tests
To run behavioral tests on the frontend:
```
cd FU.SPA
npm run selenium-test
```
Alternativly, you can use:
```
selenium-side-runner tests/*.side -c browserName=firefox
```
This does the same as above but directly calls the CLI command. You can also change the browserName
option to chrome/chromium if you want to test that browser engine instead.

Tests are located in `FU.SPA/tests`.

# Authors
Aaron Keys - alkeys@email.sc.edu

Ethan Adams - epadams@email.sc.edu

Evan Scales - escales@email.sc.edu

Jackson Williams - JRW30@email.sc.edu

James Pretorius - pretorj@email.sc.edu
