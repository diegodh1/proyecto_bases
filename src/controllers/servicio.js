let servicio = require('../models/servicio');
let Servicio = servicio.Servicio;
const { pool } = require('../connection');

//CREAMOS LA CLASE CONTROLADORA DE servicio LA CUAL ES LA QUE VA A COMUNICARSE DIRECTAMENTE CON LA BASE DE DATOS
class Servicio_controller {
    constructor() { }

    //METODO QUE PERMITE CREAR UN Servicio NUEVO EN LA BASE DE DATOS
    async crear_servicio(servicio_nro, trabajador_cedula, ocupacion_id, servicio_precio_hora, servicio_precio_unidad_labor, servicio_descripcion, servicio_estado) {
        try {
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
}

//exportamos el modulo
exports.Servicio_controller = Servicio_controller;