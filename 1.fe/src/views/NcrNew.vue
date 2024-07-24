<template>
  <div style="position: relative">
    <div class="fixed-header">
      <h1>NCR Document 입력</h1>
      <div>
        <button class="btns" style="margin-left: 2rem" @click="insertncr">
          Save
        </button>
        <button class="btnc" style="margin-left: 2rem" @click="insertncr">
          Cancel
        </button>
      </div>
    </div>
    <div class="content">
      <div class="title1">기본정보</div>
      <div class="box">
        <div class="category">
          <p>
            <label>등록일자</label>
            <input type="date" v-model="REGI_YMD" disabled />
          </p>
          <p>
            <label for="OCR_YMD">발생일자</label>
            <input type="date" v-model="OCR_YMD" id="OCR_YMD" />
          </p>
          <p>
            <label for="NCR_TX">제목</label>
            <input type="text" v-model="NCR_TX" id="NCR_TX" />
          </p>
          <p>
            <label for="ITMNO">품번</label>
            <input type="text" v-model="ITMNO" id="ITMNO" />
          </p>
          <p>
            <label for="LOT_NO">LOT No</label>
            <input type="text" v-model="LOT_NO" id="LOT_NO" />
          </p>
          <p>
            <label for="REP_GB">귀책구분</label>
            <select id="REP_GB" v-model="REP_GB">
              <option v-for="a in REP_GBs" :key="a" :value="a.ASGUB">
                {{ a.ASDES }}
              </option>
            </select>
          </p>
          <p v-if="['A', 'B'].includes(REP_GB)">
            <label for="WRK_CD">라인</label>
            <select id="WRK_CD" v-model="WRK_CD" @change="getruts">
              <option v-for="a in lines" :key="a" :value="a.WRK_CD">
                {{ a.WRK_CD }}
              </option>
            </select>
          </p>
          <p v-if="['A', 'B'].includes(REP_GB)">
            <label for="line_process">공정</label>
            <select id="line_process" v-model="RUT_CD">
              <option v-for="a in line_processes" :key="a" :value="a.RUT_CD">
                {{ a.RUT_CD }}
              </option>
            </select>
          </p>
          <p v-if="!['A', 'B', ''].includes(REP_GB)">
            <label for="WRK_CD">업체</label>
            <select id="WRK_CD" v-model="WRK_CD">
              <option v-for="a in vendors" :key="a" :value="a.CST_CD">
                {{ a.CST_NM }}
              </option>
            </select>
          </p>
        </div>
        <div class="category">
          <p>
            <label for="OCR_QTY">불량수량</label>
            <input type="number" v-model="OCR_QTY" id="OCR_QTY" />
          </p>
          <p>
            <label for="ERR_CD1">불량구분</label>
            <select id="ERR_CD1" v-model="ERR_CD1">
              <option v-for="a in ERR_CD1s" :key="a" :value="a.ASGUB">
                {{ a.ASDES }}
              </option>
            </select>
          </p>
          <p>
            <label for="ERR_CD2">불량현상</label>
            <select id="ERR_CD2" v-model="ERR_CD2">
              <option v-for="a in ERR_CD2s" :key="a" :value="a.ASGUB">
                {{ a.ASDES }}
              </option>
            </select>
          </p>
          <p>
            <label for="ERR_4M">4M</label>
            <select id="ERR_4M" v-model="ERR_4M">
              <option v-for="a in ERR_4Ms" :key="a" :value="a.ASGUB">
                {{ a.ASDES }}
              </option>
            </select>
          </p>
          <p>
            <label for="OCR_TX"
              >현상 및 <br />
              요구사항</label
            >
            <textarea name="" id="OCR_TX" v-model="OCR_TX" />
          </p>
        </div>
      </div>
      <div></div>
      <div class="images">
        <div class="img-box">
          <span>사진 1</span>
          <input
            type="file"
            accept="image/png, image/jpeg"
            @change="uploadImage($event.target.files, 1)"
          />
          <img :src="imgSrc" alt="" />
        </div>
        <div class="img-box">
          <span>사진 2</span>
          <input
            type="file"
            accept="image/png, image/jpeg"
            @change="uploadImage($event.target.files, 2)"
          />
          <img :src="imgSrc2" alt="" />
        </div>
      </div>
      <div class="title2">대책서</div>
      <div>
        <table>
          <thead>
            <tr>
              <th style="width: 10%">구분</th>
              <th style="width: 50%">내용</th>
              <th>첨부파일</th>
              <th style="width: 15%">진행상태</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center">임시대책</td>
              <td>
                <input type="text" v-model="TMP_TX" style="width: 100%" />
              </td>
              <td>
                <input
                  type="file"
                  @change="uploadFile($event.target.files, 1)"
                  style="width: 100%"
                />
              </td>
              <td style="text-align: center">
                <div class="border">
                  <input
                    type="radio"
                    name="TMP"
                    id="TMPna"
                    v-model="TMP_ST"
                    value=""
                  />
                  <label for="TMPna">N/A</label>
                </div>
                <div class="border">
                  <input
                    type="radio"
                    name="TMP"
                    id="TMPpr"
                    v-model="TMP_ST"
                    value="1"
                  />
                  <label for="TMPpr">진행중</label>
                </div>
                <div class="border">
                  <input
                    type="radio"
                    name="TMP"
                    id="TMPco"
                    v-model="TMP_ST"
                    value="9"
                  />
                  <label for="TMPco">완료</label>
                </div>
              </td>
            </tr>
            <tr>
              <td style="text-align: center">개선대책</td>
              <td>
                <input type="text" v-model="IMP_TX" style="width: 100%" />
              </td>
              <td>
                <input
                  type="file"
                  @change="uploadFile($event.target.files, 2)"
                  style="width: 100%"
                />
              </td>
              <td style="text-align: center">
                <div class="border">
                  <input
                    type="radio"
                    name="IMP"
                    id="IMPna"
                    v-model="IMP_ST"
                    value=""
                  />
                  <label for="IMPna">N/A</label>
                </div>
                <div class="border">
                  <input
                    type="radio"
                    name="IMP"
                    id="IMPpr"
                    v-model="IMP_ST"
                    value="1"
                  />
                  <label for="IMPpr">진행중</label>
                </div>
                <div class="border">
                  <input
                    type="radio"
                    name="IMP"
                    id="IMPco"
                    v-model="IMP_ST"
                    value="9"
                  />
                  <label for="IMPco">완료</label>
                </div>
              </td>
            </tr>
            <tr>
              <td style="text-align: center">유효성평가</td>
              <td>
                <input type="text" v-model="EFT_TX" style="width: 100%" />
              </td>
              <td>
                <input
                  type="file"
                  @change="uploadFile($event.target.files, 3)"
                  style="width: 100%"
                />
              </td>
              <td style="text-align: center">
                <div class="border">
                  <input
                    type="radio"
                    name="EFT"
                    id="EFTna"
                    v-model="EFT_ST"
                    value=""
                  />
                  <label for="EFTna">N/A</label>
                </div>
                <div class="border">
                  <input
                    type="radio"
                    name="EFT"
                    id="EFTpr"
                    v-model="EFT_ST"
                    value="1"
                  />
                  <label for="EFTpr">진행중</label>
                </div>
                <div class="border">
                  <input
                    type="radio"
                    name="EFT"
                    id="EFTco"
                    v-model="EFT_ST"
                    value="9"
                  />
                  <label for="EFTco">완료</label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      headers: [
        { title: 'NCR No.', key: 'NCR_number' },
        { title: '등록일자', key: 'REGI_YMD' },
        { title: '발생일자', key: 'OCR_YMD' },
        { title: '제목', key: 'NCR_TX' },
        { title: '차종', key: 'CHJ_NM' },
        { title: '품번', key: 'ITMNO' },
        { title: '발생수량', key: 'OCR_QTY' },
        { title: '귀책구분', key: 'REP_NM' },
        { title: '라인/업체', key: 'WRK_CD' },
        { title: '불량구분', key: 'ERR_NM' },
        { title: '상태', key: 'NCR_ST' },
        { title: '유효성판정결과', key: 'EFT_TX' }
      ],
      REGI_YMD: new Date().toISOString().slice(0, 10),
      OCR_YMD: new Date().toISOString().slice(0, 10),
      NCR_NO: 2,
      NCR_ST: '2',
      NCR_TX: '',
      ITMNO: '',
      LOT_NO: '',
      OCR_QTY: '',
      LOT_QTY: 0,
      ERR_CD1: 'A01',
      ERR_CD1s: '',
      ERR_CD2: 'M01',
      ERR_CD2s: '',
      ERR_4M: 'A',
      ERR_4Ms: '',
      ERR_END: '',
      REP_GB: '',
      REP_GBs: '',
      WRK_CD: '',
      RUT_CD: '',
      OCR_TX: '',
      TMP_ST: '',
      TMP_TX: '',
      TMP_YMD: '',
      IMP_ST: '',
      IMP_TX: '',
      IMP_YMD: '',
      EFT_ST: '',
      EFT_TX: '',
      EFT_YMD: '',
      MSR_ST: '',
      FMEA_FL: '',
      DMG_TAG: '',
      FMEA_TAG: '',
      CST_CD: '',
      AJIKJ: '',
      lines: '',
      vendors: '',
      line_process: '',
      line_processes: '',
      imgSrc: '',
      imgSrc2: '',
      upload: {
        img1: '',
        img2: '',
        file1: '',
        file2: '',
        file3: ''
      }
    }
  },
  setup() {},
  created() {},
  mounted() {
    this.getERR1()
    this.getERR2()
    this.getERR3()
    this.getREP()
    this.getlines()
    this.getvendors()
    this.getJanuaryFirst()
  },
  unmounted() {},
  methods: {
    // 시작일 매년 1월1일로
    getJanuaryFirst() {
      const currentYear = new Date().getFullYear() // 현재 연도 가져오기
      const januaryFirst = new Date(currentYear, 0, 1) // 올해의 1월 1일 생성
      this.dateValue1 = januaryFirst.toISOString().slice(0, 10)
    },

    async getREP() {
      const r = await this.$get('/api/ncr/getREP')
      this.REP_GBs = r.recordset
    },
    async getlines() {
      const r = await this.$get('/api/ncr/getlines')
      this.lines = r.recordset
    },
    async getruts() {
      const r = await this.$post('/api/ncr/getruts', {
        params: { WRK_CD: this.WRK_CD }
      })
      console.log(r)
      if (r === undefined) {
        alert('Error at getData')
        return
      }
      // console.log(r.data.recordset)
      this.line_processes = r.data.recordset
    },
    async getvendors() {
      const r = await this.$get('/api/ncr/getvendors')
      this.vendors = r.recordset
    },
    // 불량구분
    async getERR1() {
      const r = await this.$get('/api/ncr/getERR1')
      this.ERR_CD1s = r.recordset
    },
    // 불량현상
    async getERR2() {
      const r = await this.$get('/api/ncr/getERR2')
      this.ERR_CD2s = r.recordset
    },
    // 4M
    async getERR3() {
      const r = await this.$get('/api/ncr/getERR3')
      this.ERR_4Ms = r.recordset
    },
    async getNCRLists() {
      const r = await this.$post('/api/ncr/getncrlists', {
        params: {
          date1: this.dateValue1.replace(/-/g, ''),
          date2: this.dateValue2.replace(/-/g, ''),
          REP_GB: this.REP_GB,
          WRK_CD: this.WRK_CD,
          ERR_GB: this.ERR_GB
        }
      })
      console.log(r)
      if (r === undefined) {
        alert('Error at getData')
        return
      }
      // console.log(r.data.recordset)
      this.data = r.data.recordset
    },
    async insertncr() {
      const r = await this.$post('/api/ncr/insertncr', {
        params: {
          REGI_YMD: this.REGI_YMD.replace(/-/g, ''),
          NCR_NO: this.NCR_NO,
          NCR_ST: this.NCR_ST,
          NCR_TX: this.NCR_TX,
          OCR_YMD: this.OCR_YMD.replace(/-/g, ''),
          ITMNO: this.ITMNO,
          LOT_NO: this.LOT_NO,
          OCR_QTY: this.OCR_QTY,
          LOT_QTY: this.LOT_QTY,
          ERR_CD1: this.ERR_CD1,
          ERR_CD2: this.ERR_CD2,
          ERR_4M: this.ERR_4M,
          ERR_END: this.ERR_END,
          REP_GB: this.REP_GB,
          WRK_CD: this.WRK_CD,
          RUT_CD: this.RUT_CD,
          OCR_TX: this.OCR_TX,
          PIC_FILE1: this.upload.img1,
          PIC_FILE2: this.upload.img2,
          TMP_ST: this.TMP_ST,
          TMP_YMD: this.TMP_YMD,
          TMP_TX: this.TMP_TX,
          TMP_FILE: this.upload.file1,
          IMP_ST: this.IMP_ST,
          IMP_YMD: this.IMP_YMD,
          IMP_TX: this.IMP_TX,
          IMP_FILE: this.upload.file2,
          EFT_ST: this.EFT_ST,
          EFT_YMD: this.EFT_YMD,
          EFT_TX: this.EFT_TX,
          EFT_FILE: this.upload.file3,
          MSR_ST: this.MSR_ST,
          FMEA_FL: this.FMEA_FL,
          DMG_TAG: this.DMG_TAG,
          FMEA_TAG: this.FMEA_TAG,
          CST_CD: this.CST_CD,
          AJIKJ: this.AJIKJ
        }
      })
      console.log(r)
    },
    excelExport() {
      if (this.data === '') {
        return alert('There is no data to Export')
      }
      this.$excelFromTable(this.headers, this.data, 'Export', {})
    },
    async uploadImage(files, type) {
      console.log('files', files)
      const r = await this.$upload('/api/upload/image', files[0])
      console.log('response', r)
      console.log('serverurl', this.serverUrl)
      if (type === 1) {
        this.imgSrc = `
      ${this.serverUrl}/images/${r.data.filename}`
      } else {
        this.imgSrc2 = `${this.serverUrl}/images/${r.data.filename}`
      }
      this.upload[`img${type}`] = r.data.filename
    },
    async uploadFile(files, type) {
      console.log('files', files)
      const r = await this.$upload('/api/upload/file', files[0])
      console.log('response', r)
      this.upload[`file${type}`] = r.data.filename
    }
  }
}
</script>
<style scoped>
.fixed-header {
  position: sticky;
  top: 0;
  width: 100%;
  background-color: #fff;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000; /* 다른 요소 위에 표시되도록 설정 */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content {
  padding-top: 2rem; /* 고정 헤더의 높이만큼 여백 추가 */
}

.btns {
  margin-right: 2rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btns:hover {
  background-color: #0056b3;
}
.btnc {
  margin-right: 2rem;
  padding: 0.5rem 1rem;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btnc:hover {
  background-color: darkred;
}
.title1 {
  display: inline-block;
  font-weight: 700;
  padding: 0.2rem;
  border: 1px solid black;
  border-width: 0 0 1px;
}
.title2 {
  display: inline-block;
  font-weight: 700;
  padding: 0.2rem;
  margin: 0.5rem 0;
  border: 1px solid black;
  border-width: 0 0 1px;
  margin-top: 2rem;
}
button {
  padding: 0.5rem;
}
.btn-off {
}
.btn-progress {
  margin-left: 0.5rem;
}
.btn-progress:hover {
  background: yellow;
  color: black;
}
.btn-complete {
  margin-left: 0.5rem;
}
.btn-complete:hover {
  background: green;
  color: white;
}
.box {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}
.category {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1rem 2rem;
  display: grid;
  gap: 0.5rem;
}
.category:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
p {
  margin-bottom: 0.3rem;
  line-height: 2;
  display: grid;
  grid-template-columns: 8rem 1fr;
  align-items: center;
}
label {
  text-align: center;
  font-weight: 700;
}
input,
select {
  padding: 0.3rem 0.2rem;
  border: 1px solid lightgray;
}
textarea {
  padding: 0.3rem 0.2rem;
  border: 1px solid lightgray;
  height: 10rem;
}
input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #9ecaed;
  box-shadow: 0 0 10px #9ecaed;
}
img {
  display: block;
  width: 100%;
  max-height: 600px;
  object-fit: contain;
}
span {
  margin-right: 0.4rem;
  color: white;
  font-weight: 700;
  background: darkorange;
  padding: 0.4rem;
}
.images {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 2rem;
}
.border {
  display: inline;
  padding: 0.5rem;
}
@media (min-width: 1120px) {
  .images,
  .box {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}
.img-box {
  input {
    width: 18rem;
  }
}
</style>
