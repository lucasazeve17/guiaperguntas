const express = require('express')
const app = express()
const connection = require('./database/database')
const Question = require('./database/Question')
const Answer = require('./database/Answer')
//database
connection
    .authenticate()
    .then(() => {
        console.log('conexao feita com banco de dados')
    })
    .catch((msgErro) => {
        console.log(msgErro)
    })



app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



app.get('/', (req, res) => {

    Question.findAll({
        raw: true, order: [
            ['id', 'DESC']
        ]
    }).then((questions) => {
        return res.render('index', { questions })
    })

})

app.get('/question', (req, res) => {
    return res.render('question')
})

app.post('/savequestion', (req, res) => {
    const { title, description } = req.body

    Question.create({
        title,
        description
    }).then(() => {
        res.redirect('/')
    })

})

app.get('/question/:id', (req, res) => {
    const { id } = req.params

    Question.findOne({
        where: {
            id
        }
    }).then((question) => {
        if (question) {

            Answer.findAll({
                where: { 
                    questionId: question.id 
                },
                order:[
                    ['id','Desc']
                ]
            }).then((answers) => {
                res.render('showQuestion', { question, answers 
                })
            })

        } else {
            res.redirect('/')
        }
    })
})

app.post("/answer", (req, res) => {
    const { body, questionId } = req.body



    Answer.create({
        body,
        questionId
    }).then(() => {
        res.redirect('/question/' + questionId)
    })
})


app.listen(3333, (err) => {
    err ? console.log('error: ' + err) : console.log('server starter')
})