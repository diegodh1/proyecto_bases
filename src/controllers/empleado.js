let empleado = require('../models/empleado');
let Empleado = empleado.Empleado;
const { client } = require('../connection');

//CREAMOS LA CLASE CONTROLADORA DE EMPLEADO LA CUAL ES LA QUE VA A COMUNICARSE DIRECTAMENTE CON LA BASE DE DATOS
class Empleado_controller {
    constructor() {

    }
    //METODO QUE PERMITE CREAR UN EMPLEADO NUEVO EN LA BASE DE DATOS
    crear_empleado(cedula, nombre, apellido, celular, correo, direccion, foto_base64, doc_base64, estado_trabajador, contrasenha) {

        empleado = new Empleado(cedula, nombre, apellido, celular, correo, direccion, foto_base64, doc_base64, estado_trabajador, contrasenha);
        const sql = 'INSERT INTO trabajador(cedula, nombre, apellido, celular, correo, direccion, foto_base64, doc_base64, estado_trabajador, contrasenha) ' +
            'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING cedula, nombre, apellido';
        const values = [empleado.cedula, empleado.nombre, empleado.apellido, empleado.celular, empleado.correo, empleado.direccion, empleado.foto_to_base64(), empleado.doc_to_base64(), empleado.estado_trabajador, empleado.contrasenha_ecrypt()]
        console.log(values);
        client
            .query(sql, values)
            .then(res => {
                data ={empleado: res.rows[0], status: 200, message: 'Empleado creado con éxito'}
                return data;
            })
            .catch(e => {
                return {empleado: {cedula: '', nombre:'', apellido:''}, status: 500, message: 'Error interno del servidor'};
            });
    }
}

exports.Empleado_controller = Empleado_controller;