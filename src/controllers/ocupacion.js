let ocupacion = require('../models/ocupacion');
let Ocupacion = ocupacion.Ocupacion;
const { pool } = require('../connection');

//CREAMOS LA CLASE CONTROLADORA DE Ocupacion LA CUAL ES LA QUE VA A COMUNICARSE DIRECTAMENTE CON LA BASE DE DATOS
class Ocupacion_controller {
    constructor() {

    }

    async ocupacion_filtro(id) {
        try {
            ocupacion = new Ocupacion(id);
            //realizamos la consulta
            const sql = 'SELECT ocupacion_id FROM ocupacion WHERE ocupacion_id LIKE $1';
            const values = ['%' + ocupacion.get_ocupacion_id() + '%']
            let data = pool
                .connect()
                .then(client => {
                    return client
                        .query(sql, values)
                        .then(res => {
                            client.release();
                            console.log(res.rows);
                            return { sugerencias: res.rows, status: 200 };

                        })
                        .catch(err => {
                            client.release();
                            return { sugerencias: [], status: 400 };
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
            console.log(e);
            return {
                status: 500,
                message: "Error interno del servidor",
            };
        }

    }

}
//exportamos el modulo
exports.Ocupacion_controller = Ocupacion_controller;