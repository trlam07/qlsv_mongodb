const express = require('express');
const dotenv = require('dotenv')
const ejsLayouts = require('express-ejs-layouts');
const path = require('path');
const bodyParser = require('body-parser')
const session = require('express-session')

const app = express();
const port = 3000;

app.use(ejsLayouts)
app.set('views', './views')
app.set('view engine', 'ejs')

// chỉ định thư mục public chứa các file css, image, js, ...
app.use(express.static(path.join(__dirname, 'public')))
console.log(path.join(__dirname))
console.log(path.join(__dirname, 'public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(session({
    secret: 'con ga đang ăn  thóc',
    resave: false,
    saveUninitialized: true,
  }))

const studentRouter = require('./routers/StudentRouter');
const subjectRouter = require('./routers/SubjectRouter')
const registerRouter = require('./routers/RegisterRouter')
app.use('/', studentRouter);
app.use('/subject', subjectRouter);
app.use('/register', registerRouter);

console.log(process.env.DB_NAME)
app.listen(port, () => {
    console.log(`Server running in ${port}`)
})