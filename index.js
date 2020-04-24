// requerimos los paquetes de node
var express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');

// obtenemos los controladores
let empleado = require('./src/controllers/empleado');
let Empleado_controller = empleado.Empleado_controller;

//inicializamos el servidor de express
const app = express()
const port = 3000;


// habilitamos subir archivos

// storage de las cedulas
let storage_cedulas = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/cedulas')
  },
  filename: function (req, file, cb) {
    cb(null, req.body.cedula)
  }
})
// storage de las fotos
let storage_fotos = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/fotos')
  },
  filename: function (req, file, cb) {
    cb(null, req.body.cedula)
  }
})

// asociamos los storage
let upload_cedulas = multer({ storage: storage_cedulas });
let upload_fotos = multer({ storage: storage_fotos });

//agregamos otros middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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


// este metodo me permite crear un empleado en la base de datos
app.post('/crear_empleado', async (req, res) => {

  //obtenemos los campos de la solicitud
  cedula = req.body.cedula;
  nombre = req.body.nombre;
  apellido = req.body.apellido;
  celular = req.body.celular;
  correo = req.body.correo;
  latitud = req.body.latitud;
  longitud = req.body.longitud;
  direccion = req.body.direccion;
  contrasenha = req.body.contrasenha;
  empleado_controller = new Empleado_controller();
  let data = empleado_controller.crear_empleado(cedula, nombre, apellido, celular, correo, latitud, longitud, direccion, cedula, cedula, true, contrasenha);
  
  //resolvemos la promesa
  data.then(result => {
    res.json(result);
  }).catch(err => {
    res.send(err);
  })

});

// corremos el servidor
app.listen(port, function () {
  console.log('CORS-enabled web server listening on port 3000')
})