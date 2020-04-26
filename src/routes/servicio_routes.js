// obtenemos los controladores
let servicio = require('../controllers/servicio');
let Servicio_controller = servicio.Servicio_controller;

// metodo para poder crear un servicio en la base de datos
exports.crear_servicio = async (req, res) => {
    //obtenemos los campos de la solicitud
    cedula = req.body.cedula;
    ocupacion = req.body.ocupacion;
    precio_hora = req.body.precio_hora;
    precio_unidad_labor = req.body.precio_unidad_labor;
    estado = req.body.estado;
    descripcion = req.body.descripcion;

    servicio_controller = new Servicio_controller();
    const data = servicio_controller.crear_servicio(cedula, ocupacion, precio_hora, precio_unidad_labor, descripcion, estado);

    if (!Number(cedula) || !Number(precio_hora) || !Number(precio_unidad_labor)) {
        res.json({
            message: 'La cédula, el servicio, el precio por hora y el precio por unidad labor deben ser datos númericos',
            status: 400
        });
    }

    //resolvemos la promesa
    data.then(result => {
        res.json(result);
    }).catch(err => {
        res.json({
            message: err,
            status: 500
        });
    });
};