import express, { json } from 'express' // require -> commonJS
import { router } from './routes/route.js'
import cors from 'cors'; 


const app = express()
app.use(json())
app.use(cors());
app.disable('x-powered-by')

app.use('/multitask', router)

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
