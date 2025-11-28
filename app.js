var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const { QueryTypes } = require('sequelize');
const sequelize = require('./config/database.js'); 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


const PORT = process.env.PORT;
var app = express();
require('dotenv').config();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
  origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
  credentials: true
}));

app.options("*", cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// ทดสอบ sql injection
app.post('/runquery', async (req, res) => {
  try {
    const sql = req.body.input; 
    console.log("Executing raw SQL:", sql);

    const results = await sequelize.query(sql, { type: QueryTypes.SELECT });

    return res.send(`
      <h2>ผลลัพธ์จาก SQL:</h2>
      <pre>${JSON.stringify(results, null, 2)}</pre>
      <br><br>
      <a href="/">กลับหน้าแรก</a>
    `);

  } catch (error) {
    console.error("SQL Error:", error);

    return res.status(400).send(`
      <h3>ERROR:</h3>
      <pre>${error}</pre>
      <br><br>
      <a href="/">กลับหน้าแรก</a>
    `);
  }
});

app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

module.exports = app;
