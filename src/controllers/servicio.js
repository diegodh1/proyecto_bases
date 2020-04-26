let servicio = require('../models/servicio');
let Servicio = servicio.Servicio;
const { pool } = require('../connection');

//CREAMOS LA CLASE CONTROLADORA DE servicio LA CUAL ES LA QUE VA A COMUNICARSE DIRECTAMENTE CON LA BASE DE DATOS
class Servicio_controller {
    constructor() { }

    //METODO QUE PERMITE CREAR UN Servicio NUEVO EN LA BASE DE DATOS
    async crear_servicio(servicio_nro, trabajador_cedula, ocupacion_id, servicio_precio_hora, servicio_precio_unidad_labor, servicio_descripcion, servicio_estado) {
        try {
            servicio = new Servicio(servicio_nro, trabajador_cedula, ocupacion_id, servicio_precio_hora, servicio_precio_unidad_labor, servicio_descripcion, servicio_estado);

            const sql = 'INSERT INTO servicio(servicio_nro, trabajador_cedula, ocupacion_id, servicio_precio_hora, servicio_precio_unidad_labor, servicio_descripcion, servicio_estado) ' +
                'VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING servicio_nro, trabajador_cedula, ocupacion_id, servicio_descripcion';

            const values = [
                servicio.get_servicio_nro(),
                servicio.get_trabajador_cedula(),
                servicio.get_ocupacion(),
                servicio.get_servicio_precio_hora(),
                servicio.get_servicio_precio_unidad_labor(),
                servicio.get_servicio_descripcion(),
                servicio.get_servicio_estado()
            ];

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
                                info_servicio: res.rows[0],
                                status: 200,
                                message: 'Servicio creado con éxito',
                            };
                        })
                        .catch(err => {
                            client.release();

                            return {
                                status: 400,
                                message: err.detail,
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
}

//exportamos el modulo
exports.Servicio_controller = Servicio_controller;