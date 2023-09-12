// 01HS 12MIN
const express = require('express'); // REQUIERE --> COMON JS
const crypto = require('node:crypto');// Importar Para generar ID
const movies = require('./peliculas/movies.json');
const {validateMovie, validarPartial} = require('./schemas/movies.js');
const corss = require('corss'); // midleware qu soluciona los cors
// acepta cualquier origen 
const z = require('zod');

const app = express();
app.use(express.json());
app.use(corss()); //se puede paras opciones
app.disable('x-powered-by'); // DESABILITAR CABEZERA x-powered-by

const PORT = process.env.PORT ?? 1234; //process.env ||


app.get('/',(req,res)=>{
    res.send('<h1>Servidor inicializado</h1>')
});
app.get('/movies',(req,res)=>{
res.header('Access-Control-Allow-Origin','http://localhost:8080');
// Soluciona problemas de CORS como segundo parametro se puede poner * para todos los origenes//
    const {genre} = req.query;
    if(genre){
        // const filterdMovies = movies.filter(movie=>movie.genre.includes(genre));
        const filterdMovies = movies.filter(movie=>movie.genre.some(g=>g.toLocaleLowerCase()===genre.toLocaleLowerCase()));
        return res.json(filterdMovies);

    }
    res.json(movies);
});

app.get('/movies/:id',(req,res)=>{
    const {id} =req.params;
    const movie = movies.find(movie=>movie.id===id);
    if(movie) return res.json(movie);

    res.status(404).json({message:'Movie not found'});
});

app.post('/movies',(req,res)=>{
    const{ title,year,director,duration,poster,genre} = req.body;
    const result = validateMovie(req.body);
    if(result.error)return res.status(422).json({error:JSON.parse(result.error.message)})

    const newMovie = { // CON VALIDACION
      id: crypto.randomUUID(),
      ...result.data
    }
    // const newMovie = {  // SIN VALIDACION
    //     id:crypto.randomUUID(),// crea un UUID 
    //     title,
    //     year,
    //     director,
    //     duration,
    //     poster,
    //     genre
    // }
    // Esto no es REST, porque estamos guardando el estdo de la 
    // aplicacion en memoria
    movies.push(newMovie);
    res.status(201).json(newMovie); 

});

app.patch('/movies/:id',(req,res)=>{
    const {id} = req.params;
    const result = validarPartial(req.body);
    if(result.error)return res.status(400).json({error:JSON.parse(result.error.message)});

    const movieIndex =  movies.findIndex(movie=>movie.id===id);

    if(movieIndex === -1)return res.status(404).json({message:'Movie not found'});

    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }
    movies[movieIndex] = updateMovie;
    return res.json(updateMovie);

});

app.delete('/movies/:id',(req,res)=>{
    res.header('Access-Control-Allow-Origin','http://localhost:8080');
    const {id} = req.params;
    const movieIndex = movies.findIndex(movie=>movie.id === id);
    if(movieIndex === -1)return res.status(404).json({message:'Movie not found'})
    movies.splice(movieIndex, 1);
    return res.json({Message:'Movie deleted'});
});

app.options('/movies/:id',(req,res)=>{
    res.header('Access-Control-Allow-Origin','http://localhost:8080');
    res.header('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE');
    // determina que metoods pueden realizar acciones en el recurso 
    res.send();
})

app.listen(PORT,()=>{
    console.log(`servidor escuchando en: http://localhost:${PORT}`);
});