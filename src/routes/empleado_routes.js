// obtenemos los controladores
let empleado = require('../controllers/empleado');
let Empleado_controller = empleado.Empleado_controller;

exports.crear_empleado = async (req, res) => {

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

    if (!Number(cedula) || !Number(celular) || !Number(latitud) || !Number(longitud)) {
        res.json({
            message: 'La cédula, el celular, la latitud y longitud deben ser datos númericos',
            status: 400
        });
    }
    else {
        //resolvemos la promesa
        data.then(result => {
            res.json(result);
        }).catch(err => {
            res.json({
                message: err,
                status: 500
            });
        });
    }
};