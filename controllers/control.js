import { model } from '../mysql/model.js'
import { emailCode } from '../controllers/email-send-control.mjs'
// import { validateMovie, validatePartialMovie } from '../schemas/schemaZod.js'

export class MultiTaskController {
  static async getAll (req, res) {
    const users = await model.getAll()
    res.json(users)
  }

  static async getAllEmployees (req, res) {
    const users = await model.getAllEmployees()
    res.json(users)
  }

  static async getByEmail (req, res) {
    const { email } = req.params
    const user = await model.getByEmail({ email })
    if (user) return res.json(user)
    res.status(404).json({ message: 'User not found' })
  }

  static async generateCode (req, res) {
    const { email } = req.params
    //console.log(code)
    const code = await emailCode.sendCode(email)
    //console.log(code)
    if (code) return res.json(code)
    res.status(404).json({ message: 'Email not found' })
  }

  static async getPersonByEmail (req, res) {
    const { email } = req.params
    const person = await model.getPersonByEmail({ email })
    //console.log(person)
    if (person) return res.json(person)
    res.status(404).json({ message: 'User not found' })
  }

  static async getServicesBySector (req, res) {
    console.log("?? JSAJSAJAS")
    const { sector } = req.params
    const services = await model.getServicesBySector({ sector })
    if (services) return res.json(services)
    res.status(404).json({ message: 'Sector not found' })
  }

  static async getServicesByProfession (req, res) {
    console.log("?? PROFESIONNN")
    const { profession } = req.params
    const services = await model.getServicesByProfessions({ profession })
    if (services) return res.json(services)
    res.status(404).json({ message: 'PROFESSION not found' })
  }
  
  static async getServices (req, res) {
    console.log("?? wtf")
    const services = await model.getServices()
    if (services) return res.json(services)
    res.status(404).json({ message: 'Services not found' })
  }



  static async createPersonUser(req, res) {
    const input = req.body; 
    console.log(input);

    try {
        const dataPerson = await model.createPersonUser(input);
        res.json(dataPerson);
    } catch (error) {
        console.error('Error al crear persona y usuario:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  }
  

  static async modifyPersonUser(req, res) {
    const inputData = req.body; // Obtener los datos enviados en la solicitud

    try {
        const updatedData = await model.updatePersonUser(inputData);
        res.json(updatedData);

    } catch (error) {
        console.error('Error al modificar persona y usuario:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  }
  

  static async modifyCompanieUser(req, res) {
    const inputData = req.body; // Obtener los datos enviados en la solicitud
    const {email} = req.params
    // console.log(email, " saklsjkasjk")
    try {
        inputData.correo = email
        const updatedData = await model.modifyCompanieUser(inputData);
        res.json(updatedData);

    } catch (error) {
        console.error('Error al modificar persona y usuario:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async deleteUser(req, res) {
    const inputData = req.body; 

    try {
        const updatedData = await model.deleteUser(inputData);
        res.json(updatedData);

    } catch (error) {
        console.error('Error al eliminar persona:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  }


  static async postOffer(req, res) {
    const input = req.body; 
    // console.log(input);

    try {
        const dataPerson = await model.postOffer({input});
        res.json(dataPerson);
    } catch (error) {
        console.error('Error al crear persona y usuario:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  }

  
  static async postPostulation(req, res) {
    const input = req.body; 
    // console.log(input);

    try {
        const dataPerson = await model.postPostulation({input});
        res.json(dataPerson);
    } catch (error) {
        console.error('Error al crear persona y usuario:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  static async getEmployeeByID(req, res) {
    try {
      const { id } = req.params
      console.log(id)
      const updatedData = await model.getEmployeeByID(id);
      res.json(updatedData);

  } catch (error) {
      console.error('Error al obtener empleado por ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async preBillGenerator (req, res) {
    try {
      const { nivel_De_Educacion, cantidad } = req.params
      const datos = {
        nivel_De_Educacion,
        cantidad
      };
      console.log(datos, " __")
      const services = await model.preBillGenerator( datos )
   //  purchase.
     if (services) return res.json(services)
     res.status(404).json({ message: 'Bill not found' })
    }catch (error) {
      console.error('Error al obtener pre-factura:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  

  static async billGenerator(req, res) {
    const input = req.body; 
    try {
        const dataBill = await model.billGenerator({input});
        res.json(dataBill);
    } catch (error) {
        console.error('Error al factura:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  static async registerPayMethod(req, res) {
    const input = req.body; 
    try {
      // console.log(input, "DATA")
      const updatedData = await model.registerPayMethod(input);
      res.json(updatedData);

  } catch (error) {
      console.error('Error al registrar método de pago:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getPayMethodByEmail (req, res) {
    const { email } = req.params
    const person = await model.getPayMethodByEmail({ email })
    //console.log(person)
    if (person) return res.json(person)
    res.status(404).json({ message: 'Pay method not found' })
  }

  
  
  static async getPostulations (req, res) {
    const { email } = req.params
    const person = await model.getPostulations({ email })
    //console.log(person)
    if (person) return res.json(person)
    res.status(404).json({ message: 'Pay method not found' })
  }

  static async getCompanieByEmail (req, res) {
    const { email } = req.params
    const person = await model.getCompanieByEmail({ email })
    //console.log(person)
    if (person) return res.json(person)
    res.status(404).json({ message: 'Companie not found' })
  }
  

  static async getAspirant (req, res) {
    const { email } = req.params
    const person = await model.getAspirant({ email })
    //console.log(person)
    if (person) return res.json(person)
    res.status(404).json({ message: 'Companie not found' })
  }

  static async getPostulationConfirm (req, res) {
    const { idPostulado } = req.params
    const { idPostulacion } = req.params

    const info = {idPostulado : idPostulado, idPostulacion : idPostulacion};
    
    const person = await model.getPostulationConfirm( info )
    //console.log(person)
    if (person) return res.json(person)
    res.status(404).json({ message: 'Companie not found' })
  }

  static async getCompanieUsers (req, res) {
    
    const person = await model.getCompanieUsers()
    //console.log(person)
    if (person) return res.json(person)
    res.status(404).json({ message: 'Companie not found' })
  }
  

  static async getAspirantUsers (req, res) {
    
    const person = await model.getAspirantUsers()
    //console.log(person)
    if (person) return res.json(person)
    res.status(404).json({ message: 'Companie not found' })
  }


  static async getInterviews (req, res) {
    
    const person = await model.getInterviews()
    //console.log(person)
    if (person) return res.json(person)
    res.status(404).json({ message: 'Companie not found' })
  }

  static async changePostulationState (req, res) {
    const { offerID } = req.params
    const newChange = await model.changePostulationState({ offerID })
    console.log(newChange,  " nenenwnw")
    if (newChange) return res.json(newChange)
    res.status(404).json({ message: 'ERROR CHANGING POSTULATION' })
  }
}
