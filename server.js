const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// load env var
dotenv.config({path:'./config/config.env'});

connectDB();

const app = express();
const restaurants = require('./routes/restaurants');
const auth = require('./routes/auth');
const reservation = require('./routes/reservation');
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "*",
  credentials: true
}));

app.use('/api/v1/restaurants',restaurants)
app.use('/api/v1/auth',auth);
app.use('/api/v1/reservation',reservation);



const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(
    "Server running in",
    process.env.NODE_ENV,
    "on http://0.0.0.0:" + PORT
  );
});


const swaggerOptions={
  swaggerDefinition:{
    openapi: '3.0.0',
    info: {
    title: 'Library API',
    version: '1.0.0',
    description: 'Restaurant Booking API'
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1'
      }
    ],
  },
  apis:['./routes/*.js'],
};
const swaggerDocs=swaggerJsDoc(swaggerOptions);
app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
