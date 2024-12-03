import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
//security packages
import helmet from "helmet";
import dbConnection from "./dbConfig/index.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import router from "./routes/index.js";
import requestTimer from "./middlewares/requestTimer.js";


const __dirname = path.resolve(path.dirname(""));

dotenv.config();

const app = express();

//request timer middleware
app.use(requestTimer);

app.use(express.static(path.join(__dirname, "client/build")));
app.use(express.static(path.join(__dirname, "views/build")));


const PORT = process.env.PORT || 8800;

dbConnection();

// to Enhance security by setting various HTTP headers
app.use(helmet());

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse incoming request bodies in JSON format
app.use(bodyParser.json());

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Built-in middleware to parse JSON bodies (replaces bodyParser.json())
// Limits JSON payloads to 10MB
app.use(express.json({ limit: "10mb" }));

// Built-in middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// HTTP request logger middleware for development
app.use(morgan("dev"));
app.use(router);

//error middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log("Server running on port: %s", PORT);
});