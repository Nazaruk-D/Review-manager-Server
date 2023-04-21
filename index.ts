import express from 'express'
const cors = require('cors')
const app = express()
const mysql = require('mysql')
const cookieParser = require('cookie-parser')
const reviewRouter = require('./routers/reviewRouter')
const usersRouter = require('./routers/usersRouter')
const commentsRouter = require('./routers/commentsRouter')
const PORT = process.env.PORT || 7542;

export const connection = mysql.createConnection({
    host: 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '41GD3HPHAnrWPsk.root',
    password: 'x7BnxU2qF6DxzuWn',
    database: 'reviewer',
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    }
});

connection.connect((err: any) => {
    if (err) {
        return console.log(JSON.stringify(err))
    } else {
        return console.log('Connection successful')
    }
})

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