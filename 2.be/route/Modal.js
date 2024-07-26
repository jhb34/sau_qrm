const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.post('/getitems', (req, res) => {
  const { params } = req.body;
  console.log(params);
  const search = params.search.trim();
  const query = `SELECT A.*, B.ASDES PUMMK, C.ASDES CHAJONG
FROM BAS_ITMSTPF A
LEFT OUTER JOIN COM_ACODERP B ON A.PUM_CD = B.ASGUB AND B.ADGUB = 'P01'
LEFT OUTER JOIN COM_ACODERP C ON A.CHJ_CD = C.ASGUB AND C.ADGUB = 'P03'
WHERE (A.ITMNO LIKE '%${search}%' OR UPPER(A.ITM_NM) LIKE '%${search}%') AND A.ACT_GB <> 'Z'  ORDER BY A.PUM_CD, A.CHJ_CD, A.ITMNO
        `;
  console.log(query);
  const request = new sql.Request();
  request.query(
    `SELECT rtrim(A.ITMNO) ITMNO, rtrim(A.ITM_NM) ITM_NM, B.ASDES PUMMK, C.ASDES CHAJONG
FROM BAS_ITMSTPF A
LEFT OUTER JOIN COM_ACODERP B ON A.PUM_CD = B.ASGUB AND B.ADGUB = 'P01'
LEFT OUTER JOIN COM_ACODERP C ON A.CHJ_CD = C.ASGUB AND C.ADGUB = 'P03'
WHERE (A.ITMNO LIKE '%${search}%' OR UPPER(A.ITM_NM) LIKE '%${search}%') AND A.ACT_GB <> 'Z'  ORDER BY A.PUM_CD, A.CHJ_CD, A.ITMNO
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
