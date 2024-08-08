const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.post('/getncrno', (req, res) => {
  const { params } = req.body;
  console.log(params);
  const REGI_YMD = params.REGI_YMD;
  const request = new sql.Request();
  request.query(
    `select isnull(max(ncr_no),0) max from QCM_NCRMST where regi_ymd='${REGI_YMD}'`,
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
router.get('/getREP', (req, res) => {
  const request = new sql.Request();
  request.query(
    "select top 100 * from COM_ACODERP where adgub='Q04' and AFILL='Y' order by ASGUB",
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
router.get('/getlines', (req, res) => {
  const request = new sql.Request();
  request.query(
    "select rtrim(WRK_CD) WRK_CD from  BAS_WRKCTPF  WHERE ACT_GB = 'A' order by WRK_CD",
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
router.post('/getruts', (req, res) => {
  const { params } = req.body;
  const WRK_CD = params.WRK_CD.trim();
  const request = new sql.Request();
  request.query(
    `select rtrim(RUT_CD) RUT_CD from  BAS_RUTMST WHERE ACT_GB = 'A' and WRK_CD='${WRK_CD}' order by RUT_NO`,
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
router.get('/getvendors', (req, res) => {
  const request = new sql.Request();
  request.query(
    "SELECT A.CST_CD, B.CST_NM FROM BAS_DANGA A LEFT OUTER JOIN COM_CUSTP B ON A.CST_CD = B.CST_CD WHERE LEFT(PRC_CD,1)='B'GROUP BY A.CST_CD, B.CST_NM ORDER BY B.CST_NM",
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
router.get('/getcustomers', (req, res) => {
  const request = new sql.Request();
  request.query(
    "select rtrim(ASGUB) ASGUB,rtrim(ASDES) ASDES from COM_ACODERP where adgub='NC2' order by ASGUB",
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
router.get('/getteams', (req, res) => {
  const request = new sql.Request();
  request.query(
    "select rtrim(ASGUB) ASGUB,rtrim(ASDES) ASDES from COM_ACODERP where adgub='NC4' order by ASGUB",
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
router.get('/getshippings', (req, res) => {
  const request = new sql.Request();
  request.query(
    "select rtrim(ASGUB) ASGUB,rtrim(ASDES) ASDES from COM_ACODERP where adgub='NC1' order by ASGUB",
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
// 불량구분
router.get('/getERR1', (req, res) => {
  const request = new sql.Request();
  request.query(
    "select top 100 * from COM_ACODERP where adgub='Q02' and AFILL='Y' order by ASGUB",
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
// 불량현상
router.get('/getERR2', (req, res) => {
  const request = new sql.Request();
  request.query(
    "select top 100 * from COM_ACODERP where adgub='Q03' and AFILL='Y' order by ASGUB",
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
// 4M
router.get('/getERR3', (req, res) => {
  const request = new sql.Request();
  request.query(
    "select top 100 * from COM_ACODERP where adgub='Q01' and AFILL='Y' order by ASGUB",
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

router.post('/getncrlists', (req, res) => {
  const { params } = req.body;
  const date1 = params.date1.trim();
  const date2 = params.date2.trim();
  const REP_GB = params.REP_GB.trim();
  const WRK_CD = params.WRK_CD.trim();
  const ERR_GB = params.ERR_GB.trim();
  const request = new sql.Request();
  request.query(
    `select MST.*,MST.REGI_YMD+'-'+RIGHT('00' + CAST(MST.NCR_NO as varchar), 2) NCR_number, coalesce(CHJ.ASDES,'') CHJ_NM, coalesce(REP.ASDES,'') REP_NM, coalesce(ERR.ASDES,'') ERR_NM
      from (select * from QCM_NCRMST where REGI_YMD between '${date1}' and '${date2}' AND REP_GB like '${REP_GB}' AND WRK_CD like '${WRK_CD}'  AND ERR_CD1 like '${ERR_GB}' ) MST
      left outer join (select * from BAS_ITMSTPF) ITM on MST.ITMNO=ITM.ITMNO
      left outer join (select * from COM_ACODERP where ADGUB='P01') PUM on ITM.PUM_CD=PUM.ASGUB
      left outer join (select * from COM_ACODERP where ADGUB='P03') CHJ on ITM.CHJ_CD=CHJ.ASGUB
      left outer join (select * from COM_ACODERP where ADGUB='Q04') REP on MST.REP_GB=REP.ASGUB
      left outer join (select * from COM_ACODERP where ADGUB='Q02') ERR on MST.ERR_CD1=ERR.ASGUB
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

router.post('/getdata', (req, res) => {
  const { params } = req.body;
  console.log(params);
  const REGI_YMD = params.REGI_YMD;
  const NCR_NO = params.NCR_NO;
  const request = new sql.Request();
  request.query(
    `
 select 
 rtrim(EFT_FILE) EFT_FILE,
 rtrim(EFT_ST) EFT_ST,
 rtrim(EFT_TX) EFT_TX,
 rtrim(ERR_4M) ERR_4M,
 rtrim(ERR_CD1) ERR_CD1,
 rtrim(ERR_CD2) ERR_CD2,
 rtrim(IMP_FILE) IMP_FILE,
 rtrim(IMP_ST) IMP_ST,
 rtrim(IMP_TX) IMP_TX,
 rtrim(ITMNO) ITMNO,
 rtrim(LOT_NO) LOT_NO,
 rtrim(LOT_QTY) LOT_QTY,
 rtrim(NCR_NO) NCR_NO,
 rtrim(NCR_ST) NCR_ST,
 rtrim(NCR_TX) NCR_TX,
 rtrim(OCR_QTY) OCR_QTY,
 rtrim(OCR_TX) OCR_TX,
 rtrim(OCR_YMD) OCR_YMD,
 rtrim(PIC_FILE1) PIC_FILE1,
 rtrim(PIC_FILE2) PIC_FILE2,
 rtrim(REGI_YMD) REGI_YMD,
 rtrim(REP_GB) REP_GB,
 rtrim(RUT_CD) RUT_CD,
 rtrim(TMP_FILE) TMP_FILE,
 rtrim(TMP_ST) TMP_ST,
 rtrim(TMP_TX) TMP_TX,
 rtrim(WRK_CD) WRK_CD ,REGI_YMD+'-'+RIGHT('00' + CAST(NCR_NO as varchar), 2) NCR_number
 from QCM_NCRMST where REGI_YMD=${REGI_YMD} and NCR_NO='${NCR_NO}'
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

router.post('/insertncr', (req, res) => {
  const { params } = req.body;
  console.log(params);
  const REGI_YMD = params.REGI_YMD;
  const NCR_NO = params.NCR_NO;
  const NCR_ST = params.NCR_ST;
  const NCR_TX = params.NCR_TX;
  const OCR_YMD = params.OCR_YMD;
  const ITMNO = params.ITMNO;
  const LOT_NO = params.LOT_NO;
  const OCR_QTY = params.OCR_QTY;
  const LOT_QTY = params.LOT_QTY;
  const ERR_CD1 = params.ERR_CD1;
  const ERR_CD2 = params.ERR_CD2;
  const ERR_4M = params.ERR_4M;
  const ERR_END = params.ERR_END;
  const REP_GB = params.REP_GB;
  const WRK_CD = params.WRK_CD;
  const RUT_CD = params.RUT_CD;
  const OCR_TX = params.OCR_TX;
  const PIC_FILE1 = params.PIC_FILE1;
  const PIC_FILE2 = params.PIC_FILE2;
  const TMP_ST = params.TMP_ST;
  const TMP_YMD = params.TMP_YMD;
  const TMP_TX = params.TMP_TX;
  const TMP_FILE = params.TMP_FILE;
  const IMP_ST = params.IMP_ST;
  const IMP_YMD = params.IMP_YMD;
  const IMP_TX = params.IMP_TX;
  const IMP_FILE = params.IMP_FILE;
  const EFT_ST = params.EFT_ST;
  const EFT_YMD = params.EFT_YMD;
  const EFT_TX = params.EFT_TX;
  const EFT_FILE = params.EFT_FILE;
  const MSR_ST = params.MSR_ST;
  const FMEA_FL = params.FMEA_FL;
  const DMG_TAG = params.DMG_TAG;
  const FMEA_TAG = params.FMEA_TAG;
  const CST_CD = params.CST_CD;
  const AJIKJ = params.AJIKJ;
  const query = `
  insert into QCM_NCRMST ( REGI_YMD,NCR_NO,NCR_ST,NCR_TX,OCR_YMD,ITMNO,LOT_NO,OCR_QTY,LOT_QTY,ERR_CD1,ERR_CD2,ERR_4M,ERR_END,REP_GB,WRK_CD,RUT_CD,OCR_TX,PIC_FILE1,PIC_FILE2,TMP_ST,TMP_YMD,TMP_TX,TMP_FILE,IMP_ST,IMP_YMD,IMP_TX,IMP_FILE,EFT_ST,EFT_YMD,EFT_TX,EFT_FILE,MSR_ST, FMEA_FL, DMG_TAG, FMEA_TAG, CST_CD, AJIKJ )
  values ( '${REGI_YMD}',${NCR_NO},'${NCR_ST}','${NCR_TX}','${OCR_YMD}','${ITMNO}','${LOT_NO}',${OCR_QTY},${LOT_QTY},'${ERR_CD1}','${ERR_CD2}','${ERR_4M}','${ERR_END}','${REP_GB}','${WRK_CD}','${RUT_CD}','${OCR_TX}','${PIC_FILE1}','${PIC_FILE2}','${TMP_ST}','${TMP_YMD}','${TMP_TX}','${TMP_FILE}','${IMP_ST}','${IMP_YMD}','${IMP_TX}','${IMP_FILE}','${EFT_ST}','${EFT_YMD}','${EFT_TX}','${EFT_FILE}','${MSR_ST}','${FMEA_FL}','${DMG_TAG}','${FMEA_TAG}','${CST_CD}','${AJIKJ}')
      `;
  console.log(query);
  const request = new sql.Request();
  request.query(
    `
  insert into QCM_NCRMST ( REGI_YMD,NCR_NO,NCR_ST,NCR_TX,OCR_YMD,ITMNO,LOT_NO,OCR_QTY,LOT_QTY,ERR_CD1,ERR_CD2,ERR_4M,ERR_END,REP_GB,WRK_CD,RUT_CD,OCR_TX,PIC_FILE1,PIC_FILE2,TMP_ST,TMP_YMD,TMP_TX,TMP_FILE,IMP_ST,IMP_YMD,IMP_TX,IMP_FILE,EFT_ST,EFT_YMD,EFT_TX,EFT_FILE,MSR_ST, FMEA_FL, DMG_TAG, FMEA_TAG, CST_CD, AJIKJ )
  values ( '${REGI_YMD}',${NCR_NO},'${NCR_ST}','${NCR_TX}','${OCR_YMD}','${ITMNO}','${LOT_NO}',${OCR_QTY},${LOT_QTY},'${ERR_CD1}','${ERR_CD2}','${ERR_4M}','${ERR_END}','${REP_GB}','${WRK_CD}','${RUT_CD}','${OCR_TX}','${PIC_FILE1}','${PIC_FILE2}','${TMP_ST}','${TMP_YMD}','${TMP_TX}','${TMP_FILE}','${IMP_ST}','${IMP_YMD}','${IMP_TX}','${IMP_FILE}','${EFT_ST}','${EFT_YMD}','${EFT_TX}','${EFT_FILE}','${MSR_ST}','${FMEA_FL}','${DMG_TAG}','${FMEA_TAG}','${CST_CD}','${AJIKJ}')
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

router.post('/updatencr', (req, res) => {
  const { params } = req.body;
  console.log(params);
  const REGI_YMD = params.REGI_YMD;
  const NCR_NO = params.NCR_NO;
  const NCR_ST = params.NCR_ST;
  const NCR_TX = params.NCR_TX;
  const OCR_YMD = params.OCR_YMD;
  const ITMNO = params.ITMNO;
  const LOT_NO = params.LOT_NO;
  const OCR_QTY = params.OCR_QTY;
  const LOT_QTY = params.LOT_QTY;
  const ERR_CD1 = params.ERR_CD1;
  const ERR_CD2 = params.ERR_CD2;
  const ERR_4M = params.ERR_4M;
  const ERR_END = params.ERR_END;
  const REP_GB = params.REP_GB;
  const WRK_CD = params.WRK_CD;
  const RUT_CD = params.RUT_CD;
  const OCR_TX = params.OCR_TX;
  const PIC_FILE1 = params.PIC_FILE1;
  const PIC_FILE2 = params.PIC_FILE2;
  const TMP_ST = params.TMP_ST;
  const TMP_YMD = params.TMP_YMD;
  const TMP_TX = params.TMP_TX;
  const TMP_FILE = params.TMP_FILE;
  const IMP_ST = params.IMP_ST;
  const IMP_YMD = params.IMP_YMD;
  const IMP_TX = params.IMP_TX;
  const IMP_FILE = params.IMP_FILE;
  const EFT_ST = params.EFT_ST;
  const EFT_YMD = params.EFT_YMD;
  const EFT_TX = params.EFT_TX;
  const EFT_FILE = params.EFT_FILE;
  const MSR_ST = params.MSR_ST;
  const FMEA_FL = params.FMEA_FL;
  const DMG_TAG = params.DMG_TAG;
  const FMEA_TAG = params.FMEA_TAG;
  const CST_CD = params.CST_CD;
  const AJIKJ = params.AJIKJ;
  const query = `
  update QCM_NCRMST set NCR_ST='${NCR_ST}',NCR_TX='${NCR_TX}',OCR_YMD='${OCR_YMD}',ITMNO='${ITMNO}',LOT_NO='${LOT_NO}',OCR_QTY=${OCR_QTY},LOT_QTY=${LOT_QTY},ERR_CD1='${ERR_CD1}',ERR_CD2='${ERR_CD2}',ERR_4M='${ERR_4M}',ERR_END='${ERR_END}',REP_GB='${REP_GB}',WRK_CD='${WRK_CD}',RUT_CD='${RUT_CD}',OCR_TX='${OCR_TX}',PIC_FILE1='${PIC_FILE1}',PIC_FILE2='${PIC_FILE2}',TMP_ST='${TMP_ST}',TMP_YMD='${TMP_YMD}',TMP_TX='${TMP_TX}',TMP_FILE='${TMP_FILE}',IMP_ST='${IMP_ST}',IMP_YMD='${IMP_YMD}',IMP_TX='${IMP_TX}',IMP_FILE='${IMP_FILE}',EFT_ST='${EFT_ST}',EFT_YMD='${EFT_YMD}',EFT_TX='${EFT_TX}',EFT_FILE='${EFT_FILE}',MSR_ST='${MSR_ST}', FMEA_FL='${FMEA_FL}', DMG_TAG='${DMG_TAG}', FMEA_TAG='${FMEA_TAG}', CST_CD='${CST_CD}', AJIKJ='${AJIKJ}' where REGI_YMD=${REGI_YMD} and NCR_NO='${NCR_NO}'
      `;
  console.log(query);
  const request = new sql.Request();
  request.query(
    `
  update QCM_NCRMST set NCR_ST='${NCR_ST}',NCR_TX='${NCR_TX}',OCR_YMD='${OCR_YMD}',ITMNO='${ITMNO}',LOT_NO='${LOT_NO}',OCR_QTY=${OCR_QTY},LOT_QTY=${LOT_QTY},ERR_CD1='${ERR_CD1}',ERR_CD2='${ERR_CD2}',ERR_4M='${ERR_4M}',REP_GB='${REP_GB}',WRK_CD='${WRK_CD}',RUT_CD='${RUT_CD}',OCR_TX='${OCR_TX}',PIC_FILE1='${PIC_FILE1}',PIC_FILE2='${PIC_FILE2}',TMP_ST='${TMP_ST}',TMP_TX='${TMP_TX}',TMP_FILE='${TMP_FILE}',IMP_ST='${IMP_ST}',IMP_TX='${IMP_TX}',IMP_FILE='${IMP_FILE}',EFT_ST='${EFT_ST}',EFT_TX='${EFT_TX}',EFT_FILE='${EFT_FILE}' where REGI_YMD=${REGI_YMD} and NCR_NO='${NCR_NO}'
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
