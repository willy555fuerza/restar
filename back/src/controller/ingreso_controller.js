/*****************conection 2*********************/

const Usersmodel = require("../model/ingreso_model"); // Importa el modelo ingresosModel

class Users {
  // Método para obtener todos los usuarios
  static async getAll(req, res) {
    try {
      /* const { data, error, message } = await Usersmodel.getAll(); */
      const data = await Usersmodel.getAll();

      if (!data) {
        return res.status(404).json({ error: message });
      }
      /* console.log(data) */
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  // Método para agregar un nuevo usuario
  static async createUser(req, res) {
    try {
      const { monto, fecha_ingreso, id_usuario, id_tipo_ingresos, id_miembro } = req.body;

      // Llamar al método para crear el usuario en el modelo
      const result = await Usersmodel.createUser(
        monto,
        fecha_ingreso,
        id_usuario,
        id_tipo_ingresos,
        id_miembro
      );

      // Verificar si el usuario se creó correctamente en el modelo
      if (result) {
        // Usuario creado correctamente
        res.status(200).json({ message: "Ingresos registrado correctamente" });
      } else {
        // Error al crear el usuario en el modelo
        res
          .status(500)
          .json({ error: "El nombre del ingreso: " + monto + ", ya existe" });
      }
    } catch (error) {
      console.error("Error al registrar el ingreso:", error);
      res.status(500).json({ error: "Error al registrar el ingresos" });
    }
  }

  // Metodo para actualizar el usuario
  static async updateUser(req, res) {
    try {
      const { id_ingreso  } = req.params;
      const {   monto, fecha_ingreso, id_usuario, id_tipo_ingresos, id_miembro } = req.body;

      // Llamar al método para actualizar el usuario en el modelo
      const result = await Usersmodel.updateUser(
        id_ingreso,
        monto,
        fecha_ingreso,
        id_usuario,
        id_tipo_ingresos,
        id_miembro
      );

      // Verificar si el usuario se actualizó correctamente en el modelo
      if (result) {
        // Usuario actualizado correctamente
        res.status(200).json({ message: "Ingreso actualizado correctamente" });
      } else {
        // Error al actualizar el usuario en el modelo
        res.status(500).json({ error: "Error al actualizar el ingreso" });
      }
    } catch (error) {
      console.error("Error al actualizar el ingreso:", error);
      res.status(500).json({ error: "Error al actualizar el ingreso" });
    }
  }
  // Método para cambiar el estado de un usuario
  static async changeState(req, res) {
    try {
      const userId = req.params.userId;
      const { state } = req.body;
      // Llamar al método para cambiar el estado del usuario en el modelo
      const result = await Usersmodel.changeState(userId, state);
      // Crear el objeto de respuesta
      const responseObj = { message: "Ingreso inhabilitado correctamente" };
      // Enviar la respuesta
      res.status(200).json(responseObj);
    } catch (error) {
      console.error("Error al cambiar el estado del producto:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
  // Método para eliminar usuario de la data base
  static async deleteUser(req, res) {
    try {
      const userId = req.params.userId;

      // Llamar al método para eliminar el usuario en el modelo
      const result = await Usersmodel.deleteUser(userId);

      // Crear el objeto de respuesta
      const responseObj = { message: "Ingreso eliminado correctamente" };

      // Enviar la respuesta
      res.status(200).json(responseObj);
    } catch (error) {
      console.error("Error al eliminar el ingreso:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

module.exports = Users;
