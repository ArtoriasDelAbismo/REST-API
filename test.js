const express = require('express')
const app = express()
const PORT = process.env.PORT ?? 3001
const movies = require('./movies.json')
app.disable('x-powered-by')
app.use(express.json())

app.get('/movies', (req, res) => {
    const { genre } = req.body
    if (genre) {
        const filteredMovies = movies.filter(
            movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        
        )
        return res.json(filteredMovies)
    }
    res.json(movies)
})

app.get('/movies/:id', (req, res) => {
    const { id } = req.params
    const movie = movies.find(movie => movie.id === id)
    if (movie) return res.json(movie)

    res.status(404).json({message: 'Movie not found'})
})

app.post('/movies', (req, res) => {
    const 
})

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
})
