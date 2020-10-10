import { app } from './app'

let port = parseInt(process.env.PORT || "")
if (isNaN(port)) {
  port = 5000
}

app.listen(port, () => console.log(`Server has been started on the port ${port}`));