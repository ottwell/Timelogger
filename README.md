### TimeLogger Challenge

A POC application. API layer built using .NET Core3.1. Database simulated using Entity Framework core in-memory functionality. Unit tests implemented using XUNIT.
Frontend built using Create-React-App and Typescript. Limited styling and UI components built using fluent UI.
Unit tests written using Jest

### User stories implemented
1. Adding and editing time registrations to specific projects.
2. Displaying time registrations grouped by projects.
3. Displaying projects ordered by deadline date.

##### API Description
Api layer includes partial support of ODATA queries. Add and Patch are supported in relevant controllers, GET requests can include the following query action: 
- Select
- Expand
- Filter
- Orderby

## Endpoints
- GET `/odata/{EntityName}`. Returns all instances in the database.
- GET `/api/{EntityName}(Id)`. Returns the instance with the corresponding Id value.
- POST `/api/timeregistrations`. Validates and creates a new TimeRegistration entity.
- PATCH `/api/timeregistrations(Id)`. Validates and updates a TimeRegistration entity

##### Building
1. Clone or download the repository.
2. Run `dotnet build`.

##### Running locally
1. Clone or download the repository.
2. Run `cd server\TimeLogger.Api`
3. Run `dotnet run`.
4. The server is started and listening at http://localhost:3001.
5. Navigate to `\client`.
6. Run `npm run start`.
7. The application is running on http://localhost:3000.

##### Testing
1. Clone or download the repository.
2. Run `cd server\TimeLogger.Api`
3. Run `dotnet test` to test the API layer.
4. Navigate to `\client`.
5. Run `npm run test` to test the client app.

##### Known Issues
1. Styling is limited. To be blunt, the client app looks like dog shit. That is due to the fact that styling was not a part of the original challenge. 
2. All styling is written inline and without using style modules or any modern styling framework (SASS, LESS etc.).