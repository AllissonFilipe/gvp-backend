require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const cors = require('cors');

app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "https://www.gvpcontabilidade.com.br");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'POST');
    app.use(cors());
    next();
});

app.use(express.json());

app.post('/sendMail', (req, res) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.umbler.com',
        port: 587,
        secure: false,
        auth: { user: process.env.USER, pass: process.env.PASS },
    });

    transporter.sendMail({
        from: process.env.USER,
        to: process.env.RECIPIENT,
        replyTo: req.body.email,
        subject: `Contato do Site - Usuario ${req.body.firstname}  ${req.body.lastname}`,
        html: `<!DOCTYPE html>
        <html>
        <head>
        <title>Contato Gvp</title>
        </head>
        <body>
        
        <h2>Informações do Usuário que entrou em contato:</h2>
        <p><b>Nome</b>: ${req.body.firstname} ${req.body.lastname}</p>
        <p><b>Email</b>: <a href="mailto:${req.body.email}">${req.body.email}</a></p>
        <p><b>Telefone</b>: <a href="tel:+55${req.body.phone}">${req.body.phone}</a></p>
        <p><b>Comentário</b>: ${req.body.coment}</p>
        </body>
        </html>`
    }).then(info => {
        res.send(info);
    }).catch(err => {
        res.send(err);
    });
});

app.listen(process.env.PORT, () => console.log('Server is running on port 3000'));