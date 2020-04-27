let usuario = require('../models/usuario');
let Usuario = usuario.Usuario;
const { pool } = require('../connection');

//CREAMOS LA CLASE CONTROLADORA DE Usuario LA CUAL ES LA QUE VA A COMUNICARSE DIRECTAMENTE CON LA BASE DE DATOS
class Usuario_controller {
    constructor() {

        }
        //METODO QUE PERMITE CREAR UN Usuario NUEVO EN LA BASE DE DATOS
    async crear_usuario(id, nombre, apellido, celular, correo, latitud, longitud, direccion, foto_base64, recibo_base64, contrasenha, estado_usuario) {
            try {
                //creamos el usuario
                usuario = new Usuario(id, nombre, apellido, celular, correo, latitud, longitud, direccion, foto_base64, recibo_base64, contrasenha, estado_usuario);
                //realizamos la consulta
                const sql = 'INSERT INTO usuario(usuario_id, usuario_nombre, usuario_apellido, usuario_celular, usuario_correo, usuario_latitud, usuario_longitud, usuario_direccion, usuario_foto_base64, usuario_recibo_base64, usuario_contrasenha, usuario_estado) ' +
                    'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING usuario_id, usuario_nombre, usuario_apellido';
                //obtenemos los valores para asignar
                const values = [usuario.get_usuario_id(),
                        usuario.get_usuario_nombre(),
                        usuario.get_usuario_apellido(),
                        usuario.get_usuario_celular(),
                        usuario.get_usuario_correo(),
                        usuario.get_usuario_latitud(),
                        usuario.get_usuario_longitud(),
                        usuario.get_usuario_direccion(),
                        usuario.foto_to_base64(),
                        usuario.recibo_to_base64(),
                        usuario.contrasenha_ecrypt(),
                        usuario.get_usuario_estado()
                    ]
                // realizamos la consulta
                let data = pool
                    .connect()
                    .then(client => {
                        return client
                            .query(sql, values)
                            .then(res => {
                                client.release();
                                console.log(res.rows[0]);
                                return { info_usuario: res.rows[0], status: 200, message: 'Usuario creado con éxito' };

                            })
                            .catch(err => {
                                client.release();
                                return { info_usuario: { cedula: '', nombre: '', apellido: '' }, status: 400, message: err.detail };
                            })
                    });
                // resolvemos la promesa
                let response = await data;
                if (response.status !== 200) {
                    return response;
                } else {
                    return response;
                }
            } catch (e) {
                return { info_usuario: { cedula: '', nombre: '', apellido: '' }, status: 500, message: 'error interno del servidor' };
            }
        }
    // este metodo nos permite loguear al usuario
    async usuario_login(id, contrasenha) {
        try {
            usuario = new Usuario(id, '', '', 1, '', 1, 1, '', '', '', contrasenha, true);
            //realizamos la consulta
            const sql = 'SELECT usuario_contrasenha FROM usuario WHERE usuario_id = $1';
            const values = [id]
            let data = pool
                .connect()
                .then(client => {
                    return client
                        .query(sql, values)
                        .then(res => {
                            client.release();
                            console.log(res.rows[0]);
                            return res.rows[0];

                        })
                        .catch(err => {
                            client.release();
                            return [];
                        })
                });
            //obetenmos la respuesta
            let response = await data;
            let contrasenha_decrypt = usuario.contrasenha_decrypt(response.usuario_contrasenha)
            if (contrasenha_decrypt !== contrasenha) {
                return {
                    status: 400,
                    message: "Contraña incorrecta o usuario no registrado en la base de datos",
                    id
                };
            } else {
                return {
                    status: 200,
                    message: "Ingreso realizado",
                    id
                };
            }
        } catch (e) {
            console.log(e);
            return {
                status: 500,
                message: "Error interno del servidor",
            };
        }
    }
}

//exportamos el modulo
exports.Usuario_controller = Usuario_controller;