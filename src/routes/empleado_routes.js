// obtenemos los controladores
let empleado = require('../controllers/empleado');
let Empleado_controller = empleado.Empleado_controller;

// metodo para poder crear un empleado en la base de datos
exports.crear_empleado = async(req, res) => {

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
    servicios = req.body.servicios;
    empleado_controller = new Empleado_controller();
    let data = empleado_controller.crear_empleado(cedula, nombre, apellido, celular, correo, latitud, longitud, direccion, cedula, cedula, true, contrasenha, servicios);

    if (!Number(cedula) || !Number(celular) || !Number(latitud) || !Number(longitud)) {
        res.json({
            message: 'La cédula, el celular, la latitud y longitud deben ser datos númericos',
            status: 400
        });
    } else {
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

// metodo para poder agregar servicios a un empleado
exports.agregar_servicios_empleado = async(req, res) => {

    //obtenemos los campos de la solicitud
    cedula = req.body.cedula;
    servicios = req.body.servicios;

    empleado_controller = new Empleado_controller();
    let data = empleado_controller.verificar_servicios(cedula, servicios);

    if (!Number(cedula)) {
        res.json({
            message: 'La cédula debe ser un dato númerico',
            status: 400
        });
    } else {
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


}

// metodo para poder loguearnos como empleados a la base de datos
exports.login_empleado = async(req, res) => {

    //obtenemos los campos de la solicitud
    cedula = req.body.cedula;
    contrasenha = req.body.contrasenha;
    empleado_controller = new Empleado_controller();
    let data = empleado_controller.empleado_login(cedula, contrasenha);

    if (!Number(cedula) || contrasenha === '') {
        res.json({
            message: 'La cédula debe ser tipo nnmérico y la contraseña no puede ser vacia',
            status: 400
        });
    } else {
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
}