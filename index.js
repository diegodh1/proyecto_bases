// requerimos los paquetes de node
var express = require('express');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
var router = express.Router();

//obtenemos las rutas 
const empleado_routes = require('./src/routes/empleado_routes');

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
app.post('/crear_empleado', empleado_routes.crear_empleado);

// corremos el servidor
app.listen(port, function () {
  console.log('CORS-enabled web server listening on port 3000')
})