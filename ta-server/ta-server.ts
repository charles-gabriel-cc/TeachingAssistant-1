import express = require('express');
import bodyParser = require("body-parser");
import cors = require("cors")
import nodemailer = require("nodemailer")

import {Aluno} from '../common/aluno';
import {CadastroDeAlunos} from './cadastrodealunos';


const Data = require('./data');

var taserver = express();

var cadastro: CadastroDeAlunos = new CadastroDeAlunos();

var allowCrossDomain = function(req: any, res: any, next: any) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
taserver.use(allowCrossDomain);

taserver.use(bodyParser.json());

taserver.get('/alunos', function (req: express.Request, res: express.Response) {
  res.send(JSON.stringify(cadastro.getAlunos()));
})

taserver.post('/aluno', function (req: express.Request, res: express.Response) {
  var aluno: Aluno = <Aluno> req.body; //verificar se é mesmo Aluno!
  aluno = cadastro.cadastrar(aluno);
  if (aluno) {
    res.send({"success": "O aluno foi cadastrado com sucesso"});
  } else {
    res.send({"failure": "O aluno não pode ser cadastrado"});
  }
})

taserver.put('/aluno', function (req: express.Request, res: express.Response) {
  var aluno: Aluno = <Aluno> req.body;
  aluno = cadastro.atualizar(aluno);
  if (aluno) {
    res.send({"success": "O aluno foi atualizado com sucesso"});
  } else {
    res.send({"failure": "O aluno não pode ser atualizado"});
  }
})

taserver.get('/teste', function (req: express.Request, res: express.Response) {
  res.send({"sucess": "O email foi enviado"});
})

taserver.get("/sendmail", function (req: express.Request, res: express.Response) {
  var user: Aluno = <Aluno> Data[0];
  sendMail(user);
})

var server = taserver.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

async function sendMail(user: Aluno): Promise<void> {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });

  const mailOptions = {
    from: `Charles, "<cgcc@cin.ufpe.br>"`,
    to: `${user.email}`,
    subject: "Hello ✔",
    text: "Hello world?",
    html: "<b>Hello world?</b>",
  };

  let info = await transporter.sendMail(mailOptions);
  
  console.log("Message sent: %s", info.messageId);
}

function closeServer(): void {
  server.close();
}

export { server, closeServer }