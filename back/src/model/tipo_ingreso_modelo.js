/*****************conection 1*********************/

//consultas para obtener datos de base de la db
const {
  connectToPostgres,
  disconnectFromPostgres,
} = require("../config/index");
const bcrypt = require("bcryptjs");
const pg = require("pg");

class Usersmodel {
  // Método para obtener todas los ministerios
  static async getAll() {
    try {
      const pool = await connectToPostgres();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }
      const result = await pool.query("SELECT * FROM  tipo_ingresos");
      await disconnectFromPostgres(pool);
      /* console.log(result.rows) */
      if (result.rows.length === 0) {
        return {
          data: null,
          error: true,
          message: "No hay ministerios registrados",
        };
      }
      return { data: result.rows, error: false };
    } catch (error) {
      return { data: null, error: true, message: error.message };
    }
  }

  // Función para crear un nuevo ministerio
  static async createUser(nombre, registro_fecha) {
    let pool;
    try {
      // Conectar a la base de datos PostgreSQL
      pool = await connectToPostgres();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }

      // Obtener la fecha actual para la fecha de registro
      /* const currentDate = new Date();
          const fecha_registro = currentDate.toISOString(); */
     /*  const currentDate = new Date();
      const registro_fecha = `${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
      }-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`; */

      // Consulta para insertar una nuevo ministerio en la base de datos
      const query = `
            INSERT INTO tipo_ingresos (nombre, registro_fecha)
            VALUES ($1, $2)
            RETURNING *;
          `;

      // Ejecutar la consulta con parámetros
      const result = await pool.query(query, [
        nombre,
        registro_fecha,
      ]);

      console.log("Ministerio creado correctamente");
      return true;
    } catch (error) {
      console.error("Error al crear el ministerio:", error);
      return false;
    } finally {
      // Desconectar de la base de datos
      if (pool) {
        await disconnectFromPostgres(pool);
      }
    }
  }
  // Metodo para actualizar el ministerio
  static async updateUser(id_tipo_ingresos, nombre, registro_fecha) {
    let pool;
    try {
      // Conectar a la base de datos PostgreSQL
      pool = await connectToPostgres();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }

      // Consulta para actualizar una ministerio en la base de datos
      const query = `
            UPDATE  tipo_ingresos
            SET nombre = $1
            WHERE id_tipo_ingresos  = $2
          `;

      // Ejecutar la consulta con parámetros
      await pool.query(query, [nombre, id_tipo_ingresos]);

      console.log("Ministerio actualizado correctamente");
      return true;
    } catch (error) {
      console.error("Error al actualizar el ministerio:", error);
      return false;
    } finally {
      // Desconectar de la base de datos
      if (pool) {
        await disconnectFromPostgres(pool);
      }
    }
  }

  // Método para cambiar el estado de un ministerio
  static async changeState(userId, state) {
    try {
      const pool = await connectToPostgres();
      if (!pool) {
        throw new Error("Error al conectar con MSSQL");
      }
      /* console.log("lol") */
      /* const request = pool.request(); */
      // Actualizar el estado de un ministerio en la base de datos
      await pool.query(
        `UPDATE tipo_ingresos SET estado = ${state} WHERE id_tipo_ingresos = ${userId}`
      );
      await disconnectFromPostgres(pool);
      return true;
    } catch (error) {
      return false;
    }
  }
  // Método para eliminar usuario de la data base
  static async deleteUser(userId) {
    try {
      const pool = await connectToPostgres();
      if (!pool) {
        throw new Error("Error al conectar con PostgreSQL");
      }

      // Eliminar el usuario de la base de datos
      await pool.query(`DELETE FROM tipo_ingresos WHERE id_tipo_ingresos = ${userId}`);

      await disconnectFromPostgres(pool);
      return true;
    } catch (error) {
      console.error("Error al eliminar el ministerio:", error);
      return false;
    }
  }
}

module.exports = Usersmodel;
