export MONGO_CONNECTION_STRING='mongodb://desktop-ims-db-prd/ims'

npm install && \
npm run migrate-prd up && \
npm start