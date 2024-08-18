const express = require("express");
const app = express();
app.use(express.json());
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const cors = require("cors");
app.use(cors());

require("dotenv").config();
const mongoose = require("mongoose");

const mailerSend = new MailerSend({
  apiKey: process.env.API_KEY, // process.env.API_KEY si vous hébergez sur GitHub
});

const sentFrom = new Sender(
  `Thibault@${process.env.DOMAIN}`, // `you@${process.env.DOMAIN}` si vous hébergez sur GitHub (n'oubliez pas le nom avant @trial)
  "Thibault" // votre nom
);

app.get("/", (req, res) => {
  res.status(200).json("Server is up !");
});

app.post("/form", async (req, res) => {
  try {
    console.log(req.body);
    const { firstname, lastname, email, message } = req.body;

    //   On crée un tableau contenant les informations reçues du(des) client(s) :
    const recipients = [new Recipient(email, `${firstname} ${lastname}`)];
    // On configure le mail que l'on s'apprête à envoyer :
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("This is a Subject")
      .setHtml("<strong>" + message + "</strong>")
      .setText(message);

    // On envoie les infos à MailerSend pour créer le mail et l'envoyer.
    const result = await mailerSend.email.send(emailParams);

    console.log(result); // réponse de MailerSend

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "This route does not exist" });
});

app.listen(process.env.PORT, () => {
  console.log("Server Started Successfully");
});
