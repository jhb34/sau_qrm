const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/getstate', (req, res) => {
  const request = new sql.Request();
  request.query(
    "select top 100 * from COM_ACODERP where adgub='Q09' order by ASGUB",
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
// router.get('/getlines', (req, res) => {
//   const request = new sql.Request();
//   request.query(
//     "select A.WRK_CD from  BAS_WRKCTPF A WHERE A.ACT_GB = 'A' order by A.WRK_CD",
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
// router.get('/getvendors', (req, res) => {
//   const request = new sql.Request();
//   request.query(
//     "SELECT A.CST_CD, B.CST_NM FROM BAS_DANGA A LEFT OUTER JOIN COM_CUSTP B ON A.CST_CD = B.CST_CD WHERE LEFT(PRC_CD,1)='B'GROUP BY A.CST_CD, B.CST_NM ORDER BY B.CST_NM",
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
// router.get('/getERR', (req, res) => {
//   const request = new sql.Request();
//   request.query(
//     "select top 100 * from COM_ACODERP where adgub='Q02' and AFILL='Y' order by ASGUB",
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

router.post('/getlists', (req, res) => {
  const { params } = req.body;
  const date1 = params.date1.trim();
  const date2 = params.date2.trim();
  const state = params.state.trim();
  const request = new sql.Request();
  request.query(
    `SELECT A.*,A.JDATE+'-'+CAST(A.JSER as char) defect_number, ISNULL(B.ASDES,'') ERR_CD1_NM, ISNULL(C.ASDES,'') ERR_CD2_NM, ISNULL(D.KNAME,'') KNAME, E.ASDES STS_NM, ISNULL(F.ASDES,'') M4_NM, ISNULL(G.ASDES,'') REP_NM,ISNULL(H.KNAME,'') DNAME FROM QCM_DAMAGPF A
    LEFT OUTER JOIN COM_ACODERP B ON A.ERR_CD1=B.ASGUB AND B.ADGUB='Q02'
    LEFT OUTER JOIN COM_ACODERP C ON A.ERR_CD2=C.ASGUB AND C.ADGUB='Q03' 
    LEFT OUTER JOIN COM_AKMSTRP D ON A.PMAN=D.SABUN
    LEFT OUTER JOIN COM_ACODERP E ON A.STS=E.ASGUB AND E.ADGUB='Q09' 
    LEFT OUTER JOIN COM_ACODERP F ON A.ERR_4M = F.ASGUB AND F.ADGUB ='Q01' 
    LEFT OUTER JOIN COM_ACODERP G ON A.REP_GB = G.ASGUB AND G.ADGUB ='Q04'
    LEFT OUTER JOIN COM_AKMSTRP H ON A.TMAN=H.SABUN
    WHERE A.GDATE BETWEEN '${date1}' AND '${date2}'  AND STS like '${state}' ORDER BY A.GDATE
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

module.exports = router;
