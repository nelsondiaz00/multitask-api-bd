import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '1234',
  database: 'MULTITASKBD'

}

const connection = await mysql.createConnection(config)

export class model {
  static async getAll () {
    const [users] = await connection.query(
          'SELECT * FROM USUARIOS;'
    )
    return users
  }

  static async getByEmail ({ email }) {
    if (email) {
      const [user] = await connection.query(
        `SELECT u.idUsuario, u.password, nUsuario, tipoUsuario
        FROM USUARIOS u
        JOIN PERSONAS p ON p.USUARIOS_idUsuario =  u.idUsuario
        WHERE p.correo = '${email}';`
      )
      if (user.length === 0) {
        return null
      }
      const userData = user[0]; // Accede al primer elemento del array
      return userData;
    } else {
      throw new Error('Invalid EMAIL')
    }
  }

  static async getPersonByEmail ({ email }) {
    if (email) {
      const [person] = await connection.query(
        `SELECT p.nombre, p.apellidos, p.cedula, p.correo, p.direccion, p.telefono, p.USUARIOS_idUsuario, u.nUsuario
        FROM USUARIOS u
        JOIN PERSONAS p ON p.USUARIOS_idUsuario = u.idUsuario
        WHERE p.correo ='${email}';`
      )
      if (person.length === 0) {
        return null
      }
      const userData = person[0]; // Accede al primer elemento del array
      return userData;
    } else {
      throw new Error('Invalid EMAIL')
    }
  }
  static async createPersonUser(input) {
    const {
        nombre,
        apellidos,
        cedula,
        correo,
        direccion,
        telefono,
        nUsuario
    } = input;

    try {
        // Insertar en la tabla USUARIOS
        await connection.query(
            `INSERT INTO USUARIOS (password, nUsuario, tipoUsuario) VALUES (?, ?, 'Empleado')`,
            ['123', nUsuario]
        );

        // Obtener el ID del usuario insertado
        const [[{ 'LAST_INSERT_ID()': usuarioId }]] = await connection.query(
            'SELECT LAST_INSERT_ID() as `LAST_INSERT_ID()`'
        );

        // Insertar en la tabla PERSONAS
        await connection.query(
            `INSERT INTO PERSONAS (nombre, apellidos, cedula, correo, direccion, telefono, USUARIOS_idUsuario) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nombre, apellidos, cedula, correo, direccion, telefono, usuarioId]
        );

        // Obtener los datos de la persona recién insertada
        const [personaResult] = await connection.query(
            `SELECT nombre, apellidos, cedula, correo, direccion, telefono, USUARIOS_idUsuario 
             FROM PERSONAS WHERE cedula = ?`,
            [cedula]
        );

        return personaResult[0];
    } catch (error) {
        console.error('Error al crear persona y usuario:', error);
        throw new Error('Error creating persona and usuario');
    }
}





  static async delete ({ id }) {

  }

  static async update ({ id, input }) {

  }
}
