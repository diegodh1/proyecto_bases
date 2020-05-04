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
const port = 4000;

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

// este metodo permite restablecer la contraseña de un empleado en la base de datos
app.post('/restablecer_contrasenha', empleado_routes.restablecer_contrasenha);
// este metodo me permite crear un empleado en la base de datos
app.post('/crear_empleado', empleado_routes.crear_empleado);
// metodo para loguear el empleado a la apliacion
app.post('/login_empleado', empleado_routes.login_empleado);
// metodo para dar los empleados mas cercanos a un usuario
app.post('/empleados_cercanos', empleado_routes.empleados_cercanos);
//metodo para aceptar un servicio pedido pedido
app.post('/aceptar_servicio', empleado_routes.aceptar_servicio);
//metodo para actualizar un servicio
app.post('/servicio_update', empleado_routes.servicio_update);
// este metodo me permite agregar servicios a un trabajador
app.post('/agregar_servicios_empleado', empleado_routes.agregar_servicios_empleado);
// este metodo me permite obtener toda la informacion de un empleado
app.post('/empleado_informacion', empleado_routes.empleado_informacion);
// este metodo me permite obtener el reporte de un empleado
app.post('/empleado_reporte', empleado_routes.empleado_reporte);
// metodo para loguear el usuario a la apliacion
app.post('/login_usuario', usuario_routes.login_usuario);
// este metodo me permite crear un usuario en la base de datos
app.post('/crear_usuario', usuario_routes.crear_usuario);
// este metodo nos permite crear el pedido de un servicio
app.post('/pedir_servicio', usuario_routes.pedir_servicio);
// este metodo nos permite crear el pago de un servicio
app.post('/pagar_servicio', usuario_routes.pagar_servicio);
// este metodo nos permite cambiar directamente el estado_servicio_id directamente a un servicio pedido
app.post('/modificar_estado_servicio', usuario_routes.modificar_estado_servicio);
// este metodo nos permite recargar la cuenta de un usuario
app.post('/cuenta_recargar', usuario_routes.cuenta_recargar);
// este metodo nos permite dar la puntuacion a un servicio
app.post('/puntuacion_dar', usuario_routes.puntuacion_dar);
// este metodo me permite filtrar la lista de ocupacion
app.post('/filtro_ocupacion', ocupacion_routes.filtro_ocupacion);



// corremos el servidor
app.listen(port, function() {
    console.log('CORS-enabled web server listening on port 4000');
})