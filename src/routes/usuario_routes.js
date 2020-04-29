// obtenemos los controladores
let usuario = require('../controllers/usuario');
let Usuario_controller = usuario.Usuario_controller;

// metodo para poder crear un usuario en la base de datos
exports.crear_usuario = async (req, res) => {
    //obtenemos los campos de la solicitud
    id = req.body.id;
    nombre = req.body.nombre;
    apellido = req.body.apellido;
    celular = req.body.celular;
    correo = req.body.correo;
    latitud = req.body.latitud;
    longitud = req.body.longitud;
    direccion = req.body.direccion;
    contrasenha = req.body.contrasenha;

    usuario_controller = new Usuario_controller();
    let data = usuario_controller.crear_usuario(id, nombre, apellido, celular, correo, latitud, longitud, direccion, id, id, contrasenha, true);
    console.log(id);
    console.log(celular);
    console.log(latitud);
    console.log(longitud);
    if (!Number(id) || !Number(celular) || !Number(latitud) || !Number(longitud)) {
        res.json({
            message: 'El id, el celular, la latitud y longitud deben ser datos númericos',
            status: 400
        });
    }

    //resolvemos la promesa
    data.then(result => {
        res.json(result);
    }).catch(err => {
        res.json({
            message: err,
            status: 500
        });
    });
};

//metodo para poder pedir un servicio en la base de datos
exports.pedir_servicio = async (req, res) => {
    //obtenemos los campos de la solicitud
    usuario_id = req.body.usuario_id;
    servicio_nro = req.body.servicio_nro;
    estado_servicio_id = req.body.estado_servicio_id;
    servicio_pedido_fecha = req.body.servicio_pedido_fecha;
    descripcion = req.body.descripcion;
    servicio_horas = req.body.servicio_horas;
    servicio_unidad_labor = req.body.servicio_unidad_labor;
    es_por_hora = req.body.es_por_hora;

    usuario_controller = new Usuario_controller();
    let data = usuario_controller.servicio_verificar_estado(servicio_nro, servicio_pedido_fecha, descripcion,
        servicio_horas, servicio_unidad_labor, es_por_hora, usuario_id, estado_servicio_id);

    if (!Number(servicio_horas) || !Number(servicio_unidad_labor)) {
        res.json({
            message: 'El id, el celular, la latitud y longitud deben ser datos númericos',
            status: 400
        });
    }

    //resolvemos la promesa
    data.then(result => {
        res.json(result);
    }).catch(err => {
        res.json({
            message: err,
            status: 500
        });
    });
};

// metodo para poder loguearnos como usuarios a la base de datos
exports.login_usuario = async (req, res) => {
    //obtenemos los campos de la solicitud
    id = req.body.id;
    contrasenha = req.body.contrasenha;
<<<<<<< HEAD
    console.log(id);
    console.log(contrasenha);
=======

>>>>>>> 2d76d93414f48507cb93b3b97bfbc8bc749b9faa
    usuario_controller = new Usuario_controller();
    let data = usuario_controller.usuario_login(id, contrasenha);

    if (!Number(id) || contrasenha === '') {
        res.json({
            message: 'El id debe ser tipo numérico y la contraseña no puede ser vacia',
            status: 400
        });
    }

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