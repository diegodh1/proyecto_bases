//Creamos nuestra clase Servicio con sus respectivos parametros y metodos
class Servicio {
    constructor(trabajador_cedula, ocupacion_id, servicio_precio_hora, servicio_precio_unidad_labor, servicio_descripcion, servicio_estado) {
        this.trabajador_cedula = parseInt(trabajador_cedula);
        this.ocupacion = ocupacion_id;
        this.servicio_precio_hora = parseFloat(servicio_precio_hora);
        this.servicio_precio_unidad_labor = parseFloat(servicio_precio_unidad_labor);
        this.servicio_descripcion = servicio_descripcion;
        this.servicio_estado = servicio_estado
    }

    //getters
    get_trabajador_cedula = () => { return this.trabajador_cedula; }
    get_ocupacion = () => { return this.ocupacion; }
    get_servicio_precio_hora = () => { return this.servicio_precio_hora; }
    get_servicio_precio_unidad_labor = () => { return this.servicio_precio_unidad_labor; }
    get_servicio_descripcion = () => { return this.servicio_descripcion; }
    get_servicio_estado = () => { return this.servicio_estado; }
}

//exportamos el modulo
exports.Servicio = Servicio;