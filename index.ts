import express from 'express'
const cors = require('cors')
const app = express()
const mysql = require('mysql')
const cookieParser = require('cookie-parser')
const authRouter = require('./authRouter')
const usersRouter = require('./usersRouter')
const PORT = process.env.PORT || 7542;

export const connection = mysql.createConnection({
    host: 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '2zh1Y7ciMFXLeFu.root',
    password: '0RZCH7aOEw8s9WfX',
    database: 'users_schema',
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
app.use('/auth', authRouter);
app.use('/users', usersRouter);


app.get("/", (req, res) => {
    res.json({message: "hi from Express App"})
    return console.log('Connection closed')
})


app.listen(PORT, () => {
    console.log(`I started listening port: ${PORT}`)
})
