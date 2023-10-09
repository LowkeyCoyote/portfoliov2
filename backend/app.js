const express = require('express')
const nodeMailer = require('nodemailer')
require("dotenv").config();

const userMail = process.env.USER_MAIL;
const userPass = process.env.USER_PASS;

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  var mailConfig = {
      service : 'Outlook',
      auth : {
        user : userMail,
        pass : userPass
      }
      };
  

app.use(express.json());

app.post('/api', async function(req, res, next)  {
    try{
        const requestData = req.body;
        console.log(requestData);

        const message = {
            from: `${requestData.name}`,
            to: `${userMail}`,
            subject: `Demande de contact de ${requestData.name}, de l'entreprise ${requestData.company}`,
            text: `${requestData.message}`,
            html: `<p>${requestData.message}</p>`
        };

        let transporter = nodeMailer.createTransport(mailConfig);

        await transporter.sendMail(message);
        console.log('Message sent successfully');

        res.status(201).json({
            message: `Objet créé`
        });
    }
    catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
        res.status(500).json({
            message: 'Erreur lors de l\'envoi de l\'e-mail'
        });
    } 
  });
  
module.exports = app;