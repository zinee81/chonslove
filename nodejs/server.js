// src/routes/server.js
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const solapiRoutes = require("./routes/solapiRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const accommodationRoutes = require("./routes/accommodationRoutes.js");
const reservationRoutes = require("./routes/reservationRoute.js");

const app = express();
const url = `mongodb+srv://choncance:tmakxmdnpqdoq5!@choncance.nr4zf.mongodb.net/mydb?retryWrites=true&w=majority&appName=choncance`;

// 몽구스 라이브러리를 이용하여 몽고DB 연결
mongoose.connect(url);

// 미들웨어 설정
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5175",
      "https://chonslove.netlify.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false, // preflight 요청 처리 방식 변경
    optionsSuccessStatus: 204, // OPTIONS 요청에 대한 성공 상태 코드
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("*.js", (req, res, next) => {
  res.setHeader("Content-Type", "application/javascript");
  next();
});

// 추가 CORS 헤더 설정
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  // 허용할 요청 헤더 설정
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
});

// Solapi 라우트
app.use("/alarm", solapiRoutes);

// User 라우트
app.use("/user", userRoutes);

// accommodation 라우트
app.use("/accommodations", accommodationRoutes);

// reservation 라우트
app.use("/reservations", reservationRoutes);

// 404 처리
// app.use((req, res) => {
//   res.status(404).json({ message: "Not Found" });
// });

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}, http://localhost:${PORT}`);
});
