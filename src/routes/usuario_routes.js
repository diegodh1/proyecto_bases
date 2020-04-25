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