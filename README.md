# Forces Unite
The Forces Unite website is a platform designed to bring gamers together, form groups, and connect over their favorite gaming interests.
Read our [wiki](https://github.com/SCCapstone/PalmettoProgrammers/wiki/Project-Description)!

## External Requirements
In order to build this project you first have to install:
* [ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/introduction-to-aspnet-core?view=aspnetcore-7.0)
* [npm](https://www.npmjs.com/package/npm)
* [Docker](https://www.docker.com/get-started/)
* [PostgreSQL](https://www.postgresql.org/download/)

## Environment Setup
### Starting Postgres
Install and start the DB by installing docker and running the following command.
```
docker run --name postgres-547 -e POSTGRES_DB=shop_dev -e POSTGRES_PASSWORD=dev -e POSTGRES_USER=dev -p 5432:5432 postgres:alpine
```

Alternativly, install and start a postgreSQL db manually.

### Setup Postgres
Run the following command to apply the latest db changes.
```
dotnet ef database update
```

### Connect to Postgres
Create a `.env` file that contains the connection string in the projects root directory. The format is as follows:
```
CONNECTION_STRING="Host=localhost; Database=ForcesUnite; Username=dev; Password=dev"
```

Alternativly, add the connection string to the environment vars.

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
npm run dev
```

# Deployment
Not yet deployed. Will deploy to Azure using publish profile

# Authors
Ethan Adams - epadams@email.sc.edu
Aaron Keys - alkeys@email.sc.edu
Evan Scales - escales@email.sc.edu
Jackson Williams - JRW30@email.sc.edu
James Pretorius - pretorj@email.sc.edu
