//configurar el servidor de express
const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');
//crear el servidor
const app = express();


//conectar a la base datos
conectarDB();
//habilitar cors
app.use(cors());
//habilitar express.json para leer datos
app.use(express.json({ extended: true }));

//puerto de la app
const port = process.env.PORT || 4000;

//importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));
//arrancamos el servidor

app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta corriendo en el puerto ${port}`);
})