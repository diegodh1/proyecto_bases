// obtenemos los controladores
let usuario = require('../controllers/usuario');
let Usuario_controller = usuario.Usuario_controller;

// metodo para poder crear un usuario en la base de datos
exports.crear_usuario = async(req, res) => {
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

//metodo para poder pedir un servicio en la base de datos
exports.pedir_servicio = async(req, res) => {
    //obtenemos los campos de la solicitud
    usuario_id = req.body.usuario_id;
    servicio_nro = req.body.servicio_nro;
    servicio_pedido_fecha = req.body.servicio_pedido_fecha;
    descripcion = req.body.descripcion;
    servicio_horas = req.body.servicio_horas;
    servicio_unidad_labor = req.body.servicio_unidad_labor;
    es_por_hora = req.body.es_por_hora;

    usuario_controller = new Usuario_controller();
    let data = usuario_controller.servicio_verificar_estado(servicio_nro, servicio_pedido_fecha, descripcion,
        servicio_horas, servicio_unidad_labor, es_por_hora, usuario_id);

    if (!Number(servicio_horas) || !Number(servicio_unidad_labor)) {
        res.json({
            message: 'El id, el celular, la latitud y longitud deben ser datos númericos',
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

// metodo para poder recargar la cuenta de un usuario
exports.cuenta_recargar = async(req, res) => {
    //obtenemos los campos de la solicitud
    usuario_id = req.body.usuario_id;
    recarga = req.body.recarga;

    usuario_controller = new Usuario_controller();
    let data = usuario_controller.recargar_cuenta(usuario_id, recarga);

    if (!Number(usuario_id) || !Number(recarga)) {
        res.json({
            message: 'El id y la recarga deben ser datos númericos',
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

// metodo para poder dar la puntuacion a un servicio
exports.puntuacion_dar = async(req, res) => {
    //obtenemos los campos de la solicitud
    servicio_nro = req.body.servicio_nro;
    calificacion = req.body.calificacion;
    puntuacion_fecha = req.body.puntuacion_fecha;

    usuario_controller = new Usuario_controller();
    let data = usuario_controller.dar_puntuacion(servicio_nro, calificacion, puntuacion_fecha);

    if (!Number(servicio_nro) || !Number(calificacion)) {
        res.json({
            message: 'El id y la calificacion deben ser datos númericos',
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

// metodo para poder pagar un servicio
exports.pagar_servicio = async(req, res) => {
    //obtenemos los campos de la solicitud
    servicio_pedido_id = req.body.servicio_pedido_id;
    pago_fecha = req.body.pago_fecha;
    pago_valor = req.body.pago_valor;

    usuario_controller = new Usuario_controller();
    let data = usuario_controller.servicio_pagar(servicio_pedido_id, pago_fecha, pago_valor);

    if (!Number(servicio_pedido_id) || !Number(pago_valor)) {
        res.json({
            message: 'El id y el pago deben ser datos númericos',
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

// metodo para poder loguearnos como usuarios a la base de datos
exports.login_usuario = async(req, res) => {
    //obtenemos los campos de la solicitud
    id = req.body.id;
    contrasenha = req.body.contrasenha;
    usuario_controller = new Usuario_controller();
    let data = usuario_controller.usuario_login(id, contrasenha);

    if (!Number(id) || contrasenha === '') {
        res.json({
            message: 'El id debe ser tipo numérico y la contraseña no puede ser vacia',
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

// este metodo nos permite cambiar directamente el estado_servicio_id directamente a un servicio pedido
exports.modificar_estado_servicio = async(req, res) => {
    //obtenemos los campos de la solicitud
    servicio_pedido_id = req.body.servicio_pedido_id;
    estado_servicio = req.body.estado_servicio;

    usuario_controller = new Usuario_controller();
    let data = usuario_controller.servicio_update(servicio_pedido_id, estado_servicio);

    if (!Number(servicio_pedido_id)) {
        res.json({
            message: 'El id debe ser tipo numérico',
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