// requerimos los paquetes de node
var express = require('express');
var cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
//obtenemos las rutas 
const empleado_routes = require('./src/routes/empleado_routes');
const usuario_routes = require('./src/routes/usuario_routes');
const ocupacion_routes = require('./src/routes/ocupacion_routes');

//inicializamos el servidor de express
const app = express()
const port = 3000;

//agregamos otros middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// habilitamos subir archivos

// storage de las cedulas
let storage_cedulas = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, 'uploads/cedulas')
        },
        filename: function(req, file, cb) {
            cb(null, req.body.cedula)
        }
    })
    // storage de las fotos
let storage_fotos = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/fotos')
    },
    filename: function(req, file, cb) {
        cb(null, req.body.cedula)
    }
})

// storage de los recibos
let storage_recibos = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/recibos')
    },
    filename: function(req, file, cb) {
        cb(null, req.body.cedula)
    }
})

// asociamos los storage
let upload_cedulas = multer({ storage: storage_cedulas });
let upload_fotos = multer({ storage: storage_fotos });
let upload_recibos = multer({ storage: storage_recibos })


// este metodo permite subir las cedulas al servidor
app.post('/upload_cedula', upload_cedulas.single('documento'), (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file)

});
// este metodo permite de subir las fotos de la persona al servidor
app.post('/upload_fotos', upload_fotos.single('foto'), (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file)

});
// este metodo permite de subir los recibos de la persona al servidor
app.post('/upload_recibos', upload_recibos.single('recibo'), (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)

    }
    res.send(file)
});


// este metodo me permite crear un empleado en la base de datos
app.post('/crear_empleado', empleado_routes.crear_empleado);
// metodo para loguear el empleado a la apliacion
app.post('/login_empleado', empleado_routes.login_empleado);
// este metodo me permite agregar servicios a un trabajador
app.post('/agregar_servicios_empleado', empleado_routes.agregar_servicios_empleado);
// metodo para loguear el usuario a la apliacion
app.post('/login_usuario', usuario_routes.login_usuario);
// este metodo me permite crear un usuario en la base de datos
app.post('/crear_usuario', usuario_routes.crear_usuario);
//// este metodo nos permite crear el pedido de un servicio
app.post('/pedir_servicio', usuario_routes.pedir_servicio);
// este metodo me permite filtrar la lista de ocupacion
app.post('/filtro_ocupacion', ocupacion_routes.filtro_ocupacion);



// corremos el servidor
app.listen(port, function() {
    console.log('CORS-enabled web server listening on port 3000')
})