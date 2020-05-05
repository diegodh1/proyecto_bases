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
                message: 'Error interno del servidor'
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
                message: 'Error interno del servidor'
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
                                message: 'Error al recargar la cuenta'
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
                id_usuario: '',
                status: 500,
                message: 'Error interno del servidor'
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
                                message: 'Error al asignar la calificacion'
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
                puntuacion: {},
                status: 500,
                message: 'Error interno del servidor'
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
                            return { pedido_id: { servicio_nro: '', usuario_id: '', estado_servicio_id: '' }, status: 400, message: 'Error al solicitar el servicio' };
                        })
                });

            // resolvemos la promesa
            let response = await data;
            if (response.status !== 200) {
                return response;
            }

            return response;

        } catch (e) {
            return { pedido_id: { servicio_nro: '', usuario_id: '', estado_servicio_id: '' }, status: 500, message: 'Error interno del servidor' };
        }
    }

    //METODO QUE PERMITE VERIFICAR el saldo del usuario respecto al costo del servicio
    async servicio_verificar_saldo(servicio_nro, servicio_pedido_fecha, descripcion, servicio_horas, servicio_unidad_labor, es_por_hora, id) {
        //creamos el usuario
        usuario = new Usuario(id, '', '', 1, '', 1, 1, '', '', '', 1, true);
        let saldo_respuesta = await this.obtener_saldo(usuario.get_usuario_id());
        if (saldo_respuesta.status !== 200) {
            return saldo_respuesta;
        } else {
            try {

                //realizamos la consulta
                const sql = "SELECT servicio_precio_hora, servicio_precio_unidad_labor FROM servicio WHERE servicio_nro = $1";
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
                                return { precios: res.rows[0], status: 200, message: "Precios encontrados" };

                            })
                            .catch(err => {
                                client.release();
                                return { precios: {}, status: 400, message: "Precios no encontrados" };
                            })
                    });

                // resolvemos la promesa
                let response = await data;
                if (response.status !== 200) {
                    return response;
                } else {
                    let saldo_string = saldo_respuesta.saldo_cuenta.cuenta_saldo;
                    let saldo = parseFloat(saldo_string);

                    if ((es_por_hora === 'true' && saldo < parseFloat(response.precios.servicio_precio_hora) * parseInt(servicio_horas)) ||
                        (es_por_hora === 'false' && saldo < parseFloat(response.precios.servicio_precio_unidad_labor) * parseInt(servicio_unidad_labor))) {
                        return { saldo_existente: saldo, status: 400, message: "No hay saldo suficiente para solicitar el servicio" };
                    } else {
                        return this.servicio_verificar_estado(servicio_nro, servicio_pedido_fecha,
                            descripcion, servicio_horas, servicio_unidad_labor, es_por_hora, id);
                    }
                }

            } catch (e) {
                return { saldo_existente: '', status: 500, message: 'Error interno del servidor' };
            }

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
            return { ocupacion_id: '', status: 500, message: 'Error interno del servidor' };
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
                    fecha: '',
                    status: 400,
                    message: 'No se puede solicitar otro pedido en horario de otro ya solicitado'
                };
            }

            return this.servicio_verificar_fecha_otros(servicio_nro, servicio_pedido_fecha,
                descripcion, servicio_horas, servicio_unidad_labor, es_por_hora, id);

        } catch (e) {
            return {
                fecha: '',
                status: 500,
                message: 'Error interno del servidor'
            };
        }
    }

    //METODO QUE PERMITE DAR EL LISTADO DE LOS ULTIMOS SERVICIOS PEDIDOS POR EL USUARIO
    async get_ultimos_servicios_pedidos(usuario_id, estado_servicio_id, limite){
        let sql = "SELECT sp.servicio_pedido_id, ser.servicio_precio_unidad_labor, ser.servicio_precio_hora, ser.trabajador_cedula,case sp.servicio_pedido_es_por_hora when true then sp.servicio_pedido_horas * ser.servicio_precio_hora else sp.servicio_pedido_unidad_labor * ser.servicio_precio_unidad_labor end as valor_servicio, "+
        "to_char(sp.servicio_pedido_fecha, 'YYYY-MM-DD HH:MM:SS') as fecha, sp.estado_servicio_id, sp.servicio_pedido_es_por_hora, sp.servicio_pedido_horas, sp.servicio_pedido_unidad_labor "+
        "FROM servicio_pedido as sp JOIN servicio as ser ON ser.servicio_nro = sp.servicio_nro "+
        "WHERE usuario_id = $1 AND estado_servicio_id = $2 ORDER BY servicio_pedido_fecha DESC  LIMIT $3";
        let values = [parseInt(usuario_id), estado_servicio_id, parseInt(limite)]
        try {
            // realizamos la consulta
            let data = pool
                .connect()
                .then(client => {
                    return client
                        .query(sql, values)
                        .then(res => {
                            client.release();
                            return {servicios: res.rows, status:200, message:'Operación realizada con éxito'};

                        })
                        .catch(err => {
                            client.release();
                            return {servicios: [], status:400, message:'Los parametros enviados no son correctos'};
                        })
                });
            let response = await data;
            return response;
        } catch (e) {
            return {servicios: [], status:500, message:'Error interno del servidor'};
        }
    }
    //METODO QUE PERMITE DAR EL LISTADO DE LOS ULTIMOS SERVICIOS ACEPTADOS POR EL USUARIO
    async get_ultimos_servicios_aceptados(usuario_id, estado_servicio_id, limite){
        let sql = "select sp.servicio_pedido_id, ser.servicio_precio_unidad_labor, ser.servicio_precio_hora, ser.trabajador_cedula, case sp.servicio_pedido_es_por_hora when true then sp.servicio_pedido_horas * ser.servicio_precio_hora else sp.servicio_pedido_unidad_labor * ser.servicio_precio_unidad_labor end as valor_servicio, "+
        "to_char(sa.servicio_aceptado_fecha, 'YYYY-MM-DD HH:MM:SS') as fecha, sa.estado_servicio_id, sp.servicio_pedido_es_por_hora, sp.servicio_pedido_horas, sp.servicio_pedido_unidad_labor from servicio_aceptado as sa join servicio_pedido as sp on sp.servicio_pedido_id = sa.servicio_pedido_id "+
        "join servicio as ser on ser.servicio_nro = sp.servicio_nro "+
        "where sp.usuario_id = $1 and sa.estado_servicio_id = $2 order by sa.servicio_aceptado_fecha desc limit $3";
        let values = [parseInt(usuario_id), estado_servicio_id, parseInt(limite)]
        try {
            // realizamos la consulta
            let data = pool
                .connect()
                .then(client => {
                    return client
                        .query(sql, values)
                        .then(res => {
                            client.release();
                            return {servicios: res.rows, status:200};

                        })
                        .catch(err => {
                            client.release();
                            return {servicios: [], status:400};
                        })
                });
            let response = await data;
            return response;
        } catch (e) {
            return {servicios: [], status:500};
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
                        fecha_otros: '',
                        status: 400,
                        message: 'No se puede solicitar porque en este horario el trabajador esta ocupado'
                    };
                }

                return this.servicio_pedir(servicio_nro, servicio_pedido_fecha,
                    descripcion, servicio_horas, servicio_unidad_labor, es_por_hora, id);

            } catch (e) {
                return {
                    fecha_otros: '',
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
                trabajador: {},
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

    //METODO QUE retorna el id del usuario que hizo un pedido
    async dar_usuario_servicio(servicio_pedido_id) {
        try {
            //realizamos la consulta
            const sql = 'SELECT usuario_id FROM servicio_pedido WHERE servicio_pedido_id = $1';
            //obtenemos los valores para asignar
            const values = [parseInt(servicio_pedido_id)]

            // realizamos la consulta
            let data = pool
                .connect()
                .then(client => {
                    return client
                        .query(sql, values)
                        .then(res => {
                            client.release();
                            return { id: res.rows[0], status: 200, message: "Usuario encontrado" };

                        })
                        .catch(err => {
                            client.release();
                            return { id: {}, status: 400, message: "Usuario no encontrado" };
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
                id: {},
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
                                return { ingo_pago: {}, status: 400, message: 'No se logro pagar el servicio' };
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
                return { info_pago: {}, status: 500, message: 'Error interno del servidor' };
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
                            return { servicio_id: servicio_pedido_id, estado_servicio_id: '', status: 400, message: 'No se logro actualizar el servicio' };
                        })
                });

            // resolvemos la promesa
            let response = await data;
            return response;

        } catch (e) {
            return { servicio_id: {}, status: 500, message: 'Error interno del servidor' };
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
                            return { servicio_id: servicio_pedido_id, estado_servicio_id: '', status: 400, message: 'No se logro actualizar el servicio' };
                        })
                });

            // resolvemos la promesa
            let response = await data;
            return response;

        } catch (e) {
            return { servicio_id: {}, status: 500, message: 'Error interno del servidor' };
        }
    }

    //METODO QUE PERMITE Actualizar un servicio_pedido
    async obtener_saldo(id) {
        try {

            //realizamos la consulta
            const sql = "SELECT cuenta_saldo FROM cuenta WHERE usuario_id = $1";
            //obtenemos los valores para asignar
            const values = [
                id
            ]

            // realizamos la consulta
            let data = pool
                .connect()
                .then(client => {
                    return client
                        .query(sql, values)
                        .then(res => {
                            client.release();
                            return { saldo_cuenta: res.rows[0], status: 200, message: 'Saldo encontrado' };

                        })
                        .catch(err => {
                            client.release();
                            return { saldo_cuenta: {}, status: 400, message: 'Saldo no encontrado' };
                        })
                });

            // resolvemos la promesa
            let response = await data;
            return response;

        } catch (e) {
            return { saldo_cuenta: {}, status: 500, message: 'Error interno del servidor' };
        }
    }


}


//exportamos el modulo
exports.Usuario_controller = Usuario_controller;