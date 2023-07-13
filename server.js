import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.DB_HOST)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000");
    });
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.log(error.massage);
    process.exit(1);
  });
