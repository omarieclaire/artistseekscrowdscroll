import { Prisma, PrismaClient } from "@prisma/client";
import "dotenv/config"
import express from "express";
import basicAuth from 'express-basic-auth'

const prisma = new PrismaClient();
const app = express();

let auth = basicAuth({
  users: { 'admin': process.env.PASSWORD || 'password' },
  challenge: true,
});

app.use('/database', auth)
app.use('/delete/', auth)


app.use(express.json());
app.use(express.static("public"));

app.put(`/answers`, async (req, res) => {
  const answers = [];

  const questions = Object.keys(req.body.answers);

  for (let question of questions) {
    const answer = req.body.answers[question];

    try {
      const answered = await prisma.answer.create({
        data: {
          questionID: question,
          answer,
          answerer: req.body.answerer,
        },
      });

      answers.push(answered);
    } catch (e: any) {
      res.status(500).send(e.toString && e.toString());
      return;
    }
  }

  res.json(answers);
});

const targets = new Map();

app.get("/answers", async (req, res) => {
  const answers = await prisma.answer.findMany({});

  answers.forEach((answer) => {
    const id = `${answer.questionID}${answer.answer}`;
    if (!targets.has(id)) {
      targets.set(id, { x: Math.random(), y: Math.random() });
    }
  });

  res.json(
    answers.map((a) => {
      const id = `${a.questionID}${a.answer}`;

      const target = targets.get(id);
      return { ...a, targetX: target.x, targetY: target.y };
    })
  );
});

app.post("/delete/:id", async (req, res) => {
  await prisma.answer.delete({
    where: {
      id: parseInt(req.params.id),
    },
  });

  res.redirect("/database");
});

app.get("/database", async (req, res) => {
  // { id, answerer, questionID, answer}

  const answers = await prisma.answer.findMany({});
  res.setHeader("Content-Type", "text/html");
  res.send(`
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>title</title>
    <style>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>
  </head>
  <body>
  <table>
  <tr>
    <th>id</th>
    <th>answerer</th>
    <th>questionID</th>
    <th>answer</th>
  </tr>
  ${answers
      .map(
        ({ id, answerer, questionID, answer }) => `<tr>
  <td>${id}</td>
  <td>${answerer}</td>
  <td>${questionID}</td>
  <td>${answer}</td>
  <td>
  <form action="/delete/${id}" method="POST">
  <input type="submit" value="Delete">
</form> </td>
</tr>`
      )
      .join("")}
  </table>
  </body>
</html>`);
});

const server = app.listen(process.env.PORT || 3000, async () => {
  console.log(`🚀 Server ready at: http://localhost:3000`);
});
