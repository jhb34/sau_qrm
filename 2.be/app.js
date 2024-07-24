const express = require('express');
const cors = require('cors');

const fs = require('fs');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const path = require('path');

const cookie = require('cookie-parser');
const session = require('express-session');
require('dotenv').config({ path: '.env' });
const sql = require('mssql');
const { log } = require('console');
const app = express();

// const generator = (time, index) => {
//   if (!time) return "file.log";
//   const yearmonth =
//     time.getFullYear() + (time.getMonth() + 1).toString().padStart(2, "0");
//   const day = time.getDate().toString().padStart(2, "0");

//   return `${yearmonth}${path.sep}${yearmonth}${day}-${index}-file.log`;
// };

// const accessLogStream = rfs.createStream(generator, {
//   interval: "1d", //'1d'
//   size: "10M",
//   path: path.join(__dirname, "log"),
// });

app.use(
  morgan(
    'dev'
    // 'combined'
    //  {
    //   stream: accessLogStream,
    //   skip: function (req, res) {
    //     return res.statusCode < 400;
    //   },
    // }
  )
);

app.use(express.json());
app.use(cookie());
app.use(
  session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 1,
    },
  })
);

const config = {
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PW,
  server: '192.168.1.10',
  database: 'SAU',
  port: 1433,
  options: {
    encrypt: false,
  },
};

sql
  .connect(config)
  .then(console.log('mssql연결됨'))
  .catch((err) => console.log(err));

app.use(
  cors({
    origin: 'http://172.20.2.122:8080',
    optionsSuccessStatus: 200, //없어도 됨
    credentials: true, //꼭필요
  })
);

app.use(express.static('public'));

const ncrRoute = require('./route/NCR');
app.use('/api/ncr', ncrRoute);

const defectRoute = require('./route/Defect');
app.use('/api/defect', defectRoute);

const fileRoute = require('./route/file');
app.use('/api/upload', fileRoute);

app.listen(3000, function () {
  console.log('listening on 3000');
});

app.get('/get', (req, res) => {
  const r = req.session;
  console.log(r);
  // const user = req.session.user;
  // if (user) {
  //   res.status(200).json(user);
  // } else {
  //   res.status(401).send('Unauthorized');
  // }
});

app.get('/api/getdefectlists', (req, res) => {
  const request = new sql.Request();
  request.query(
    'select top 100 * from QCM_DAMAGPF where JDATE=20240709',
    (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      res.send(result);
    }
  );
});

app.post('/api/login', (req, res) => {
  const { params } = req.body;
  const sabun = params.username.trim();
  const pswd = params.password.trim();
  const request = new sql.Request();
  request.query(
    `select top 100 * from COM_AKMSTRP where sabun='${sabun}' and passwd='${pswd}'
      `,
    (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      // console.log(result);
      if (result.recordset.length > 0) {
        // req.session.loggedIn = true;
        // req.session.user = sabun;
        res.status(200).send(sabun);
      } else {
        res.status(200).send();
      }
    }
  );
});

// Middleware to check for valid session (protects routes)
const isLoggedIn = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
    res.redirect('/login');
  }
};
// 메인 페이지 라우터 (로그인 확인 필요)
// app.get('/main', isLoggedIn, async (req, res) => {
//   const userId = req.session.userId;
//   const user = users.find((user) => user.id === userId);

//   if (user) {
//     res.json({ message: 'Welcome to main page', user: user });
//   } else {
//     res.status(404).json({ message: 'User not found' });
//   }
// });
// 미들웨어: 요청마다 로그인 여부 확인
app.use((req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});
