<div align="center">
  <h3 align="center">Inventory Management System</h3>
</div>

<hr>

### Built With

- [Next.js](https://nextjs.org/) - Frontend reactjs framework
- [Nest.js](https://nestjs.com/) - Backend nodejs framework
- [MongoDB](https://www.mongodb.com/) - NoSQL Database

### Prerequisites

- [docker & docker compose](https://docs.docker.com/compose/) (optional) - makes setup a lot easier
- [npm](https://nodejs.org/en/) - node package manager
- [MongoDB v5](https://www.mongodb.com/try/download/community) - NoSQL Database, make sure to choose version 5 (ignore if docker and docker-compose is installed)

### Installation with docker

1. install development dependencies
```
  npm install
```

2. run the app with

```
  npm start
```

### Installation w/o docker

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

4. Start frontend
```
  npm run dev
```

5. Open new terminal and install backend dependencies
```
  cd backend && npm i
```

6. Start backend
```
  npm run start:dev
```