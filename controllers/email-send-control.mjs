import nodemailer from 'nodemailer';

export class emailCode {


    static async generarCodigoAleatorio() {
        const codigo = Math.floor(Math.random() * 9000) + 1000;
        return codigo.toString(); 
    }

    static async sendCode(email){
        const transporter = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
                user: 'multitaskcorreo@gmail.com', 
                pass: 'kmdj fkkn ohot lqit' 
            }
        });

        const codigoAleatorio = await this.generarCodigoAleatorio(); 

        try {
            const info = await transporter.sendMail({
                from: 'multitaskcorreo@gmail.com',
                to: email,
                subject: 'Este email contiene tu código para ingresar en MultiTask',
                text: `¡Hola! No da gusto saludarte, el código para ingresar a tu cuenta es: ${codigoAleatorio}`
            });
            
            console.log('Correo electrónico enviado: ' + info.response); 
            return codigoAleatorio;
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error);
            return null;
        }

    }


}