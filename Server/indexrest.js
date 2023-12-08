const express = require('express'); //se indica que se requiere express
const app = express(); // se inicia express y se instancia en una constante de nombre app.
const morgan = require('morgan'); //se indica que se requiere morgan
// settings
app.set('port', 3000); //se define el puerto en el cual va a funcionar el servidro
// Utilities
app.use(morgan('dev')); //se indica que se va a usar morgan en modo dev
app.use(express.json()); //se indica que se va a usar la funcionalidad para manejo de json de express
//Routes
const cors=require("cors");
const corsOptions ={
origin:'*',
credentials:true, //access-control-allow-credentials:true
optionSuccessStatus:200,
}
app.use(cors(corsOptions)) // Use this after the variable declaration
//app.use(require('./rutas/ejemplo.js'));
app.use(require('./datos.js'));
app.use(require('./usuarios.js'));
// app.use(require('./datosparcial.js'));
// app.use(require('./ocupacion/ocupacion.js'));
// app.use(require('./ocupacion/usuarios_ocupacion.js'));
// app.use(require('./agua/usuarios_agua.js'));
// app.use(require('./agua/datosagua.js'));
// app.use(require('./parqueadero/camara.js'));
// app.use(require('./parqueadero/laser.js'));
// app.use(require('./parqueadero/usuarios.js'));
// app.use(require('./jardin/datos_jardin.js'));
// app.use(require('./jardin/usuarios_jardin.js'));
//Start server

app.listen(app.get('port'), ()=> {
    console.log("Servidor funcionando");
    }); //se inicia el servidor en el puerto definido y se pone un mensaje en la consola.
    
