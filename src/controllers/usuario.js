let usuario = require('../models/usuario');
let Usuario = usuario.Usuario;
const { pool } = require('../connection');

//CREAMOS LA CLASE CONTROLADORA DE Usuario LA CUAL ES LA QUE VA A COMUNICARSE DIRECTAMENTE CON LA BASE DE DATOS
class Usuario_controller {
    constructor() {}

    //METODO QUE PERMITE CREAR UN Usuario NUEVO EN LA BASE DE DATOS
    async crear_usuario(id, nombre, apellido, celular, correo, latitud, longitud, direccion, foto_base64, recibo_base64, contrasenha, estado_usuario) {
        try {
            //creamos el usuario
            usuario = new Usuario(id, nombre, apellido, celular, correo, latitud, longitud, direccion, foto_base64, recibo_base64, contrasenha, estado_usuario);
            //realizamos la consulta
            const sql = "INSERT INTO usuario(usuario_id, usuario_nombre, usuario_apellido, usuario_celular, usuario_correo, usuario_latitud, usuario_longitud, usuario_direccion, usuario_point, usuario_foto_base64, usuario_recibo_base64, usuario_contrasenha, usuario_estado) " +
                "VALUES($1, $2, $3, $4, $5, $6, $7, $8, ST_GeomFromText($9, 4326), $10, $11, $12, $13) RETURNING usuario_id, usuario_nombre, usuario_apellido";
            //obtenemos los valores para asignar 
            const values = [
                usuario.get_usuario_id(),
                usuario.get_usuario_nombre(),
                usuario.get_usuario_apellido(),
                usuario.get_usuario_celular(),
                usuario.get_usuario_correo(),
                usuario.get_usuario_latitud(),
                usuario.get_usuario_longitud(),
                usuario.get_usuario_direccion(),
                'POINT(' + usuario.get_usuario_latitud() + ' ' + usuario.get_usuario_longitud() + ')',
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

                            return {
                                info_usuario: res.rows[0],
                                status: 200,
                                message: 'Usuario creado con éxito'
                            };
                        })
                        .catch(err => {
                            client.release();

                            return {
                                info_usuario: {
                                    cedula: '',
                                    nombre: '',
                                    apellido: ''
                                },
                                status: 400,
                                message: err.detail
                            };
                        })
                });

            // resolvemos la promesa
            let response = await data;
            if (response.status !== 200) {
                return response;
            }

            let cuenta = await this.crear_cuenta(usuario.get_usuario_id());

            if (cuenta.status !== 200) {
                return cuenta;
            }

            return response;
        } catch (e) {
            return {
                info_usuario: {
                    cedula: '',
                    nombre: '',
                    apellido: ''
                },
                status: 500,
                message: 'error interno del servidor'
            };
        }
    }

    //METODO QUE PERMITE CREAR LA Cuenta de un Usuario NUEVO EN LA BASE DE DATOS
    async crear_cuenta(id) {
        try {

            //realizamos la consulta
            const sql = "INSERT INTO cuenta(usuario_id, cuenta_saldo) " +
                "VALUES($1, $2) RETURNING usuario_id";
            //obtenemos los valores para asignar 
            const values = [
                id,
                0
            ]

            // realizamos la consulta
            let data = pool
                .connect()
                .then(client => {
                    return client
                        .query(sql, values)
                        .then(res => {
                            client.release();

                            return {
                                status: 200,
                                message: 'Cuenta creado con éxito'
                            };
                        })
                        .catch(err => {
                            client.release();

                            return {
                                status: 400,
                                message: err.detail
                            };
                        })
                });

            // resolvemos la promesa
            let response = await data;
            if (response.status !== 200) {
                return response;
            }

            return response;
        } catch (e) {
            return {
                status: 500,
                message: 'error interno del servidor'
            };
        }
    }

    //METODO QUE PERMITE recargar LA Cuenta de un Usuario EN LA BASE DE DATOS
    async recargar_cuenta(id, recarga) {
        try {

            //creamos el usuario
            usuario = new Usuario(id, "", "", 1, "", 1, 1, "", "", "", "", true);

            //realizamos la consulta
            const sql = "UPDATE cuenta SET cuenta_saldo = $1 + cuenta.cuenta_saldo WHERE usuario_id = $2 ";
            //obtenemos los valores para asignar 
            const values = [
                parseFloat(recarga),
                usuario.get_usuario_id()
            ]

            // realizamos la consulta
            let data = pool
                .connect()
                .then(client => {
                    return client
                        .query(sql, values)
                        .then(res => {
                            client.release();

                            return {
                                id_usuario: usuario.get_usuario_id(),
                                status: 200,
                                message: 'Cuenta recargada con éxito'
                            };
                        })
                        .catch(err => {
                            client.release();

                            return {
                                id_usuario: usuario.get_usuario_id(),
                                status: 400,
                                message: err.detail
                            };
                        })
                });

            // resolvemos la promesa
            let response = await data;
            if (response.status !== 200) {
                return response;
            }

            return response;
        } catch (e) {
            return {
                status: 500,
                message: 'error interno del servidor'
            };
        }
    }

    //METODO QUE PERMITE dar una puntuacion a un servicio
    async dar_puntuacion(servicio_nro, calificacion, puntuacion_fecha) {
        try {


            //realizamos la consulta
            const sql = "INSERT INTO puntuacion(servicio_nro, puntuacion_calificacion, puntuacion_fecha) " +
                "VALUES($1, $2, $3) RETURNING servicio_nro, puntuacion_calificacion";
            //obtenemos los valores para asignar 
            const values = [
                parseInt(servicio_nro),
                parseFloat(calificacion),
                puntuacion_fecha
            ]

            // realizamos la consulta
            let data = pool
                .connect()
                .then(client => {
                    return client
                        .query(sql, values)
                        .then(res => {
                            client.release();

                            return {
                                puntacion: { servicio: servicio_nro, puntos: calificacion },
                                status: 200,
                                message: 'Calificacion asignada correctamente'
                            };
                        })
                        .catch(err => {
                            client.release();

                            return {
                                puntuacion: {},
                                status: 400,
                                message: err.detail
                            };
                        })
                });

            // resolvemos la promesa
            let response = await data;
            if (response.status !== 200) {
                return response;
            }

            return response;
        } catch (e) {
            return {
                status: 500,
                message: 'error interno del servidor'
            };
        }
    }

    // este metodo nos permite loguear al usuario
    async usuario_login(id, contrasenha) {
        try {
            usuario = new Usuario(id, '', '', 1, '', 1, 1, '', '', '', contrasenha, true);
            //realizamos la consulta
            const sql = 'SELECT usuario_contrasenha FROM usuario WHERE usuario_id = $1';
            const values = [usuario.get_usuario_id()]
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
            if (response == undefined) {
                return {
                    status: 400,
                    message: "Contraña incorrecta o usuario no registrado en la base de datos",
                    id: id
                };
            }
            let contrasenha_decrypt = usuario.contrasenha_decrypt(response.usuario_contrasenha)
            if (contrasenha_decrypt !== contrasenha) {
                return {
                    status: 400,
                    message: "Contraña incorrecta o usuario no registrado en la base de datos",
                    id: id
                };
            }

            return {
                status: 200,
                message: "Ingreso realizado",
                id: id
            };
        } catch (e) {
            console.log(e);

            return {
                id: id,
                status: 500,
                message: "Error interno del servidor",
            };
        }
    }

    //METODO QUE PERMITE PEDIR un servicio en la base
    async servicio_pedir(servicio_nro, servicio_pedido_fecha, descripcion, servicio_horas, servicio_unidad_labor, es_por_hora, id) {
        try {
            //creamos el usuario
            usuario = new Usuario(id, '', '', 1, '', 1, 1, '', '', '', 1, true);
            //realizamos la consulta
            const sql = "INSERT INTO servicio_pedido(servicio_nro, servicio_pedido_fecha, servicio_pedido_descripcion, servicio_pedido_horas, servicio_pedido_unidad_labor, servicio_pedido_es_por_hora, usuario_id, estado_servicio_id)" +
                "VALUES($1, $2, $3, $4, $5, $6, $7, $8)";
            //obtenemos los valores para asignar
            const values = [
                parseInt(servicio_nro),
                servicio_pedido_fecha,
                descripcion,
                parseFloat(servicio_horas),
                parseFloat(servicio_unidad_labor),
                es_por_hora,
                usuario.get_usuario_id(),
                'PENDIENTE'
            ]

            // realizamos la consulta
            let data = pool
                .connect()
                .then(client => {
                    return client
                        .query(sql, values)
                        .then(res => {
                            client.release();
                            return { pedido_id: res.rows[1], status: 200, message: 'Servicio pedido con exito' };

                        })
                        .catch(err => {
                            client.release();
                            return { pedido_id: { servicio_nro: '', usuario_id: '', estado_servicio_id: '' }, status: 400, message: err.detail };
                        })
                });

            // resolvemos la promesa
            let response = await data;
            if (response.status !== 200) {
                return response;
            }

            return response;

        } catch (e) {
            return { pedido_id: { servicio_nro: '', usuario_id: '', estado_servicio_id: '' }, status: 500, message: 'error interno del servidor' };
        }
    }

    //METODO QUE PERMITE VERIFICAR un servicio en la base respecto a su estado y ocupacion solicitada
    async servicio_verificar_estado(servicio_nro, servicio_pedido_fecha, descripcion, servicio_horas, servicio_unidad_labor, es_por_hora, id) {
        try {
            //creamos el usuario
            usuario = new Usuario(id, '', '', 1, '', 1, 1, '', '', '', 1, true);
            //realizamos la consulta
            const sql = "SELECT ocupacion_id FROM servicio NATURAL JOIN " +
                "(SELECT servicio_nro FROM servicio_pedido WHERE " +
                "(estado_servicio_id = 'PENDIENTE' OR estado_servicio_id = 'ACEPTADO' OR estado_servicio_id = 'OCUPADO') AND usuario_id = $1) AS procesados";
            //obtenemos los valores para asignar
            const values = [usuario.get_usuario_id()]

            // realizamos la consulta
            let data = pool
                .connect()
                .then(client => {
                    return client
                        .query(sql, values)
                        .then(res => {
                            client.release();
                            return res.rows;

                        })
                        .catch(err => {
                            client.release();
                            return [];
                        })
                });

            // resolvemos la promesa
            let response = await data;
            if (response.length > 0) {
                let ocupacion_actual = await this.dar_ocupacion_servicio(servicio_nro);
                for (let i = 0; i < response.length; i++) {
                    if (ocupacion_actual === response[i].ocupacion_id) {
                        return {
                            ocupacion_id: '',
                            status: 400,
                            message: 'No se puede solicitar otro pedido de la misma ocupacion mientras este en proceso'
                        }
                    }
                }

                return this.servicio_verificar_fecha(servicio_nro, servicio_pedido_fecha,
                    descripcion, servicio_horas, servicio_unidad_labor, es_por_hora, id);
            }

            return this.servicio_verificar_fecha(servicio_nro, servicio_pedido_fecha,
                descripcion, servicio_horas, servicio_unidad_labor, es_por_hora, id);
        } catch (e) {
            return { ocupacion_id: '', status: 500, message: 'error interno del servidor' };
        }
    }

    //METODO QUE PERMITE VERIFICAR un servicio en la base respecto a su fecha solicitada
    async servicio_verificar_fecha(servicio_nro, servicio_pedido_fecha, descripcion, servicio_horas, servicio_unidad_labor, es_por_hora, id) {
        try {
            es_por_hora === 'true' ? es_por_hora = true : es_por_hora;
            es_por_hora === 'false' ? es_por_hora = false : es_por_hora;
            //realizamos la consulta
            const sql = "SELECT servicio_pedido_id FROM " +
                "(SELECT servicio_pedido_id, servicio_pedido_fecha, servicio_pedido_horas, servicio_pedido_unidad_labor, servicio_pedido_es_por_hora FROM servicio_pedido WHERE " +
                "(estado_servicio_id = 'PENDIENTE' OR estado_servicio_id = 'ACEPTADO' OR estado_servicio_id = 'OCUPADO') AND usuario_id = $1) AS procesados " +
                "WHERE (servicio_pedido_es_por_hora = false AND $2 AND (servicio_pedido_fecha > $3 AND servicio_pedido_fecha - $4 * INTERVAL '1 hour' < $5 )) OR " +
                "(servicio_pedido_es_por_hora = true AND $6 AND (servicio_pedido_fecha - $7 * INTERVAL '1 hour' < $8 AND $9 < servicio_pedido_fecha + servicio_pedido_horas * INTERVAL'1 hour')) OR " +
                "(servicio_pedido_es_por_hora = true AND $10 AND (servicio_pedido_fecha < $11 AND $12::timestamptz - servicio_pedido_horas * INTERVAL '1 hour' < servicio_pedido_fecha))";

            //obtenemos los valores para asignar
            const values = [
                usuario.get_usuario_id(),
                es_por_hora,
                servicio_pedido_fecha,
                parseInt(servicio_horas),
                servicio_pedido_fecha,
                es_por_hora,
                parseInt(servicio_horas),
                servicio_pedido_fecha,
                servicio_pedido_fecha, !es_por_hora,
                servicio_pedido_fecha,
                servicio_pedido_fecha
            ]

            // realizamos la consulta
            let data = pool
                .connect()
                .then(client => {
                    return client
                        .query(sql, values)
                        .then(res => {
                            client.release();
                            return res.rows;

                        })
                        .catch(err => {
                            client.release();
                            return [];
                        })
                });

            // resolvemos la promesa
            let response = await data;
            if (response.length > 0) {
                return {
                    ocupacion_id: '',
                    status: 400,
                    message: 'No se puede solicitar otro pedido en horario de otro ya solicitado'
                };
            }

            return this.servicio_verificar_fecha_otros(servicio_nro, servicio_pedido_fecha,
                descripcion, servicio_horas, servicio_unidad_labor, es_por_hora, id);

        } catch (e) {
            return {
                ocupacion_id: '',
                status: 500,
                message: 'Error interno del servidor'
            };
        }
    }


    //METODO QUE PERMITE VERIFICAR un servicio en la base respecto a su fecha solicitada
    async servicio_verificar_fecha_otros(servicio_nro, servicio_pedido_fecha, descripcion, servicio_horas, servicio_unidad_labor, es_por_hora, id) {

        let cedula_respuesta = await this.dar_ocupacion_servicio_cedula(servicio_nro);
        if (cedula_respuesta.status !== 200) {
            return cedula_respuesta;
        } else {

            try {

                let cedula = cedula_respuesta.trabajador.trabajador_cedula;
                //realizamos la consulta
                const sql = "SELECT servicio_pedido_id FROM " +
                    "(SELECT servicio_nro, trabajador_cedula FROM servicio WHERE trabajador_cedula = $1) AS procesado_final NATURAL JOIN " +
                    "(SELECT servicio_nro, servicio_pedido_id, servicio_pedido_fecha, servicio_pedido_horas, servicio_pedido_unidad_labor, servicio_pedido_es_por_hora FROM servicio_pedido WHERE " +
                    "estado_servicio_id = 'ACEPTADO' OR estado_servicio_id = 'OCUPADO') AS procesados " +
                    "WHERE (servicio_pedido_es_por_hora = false AND $2 AND (servicio_pedido_fecha > $3 AND servicio_pedido_fecha - $4 * INTERVAL '1 hour' < $5)) OR " +
                    "(servicio_pedido_es_por_hora = true AND $6 AND (servicio_pedido_fecha - $7 * INTERVAL '1 hour' < $8 AND $9 < servicio_pedido_fecha + servicio_pedido_horas * INTERVAL'1 hour')) OR " +
                    "(servicio_pedido_es_por_hora = true AND $10 AND (servicio_pedido_fecha < $11 AND $12::timestamptz - servicio_pedido_horas * INTERVAL '1 hour' < servicio_pedido_fecha))";

                //obtenemos los valores para asignar
                const values = [
                    parseInt(cedula),
                    es_por_hora,
                    servicio_pedido_fecha,
                    parseInt(servicio_horas),
                    servicio_pedido_fecha,
                    es_por_hora,
                    parseInt(servicio_horas),
                    servicio_pedido_fecha,
                    servicio_pedido_fecha, !es_por_hora,
                    servicio_pedido_fecha,
                    servicio_pedido_fecha
                ]

                // realizamos la consulta
                let data = pool
                    .connect()
                    .then(client => {
                        return client
                            .query(sql, values)
                            .then(res => {
                                client.release();
                                return res.rows;

                            })
                            .catch(err => {
                                client.release();
                                return [];
                            })
                    });

                // resolvemos la promesa
                let response = await data;
                if (response.length > 0) {
                    return {
                        ocupacion_id: '',
                        status: 400,
                        message: 'No se puede solicitar porque en este horario el trabajador esta ocupado'
                    };
                }

                return this.servicio_pedir(servicio_nro, servicio_pedido_fecha,
                    descripcion, servicio_horas, servicio_unidad_labor, es_por_hora, id);

            } catch (e) {
                return {
                    ocupacion_id: '',
                    status: 500,
                    message: 'Error interno del servidor'
                };
            }

        }

    }

    //METODO QUE retorna la cedula del trabajador de un servicio
    async dar_ocupacion_servicio_cedula(servicio_nro) {
        try {
            //realizamos la consulta
            const sql = 'SELECT trabajador_cedula FROM servicio WHERE servicio_nro = $1';
            //obtenemos los valores para asignar
            const values = [parseInt(servicio_nro)]

            // realizamos la consulta
            let data = pool
                .connect()
                .then(client => {
                    return client
                        .query(sql, values)
                        .then(res => {
                            client.release();
                            return { trabajador: res.rows[0], status: 200, message: 'Se encontro al trabajador para realizar el pedido' };
                        })
                        .catch(err => {
                            client.release();
                            return { trabajador: {}, status: 400, message: 'No se encontro al trabajador para realizar el pedido' };
                        })
                });

            // resolvemos la promesa
            let response = await data;
            if (response !== 200) {
                return response;
            }

            return response;
        } catch (e) {
            return {
                cedula: '',
                status: 500,
                message: 'Error interno del servidor'
            };
        }
    }

    //METODO QUE retorna la ocupacion_id de un servicio
    async dar_ocupacion_servicio(servicio_nro) {
        try {
            //realizamos la consulta
            const sql = 'SELECT ocupacion_id FROM servicio WHERE servicio_nro = $1';
            //obtenemos los valores para asignar
            const values = [parseInt(servicio_nro)]

            // realizamos la consulta
            let data = pool
                .connect()
                .then(client => {
                    return client
                        .query(sql, values)
                        .then(res => {
                            client.release();
                            return res.rows[0].ocupacion_id;

                        })
                        .catch(err => {
                            client.release();
                            return 'NO ENCONTRADO';
                        })
                });

            // resolvemos la promesa
            let response = await data;
            if (response === 'NO ENCONTRADO') {
                return 'NO ENCONTRADO';
            }

            return response;
        } catch (e) {
            return {
                ocupacion_id: '',
                status: 500,
                message: 'Error interno del servidor'
            };
        }
    }


    //METODO QUE PERMITE PAGAR un servicio en la base
    async servicio_pagar(servicio_pedido_id, pago_fecha, pago_valor) {

        let pagado = await this.servicio_update(servicio_pedido_id, 'FINALIZADO')
        let pagado_aceptado = await this.servicio_aceptado_update(servicio_pedido_id, 'FINALIZADO');
        if (pagado.status !== 200 || pagado_aceptado.status !== 200) {
            return pagado.message;
        } else {

            try {

                //realizamos la consulta
                const sql = "INSERT INTO pago(servicio_pedido_id, pago_fecha, pago_valor) " +
                    "VALUES($1, $2, $3) RETURNING servicio_pedido_id, pago_fecha, pago_valor";
                //obtenemos los valores para asignar
                const values = [
                    parseInt(servicio_pedido_id),
                    pago_fecha,
                    parseFloat(pago_valor)
                ]

                // realizamos la consulta
                let data = pool
                    .connect()
                    .then(client => {
                        return client
                            .query(sql, values)
                            .then(res => {
                                client.release();
                                return { ingo_pago: res.rows[0], status: 200, message: 'Pago realizado con exito' };

                            })
                            .catch(err => {
                                client.release();
                                return { ingo_pago: {}, status: 400, message: 'No se pudo pagar el servicio' };
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
                return { pedido_id: { servicio_nro: '', usuario_id: '', estado_servicio_id: '' }, status: 500, message: 'error interno del servidor' };
            }

        }

    }

    //METODO QUE PERMITE Actualizar un servicio_pedido
    async servicio_update(servicio_pedido_id, estado_servicio) {
        try {

            //realizamos la consulta
            const sql = "UPDATE servicio_pedido SET estado_servicio_id = $1 WHERE servicio_pedido_id = $2";
            //obtenemos los valores para asignar
            const values = [
                estado_servicio,
                parseInt(servicio_pedido_id)
            ]

            // realizamos la consulta
            let data = pool
                .connect()
                .then(client => {
                    return client
                        .query(sql, values)
                        .then(res => {
                            client.release();
                            return { servicio_id: servicio_pedido_id, estado_servicio_id: estado_servicio, status: 200, message: 'Servicio actualizado correctamente' };

                        })
                        .catch(err => {
                            client.release();
                            return { servicio_id: servicio_pedido_id, estado_servicio_id: '', status: 400, message: 'No se pudo actualizar el servicio' };
                        })
                });

            // resolvemos la promesa
            let response = await data;
            return response;

        } catch (e) {
            return { pedido_id: { servicio_nro: '', usuario_id: '', estado_servicio_id: '' }, status: 500, message: 'error interno del servidor' };
        }
    }

    //METODO QUE PERMITE Actualizar un servicio_pedido
    async servicio_aceptado_update(servicio_pedido_id, estado_servicio) {
        try {

            //realizamos la consulta
            const sql = "UPDATE servicio_aceptado SET estado_servicio_id = $1 WHERE servicio_pedido_id = $2";
            //obtenemos los valores para asignar
            const values = [
                estado_servicio,
                parseInt(servicio_pedido_id)
            ]

            // realizamos la consulta
            let data = pool
                .connect()
                .then(client => {
                    return client
                        .query(sql, values)
                        .then(res => {
                            client.release();
                            return { servicio_id: servicio_pedido_id, estado_servicio_id: estado_servicio, status: 200, message: 'Servicio actualizado correctamente' };

                        })
                        .catch(err => {
                            client.release();
                            return { servicio_id: servicio_pedido_id, estado_servicio_id: '', status: 400, message: 'No se pudo actualizar el servicio' };
                        })
                });

            // resolvemos la promesa
            let response = await data;
            return response;

        } catch (e) {
            return { pedido_id: { servicio_nro: '', usuario_id: '', estado_servicio_id: '' }, status: 500, message: 'error interno del servidor' };
        }
    }




}


//exportamos el modulo
exports.Usuario_controller = Usuario_controller;