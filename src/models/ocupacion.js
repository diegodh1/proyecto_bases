//importamos las dependencias

//Creamos nuestra clase Ocupacion con sus respectivos parametros y metodos

class Ocupacion {

    constructor(ocupacion_id) {
        this.ocupacion_id = ocupacion_id.toUpperCase();
    }

    //getters
    get_ocupacion_id = () => { return this.ocupacion_id; }

}
//exportamos el modulo
exports.Ocupacion = Ocupacion;