import express from "express";
import morgan from "morgan";
import cors from "cors"; // ✅ usa import, no require
import { createRoles } from "./libs/initialSetup";

import playersRoutes from "./routes/players.routes";
import salesRoutes from "./routes/sales.routes";
import authRoutes from "./routes/auth.routes";
import smsRoutes from "./routes/sms.routes";
import countPlayerRoutes from "./routes/countPlayersByDate.routes";
import dailyReportByDate from "./routes/dailyReportByDate";
import dailyReportByUser from "./routes/dailyUserReportByDate";
import pokerRoutes from "./routes/poker.routes";
import reportByPlayerAndDate from "./routes/reportByPlayerAndDate.routes";
import aforoController from "./routes/uniqueCount.routes";
import businessDay from "./routes/businessDay.routes";

const app = express();

createRoles();


app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

app.use(morgan("dev"));

// ✅ CORS CORRECTO (ANTES de tus rutas)
const allowedOrigins = [
  "http://localhost:8080",
  "https://juegoenvivodiamantecasino.com",
   "https://www.juegoenvivodiamantecasino.com" 
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
  })
);

// ✅ Responder TODOS los preflight (OPTIONS)
app.options("*", cors());

app.get("/", (req, res) => {
  res.json("Bienvenido a Diamante Mesas En Vivo");
});

// Rutas
app.use("/players", playersRoutes);
app.use("/sales", salesRoutes);
app.use("/auth", authRoutes);
app.use("/sendsms", smsRoutes);
app.use("/countplayers", countPlayerRoutes);
app.use("/dailyreport", dailyReportByDate);
app.use("/dailyreportusers", dailyReportByUser);
app.use("/poker", pokerRoutes);
app.use("/playeranddate", reportByPlayerAndDate);
app.use("/aforo", aforoController);
app.use("/businessDay", businessDay);

export default app;
