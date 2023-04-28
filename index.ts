import express from 'express'
const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser')
const reviewRouter = require('./routers/reviewRouter')
const usersRouter = require('./routers/usersRouter')
const commentsRouter = require('./routers/commentsRouter')
const PORT = process.env.PORT || 7542;
import dotenv from 'dotenv';
dotenv.config();


const corsOptions = {
    origin: (origin: any, callback: any) => {
        console.log("origin: ", origin);
        callback(null, true);
    },
    credentials: true,
    optionSuccessStatus: 200
}
const jsonBodyMiddleWare = express.json()

app.use(jsonBodyMiddleWare)
app.use(cors(corsOptions));
app.use(cookieParser('secret key'))
app.use('/review', reviewRouter);
app.use('/user', usersRouter);
app.use('/comment', commentsRouter);

app.get("/", (req, res) => {
    res.json({message: "hi from Express App"})
    return console.log('Connection closed')
})

app.listen(PORT, () => {
    console.log(`I started listening port: ${PORT}`)
})