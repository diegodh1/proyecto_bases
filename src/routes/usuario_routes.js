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
    let data = usuario_controller.servicio_verificar_saldo(servicio_nro, servicio_pedido_fecha, descripcion,
        servicio_horas, servicio_unidad_labor, es_por_hora, usuario_id);

    if (!Number(servicio_nro) || !Number(usuario_id) || !Number(servicio_horas) || !Number(servicio_unidad_labor)) {
        res.json({
            message: 'El id, el numero del servicio, las horas y la unidad labor deben ser datos númericos',
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

// metodo para poder consultar los ultimos servicios pedidos
exports.get_ultimos_servicios_pedidos = async(req, res) => {
    //obtenemos los campos de la solicitud
    usuario_id = req.body.usuario_id;
    estado_servicio_id = req.body.estado_servicio_id;
    limite = req.body.limite;

    usuario_controller = new Usuario_controller();
    let data = usuario_controller.get_ultimos_servicios_pedidos(usuario_id, estado_servicio_id, limite);

    if (!Number(usuario_id) || !Number(limite)) {
        res.json({
            message: 'El id del usuario y el límite deben ser numéricos',
            status: 400,
            servicios: []
        });
    } else {
        //resolvemos la promesa
        data.then(result => {
            res.json(result);
        }).catch(err => {
            res.json({
                message: err,
                status: 500,
                servicios: []
            });
        });
    }
};

// metodo para poder consultar los ultimos servicios aceptados por el usuario
exports.get_ultimos_servicios_aceptados = async(req, res) => {
    //obtenemos los campos de la solicitud
    usuario_id = req.body.usuario_id;
    estado_servicio_id = req.body.estado_servicio_id;
    limite = req.body.limite;

    usuario_controller = new Usuario_controller();
    let data = usuario_controller.get_ultimos_servicios_aceptados(usuario_id, estado_servicio_id, limite);

    if (!Number(usuario_id) || !Number(limite)) {
        res.json({
            message: 'El id del usuario y el límite deben ser numéricos',
            status: 400
        });
    } else {
        //resolvemos la promesa
        data.then(result => {
            res.json(result);
        }).catch(err => {
            res.json({
                message: err,
                status: 500,
                message: 'Error interno del servidor'
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
            message: 'El servicio y la calificacion deben ser datos númericos',
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

    usuario_controller = new Usuario_controller();
    let data = usuario_controller.servicio_pagar(servicio_pedido_id, pago_fecha);

    if (!Number(servicio_pedido_id)) {
        res.json({
            message: 'El id del servicio pedido debe ser dato númerico',
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

// metodo que permite consultar el saldo de un usuario
exports.dar_saldo_usuario = async(req, res) => {
    //obtenemos los campos de la solicitud
    usuario_id = req.body.usuario_id;

    usuario_controller = new Usuario_controller();
    let data = usuario_controller.dar_saldo_usuario(usuario_id);

    if (!Number(usuario_id)) {
        res.json({
            message: 'El id del usuario debe ser dato númerico',
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
// metodo que permite obtener los datos para graficar
exports.get_reporte_profesion = async(req, res) => {
    //obtenemos los campos de la solicitud
    usuario_id = req.body.usuario_id;

    usuario_controller = new Usuario_controller();
    let data = usuario_controller.get_reporte_profesion(usuario_id);

    if (!Number(usuario_id)) {
        res.json({status:400, char:{labels:[], datasets:[{data: [],backgroundColor:[],hoverBackgroundColor:[]}]}, message:'El id del usuario debe ser numerico'});
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
            message: 'El id del servicio pedido debe ser tipo numérico',
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