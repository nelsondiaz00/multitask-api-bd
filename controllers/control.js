import { model } from '../mysql/model.js'
import { emailCode } from '../controllers/email-send-control.mjs'
// import { validateMovie, validatePartialMovie } from '../schemas/schemaZod.js'

export class MultiTaskController {
  static async getAll (req, res) {
    const users = await model.getAll()
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



}
