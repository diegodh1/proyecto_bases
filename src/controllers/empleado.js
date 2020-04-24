let empleado = require('../models/empleado');
let Empleado = empleado.Empleado;
const { pool } = require('../connection');

//CREAMOS LA CLASE CONTROLADORA DE EMPLEADO LA CUAL ES LA QUE VA A COMUNICARSE DIRECTAMENTE CON LA BASE DE DATOS
class Empleado_controller {
    constructor() {

    }
    //METODO QUE PERMITE CREAR UN EMPLEADO NUEVO EN LA BASE DE DATOS
    async crear_empleado(cedula, nombre, apellido, celular, correo, latitud, longitud, direccion, foto_base64, doc_base64, estado_trabajador, contrasenha) {
        try {
            empleado = new Empleado(cedula, nombre, apellido, celular, correo, latitud, longitud, direccion, foto_base64, doc_base64, estado_trabajador, contrasenha);
            const sql = 'INSERT INTO trabajador(trabajador_cedula, trabajador_nombre, trabajador_apellido, trabajador_celular, trabajador_correo, trabajador_latitud, trabajador_longitud, trabajador_direccion, trabajador_foto_base64, trabajador_doc_base64, trabajador_estado, trabajador_contrasenha) ' +
                'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING trabajador_cedula, trabajador_nombre, trabajador_apellido';
            const values = [empleado.get_trabajador_cedula(),
            empleado.get_trabajador_nombre(),
            empleado.get_trabajador_apellido(),
            empleado.get_trabajador_celular(),
            empleado.get_trabajador_correo(),
            empleado.get_trabajador_latitud(),
            empleado.get_trabajador_longitud(),
            empleado.get_trabajador_direccion(),
            empleado.foto_to_base64(),
            empleado.doc_to_base64(),
            empleado.get_trabajador_estado(),
            empleado.contrasenha_ecrypt()]
            let data = pool
                .connect()
                .then(client => {
                    return client
                        .query(sql, values)
                        .then(res => {
                            client.release();
                            console.log(res.rows[0]);
                            return { info_empleado: res.rows[0], status: 200, message: 'Empleado creado con éxito' };

                        })
                        .catch(err => {
                            client.release();
                            return { info_empleado: { cedula: '', nombre: '', apellido: '' }, status: 400, message: err.detail };
                        })
                });
            return data.then(res => {return res;});
        }
        catch (e) {
            return { info_empleado: { cedula: '', nombre: '', apellido: '' }, status: 500, message: 'error interno del servidor' };
        }
    }
}

exports.Empleado_controller = Empleado_controller;