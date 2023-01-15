<div align="center">
  <h1 align="center">Inventory Management System</h1>
</div>

## Built With

-   [Next.js](https://nextjs.org/) - Frontend reactjs framework
-   [Nest.js](https://nestjs.com/) - Backend nodejs framework
-   [MongoDB](https://www.mongodb.com/) - NoSQL Database

## Prerequisites

-   [docker & docker compose](https://docs.docker.com/compose/) (optional) - makes setup a lot easier
-   [npm](https://nodejs.org/en/) - node package manager
-   [MongoDB v5](https://www.mongodb.com/try/download/community) - NoSQL Database, make sure to choose version 5 (ignore if docker and docker-compose is installed)

## Installation with docker

1. install development dependencies

```
  npm install
```

2. Install husky git hooks

```
  npx husky install
```

3. run the app with

```
  npm start
```

## Installation w/o docker

1. Check if mongodb is installed

```
  mongo --version
```

2. Start mongodb

```
  mongod
```

3. Open new terminal and install frontend dependencies

```
  cd frontend && npm i
```

4. Install husky git hooks

```
  npx husky install
```

5. Start frontend

```
  npm run dev
```

6. Open new terminal and install backend dependencies

```
  cd backend && npm i
```

7. Start backend

```
  npm run start:dev
```

## Connecting to Database with Compass

Using compass to connect wont work without a `directConnection` parameter

```
mongodb://localhost:27017/?directConnection=true
```

## Deployment

Pushing to the production branch triggers deployment:

-   Server is deployed [here](https://dashboard.render.com/web/srv-ccb9atkgqg461mcodu70) through [render.com](https://dashboard.render.com/web/srv-ccb9atkgqg461mcodu70)

-   Frontend is deployed [here](https://desktop-ims.vercel.app) through [vercel.com](https://vercel.com/tristanjeruta/desktop-ims)
