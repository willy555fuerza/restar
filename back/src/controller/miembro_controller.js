/*****************conection 2*********************/

const Usersmodel = require("../model/miembro_model"); // Importa el modelo ProductosModel

class Users {
  // Método para obtener todas los miembros
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
  // Método para agregar una nuevo miembro
  static async createUser(req, res) {
    try {
      const { nombres, apellidos, ci, dirrecion, telefono, fecha_naci } = req.body;

      // Llamar al método para crear un miembro en el modelo
      const result = await Usersmodel.createUser(nombres, apellidos, ci, dirrecion, telefono,  fecha_naci);

      // Verificar si el miembro se creó correctamente en el modelo
      if (result) {
        // Miembro creado correctamente
        res.status(200).json({ message: "Miembro creado correctamente" });
      } else {
        // Error al crear el miembro en el modelo
        res.status(500).json({ error: "Error al crear el miembro" });
      }
    } catch (error) {
      console.error("Error al crear el miembro:", error);
      res.status(500).json({ error: "Error al crear el miembro" });
    }
  }

  static async updateUser(req, res) {
    try {
      const { id_miembro } = req.params;
      const { nombres, apellidos, ci, dirrecion, telefono, fecha_naci } = req.body;

      // Llamar al método para actualizar el miembro en el modelo
      const result = await Usersmodel.updateUser(
        id_miembro,
        nombres,
        apellidos,
        ci,
        dirrecion,
        telefono,
        fecha_naci
      );

      // Verificar si el miembro se actualizó correctamente en el modelo
      if (result) {
        // Miembro actualizado correctamente
        res.status(200).json({ message: "Miembro actualizado correctamente" });
      } else {
        // Error al actualizar el miembro en el modelo
        res.status(500).json({ error: "Error al actualizar la miembro" });
      }
    } catch (error) {
      console.error("Error al actualizar la miembro:", error);
      res.status(500).json({ error: "Error al actualizar la miembro" });
    }
  }
  // Método para cambiar el estado de  un miembro
  static async changeState(req, res) {
    try {
      const userId = req.params.userId;
      const { state } = req.body;
      // Llamar al método para cambiar el estado de un miembro en el modelo
      const result = await Usersmodel.changeState(userId, state);
      
      res.status(200).json({ message: "Estado de la miembro cambiado correctamente" });
    } catch (error) {
      console.error("Error al cambiar el estado del miembro:", error);
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
      const responseObj = { message: "Miembro eliminada correctamente" };

      // Enviar la respuesta
      res.status(200).json(responseObj);
    } catch (error) {
      console.error("Error al eliminar el miembro:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

module.exports = Users;
