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
  database: 'USA_ERP',
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

app.get('/api/getlines', (req, res) => {
  const request = new sql.Request();
  request.query('select top 100 * from LINE_MST', (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    res.send(result);
  });
});

app.post('/api/login', (req, res) => {
  const { params } = req.body;
  const sabun = params.username.trim();
  const pswd = params.password.trim();
  const request = new sql.Request();
  request.query(
    `select top 100 * from EMP_MST where asabn='${sabun}' and passwd='${pswd}'
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

app.post('/api/monthlyshipping', (req, res) => {
  const { params } = req.body;
  const date = params.date.replace('-', '');
  const customer = params.customer;
  const request = new sql.Request();
  request.query(
    `SELECT s.CUST_CD, s.ITMNO, s.QTY, B.ITM_NM,B.CHAJ_CD
    FROM (
        SELECT CUST_CD, 
    case
    WHEN GROUPING(CUST_CD) = 1 THEN 'Total'
    WHEN GROUPING(ITMNO) = 1 THEN 'Subtotal'
            ELSE ITMNO 
        END AS ITMNO,
    SUM(SCAN_QTY) AS QTY 
        FROM SAL_ORDER  
        WHERE sal_ymd LIKE '${date}%' and cust_cd like '${customer}'
        GROUP BY CUST_CD, ITMNO WITH ROLLUP
    ) AS s
    LEFT JOIN ITM_MST B ON s.ITMNO = B.ITMNO
    
      `,
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
app.post('/api/dailyshipping', (req, res) => {
  const { params } = req.body;
  const date1 = params.date1.replace(/-/g, '');
  const date2 = params.date2.replace(/-/g, '');
  const customer = params.customer;
  const dategroup = params.dategroup.map((date) => `[${date.date}]`).join(', ');
  const request = new sql.Request();
  request.query(
    `
    SELECT cust_cd, CHAJ_CD, itmno, itm_nm, ${dategroup}
    FROM (
        SELECT A.cust_cd, A.itmno, ISNULL(A.scan_qty, 0) AS scan_qty, A.sal_ymd,B.CHAJ_CD, B.ITM_NM
        FROM sal_order A
        LEFT JOIN ITM_MST B ON A.itmno = B.itmno
        WHERE A.sal_ymd BETWEEN '${date1}' AND '${date2}' and A.cust_cd like '${customer}'
    ) AS source
    PIVOT (
      SUM(scan_qty) FOR sal_ymd IN (${dategroup})
    ) AS pivot_table
    `,
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
app.post('/api/getpallets', (req, res) => {
  const { params } = req.body;
  const date1 = params.date1.replace(/-/g, '');
  const date2 = params.date2.replace(/-/g, '');
  const line = params.line;
  const request = new sql.Request();
  request.query(
    `
    select top 100 A.*, B.ITM_NM from PRD_TAG A left join ITM_MST B on A.ITMNO=B.ITMNO where PRD_YMD between '${date1}' AND '${date2}' and LINE_CD like '${line}'
    `,
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
// app.post('/api/logout', (req, res) => {
//   req.session.destroy();
//   res.json({ message: 'Logout successful' });
// });

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
app.get('/main', isLoggedIn, async (req, res) => {
  const userId = req.session.userId;
  const user = users.find((user) => user.id === userId);

  if (user) {
    res.json({ message: 'Welcome to main page', user: user });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});
// 미들웨어: 요청마다 로그인 여부 확인
app.use((req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});
// app.post("/getlist", (req, res) => {
//   const { params } = req.body;
//   const date = params[0].trim();
//   const trailer = params[1].trim();
//   const cust = params[2].trim();
//   const request = new sql.Request();
//   request.query(
//     `select TOP 100 * from SAL_ORDER where SAL_YMD=${date} and TRAILER_NO='${trailer}' and CUST_CD='${cust}' order by ITMNO
//       `,
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         res.sendStatus(500);
//         return;
//       }
//       res.send(result);
//     }
//   );
// });
// app.post("/getproductlist", (req, res) => {
//   const { params } = req.body;
//   console.log(params);
//   // const date = params[0].trim();
//   // const trailer = params[1].trim();
//   // const cust = params[2].trim();
//   const request = new sql.Request();
//   request.query(
//     `select TOP 100 * from SAL_PART where STAG_NO='${params}' order by SCAN_DTTM desc
//       `,
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         res.sendStatus(500);
//         return;
//       }
//       res.send(result);
//     }
//   );
// });

// app.post("/chkdup", (req, res) => {
//   const a = req.body.params;
//   console.log(a);
//   // const date = params[0].trim();
//   // const cust = params[1].trim();
//   const request = new sql.Request();
//   request.query(
//     `select top 100 * from  SAL_HIST where STAG_NO='${a}' and NOW_ST='1'
//       `,
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         res.sendStatus(500);
//         return;
//       }
//       res.send(result);
//     }
//   );
// });
// app.post("/chkpo", (req, res) => {
//   const a = req.body.params;
//   console.log(a);
//   // const date = params[0].trim();
//   // const cust = params[1].trim();
//   const request = new sql.Request();
//   request.query(
//     `select top 100 * from  TB_PO_INFO where PART_NO='${a.ITMNO}' and CUST_CODE='${a.CUST_CD}'
//       `,
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         res.sendStatus(500);
//         return;
//       }
//       res.send(result);
//     }
//   );
// });
// app.post("/chkitmno", (req, res) => {
//   const a = req.body.params;
//   console.log(a);
//   // const date = params[0].trim();
//   // const cust = params[1].trim();
//   const request = new sql.Request();
//   request.query(
//     `select top 100 * from ITM_MST where ITMNO='${a}'
//       `,
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         res.sendStatus(500);
//         return;
//       }
//       console.log(result);
//       res.send(result);
//     }
//   );
// });
// app.post("/chkalc", (req, res) => {
//   const a = req.body.params;
//   console.log(a);
//   const itm = a[0].trim();
//   const alc = a[1].trim();
//   const request = new sql.Request();
//   request.query(
//     `select top 100 * from ITM_MST where ITMNO='${itm}' and ECO_NO='${alc}'
//       `,
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         res.sendStatus(500);
//         return;
//       }
//       console.log(result);
//       res.send(result);
//     }
//   );
// });
// app.post("/chkprdno", (req, res) => {
//   const a = req.body.params;
//   console.log(a);
//   // const itm = a[0].trim();
//   // const alc = a[1].trim();
//   const request = new sql.Request();
//   request.query(
//     `select top 100 * from SAL_PART where PART_LABEL='${a}'
//       `,
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         res.sendStatus(500);
//         return;
//       }
//       console.log(result);
//       res.send(result);
//     }
//   );
// });

// app.post("/isshaft", (req, res) => {
//   const a = req.body.params;
//   console.log(a);
//   const scan = a[0];
//   const code = a[1];
//   console.log(scan.TMP_ITMNO);
//   console.log(code);
//   const request = new sql.Request();
//   request.query(
//     `select top 100 * from ITM_MST where ITMNO='${scan.TMP_ITMNO}' and GUB_CD='${code}'
//       `,
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         res.sendStatus(500);
//         return;
//       }
//       console.log(result);
//       res.send(result);
//     }
//   );
// });

app.post('/getscandetail', (req, res) => {
  const { params } = req.body;
  const date = params[0].trim();
  const trailer = params[1].trim();
  const itm = params[2].trim();
  const request = new sql.Request();
  request.query(
    `select TOP 100 * from SAL_HIST where SAL_YMD=${date} and TRAILER_NO='${trailer}' order by OUT_FLAG desc
      `,
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

app.post('/api/inserthist', (req, res) => {
  const { params } = req.body;
  console.log('inserthist', params);
  const selectd = params[0];
  const scand = params[1];
  const today1 = params[2];
  const today2 = params[3];
  const code = params[4];
  const request = new sql.Request();
  request.query(
    `insert into SAL_HIST values('${scand.TMP_ITMNO}','${scand.TMP_SERNO}','${today1}',${scand.TMP_QTY},'${selectd.SAL_YMD}','${selectd.TRAILER_NO}','${selectd.CUST_CD}','${selectd.ASN_NO}','${code}',${today2},'')
      `,
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
// app.post("/insertproduct", (req, res) => {
//   const { params } = req.body;
//   console.log("insertproduct", params);
//   const stagno = params[0];
//   const partlabel = params[1];
//   const tagpart = params[2];
//   const labelpart = params[3];
//   const dttm = params[4];
//   const request = new sql.Request();
//   request.query(
//     `insert into SAL_PART values('${stagno}','${partlabel}','${tagpart}','${labelpart}',${dttm})
//       `,
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         res.sendStatus(500);
//         return;
//       }
//       res.send(result);
//     }
//   );
// });
app.post('/api/updateorder', (req, res) => {
  const { params } = req.body;
  console.log('updateorder', params);
  const selectd = params[0];
  const scanqty = params[1];
  const scanbox = params[2];
  const today3 = params[3];
  const code = params[4];
  const request = new sql.Request();
  request.query(
    `update SAL_ORDER set SCAN_QTY=${scanqty},SCAN_BOX=${scanbox},SCAN_HM='${today3}',NOW_ST='${code}' where SAL_YMD='${selectd.SAL_YMD}' and TRAILER_NO='${selectd.TRAILER_NO}'and ITMNO='${selectd.ITMNO}'      `,
    (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      console.log(result);
      res.send(result);
    }
  );
});
app.post('/api/updateprdtag', (req, res) => {
  const { params } = req.body;
  console.log('updateprdtag', params);
  const TMP_SERNO = params[0];
  const today1 = params[1];
  const request = new sql.Request();
  request.query(
    `update PRD_TAG set OUT_FLAG='${today1}' where STAG_NO='${TMP_SERNO}' `,
    (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      console.log(result);
      res.send(result);
    }
  );
});
// app.post("/updatecontainer", (req, res) => {
//   const { params } = req.body;
//   console.log(params);
//   const con = params[0];
//   const selectd = params[1];
//   // const scanbox = params[2];
//   // const today3 = params[3];
//   // const code = params[4];
//   // const request = new sql.Request();
//   // request.query(
//   //   `update SAL_ORDER set CONTAINER_NO='${con}',NOW_ST='3' where SAL_YMD='${selectd.date}' and TRAILER_NO='${selectd.trail}'  `,
//   //   (err, result) => {
//   //     if (err) {
//   //       console.log(err);
//   //       res.sendStatus(500);
//   //       return;
//   //     }
//   //     console.log(result);
//   //     res.send(result);
//   //   }
//   // );
// });
