import express, { json } from 'express'
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middleware/cors.js'

const app = express()
const PORT = process.env.PORT ?? 3000 // utilizar el puerto que destine por defecto el servicio de hosting, si no hay ninguno, utilizar puerto 3000


app.use(json())
app.disable('x-powered-by')

app.use(corsMiddleware())

app.use('/movies', moviesRouter)

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
})




