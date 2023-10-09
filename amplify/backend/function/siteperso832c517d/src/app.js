const express = require('express')
const nodeMailer = require('nodemailer')
require("dotenv").config();

const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

const app = express()

app.use(awsServerlessExpressMiddleware.eventContext())

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next()
});

var mailConfig = {
  service : 'Outlook',
  auth : {
    user : "jgyur.dev@outlook.fr",
    pass : "aLossIsaLoss_150"
  }
  };

  app.use(express.json());


  app.post('/form', async function(req, res) {
    
    try{
      const requestData = req.body;
      console.log(requestData);

      const message = {
          from: `${requestData.name}`,
          to: "jgyur.dev@outlook.fr",
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

app.listen(3000, function() {
    console.log("App started")
});


module.exports = app
