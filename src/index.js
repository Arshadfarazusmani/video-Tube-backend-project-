// Initiate the server and connect to the database

import dotenv from 'dotenv';
dotenv.config(
   {
    path: '/.env'
   }
);
import { app } from './app.js';
import { DB_connect } from './db/db.js';

const PORT = process.env.PORT || 8080;

DB_connect().then(() => {

    app.get("/", (req, res) => {
        res.send("Arshad Faraz ");
    });


  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => { console.log("Database connection error",err); });