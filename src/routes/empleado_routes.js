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
    const data = empleado_controller.crear_empleado(cedula, nombre, apellido, celular, correo, latitud, longitud, direccion, cedula, cedula, true, contrasenha, servicios);

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
    };
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

// metodo para poder loguearnos como empleados a la base de datos
exports.login_empleado = async(req, res) => {
        //obtenemos los campos de la solicitud
        cedula = req.body.cedula;
        contrasenha = req.body.contrasenha;

        empleado_controller = new Empleado_controller();
        const data = empleado_controller.empleado_login(cedula, contrasenha);

        if (!Number(cedula) || contrasenha === '') {
            res.json({
                message: 'La cédula debe ser tipo numérico y la contraseña no puede ser vacía',
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
    // metodo que permite dar los trabajadores mas cercanos de acuerdo a la posición del usuario y el servicio que ofrecen
exports.empleados_cercanos = async(req, res) => {
    //obtenemos los campos de la solicitud
    id_usuario = req.body.id_usuario;
    ocupacion_id = req.body.ocupacion_id;
    limite = req.body.limite;

    empleado_controller = new Empleado_controller();
    const data = empleado_controller.empleados_cercanos(id_usuario, ocupacion_id, limite);

    if (!Number(id_usuario)) {
        res.json({
            message: 'El id del usuario debe de ser de tipo numerico',
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

exports.restablecer_contrasenha = async(req, res) => {

    empleado_controller = new Empleado_controller();
    const data = empleado_controller.restablecer_contrasenha(cedula, contrasenha);

    data.then(result => {
        console.log(result)
        res.json(result);
    }).catch(err => {
        res.json({
            message: err,
            status: 500
        });
    });

}

exports.aceptar_servicio = async(req, res) => {

    servicio_pedido_id = req.body.servicio_pedido_id;
    servicio_aceptado_fecha = req.body.servicio_aceptado_fecha;

    empleado_controller = new Empleado_controller();
    const data = empleado_controller.aceptar_verificar_fecha(servicio_pedido_id, servicio_aceptado_fecha);


    if (!Number(servicio_pedido_id)) {
        res.json({
            message: 'El id del servicio pedido debe ser un numero',
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

//este metodo me permite obtener el reporte de un empleado
exports.empleado_reporte = async(req, res) => {

    trabajador_cedula = req.body.trabajador_cedula;

    empleado_controller = new Empleado_controller();
    const data = empleado_controller.reporte_empleado(trabajador_cedula);


    if (!Number(trabajador_cedula)) {
        res.json({
            message: 'La cedula debe ser de tipo numerico',
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

exports.servicio_update = (req, res) => {

    servicio_pedido_id = req.body.servicio_pedido_id;
    estado_servicio_id = req.body.estado_servicio_id;

    empleado_controller = new Empleado_controller();
    const data = empleado_controller.update_servicio(servicio_pedido_id, estado_servicio_id);

    if (!Number(servicio_pedido_id)) {
        res.json({
            message: 'El id del servicio pedido debe ser un numero',
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

exports.update_servicio_aceptado = (req, res) => {

    servicio_pedido_id = req.body.servicio_pedido_id;
    estado_servicio_id = req.body.estado_servicio_id;

    empleado_controller = new Empleado_controller();
    const data = empleado_controller.update_servicio_aceptado(servicio_pedido_id, estado_servicio_id);

    if (!Number(servicio_pedido_id)) {
        res.json({
            message: 'El id del servicio pedido debe ser un numero',
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

// metodo que permite obtener la informacion de un empleado
exports.empleado_informacion = async(req, res) => {

    //obtenemos los campos de la solicitud
    servicio_nro = req.body.servicio_nro;

    empleado_controller = new Empleado_controller();
    const data = empleado_controller.empleado_informacion(servicio_nro);

    if (!Number(servicio_nro)) {
        res.json({
            message: 'El servicio para dar la informacion debe ser numérico',
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

// metodo para poder consultar los ultimos servicios pedidos
exports.get_ultimos_servicios_pedidos = async(req, res) => {
    //obtenemos los campos de la solicitud
    usuario_id = req.body.usuario_id;
    estado_servicio_id = req.body.estado_servicio_id;
    limite = req.body.limite;

    empleado_controller = new Empleado_controller();
    let data = empleado_controller.get_servicios_pedidos_trabajdor(usuario_id, estado_servicio_id, limite);

    if (!Number(usuario_id) || !Number(limite)) {
        res.json({
            message: 'El id del usuario y el límite deben ser numéricos',
            status: 400,
            servicios:[]
        });
    } else {
        //resolvemos la promesa
        data.then(result => {
            res.json(result);
        }).catch(err => {
            res.json({
                message: err,
                status: 500,
                servicios:[]
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

    empleado_controller = new Empleado_controller();
    let data = empleado_controller.get__servicios_aceptados_trabajdor(usuario_id, estado_servicio_id, limite);

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
                message:'Error interno del servidor'
            });
        });
    }
};