import express from 'express'
import connectToDatabase, {databaseLogger} from "./db/connect";
import userRoute from "./routes/user";
import dotenv from 'dotenv'
import courseRouter from "./routes/course";
import moduleRouter from "./routes/module";
import Logger from "./utils/logger";
import morganMiddleware from "./middlewares/morganMiddleware";
import {Error} from "mongoose";
import cors from "cors";
const {MongooseServerSelectionError} = Error

dotenv.config()

const PORT = process.env.PORT as string
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morganMiddleware)

connectToDatabase()
    .then(() => {
        Logger.debug('database connection is secured', { label: 'database connection' })
        app.listen(PORT,
            () => Logger.debug(`server is up and running @ http://localhost:${PORT}`, { label: 'server initiation' }))
    })
    .catch((e) => {
        if (e.name === MongooseServerSelectionError.name)
            databaseLogger(e.message + '-- Ensure that your mongodb server is running.', 'error')
        else databaseLogger(e.message, 'error')
        process.exit(1)
    })

app.get('/', (req, res) => {
    res.send('This is the base response for my e-learning application. WELCOME!!!').status(200)
})

app.use(userRoute)
app.use('/courses', courseRouter)
app.use('/modules', moduleRouter)
