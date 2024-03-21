import { model } from '../models/mysql/model.js'
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
    console.log(code)
    if (code) return res.json(code)
    res.status(404).json({ message: 'Email not found' })
  }

}
