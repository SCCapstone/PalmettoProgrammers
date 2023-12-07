# Forces Unite
The Forces Unite website is a platform designed to bring gamers together, form groups, and connect over their favorite gaming interests.
Read our [wiki](https://github.com/SCCapstone/PalmettoProgrammers/wiki/Project-Description)!

## External Requirements
In order to build this project you first have to install:
* [ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/introduction-to-aspnet-core?view=aspnetcore-7.0)
* [npm](https://www.npmjs.com/package/npm)
* [Docker](https://www.docker.com/get-started/)
* [PostgreSQL](https://www.postgresql.org/download/)
* [Entity Framework Core tools](https://learn.microsoft.com/en-us/ef/core/cli/)

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

### Setup Postgres
Run the following command to apply the latest database changes.
Make sure you have the Entity Framework tool installed.
```
dotnet tool install --global dotnet-ef
dotnet ef database update
```

### Connect to Postgres
Set the `CONNECTION_STRING` environment variable.
```
CONNECTION_STRING="Host=localhost; Database=ForcesUnite; Username=dev; Password=dev"
```

### SPA Environment Setup
Config settings are loaded from the environment variables. To automatically load the environment variable from a file, create a `.env` file in the `FU.SPA` parent folder.

Then set the `VITE_API_URL` environment variable
```
VITE_API_URL=https://localhost:7171/api
```

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
Not yet deployed. Will deploy to Azure using publish profile.

# Authors
Aaron Keys - alkeys@email.sc.edu

Ethan Adams - epadams@email.sc.edu

Evan Scales - escales@email.sc.edu

Jackson Williams - JRW30@email.sc.edu

James Pretorius - pretorj@email.sc.edu
