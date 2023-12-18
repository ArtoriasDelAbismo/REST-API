const express = require('express')
const crypto = require('node:crypto')
const cors = require('cors')

const app = express()
const movies = require('./movies.json')

const { validateMovie, validatePartialMovie } = require('./schemas/movies')
const PORT = process.env.PORT ?? 3000 // utilizar el puerto que destine por defecto el servicio de hosting, si no hay ninguno, utilizar puerto 3000

app.use(express.json())
app.disable('x-powered-by')

app.use(cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        'http://localhost:8080',
        'http://localhost:1234',
        'https://movies.com',
        'https://midu.dev'
      ]
  
      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true)
      }
  
      if (!origin) {
        return callback(null, true)
      }
  
      return callback(new Error('Not allowed by CORS'))
    }
  }))

app.get("/movies", (req, res) => {
  const { genre } = req.query;
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
    return res.json(filteredMovies);
  }
  res.json(movies);
});

app.get('/movies/:id', (req, res) => { //path-to-regexp
    const { id } = req.params
    const movie = movies.find(movie => movie.id === id)
    if (movie) return res.json(movie)

    res.status(404).json({ message: 'Movie not found' })
})

app.post('/movies', (req, res) => {

    const result = validateMovie(req.body)

    if (result.error) {
        return res.status(404).json({error: JSON.parse(result.error.message)})
    }

    // en base de datos
    const newMovie = {
        id: crypto.randomUUID(), // crea un uuid(unique universal identifier), funciona tambien en el navegador
        ...result.data // devuelve unicamente los datos validados, a diferencia de req.body que pueden inyectar lo que quieran
    }
    // Esto no es REST, porque estamos guardando el estado en memoria, deberiamos utilizar BD
    movies.push(newMovie)
    res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)
    
    if (movieIndex === -1) {
        return res.status(404).json({message: 'Movie not found'})
    }
    
    const result = validatePartialMovie(req.body)
    if (result.error) {
        return res.status(404).json({error: JSON.parse(result.error.message)})
    }
    

    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = updateMovie

    return res.json(updateMovie)
})

app.use((req, res) => {
    res.status(404).send('404 Movie not found')
})

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
})