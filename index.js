import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import userRouter from "./routes/auth.routes.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", userRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
