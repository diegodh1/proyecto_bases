let empleado = require('../models/empleado');
let Empleado = empleado.Empleado;
const { pool } = require('../connection');

//CREAMOS LA CLASE CONTROLADORA DE EMPLEADO LA CUAL ES LA QUE VA A COMUNICARSE DIRECTAMENTE CON LA BASE DE DATOS
class Empleado_controller {
    constructor() {

    }

    //METODO QUE PERMITE CREAR UN EMPLEADO NUEVO EN LA BASE DE DATOS
    async crear_empleado(cedula, nombre, apellido, celular, correo, latitud, longitud, direccion, foto_base64, doc_base64, estado_trabajador, contrasenha, servicios) {
        try {
            //creamos el empleado
            empleado = new Empleado(cedula, nombre, apellido, celular, correo, latitud, longitud, direccion, foto_base64, doc_base64, estado_trabajador, contrasenha, servicios);
            //realizamos la consulta
            const sql = "INSERT INTO trabajador(trabajador_cedula, trabajador_nombre, trabajador_apellido, trabajador_celular, trabajador_correo, trabajador_latitud, trabajador_longitud, trabajador_direccion, trabajador_point, trabajador_foto_base64, trabajador_doc_base64, trabajador_estado, trabajador_contrasenha) " +
                "VALUES($1, $2, $3, $4, $5, $6, $7, $8, ST_GeomFromText($9, 4326), $10, $11, $12, $13) RETURNING trabajador_cedula, trabajador_nombre, trabajador_apellido";
            //obtenemos los valores para asignar
            const values = [empleado.get_trabajador_cedula(),
                empleado.get_trabajador_nombre(),
                empleado.get_trabajador_apellido(),
                empleado.get_trabajador_celular(),
                empleado.get_trabajador_correo(),
                empleado.get_trabajador_latitud(),
                empleado.get_trabajador_longitud(),
                empleado.get_trabajador_direccion(),
                'POINT(' + empleado.get_trabajador_latitud() + ' ' + empleado.get_trabajador_longitud() + ')',
                empleado.foto_to_path(),
                empleado.doc_to_path(),
                empleado.get_trabajador_estado(),
                empleado.contrasenha_ecrypt()
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
                                info_empleado: res.rows[0],
                                status: 200,
                                message: 'Empleado creado con éxito',
                                servicios: []
                            };
                        })
                        .catch(err => {
                            client.release();

                            return {
                                info_empleado: {
                                    cedula: '',
                                    nombre: '',
                                    apellido: ''
                                },
                                status: 400,
                                message: err.detail,
                                servicios: []
                            };
                        })
                });

            // resolvemos la promesa
            let response = await data;
            if (response.status !== 200) {
                return response;
            }

            response.servicios = await this.agregar_servicios(empleado.get_trabajador_cedula(), empleado.get_servicios());

            return response;
        } catch (e) {
            return { info_empleado: { cedula: '', nombre: '', apellido: '' }, status: 500, message: 'error interno del servidor' };
        }
    }

    // este metodo nos permite agregar los servicios que están asociados al empleado
    async agregar_servicios(trabajador_cedula, servicios) {
        //realizamos la consulta
        const sql = 'INSERT INTO servicio(trabajador_cedula, ocupacion_id, servicio_precio_hora, servicio_precio_unidad_labor, servicio_estado, servicio_descripcion) ' +
            'VALUES($1, $2, $3, $4, $5, $6) RETURNING trabajador_cedula, ocupacion_id, servicio_precio_hora, servicio_precio_unidad_labor';
        let list_servicios = [];
        //convertimos el strin a JSON
        let array_servicios = JSON.parse(servicios);
        //recorremos el array_servicios para agregar el servicio uno por uno
        for (let i = 0; i < array_servicios.length; i++) {
            const values = [
                trabajador_cedula,
                array_servicios[i].ocupacion_id,
                parseFloat(array_servicios[i].servicio_precio_hora),
                parseFloat(array_servicios[i].servicio_precio_unidad_labor),
                true,
                array_servicios[i].servicio_descripcion
            ];

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
            list_servicios.push(response);
        }

        //eliminamos en caso de duplicados
        return [...new Set(list_servicios)];
    }

    async empleado_login(cedula, contrasenha) {
        try {
            empleado = new Empleado(cedula, '', '', 1, '', 1, 1, '', '', '', true, contrasenha, '');
            //realizamos la consulta
            const sql = 'SELECT trabajador_contrasenha FROM trabajador WHERE trabajador_cedula = $1';
            const values = [empleado.get_trabajador_cedula()]
            console.log(empleado.get_trabajador_cedula());

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
                        })
                });

            //obetenmos la respuesta
            let response = await data;
            if (response == undefined) {
                return {
                    status: 400,
                    message: "Contraña incorrecta o usuario no registrado en la base de datos",
                    cedula: 0
                };
            }

            let contrasenha_decrypt = empleado.contrasenha_decrypt(response.trabajador_contrasenha);
            console.log(contrasenha_decrypt);
            if (contrasenha_decrypt !== contrasenha) {
                return {
                    status: 400,
                    message: "Contraña incorrecta o usuario no registrado en la base de datos",
                    cedula: 0
                };
            }

            return {
                status: 200,
                message: "Ingreso realizado",
                cedula
            };
        } catch (e) {
            console.log(e);
            return {
                status: 500,
                message: "Error interno del servidor",
                cedula: 0
            };
        }
    }

    async restablecer_contrasenha(cedula, contrasenha) {
        try {
            empleado = new Empleado(cedula, '', '', 1, '', 1, 1, '', '', '', true, contrasenha, '');

            //realizamos la consulta
            const sql = 'UPDATE trabajador SET trabajador_contrasenha = $1 WHERE trabajador_cedula = $2';
            const values = [empleado.contrasenha_ecrypt(), empleado.get_trabajador_cedula()]

            let data = pool
                .connect()
                .then(client => {
                    return client
                        .query(sql, values)
                        .then(res => {
                            client.release();

                            return {
                                status: 200,
                                message: 'contraseña restablecida con éxito'
                            };
                        })
                        .catch(err => {
                            client.release();

                            return {
                                status: 400,
                                message: 'Error al restablecer la contraseña'
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
                message: "Error interno del servidor"
            }
        }
    }

    //METODO QUE PERMITE CREAR un servicio aceptado en la base de datos
    async servicio_aceptar(servicio_pedido_id, servicio_aceptado_fecha) {

        let actualizado = await this.update_servicio(servicio_pedido_id, 'ACEPTADO');
        if (actualizado.status !== 200) {

            return actualizado.message;

        } else {

            try {

                let estado_actualizado = actualizado.estado_servicio;
                //realizamos la consulta
                const sql = "INSERT INTO servicio_aceptado(servicio_pedido_id, servicio_aceptado_fecha, estado_servicio_id) " +
                    "VALUES($1, $2, $3) RETURNING servicio_pedido_id, servicio_aceptado_fecha, estado_servicio_id";
                //obtenemos los valores para asignar
                const values = [parseInt(servicio_pedido_id),
                        servicio_aceptado_fecha,
                        estado_actualizado
                    ]
                    // realizamos la consulta
                let data = pool
                    .connect()
                    .then(client => {
                        return client
                            .query(sql, values)
                            .then(res => {
                                client.release();
                                return { servicio_pedido_id: res.rows[0], status: 200, message: 'Servicio aceptado correctamente' };

                            })
                            .catch(err => {
                                client.release();
                                return { servicio_pedido_id: {}, status: 400, message: 'No se logro aceptar el servicio' };
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
                return { servicio_pedido_id: {}, status: 500, message: 'error interno del servidor' };
            }

        }

    }

    //METODO QUE PERMITE VERIFICAR el aceptar un servicio respecto a su fecha para realizar
    async aceptar_verificar_fecha(servicio_pedido_id, servicio_aceptado_fecha) {
        let fecha_aceptar = await this.dar_fecha_servicio(servicio_pedido_id);
        let cedula_aceptar = await this.dar_ocupacion_servicio_cedula(servicio_pedido_id);
        if (fecha_aceptar.status !== 200 || cedula_aceptar.status !== 200) {
            return fecha_aceptar;
        } else {

            try {
                let es_por_hora = fecha_aceptar.info.servicio_pedido_es_por_hora;
                let servicio_horas = fecha_aceptar.info.servicio_pedido_horas;
                let fecha = fecha_aceptar.info.servicio_pedido_fecha;
                let cedula = cedula_aceptar.info.trabajador_cedula;
                es_por_hora === 'true' ? es_por_hora = true : es_por_hora;
                es_por_hora === 'false' ? es_por_hora = false : es_por_hora;
                //realizamos la consulta
                const sql = "SELECT servicio_pedido_id FROM " +
                    "(SELECT servicio_nro, servicio_pedido_id, servicio_pedido_fecha, servicio_pedido_horas, servicio_pedido_unidad_labor, servicio_pedido_es_por_hora FROM servicio_pedido WHERE " +
                    "estado_servicio_id = 'ACEPTADO' OR estado_servicio_id = 'OCUPADO') AS procesados NATURAL JOIN " +
                    "(SELECT servicio_nro, trabajador_cedula FROM servicio WHERE trabajador_cedula = $1 ) AS procesado_cedula " +
                    "WHERE (servicio_pedido_es_por_hora = false AND $2 AND (servicio_pedido_fecha > $3 AND servicio_pedido_fecha - $4 * INTERVAL '1 hour' < $5 )) OR " +
                    "(servicio_pedido_es_por_hora = true AND $6 AND (servicio_pedido_fecha - $7 * INTERVAL '1 hour' < $8 AND $9 < servicio_pedido_fecha + servicio_pedido_horas * INTERVAL '1 hour')) OR " +
                    "(servicio_pedido_es_por_hora = true AND $10 AND (servicio_pedido_fecha < $11 AND $12::timestamptz - servicio_pedido_horas * INTERVAL '1 hour' < servicio_pedido_fecha))";

                //obtenemos los valores para asignar // 2:50 < 3:10 + 4 horas 
                const values = [
                    parseInt(cedula),
                    es_por_hora,
                    fecha + '',
                    parseInt(servicio_horas),
                    fecha + '',
                    es_por_hora,
                    parseInt(servicio_horas),
                    fecha + '',
                    fecha + '', !es_por_hora,
                    fecha + '',
                    fecha + ''
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
                        message: 'No se puede aceptar otro pedido en un horario ocupado'
                    };
                }

                return this.servicio_aceptar(servicio_pedido_id, servicio_aceptado_fecha);

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
    async dar_ocupacion_servicio_cedula(servicio_pedido_id) {
        try {
            //realizamos la consulta
            const sql = "SELECT trabajador_cedula FROM servicio NATURAL JOIN " +
                "(SELECT servicio_nro FROM servicio_pedido WHERE servicio_pedido_id = $1) AS procesado";
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
                            return { info: res.rows[0], status: 200, message: "Se encontro al trabajador del servicio" };

                        })
                        .catch(err => {
                            client.release();
                            return { info: {}, status: 400, message: "No se encontro al trabajador del servicio" };
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
                cedula: '',
                status: 500,
                message: 'Error interno del servidor'
            };
        }
    }

    //METODO QUE retorna la fecha del servicio que solicitaron
    async dar_fecha_servicio(servicio_pedido_id) {
        try {
            //realizamos la consulta
            const sql = "SELECT servicio_pedido_fecha::VARCHAR, servicio_pedido_horas, servicio_pedido_es_por_hora FROM servicio_pedido WHERE servicio_pedido_id = $1 ";
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
                            return { info: res.rows[0], status: 200, message: "Se encontro la fecha del trabajo a aceptar" };

                        })
                        .catch(err => {
                            client.release();
                            return { info: {}, status: 400, message: "No se encontro la fecha del trabajo a aceptar" };
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
                info: {},
                status: 500,
                message: 'Error interno del servidor'
            };
        }
    }

    //METODO QUE el reporte de los servicios que presto un empleado
    async reporte_empleado(trabajador_cedula) {
        try {
            //realizamos la consulta
            const sql = "SELECT date_part('week', servicio_pedido_fecha::date) AS semana, ocupacion_id, COUNT(servicio_nro) AS cantidad  FROM servicio_aceptado NATURAL JOIN " +
                "(SELECT * FROM (SELECT servicio_nro, ocupacion_id FROM servicio WHERE trabajador_cedula = $1) AS servicios NATURAL JOIN " +
                "(SELECT servicio_nro, servicio_pedido_id, servicio_pedido_fecha FROM servicio_pedido WHERE CURRENT_TIMESTAMP - 1 * INTERVAL '1 month' <= servicio_pedido_fecha AND servicio_pedido_fecha <= CURRENT_TIMESTAMP) AS pedidos) AS hechos " +
                "WHERE estado_servicio_id = 'FINALIZADO' " +
                "GROUP BY semana, ocupacion_id " +
                "ORDER BY semana";
            //obtenemos los valores para asignar
            const values = [parseInt(trabajador_cedula)]

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
                            return {};
                        })
                });

            // resolvemos la promesa
            let response = await data;
            let response_final = [];
            if (response.length == 0) {
                return {
                    reporte: '',
                    status: 400,
                    message: 'Reporte no encontrado'
                };
            } else {

                let semana_actual = 1;
                let numero_semana = response[0].semana;
                for (let i = 0; i < response.length; i++) {

                    if (parseInt(numero_semana) !== parseInt(response[i].semana)) {
                        semana_actual = semana_actual + (parseInt(response[i].semana) - parseInt(numero_semana));
                        numero_semana = response[i].semana;
                    }
                    response_final.push({ semana: semana_actual, servicio: response[i].ocupacion_id, frecuencia: response[i].cantidad });
                }

                return { reporte: response_final, status: 200 };
            }

        } catch (e) {
            return {
                reporte: '',
                status: 500,
                message: 'Error interno del servidor'
            };
        }
    }


    //METODO QUE ACTUALIZAR EL ESTADO_SERVICIO_ID 
    async update_servicio(servicio_pedido_id, estado_servicio_id) {
        try {

            //realizamos la consulta
            const sql = 'UPDATE servicio_pedido ' +
                'SET estado_servicio_id = $1 WHERE servicio_pedido_id = $2';
            //obtenemos los valores para asignar
            const values = [estado_servicio_id,
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
                            return { servicio_id: servicio_pedido_id, estado_servicio: estado_servicio_id, status: 200, message: 'Servicio actualizado correctamente' };

                        })
                        .catch(err => {
                            client.release();
                            return { servicio_id: servicio_pedido_id, estado_servicio: '', status: 400, message: 'No se pudo actualizar el servicio' };
                        })
                });
            // resolvemos la promesa
            let response = await data;
            return response;

        } catch (e) {
            return { servicio_id: {}, estado_servicio: '', status: 500, message: 'Error interno del servidor' };
        }
    }
    //METODO QUE ACTUALIZAR EL ESTADO_SERVICIO_ID 
    async update_servicio_aceptado(servicio_pedido_id, estado_servicio_id) {
        try {

            //realizamos la consulta
            const sql = 'UPDATE servicio_aceptado ' +
                'SET estado_servicio_id = $1 WHERE servicio_pedido_id = $2';
            //obtenemos los valores para asignar
            const values = [estado_servicio_id,
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
                            return { servicio_id: servicio_pedido_id, estado_servicio: estado_servicio_id, status: 200, message: 'Servicio actualizado correctamente' };

                        })
                        .catch(err => {
                            client.release();
                            return { servicio_id: servicio_pedido_id, estado_servicio: '', status: 400, message: 'No se pudo actualizar el servicio' };
                        })
                });
            // resolvemos la promesa
            let response = await data;
            return response;

        } catch (e) {
            return { servicio_id: {}, estado_servicio: '', status: 500, message: 'Error interno del servidor' };
        }
    }

    //METODO QUE DA LOS EMPLEADOS MÁS CERCANOS AL USUARIO DE ACUERDO AL SERVICIO
    async empleados_cercanos(id_usuario, ocupacion_id, limite) {
        try {
            const sql = "WITH trabajadores_cerca AS (" +
                "SELECT trabajador.trabajador_cedula,trabajador.trabajador_nombre, " +
                "trabajador.trabajador_apellido,trabajador.trabajador_celular," +
                "trabajador.trabajador_direccion,trabajador.trabajador_latitud," +
                "trabajador.trabajador_longitud,trabajador.trabajador_point," +
                "round(CAST(ST_DistanceSphere(ST_Centroid(trabajador.trabajador_point)," +
                "ST_Centroid($1)) As numeric),4) AS distancia FROM trabajador " +
                "WHERE trabajador.trabajador_cedula IN " +
                "(SELECT servicio.trabajador_cedula FROM servicio WHERE servicio.ocupacion_id = $2) " +
                "AND trabajador.trabajador_estado = true " +
                "ORDER BY trabajador.trabajador_point <-> $3::geometry LIMIT $4) " +
                "select * from (SELECT trabajadores_cerca.trabajador_cedula as trabajador_cedula, trabajadores_cerca.trabajador_nombre as trabajador_nombre, " +
                "trabajadores_cerca.trabajador_apellido as trabajador_apellido, trabajadores_cerca.trabajador_direccion as trabajador_direccion, " +
                "trabajadores_cerca.trabajador_latitud as trabajador_latitud, trabajadores_cerca.trabajador_longitud as trabajador_longitud " +
                "FROM trabajadores_cerca WHERE trabajadores_cerca.distancia < 12000 " +
                "ORDER BY ST_Distance(trabajadores_cerca.trabajador_point, $5::geometry) LIMIT $6) as r1 " +
                "natural join " +
                "(SELECT trabajadores_cerca.trabajador_cedula as trabajador_cedula, servicio.servicio_nro as servicio_nro, servicio.servicio_precio_hora as servicio_precio_hora, " +
                "servicio.servicio_precio_unidad_labor as servicio_precio_unidad_labor, servicio.servicio_descripcion as servicio_descripcion " +
                "FROM trabajadores_cerca NATURAL JOIN servicio " +
                "WHERE servicio.servicio_estado = true AND servicio.ocupacion_id = $7) as r2";
            const usuario = await this.usuario_point(id_usuario);
            const values = [
                "SRID=4326;POINT(" + usuario.usuario_latitud + " " + usuario.usuario_longitud + ")",
                ocupacion_id,
                "SRID=4326;POINT(" + usuario.usuario_latitud + " " + usuario.usuario_longitud + ")",
                parseInt(limite) * 2,
                "SRID=4326;POINT(" + usuario.usuario_latitud + " " + usuario.usuario_longitud + ")",
                parseInt(limite),
                ocupacion_id
            ];
            let data = pool
                .connect()
                .then(client => {
                    return client
                        .query(sql, values)
                        .then(res => {
                            client.release();
                            return { trabajadores: res.rows, status: 200 };

                        })
                        .catch(err => {
                            client.release();
                            return { trabajadores: [], status: 400 };
                        })
                });

            let response = await data;
            return response;
        } catch (e) {
            console.log(e);
            return {
                message: "Error interno del servidor",
                trabajadores: [],
                status: 500
            };
        }

    }

    //METODO QUE ME RETORNA LA LATITUD Y LA LONGITUD DEL USUARIO
    async usuario_point(id_usuario) {
        try {
            const sql = "SELECT usuario_latitud, usuario_longitud FROM usuario WHERE usuario_estado = true AND usuario_id = $1";
            const values = [parseInt(id_usuario)];
            let data = pool
                .connect()
                .then(client => {
                    return client
                        .query(sql, values)
                        .then(res => {
                            client.release();
                            return res.rows[0];
                        })
                        .catch(err => {
                            client.release();
                            return { usuario_latitud: 0, usuario_longitud: 0 };
                        })
                });
            // resolvemos la promesa
            let response = await data;
            return response;
        } catch (e) {
            console.log(e);
            return { usuario_latitud: 0, usuario_longitud: 0 };
        }
    }

    //METODO QUE da la informacion de un empleado
    async empleado_informacion(servicio_nro) {
        try {
            empleado = new Empleado(-1, '', '', 1, '', 1, 1, '', '', '', true, '', '');
            //realizamos la consulta
            const sql = "SELECT tr.trabajador_cedula, (tr.trabajador_nombre||' '||tr.trabajador_apellido) as trabajador_nombre, tr.trabajador_direccion," +
                "tr.trabajador_latitud, tr.trabajador_longitud, tr.trabajador_celular, tr.trabajador_foto_base64," +
                "(SELECT CASE WHEN AVG(puntuacion_calificacion) IS NULL THEN 0 ELSE  ROUND(AVG(puntuacion_calificacion)::numeric,1) END " +
                "FROM puntuacion WHERE puntuacion.servicio_nro = servicio.servicio_nro) as puntuacion FROM servicio NATURAL JOIN trabajador as tr " +
                "WHERE servicio_nro = $1";

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
                            return { trabajador: res.rows[0], status: 200, message: 'operación realizada' };

                        })
                        .catch(err => {
                            client.release();
                            return { trabajador: {}, status: 400, message: 'No se pudo encontrar la información' };
                        })
                });

            let response = await data;
            // resolvemos la promesa
            if (response.status == 400) {
                return response
            } else {
                let base64 = empleado.foto_to_base64(response.trabajador.trabajador_foto_base64);
                response.trabajador.trabajador_foto_base64 = base64;
                return response;
            }

        } catch (e) {
            return { trabajador: {}, status: 500, message: 'Error interno del servidor' };
        }
    }

    //METODO QUE PERMITE DAR EL LISTADO DE LOS ULTIMOS SERVICIOS PENDIENTES DEL TRABAJADOR
    async get_servicios_pedidos_trabajdor(usuario_id, estado_servicio_id, limite){
        let sql = "SELECT ser.ocupacion_id, sp.servicio_pedido_id, ser.servicio_precio_unidad_labor, ser.servicio_precio_hora, (usuario.usuario_nombre||' '||usuario.usuario_apellido) as usuario_nombre,usuario.usuario_celular, case sp.servicio_pedido_es_por_hora when true then sp.servicio_pedido_horas * ser.servicio_precio_hora else sp.servicio_pedido_unidad_labor * ser.servicio_precio_unidad_labor end as valor_servicio, "+
        "to_char(sp.servicio_pedido_fecha, 'YYYY-MM-DD HH:MM:SS') as fecha, sp.estado_servicio_id, sp.servicio_pedido_es_por_hora, sp.servicio_pedido_horas, sp.servicio_pedido_unidad_labor "+
        "FROM servicio as ser JOIN servicio_pedido as sp ON  sp.servicio_nro = ser.servicio_nro "+
        "JOIN usuario ON usuario.usuario_id = sp.usuario_id "+
        "WHERE ser.trabajador_cedula = $1 AND estado_servicio_id = $2 ORDER BY servicio_pedido_fecha DESC";
        let values = [parseInt(usuario_id), estado_servicio_id]
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

    //METODO QUE PERMITE DAR EL LISTADO DE LOS ULTIMOS SERVICIOS ACEPTADOS POR EL TRABAJADOR
    async get__servicios_aceptados_trabajdor(usuario_id, estado_servicio_id, limite){
        let sql = "select ser.ocupacion_id, sp.servicio_pedido_id, ser.servicio_precio_unidad_labor, ser.servicio_precio_hora, (usuario.usuario_nombre||' '||usuario.usuario_apellido) as usuario_nombre,usuario.usuario_celular, case sp.servicio_pedido_es_por_hora when true then sp.servicio_pedido_horas * ser.servicio_precio_hora else sp.servicio_pedido_unidad_labor * ser.servicio_precio_unidad_labor end as valor_servicio, "+
        "to_char(sa.servicio_aceptado_fecha, 'YYYY-MM-DD HH:MM:SS') as fecha, sa.estado_servicio_id, sp.servicio_pedido_es_por_hora, sp.servicio_pedido_horas, sp.servicio_pedido_unidad_labor "+
        "from servicio as ser join servicio_pedido as sp on ser.servicio_nro = sp.servicio_nro "+
        "join servicio_aceptado as sa ON sa.servicio_pedido_id = sp.servicio_pedido_id "+
        "JOIN usuario ON usuario.usuario_id = sp.usuario_id "+
        "where ser.trabajador_cedula = $1 and sa.estado_servicio_id = $2 order by sa.servicio_aceptado_fecha desc";
        let values = [parseInt(usuario_id), estado_servicio_id]
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

}

//exportamos el modulo
exports.Empleado_controller = Empleado_controller;