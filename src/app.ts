import express from 'express'
import * as Sentry from "@sentry/node"
import * as Tracing from "@sentry/tracing"
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'

dotenv.config()

export const app: express.Application = express()

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

mongoose.connect(`${process.env.MONGO_URI}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(error => {
    console.log(process.env.MONGO_URI)
    console.log(error)
  })

Sentry.init({
  dsn: `${process.env.SENTRY_DSN}`,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],

  tracesSampleRate: 1.0,
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
})

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