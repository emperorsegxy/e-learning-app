import express from 'express'
import connectDB from "./db/connect";
import userRoute from "./routes/user";
import dotenv from 'dotenv'
import courseRouter from "./routes/course";
import moduleRouter from "./routes/module";

dotenv.config()

connectDB().catch(() => process.exit(1))
const PORT = process.env.PORT as string
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('We\'ve started listening, lol.').status(200)
})

app.use(userRoute)
app.use('/courses', courseRouter)
app.use('/modules', moduleRouter)

app.listen(PORT, () => console.log('app has started on ' + PORT))
