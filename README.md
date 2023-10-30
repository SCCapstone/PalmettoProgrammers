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

## Environment Setup
### Starting Postgres
Install and start the DB by installing Docker and running the following command.
```
docker run --name postgres-490 -e POSTGRES_DB=fu_dev -e POSTGRES_PASSWORD=dev -e POSTGRES_USER=dev -p 5432:5432 postgres:alpine
```
To run the container at a later time, run:
```docker container start postgres-490```

Alternatively, install and start a PostgreSQL database manually.

### Setup Postgres
Run the following command to apply the latest db changes.
Make sure you have the Entity Framework tool installed.
```
dotnet tool install --global dotnet-ef
dotnet ef database update
```

### Connect to Postgres
Create a `.env` file that contains the connection string in the projects root directory. The format is as follows:
```
CONNECTION_STRING="Host=localhost; Database=ForcesUnite; Username=dev; Password=dev"
```

Alternatively, add the connection string to the environment vars.

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
Follow Google's JavaScript [style guide](https://google.github.io/styleguide/jsguide.html)
Follow Google's HTML/CSS [style guide](https://google.github.io/styleguide/htmlcssguide.html)
# Deployment
Not yet deployed. Will deploy to Azure using publish profile.

# Authors
Ethan Adams - epadams@email.sc.edu

Aaron Keys - alkeys@email.sc.edu

Evan Scales - escales@email.sc.edu

Jackson Williams - JRW30@email.sc.edu

James Pretorius - pretorj@email.sc.edu
