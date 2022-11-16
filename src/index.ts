import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(express.static('public'))

app.put(`/answers`, async (req, res) => {


  const answers = []

  const questions = Object.keys(req.body.answers);

  for (let question of questions) {
    const answer = req.body.answers[question];

    try {
      const answered = await prisma.answer.create({
        data: {
          questionID: question,
          answer,
          answerer: req.body.answerer
        }
      })

      answers.push(answered)
    } catch (e: any) {
      res.status(500).send(e.toString && e.toString())
      return;
    }
  }

  res.json(answers);
})


const targets = new Map();

app.get('/answers', async (req, res) => {
  const answers = await prisma.answer.findMany({});


  answers.forEach(answer => {
    const id = `${answer.questionID}${answer.answer}`
    if (!targets.has(id)) {
      targets.set(id, { x: Math.random(), y: Math.random() })
    }
  })



  res.json(answers.map(a => {
    const id = `${a.questionID}${a.answer}`

    const target = targets.get(id)
    return { ...a, targetX: target.x, targetY: target.y }
  }))
})



const server = app.listen(process.env.PORT || 3000, async () => {
  console.log(`🚀 Server ready at: http://localhost:3000`)
},
)
