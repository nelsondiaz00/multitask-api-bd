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
      throw new Error('Invalid ID')
    }
  }


  static async delete ({ id }) {

  }

  static async update ({ id, input }) {

  }
}
