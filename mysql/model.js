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
  static async getAllEmployees () {
    const [employees] = await connection.query(
        `SELECT u.idUsuario, p.nombre, p.apellidos, p.cedula, p.direccion
          FROM PERSONAS p
          JOIN USUARIOS u ON u.idUsuario = p.USUARIOS_idUsuario
          WHERE u.tipoUsuario = 'empleado';`
    )
    return employees
  }
  

  static async getByEmail ({ email }) {
    if (email) {
      const [user] = await connection.query(
        `SELECT 
        PER.nombre, 
        PER.apellidos, 
        PER.tipo_documento, 
        PER.cedula, 
        PER.correo, 
        PER.direccion, 
        PER.telefono, 
        PER.fecha_nacimiento, 
        PER.genero, 
        USU.tipoUsuario,
        USU.nUsuario, 
        USU.password
        FROM 
            PERSONAS AS PER
        INNER JOIN 
            USUARIOS AS USU ON PER.USUARIOS_idUsuario = USU.idUsuario
        WHERE 
            PER.correo = '${email}';
        ;`);
      
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
  
  static async getServicesBySector ({ sector }) {
    if (sector) {
      const [services] = await connection.query(
        `SELECT * FROM PROFESIONES
        WHERE sector = '${sector}';`
      )
      if (services.length === 0) {
        return null
      }

      return services;
    } else {
      throw new Error('Invalid SECTOR')
    }
  }

  static async createPersonUser(input) {
    const {
        nombre,
        apellidos,
        tipo_documento,
        cedula,
        correo,
        direccion,
        telefono,
        fecha_nacimiento,
        genero,
        password,
        nUsuario,
        tipoUsuario
    } = input;

    try {
        // Insertar en la tabla USUARIOS
        await connection.query(
            `INSERT INTO USUARIOS (password, nUsuario, tipoUsuario) VALUES (?, ?, '${tipoUsuario}')`,
            [password, nUsuario]
        );

        // Obtener el ID del usuario insertado
        const [[{ 'LAST_INSERT_ID()': usuarioId }]] = await connection.query(
            'SELECT LAST_INSERT_ID() as `LAST_INSERT_ID()`'
        );

        // Insertar en la tabla PERSONAS
        await connection.query(
            `INSERT INTO PERSONAS (nombre, apellidos, tipo_documento, cedula, correo, direccion, telefono, fecha_nacimiento, genero, USUARIOS_idUsuario) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, apellidos, tipo_documento, cedula, correo, direccion, telefono, fecha_nacimiento, genero, usuarioId]
        );

        // Obtener los datos de la persona recién insertada
        const [personaResult] = await connection.query(
            `SELECT nombre, apellidos, tipo_documento, cedula, correo, direccion, telefono, fecha_nacimiento, genero, USUARIOS_idUsuario 
             FROM PERSONAS WHERE cedula = ?`,
            [cedula]
        );

        return personaResult[0];
    } catch (error) {
        console.error('Error al crear persona y usuario:', error);
        throw new Error('Error creating persona and usuario');
    }
}


  static async updatePersonUser(inputData) {
    console.log(inputData)
    const {
        nombre,
        apellidos,
        nUsuario,
        password,
        telefono,
        direccion,
        correo
    } = inputData;

    try {
        await connection.query(
            `UPDATE PERSONAS p
            JOIN USUARIOS u ON p.USUARIOS_idUsuario = u.idUsuario
            SET p.nombre = '${nombre}',
                p.apellidos = '${apellidos}',
                p.direccion = '${direccion}',
                p.telefono = '${telefono}',
                u.nUsuario = '${nUsuario}' ,
                u.password = '${password}'
            WHERE p.correo = '${correo}';`
        );
        // terminar después
        /*await connection.query(
            `UPDATE USUARIOS
            SET nUsuario = '${nUsuario}'
            WHERE idUsuario = ${USUARIOS_idUsuario};`
        );*/

        const updatedPerson = await connection.query(
          `SELECT 
            PER.nombre, 
            PER.apellidos, 
            PER.tipo_documento, 
            PER.cedula, 
            PER.correo, 
            PER.direccion, 
            PER.telefono, 
            PER.fecha_nacimiento, 
            PER.genero, 
            USU.tipoUsuario,
            USU.nUsuario, 
            USU.password
            FROM 
                PERSONAS AS PER
            INNER JOIN 
                USUARIOS AS USU ON PER.USUARIOS_idUsuario = USU.idUsuario
            WHERE 
                PER.correo = '${correo}';
            ;`
        );
      

        if (updatedPerson.length === 0) {
            throw new Error('No se encontró la persona actualizada');
        }

        console.log(updatedPerson[0][0])
        return updatedPerson[0][0]; // Devuelve la primera fila de resultados
    } catch (error) {
        console.error('Error al actualizar persona y usuario:', error);
        throw new Error('Error al actualizar persona y usuario');
    }
  }

}
