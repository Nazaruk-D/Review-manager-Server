const express = require('express')
const reviewRouter = require('./src/routers/reviewRouter')
const usersRouter = require('./src/routers/usersRouter')
const searchRouter = require('./src/routers/searchRouter')
const commentRouter = require('./src/routers/commentRouter')
const tagsRouter = require('./src/routers/tagsRouter')
const adminRouter = require('./src/routers/adminRouter')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv');

const PORT = process.env.PORT || 7542;
const app = express()
dotenv.config();

const corsOptions = {
    origin: (origin: string, callback: Function) => {
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
app.use('/search', searchRouter);
app.use('/comment', commentRouter);
app.use('/tags', tagsRouter);
app.use('/admin', adminRouter);

app.listen(PORT, () => {
    console.log(`I started listening port: ${PORT}`)
})