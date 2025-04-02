import express from 'express';
import morgan from "morgan";
import { createRoles } from './libs/initialsetup';
import playersRoutes from "./routes/players.routes"
import salesRoutes from "./routes/sales.routes"
import authRoutes from "./routes/auth.routes"
import smsRoutes from "./routes/sms.routes"
import countPlayerRoutes from "./routes/countPlayersByDate.routes"
import dailyReportByDate from "./routes/dailyReportByDate"


const cors = require('cors');

const app = express()
createRoles()

app.use(morgan('dev'))
app.use(express.json());
app.use(cors()); 
app.get('/', (req, res) =>{
    res.json("Diamante Mesas En Vivo")
})

app.use('/players', playersRoutes)
app.use('/sales', salesRoutes)
app.use('/auth', authRoutes)
app.use('/sendsms', smsRoutes)
app.use('/countplayers', countPlayerRoutes)
app.use('/dailyreport', dailyReportByDate)
export default app  