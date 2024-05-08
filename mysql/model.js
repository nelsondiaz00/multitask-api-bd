import mysql from 'mysql2/promise'
import priceEvaluation from '../controllers/price-control.js'

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
        `SELECT u.idUsuario, p.nombre, p.apellidos, p.cedula, p.direccion, u.activo, u.belonging
          FROM PERSONAS p
          JOIN USUARIOS u ON u.idUsuario = p.USUARIOS_idUsuario
          WHERE u.tipoUsuario = 'empleado';`
    )
    return employees
  }
  

  static async getByEmail({ email }) {
    if (email) {
        const [user] = await connection.query(
            `SELECT * FROM USUARIOS 
            WHERE correo = ?;
            `,
            [email]
        );

        if (user.length === 0) {
            return null;
        }
        const userData = user[0]; // Accede al primer elemento del array
        return userData;
    } else {
        throw new Error('Invalid EMAIL');
    }
  }

  static async getPersonByEmail ({ email }) {
    if (email) {
        const [person] = await connection.query(
            `SELECT 
                p.nombre, 
                p.apellidos, 
                p.cedula, 
                u.correo, 
                p.direccion, 
                p.telefono, 
                p.USUARIOS_idUsuario, 
                u.nUsuario
            FROM 
                PERSONAS p
            JOIN 
                USUARIOS u ON p.USUARIOS_idUsuario = u.idUsuario
            WHERE 
                u.correo = ?;
            `,
            [email]
        );

        if (person.length === 0) {
            return null;
        }
        const userData = person[0]; // Accede al primer elemento del array
        return userData;
    } else {
        throw new Error('Invalid EMAIL');
    }
  }

  
  static async getServicesBySector ({ sector }) {

    if (sector) {
      if(sector === 'all'){
        // console.log(sector, " jijija")

        const [services] = await connection.query(
          `SELECT * FROM PROFESIONES;`
        )
        if (services.length === 0) {
          return null
        }
        console.log('sí devolvió wtf')
        return services;

      }else{
        const [services] = await connection.query(
          `SELECT * FROM PROFESIONES
          WHERE sector = '${sector}';`
        )
        if (services.length === 0) {
          return null
        }
        return services;
      }
    } else {
      throw new Error('Invalid SECTOR')
    }
  }


  static async getServicesByProfessions({ profession }) {

    if (profession) {
      const [services] = await connection.query(
        `SELECT * FROM OFERTA_TRABAJOS
        WHERE PROFESIONES_idProfesion = ?`,
        [profession]
      );
      if (services.length === 0) {
        return null
      }

      console.log(services, " result profesiones")

      return services;
    } else {
      throw new Error('Invalid SERVICES')
    }
  }

  static async getServices () {

    if (sector) {
      const [services] = await connection.query(
        `SELECT * FROM PROFESIONES;`
      )
      if (services.length === 0) {
        return null
      }

      console.log(services, " sese")

      return services;
    } else {
      throw new Error('Invalid SERVICES')
    }
  }


  static async preBillGenerator ( input ) {
    if (input) {
      const [services] = await connection.query(
        `SELECT AUTO_INCREMENT
        FROM information_schema.TABLES
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'FACTURAS';
        `
      )
      // console.log(services[0].AUTO_INCREMENT, " sss")
      if (services === null) {
        return null
      }
      const preBill = {
        numeroFactura :  services[0].AUTO_INCREMENT !== null ? services[0].AUTO_INCREMENT : 1,
        cantidad: parseInt(input.cantidad), // Asegúrate de convertir la cantidad a un número
        individual: priceEvaluation(input.nivel_De_Educacion),
        subtotal : priceEvaluation(input.nivel_De_Educacion) * parseInt(input.cantidad) * 0.19,
        total: priceEvaluation(input.nivel_De_Educacion) * parseInt(input.cantidad) // Calcula el total
      };
          
      console.log(preBill);
      return preBill;
    } else {
      throw new Error('Invalid PRE-BILL')
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
            `INSERT INTO USUARIOS (password, correo, nUsuario, tipoUsuario) VALUES (?, ?, ?, ?)`,
            [password, correo, nUsuario, tipoUsuario]
        );

        // Obtener el ID del usuario insertado
        const [[{ 'LAST_INSERT_ID()': usuarioId }]] = await connection.query(
            'SELECT LAST_INSERT_ID() as `LAST_INSERT_ID()`'
        );

        // Insertar en la tabla PERSONAS
        await connection.query(
            `INSERT INTO PERSONAS (nombre, apellidos, tipo_documento, cedula, direccion, telefono, fecha_nacimiento, genero, USUARIOS_idUsuario) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, apellidos, tipo_documento, cedula, direccion, telefono, fecha_nacimiento, genero, usuarioId]
        );

        // Obtener los datos de la persona recién insertada
        const [personaResult] = await connection.query(
          `SELECT * FROM PERSONAS WHERE idPersona = LAST_INSERT_ID();`
        );

        return personaResult[0];
    } catch (error) {
        console.error('Error al crear persona y usuario:', error);
        throw new Error('Error creating persona and usuario');
    } 
  }

  static async deleteUser(inputData){
  const {
    idUser
  } = inputData;

  if (inputData) {
    console.log("idUser")
    console.log(inputData)
    await connection.query(
      `UPDATE USUARIOS
      SET belonging = FALSE
      WHERE idUsuario = '${idUser}';`
    )

    const [personDeleted] = await connection.query(
      `SELECT * FROM USUARIOS
      WHERE idUsuario = '${idUser}';`
    )

    return personDeleted;
  } else {
    throw new Error('Invalid SECTOR')
  }

}



static async getEmployeeByID(inputData){
  if (inputData) {
    console.log("idUser")
    const [employee] = await connection.query(
      `SELECT 
          PERSONAS.nombre, 
          PERSONAS.apellidos, 
          PERSONAS.telefono, 
          PERSONAS.direccion, 
          USUARIOS.correo, 
          USUARIOS.nUsuario, 
          USUARIOS.password
      FROM 
          PERSONAS
      JOIN 
          USUARIOS ON PERSONAS.USUARIOS_idUsuario = USUARIOS.idUsuario
      WHERE 
          USUARIOS.idUsuario = ?;`,
      [inputData]
    );

      return employee[0];
    } else {
      throw new Error('Invalid SECTOR')
    }

  }

  static async getPayMethodByEmail(inputData){
    if (inputData) {
      console.log(inputData.email, "em")
      const [metodosPago] = await connection.query(
        `SELECT mp.id, mp.tipo, mp.numero_tarjeta, mp.nombre_tarjeta, mp.fecha_vencimiento, mp.codigo_seguridad
        FROM METODO_PAGO AS mp
        INNER JOIN USUARIOS AS u ON mp.USUARIOS_idUsuario = u.idUsuario
        WHERE u.correo = ?`,
        [inputData.email]
      );

      return metodosPago;
    } else {
      throw new Error('Invalid PAY METHOD')
    }
  
  }

  static async getPostulations(inputData){
    if (inputData) {
      console.log(inputData.email, "gggs")
      const [OFERTA_TRABAJOS] = await connection.query(
        `SELECT OT.*
        FROM OFERTA_TRABAJOS OT
        JOIN EMPRESAS E ON OT.EMPRESAS_idEmpresa = E.idEmpresa
        JOIN USUARIOS U ON E.USUARIOS_idUsuario = U.idUsuario
        WHERE U.correo = ?`,
        [inputData.email]
      );

      return OFERTA_TRABAJOS;
    } else {
      throw new Error('Invalid POSTULATION')
    }
  
  }
   
  static async getCompanieByEmail(inputData){
    if (inputData) {
        console.log(inputData.email, "em")
      const [companie] = await connection.query(
        `SELECT *
        FROM EMPRESAS AS E
        JOIN USUARIOS AS U ON E.USUARIOS_idUsuario = U.idUsuario
        WHERE U.correo = ?`,
        [inputData.email]
      );

      if(companie.length > 0){
        console.log(companie[0])
        return companie[0];

      }else{
        return null;
      }
    
    } else {
      throw new Error('Invalid COMPANIE')
    }
    
  }

  
  static async getAspirant(inputData){
    if (inputData) {
        console.log(inputData.email, "POSTUPOSTU")
      const [companie] = await connection.query(
        `SELECT p.*
        FROM POSTULADOS p
        JOIN PERSONAS pe ON p.PERSONAS_idPersona = pe.idPersona
        JOIN USUARIOS u ON pe.USUARIOS_idUsuario = u.idUsuario
        WHERE u.correo = ?`,
        [inputData.email]
      );

      if(companie.length > 0){
        console.log(companie[0])
        return companie[0];

      }else{
        return null;
      }
    
    } else {
      throw new Error('Invalid COMPANIE')
    }
    
  }

  static async getPostulationConfirm(inputData) {
    if (inputData) {
      try {
        console.log(inputData.idPostulado, "POSTUPOSTU ", inputData.idPostulacion);
  
        // Consulta para obtener el recuento de postulaciones
        const [countResult] = await connection.query(
          `SELECT COUNT(*) AS postulaciones
          FROM POSTULACIONES 	
          WHERE idOferta_Trabajo = ? AND POSTULADOS_idPostulado = ?`,
          [inputData.idPostulacion, inputData.idPostulado]
        );
  
        // Consulta para obtener la información detallada de la postulación
        const [detailResult] = await connection.query(
          `SELECT idPostulacion, idOferta_Trabajo, POSTULADOS_idPostulado, fasePostulacion
          FROM POSTULACIONES
          WHERE idOferta_Trabajo = ? AND POSTULADOS_idPostulado = ?`,
          [inputData.idPostulacion, inputData.idPostulado]
        );
  
        // Construir el objeto de resultado
        const resultado = {
          postulaciones: countResult[0] ? countResult[0].postulaciones : 0, // Si no hay resultados, devuelve 0
          ...detailResult[0] // La información detallada de la postulación
        };
  
        // Devuelve el objeto de resultado
        return resultado;
      } catch (error) {
        console.error('Error en getPostulationConfirm:', error);
        throw error;
      }
    } else {
      throw new Error('Invalid inputData');
    }
  }
  
  static async getCompanieUsers(){
        // console.log(inputData.email, "POSTUPOSTU")
    const [companie] = await connection.query(
      `SELECT * FROM EMPRESAS
      `,
    );

    if(companie.length > 0){
      console.log(companie)
      return companie;

    }else{
      return null;
    }
  }

  
  static async getAspirantUsers(){
    // console.log(inputData.email, "POSTUPOSTU")
    const [companie] = await connection.query(
      `SELECT 
      p.idPostulado,
      pe.nombre,
      pe.apellidos,
      pe.telefono,
      pe.cedula AS documento
      FROM 
      POSTULADOS p
      JOIN 
      PERSONAS pe ON p.PERSONAS_idPersona = pe.idPersona
      `,
    );

    if(companie.length > 0){
      console.log(companie)
      return companie;

    }else{
      return null;
    }
  }

  

  static async getInterviews(){
    // console.log(inputData.email, "POSTUPOSTU")
    const [companie] = await connection.query(
      `SELECT * FROM ENTREVISTA`,
    );

    if(companie.length > 0){
      console.log(companie)
      return companie;

    }else{
      return null;
    }
  }

  static async changePostulationState(inputData){
    if (inputData) {
        console.log(inputData, " IDDD")
      const [change] = await connection.query(
        `UPDATE OFERTA_TRABAJOS
        SET disponibilidad_oferta = NOT disponibilidad_oferta
        WHERE idOferta_Trabajo = ?`,
        [inputData.offerID]
      );

      const [changedOFFER] = await connection.query(
        `SELECT *
        FROM OFERTA_TRABAJOS
        WHERE idOferta_Trabajo = ?`,
        [inputData.offerID]
      );
      console.l

      if(changedOFFER.length > 0){
        // console.log(companie[0])
        return changedOFFER[0];

      }else{
        return null;
      }
    
    } else {
      throw new Error('Invalid change POSTULATION')
    }
    
  }

  static async modifyCompanieUser(inputData) {
    console.log(inputData);
    const {
        nombre_Empresa,
        telefono,
        direccion,
        password,
        descripcion,
        correo
    } = inputData;

    try {
          await connection.query(
            `UPDATE EMPRESAS e
            JOIN USUARIOS u ON e.USUARIOS_idUsuario = u.idUsuario
            SET e.nombre_Empresa = ?,
                e.telefono = ?,
                e.direccion = ?,
                e.descripcion_publica = ?,
                u.password = ?
            WHERE u.correo = ?;`,
            [nombre_Empresa, telefono, direccion, descripcion, password, correo]
        );

        const updatedEmpresa = await connection.query(
          `SELECT 
              EMP.nombre_Empresa, 
              EMP.nit, 
              EMP.telefono, 
              EMP.direccion, 
              EMP.premium, 
              EMP.descripcion_publica, 
              USU.correo, 
              USU.tipoUsuario,
              USU.password
          FROM 
              EMPRESAS AS EMP
          INNER JOIN 
              USUARIOS AS USU ON EMP.USUARIOS_idUsuario = USU.idUsuario
          WHERE 
              USU.correo = ?;
          `,
          [correo]
      );

      if (updatedEmpresa.length === 0) {
          throw new Error('No se encontró la persona actualizada');
      }
      console.log(updatedEmpresa[0][0], " oeoeeo")
      // console.log(updatedEmpresa, " jojo ", correo);
      return updatedEmpresa[0][0]; // Devuelve la primera fila de resultados
    } catch (error) {
        console.error('Error al actualizar persona y usuario:', error);
        throw new Error('Error al actualizar persona y usuario');
    }
  }

  static async updatePersonUser(inputData) {
    console.log(inputData);
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
            SET p.nombre = ?,
                p.apellidos = ?,
                p.direccion = ?,
                p.telefono = ?,
                u.nUsuario = ?,
                u.password = ?
            WHERE u.correo = ?;`,
            [nombre, apellidos, direccion, telefono, nUsuario, password, correo]
        );

        const updatedPerson = await connection.query(
            `SELECT 
                PER.nombre, 
                PER.apellidos, 
                PER.tipo_documento, 
                PER.cedula, 
                USU.correo, 
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
                USU.correo = ?;
            `,
            [correo]
        );

        if (updatedPerson.length === 0) {
            throw new Error('No se encontró la persona actualizada');
        }

        console.log(updatedPerson[0][0]);
        return updatedPerson[0][0]; // Devuelve la primera fila de resultados
    } catch (error) {
        console.error('Error al actualizar persona y usuario:', error);
        throw new Error('Error al actualizar persona y usuario');
    }
  }
  
  
  static async postOffer ({ input }) {
    // console.log(input)
    const {
      descripcion_Empleo,
      especificacion_Empleo,
      horario,
      fecha_Inicio,
      fecha_Final,
      posibilidad_Viaje,
      disponibilidad_oferta,
      salario_Oferta,
      tipo_Contrato,
      cantidadRequerida,
      EMPRESAS_idEmpresa,
      PROFESIONES_idProfesion,
      POSTULADOS_idPostulado,
      servicio_nombre
    } = input;

    if (input) {
      const [offerBD] = await connection.query(
        `INSERT INTO OFERTA_TRABAJOS (
          servicio_nombre,
          descripcion_Empleo,
          especificacion_Empleo,
          horario,
          fecha_Inicio,
          fecha_Final,
          posibilidad_Viaje,
          disponibilidad_oferta,
          salario_Oferta,
          tipo_Contrato,
          cantidadRequerida,
          EMPRESAS_idEmpresa,
          PROFESIONES_idProfesion,
          POSTULADOS_idPostulado
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          servicio_nombre,
          descripcion_Empleo,
          especificacion_Empleo,
          horario,
          fecha_Inicio,
          fecha_Final,
          posibilidad_Viaje,
          disponibilidad_oferta,
          salario_Oferta,
          tipo_Contrato,
          cantidadRequerida,
          EMPRESAS_idEmpresa,
          PROFESIONES_idProfesion,
          POSTULADOS_idPostulado
        ]
      )

      if (offerBD.length === 0) {
        return null
      }
      const [offerCreated] = await connection.query(
        `SELECT * FROM OFERTA_TRABAJOS
        WHERE idOferta_Trabajo = '${offerBD.insertId}';`
      )
      const offer = offerCreated[0]; // Accede al primer elemento del array
      console.log(offer)
      return offer;
    } else {
      throw new Error('Invalid EMAIL')
    }
  }

  

  static async postPostulation ({ input }) {
    // console.log(input)
    const {
      idOferta_Trabajo,
      POSTULADOS_idPostulado,
      fasePostulacion
    } = input;

    if (input) {
      const [postulation] = await connection.query(
        `INSERT INTO POSTULACIONES (
          idOferta_Trabajo,
          POSTULADOS_idPostulado,
          fasePostulacion
        ) VALUES (?, ?, ?)`,
        [
          idOferta_Trabajo,
          POSTULADOS_idPostulado,
          fasePostulacion
        ]
      )

      if (postulation.length === 0) {
        return null
      }
      const [postulationCreated] = await connection.query(
        `SELECT * FROM POSTULACIONES
        WHERE idPostulacion = '${postulation.insertId}';`
      )
      const postulationFinal = postulationCreated[0]; // Accede al primer elemento del array
      console.log(postulationFinal)
      return postulationFinal;
    } else {
      throw new Error('Invalid EMAIL')
    }
  }
  

  static async billGenerator ({ input }) {
    // console.log(input)
    const {
      cantidad_Entrevistas,
      total,
      subtotal,
      EMPRESAS_idEmpresa,
      METODO_PAGO_id,
      idOferta_Trabajo
    } = input;

    if (input) {
      const [bill] = await connection.query(
        `INSERT INTO FACTURAS (
          fecha,
          cantidad_Entrevistas,
          total,
          subtotal,
          EMPRESAS_idEmpresa,
          METODO_PAGO_id,
          idOferta_Trabajo
        ) VALUES (NOW(), ?, ?, ?, ?, ?, ?)`,
        [
          cantidad_Entrevistas,
          total,
          subtotal,
          EMPRESAS_idEmpresa,
          METODO_PAGO_id,
          idOferta_Trabajo
        ]
      )

      if (bill.length === 0) {
        return null
      }
      const [billCreated] = await connection.query(
        `SELECT * FROM FACTURAS
        WHERE idFactura = '${bill.insertId}';`
      )
      const offer = billCreated[0]; // Accede al primer elemento del array
      console.log(offer)
      return offer;
    } else {
      throw new Error('Invalid BILL')
    }
  }
  
  static async registerPayMethod ( input ) {
    console.log(input, " gg")
    const {
      tipo,
      numero_tarjeta,
      nombre_tarjeta,
      fecha_vencimiento,
      codigo_seguridad,
      USUARIOS_idUsuario,
    } = input;

    if (input) {
      const [payMethod] = await connection.query(
        `INSERT INTO METODO_PAGO (
          tipo,
          numero_tarjeta,
          nombre_tarjeta,
          fecha_vencimiento,
          codigo_seguridad,
          USUARIOS_idUsuario
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          tipo,
          numero_tarjeta,
          nombre_tarjeta,
          fecha_vencimiento,
          codigo_seguridad,
          USUARIOS_idUsuario
        ]
      );

      if (payMethod.length === 0) {
        return null
      }
      const [payMethodCreated] = await connection.query(
        `SELECT * FROM METODO_PAGO
        WHERE id = ?`,
        [payMethod.insertId]
      );

      return payMethodCreated[0];
    } else {
      throw new Error('Invalid PAY METHOD')
    }
  }
}
