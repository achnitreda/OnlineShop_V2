import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import {authJwt} from "./helpers/jwt";
import {errorHandler} from "./helpers/errorHandler";
import path from "path";
import expressValidator from "express-validator";

const port: string | number = process.env.PORT || 8000;
const uri: string = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.dqn8fht.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const api: string | undefined = process.env.API_URL;

// middlewares
app.use(expressValidator());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("tiny"));
app.use(authJwt());
app.use('/public/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));
app.use(errorHandler);

// Routes
import productsRouter from "./routes/products";
import ordersRouter from "./routes/orders";
import usersRouter from "./routes/users";
import categoriesRouter from "./routes/categories";
app.use(`${api}/products`, productsRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/categories`, categoriesRouter);

// Database connection
mongoose.set('strictQuery', false);
mongoose
  .connect(uri)
  .then(() => {
    console.log("[MongoDB]: Connected");
  })
  .catch((err) => {
    console.log(err);
  });

// Server
app.listen(port, () => {
  console.log(`[Server]: I am running at http://localhost:${port}`);
  console.log(path.join(__dirname, '..', 'public', 'uploads'))
});
