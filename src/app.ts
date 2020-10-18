import express, { Application } from 'express'
import passport from 'passport'
import mongoose from 'mongoose'
import compression from 'compression'
import morgan from 'morgan'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import * as Sentry from "@sentry/node"
import * as Tracing from "@sentry/tracing"

import { shouldCompress } from './middleware/compression'
import passportMiddleware from './middleware/passport'
import { authRouter } from './routers/auth'
import { todoItemRouter } from './routers/todoItem'

dotenv.config()

export const app: Application = express()

mongoose.connect(`${process.env.MONGO_URI}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(error => {
    Sentry.captureException(error)
  })

app.use(passport.initialize())
passportMiddleware(passport)

app.use(compression({
  filter: shouldCompress
}))

app.use(morgan('dev'))
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

app.use('/api/auth', authRouter)
app.use('/api', todoItemRouter)



Sentry.init({
  dsn: `${process.env.SENTRY_DSN}`,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],

  tracesSampleRate: 1.0,
});

// app.get("/debug-sentry", function mainHandler(req, res) {
//   throw new Error("My first Sentry error!");
// })

app.get("/", (req, res) => {
  res.send({msg: 'Hello', name: 'Vlad'})
})

// app.get('/', (req: express.Request, res: express.Response) => {
//   const animal = 'elephant'
//   res.send(animal.repeat(1000))
// })

app.use(Sentry.Handlers.errorHandler())

// app.use(
//   Sentry.Handlers.errorHandler({
//     shouldHandleError(error) {
//       // Capture all 404 and 500 errors
//       if (error.status === 404 || error.status === 500) {
//         return true;
//       }
//       return false;
//     },
//   })
// );