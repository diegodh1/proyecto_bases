var express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
// obtenemos los controladores
let empleado = require('./src/controllers/empleado');
let Empleado_controller = empleado.Empleado_controller;

//inicializamos el servidor de express
const app = express()
const port = 3000;


// habilitamos subir archivos
app.use(fileUpload({
  createParentPath: true
}));

//agregamos otros middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));


app.get('/saludo', function (req, res, next) {
  res.json({ msg: 'Hola Mundo!' })
});

// este metodo me permite crear un empleado en la base de datos
app.post('/crear_empleado', async (req, res) => {
  cedula = req.body.cedula;
  nombre = req.body.nombre;
  apellido = req.body.apellido;
  celular = req.body.celular;
  correo = req.body.correo;
  direccion = req.body.direccion;
  contrasenha = req.body.contrasenha;
  empleado_controller = new Empleado_controller();
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No se subieron los archivos necesarios'
      });
    } else {
      //obtenemos los archivos del trabajador
      let documento = req.files.documento;
      let foto = req.files.foto;

      //movemos los archivos a sus respectivas carpetas
      documento.mv('./uploads/cedulas/' + documento.name);
      foto.mv('./uploads/fotos/' + foto.name);
      let data = empleado_controller.crear_empleado(cedula, nombre, apellido, celular, correo, direccion, foto.name, documento.name, true, contrasenha);
      return res.send(data);

    }
  } catch (err) {
    return {empleado: {cedula: '', nombre:'', apellido:''}, status: 500, message: err};
  }
});

app.listen(port, function () {
  console.log('CORS-enabled web server listening on port 3000')
})
