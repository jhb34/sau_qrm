<template>
  <div style="position: relative">
    <div class="fixed-header">
      <h1>NCR Document (Edit)</h1>
      <div>
        <label>NCR Number</label>
        <input type="text" v-model="NCR_number" disabled />
      </div>
      <div>
        <label>작성자</label>
        <input type="text" disabled />
      </div>
      <div>
        <button class="btns" style="margin-left: 2rem" @click="updateNcr">
          Edit
        </button>
        <button class="btnc" style="margin-left: 2rem" @click="goToNcrList">
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
            <input
              type="text"
              v-model="ITMNO"
              id="ITMNO"
              @click="showModal = true"
              autocomplete="off"
            />
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
          <div class="img-tag">
            <span>사진 1</span>
            <button
              @click="$refs.img1.click()"
              style="font-weight: 600; cursor: pointer"
            >
              {{ upload.img1 === '' ? 'Upload Image' : 'Change Image' }}
            </button>
            <button
              v-if="upload.img1 !== ''"
              @click="deleteIMG1"
              style="
                width: 1.2rem;
                height: 1.2rem;
                cursor: pointer;
                padding: 0;
                background-color: red;
                color: white;
                margin-left: 0.5rem;
              "
            >
              X
            </button>
            <input
              type="file"
              accept="image/png, image/jpeg"
              @change="uploadImage($event.target.files, 1)"
              ref="img1"
              style="display: none"
            />
          </div>
          <img :src="imgSrc" alt="" />
        </div>
        <div class="img-box">
          <div class="img-tag">
            <span>사진 2</span>
            <button
              @click="$refs.img2.click()"
              style="font-weight: 600; cursor: pointer"
            >
              {{ upload.img2 === '' ? 'Upload Image' : 'Change Image' }}
            </button>
            <button
              v-if="upload.img2 !== ''"
              @click="deleteIMG2"
              style="
                width: 1.2rem;
                height: 1.2rem;
                cursor: pointer;
                padding: 0;
                background-color: red;
                color: white;
                margin-left: 0.5rem;
              "
            >
              X
            </button>
            <input
              type="file"
              accept="image/png, image/jpeg"
              @change="uploadImage($event.target.files, 2)"
              ref="img2"
              style="display: none"
            />
          </div>
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
              <td style="text-align: center; font-weight: 900">임시대책</td>
              <td>
                <input type="text" v-model="TMP_TX" style="width: 100%" />
              </td>
              <td style="text-align: center">
                <a
                  v-if="upload.file1 !== ''"
                  :href="`${serverUrl}/uploads/${upload.file1}`"
                  style="
                    font-weight: 600;
                    cursor: pointer;
                    color: white;
                    background: #007bff;
                    padding: 0.5rem;
                  "
                >
                  Download
                </a>
                <button
                  @click="$refs.file1.click()"
                  style="font-weight: 600; cursor: pointer; margin-left: 1rem"
                >
                  {{ upload.file1 === '' ? 'Upload' : 'Change' }}
                </button>
                <button
                  v-if="upload.file1 !== ''"
                  @click="upload.file1 = ''"
                  style="
                    width: 1.2rem;
                    height: 1.2rem;
                    cursor: pointer;
                    padding: 0;
                    background-color: red;
                    color: white;
                    margin-left: 0.5rem;
                  "
                >
                  X
                </button>
                <input
                  type="file"
                  @change="uploadFile($event.target.files, 1)"
                  ref="file1"
                  style="display: none"
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
              <td style="text-align: center; font-weight: 900">개선대책</td>
              <td>
                <input type="text" v-model="IMP_TX" style="width: 100%" />
              </td>
              <td style="text-align: center">
                <a
                  v-if="upload.file2 !== ''"
                  :href="`${serverUrl}/uploads/${upload.file2}`"
                  style="
                    font-weight: 600;
                    cursor: pointer;
                    color: white;
                    background: #007bff;
                    padding: 0.5rem;
                  "
                >
                  Download
                </a>
                <button
                  @click="$refs.file2.click()"
                  style="font-weight: 600; cursor: pointer; margin-left: 1rem"
                >
                  {{ upload.file2 === '' ? 'Upload' : 'Change' }}
                </button>
                <button
                  v-if="upload.file2 !== ''"
                  @click="upload.file2 = ''"
                  style="
                    width: 1.2rem;
                    height: 1.2rem;
                    cursor: pointer;
                    padding: 0;
                    background-color: red;
                    color: white;
                    margin-left: 0.5rem;
                  "
                >
                  X
                </button>
                <input
                  type="file"
                  @change="uploadFile($event.target.files, 2)"
                  ref="file2"
                  style="display: none"
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
              <td style="text-align: center; font-weight: 900">유효성평가</td>
              <td>
                <input type="text" v-model="EFT_TX" style="width: 100%" />
              </td>
              <td style="text-align: center">
                <a
                  v-if="upload.file3 !== ''"
                  :href="`${serverUrl}/uploads/${upload.file3}`"
                  style="
                    font-weight: 600;
                    cursor: pointer;
                    color: white;
                    background: #007bff;
                    padding: 0.5rem;
                  "
                >
                  Download
                </a>
                <button
                  @click="$refs.file3.click()"
                  style="font-weight: 600; cursor: pointer; margin-left: 1rem"
                >
                  {{ upload.file3 === '' ? 'Upload' : 'Change' }}
                </button>
                <button
                  v-if="upload.file3 !== ''"
                  @click="upload.file3 = ''"
                  style="
                    width: 1.2rem;
                    height: 1.2rem;
                    cursor: pointer;
                    padding: 0;
                    background-color: red;
                    color: white;
                    margin-left: 0.5rem;
                  "
                >
                  X
                </button>
                <input
                  type="file"
                  @change="uploadFile($event.target.files, 3)"
                  ref="file3"
                  style="display: none"
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
    <Modal
      v-if="showModal"
      @close="showModal = false"
      @select="handleSelect"
      :str="ITMNO"
    />
  </div>
</template>
<script>
import Modal from './ModalForm.vue'
export default {
  components: { Modal: Modal },
  data() {
    return {
      showModal: false,
      input: '',
      data: '',
      REGI_YMD: new Date().toISOString().slice(0, 10),
      OCR_YMD: new Date().toISOString().slice(0, 10),
      NCR_NO: 1,
      NCR_number: '',
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
  created() {
    this.input = this.$route.query
    this.getERR1()
    this.getERR2()
    this.getERR3()
    this.getREP()
    this.getlines()
    this.getvendors()
  },
  mounted() {
    this.getJanuaryFirst()
    this.getData()
  },
  unmounted() {},
  methods: {
    // 시작일 매년 1월1일로
    getJanuaryFirst() {
      const currentYear = new Date().getFullYear() // 현재 연도 가져오기
      const januaryFirst = new Date(currentYear, 0, 1) // 올해의 1월 1일 생성
      this.dateValue1 = januaryFirst.toISOString().slice(0, 10)
    },
    handleSelect(item) {
      this.ITMNO = item
    },
    deleteIMG1() {
      this.upload.img1 = ''
      this.imgSrc = ''
    },
    deleteIMG2() {
      this.upload.img2 = ''
      this.imgSrc2 = ''
    },
    formatDate(dateString) {
      // Ensure the input is a string
      dateString = dateString.toString()
      // Extract year, month, and day from the input string
      const year = dateString.slice(0, 4)
      const month = dateString.slice(4, 6)
      const day = dateString.slice(6, 8)
      // Construct the formatted date string
      return `${year}-${month}-${day}`
    },
    goToNcrList() {
      this.$router.push({
        path: '/ncrlist'
      })
    },
    async getncrno() {
      const r = await this.$post('/api/ncr/getncrno', {
        params: {
          REGI_YMD: this.REGI_YMD.replace(/-/g, '')
        }
      })
      console.log(r)
      if (r === undefined) {
        alert('Error at getData')
        return
      }
      // console.log(r.data.recordset)
      const aaa = r.data.recordset[0].max
      console.log('aaa', aaa)
      console.log(typeof aaa)
      this.NCR_NO = aaa + 1
    },
    async getData() {
      const r = await this.$post('/api/ncr/getdata', {
        params: { REGI_YMD: this.input.REGI_YMD, NCR_NO: this.input.NCR_NO }
      })
      if (r === undefined) {
        alert('Error at getData')
        return
      }
      console.log('getData', r)
      const data = r.data.recordset[0]
      console.log(data)
      // Object.assign(this, data)
      this.REGI_YMD = this.formatDate(data.REGI_YMD)
      this.NCR_NO = data.NCR_NO
      this.NCR_number = data.NCR_number
      this.NCR_ST = data.NCR_ST
      this.NCR_TX = data.NCR_TX
      this.OCR_YMD = this.formatDate(data.OCR_YMD)
      this.ITMNO = data.ITMNO
      this.LOT_NO = data.LOT_NO
      this.OCR_QTY = data.OCR_QTY
      this.LOT_QTY = data.LOT_QTY
      this.ERR_CD1 = data.ERR_CD1.trim()
      this.ERR_CD2 = data.ERR_CD2.trim()
      this.ERR_4M = data.ERR_4M.trim()
      this.ERR_END = data.ERR_END
      this.REP_GB = data.REP_GB.trim()
      this.WRK_CD = data.WRK_CD.trim()
      if (
        data.WRK_CD.startsWith('C') ||
        data.WRK_CD.startsWith('F') ||
        data.WRK_CD.startsWith('R')
      ) {
        await this.getruts()
        this.RUT_CD = data.RUT_CD.trim()
      }
      this.OCR_TX = data.OCR_TX
      this.upload.img1 = data.PIC_FILE1
      this.upload.img2 = data.PIC_FILE2
      this.TMP_ST = data.TMP_ST
      this.TMP_YMD = data.TMP_YMD
      this.TMP_TX = data.TMP_TX
      this.upload.file1 = data.TMP_FILE
      this.IMP_ST = data.IMP_ST
      this.IMP_YMD = data.IMP_YMD
      this.IMP_TX = data.IMP_TX
      this.upload.file2 = data.IMP_FILE
      this.EFT_ST = data.EFT_ST
      this.EFT_YMD = data.EFT_YMD
      this.EFT_TX = data.EFT_TX
      this.upload.file3 = data.EFT_FILE
      this.MSR_ST = data.MSR_ST
      this.FMEA_FL = data.FMEA_FL
      this.DMG_TAG = data.DMG_TAG
      this.FMEA_TAG = data.FMEA_TAG
      this.CST_CD = data.CST_CD
      this.AJIKJ = data.AJIKJ
      this.imgSrc = `${this.serverUrl}/images/${data.PIC_FILE1}`
      this.imgSrc2 = `${this.serverUrl}/images/${data.PIC_FILE2}`

      // {this.REGI_YMD.replace(/-/g, ''),this.NCR_NO,this.NCR_ST,this.NCR_TX,this.OCR_YMD.replace(/-/g, ''),this.ITMNO,this.LOT_NO,this.OCR_QTY,this.LOT_QTY,this.ERR_CD1,this.ERR_CD2,this.ERR_4M,this.ERR_END,this.REP_GB,this.WRK_CD,this.RUT_CD,this.OCR_TX,this.upload.img1,this.upload.img2,this.TMP_ST,this.TMP_YMD,this.TMP_TX,this.upload.file1,this.IMP_ST,this.IMP_YMD,this.IMP_TX,this.upload.file2,this.EFT_ST,this.EFT_YMD,this.EFT_TX,this.upload.file3,this.MSR_ST,this.FMEA_FL,this.DMG_TAG,this.FMEA_TAG,this.CST_CD,this.AJIKJ } = data
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
    async updateNcr() {
      if (this.NCR_TX === '') {
        alert('Fill Title')
        return
      }
      if (this.ITMNO === '') {
        alert('Fill Item Number')
        return
      }
      if (this.OCR_QTY < 1) {
        alert('Fill defect Qty')
        return
      }
      const r = await this.$post('/api/ncr/updatencr', {
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
      if (r.status === 200) {
        alert('Edited successfully')
        this.goToNcrList()
      } else {
        alert('An error occurred. Please contact the IT team')
        this.goToNcrList()
      }
    },
    excelExport() {
      if (this.data === '') {
        return alert('There is no data to Export')
      }
      this.$excelFromTable(this.headers, this.data, 'Export', {})
    },
    async uploadImage(files, type) {
      console.log('files', files)
      console.log('files0', files[0])
      console.log('files1', files.length)
      const r = await this.$upload('/api/upload/image', files[0])
      console.log('response', r)
      console.log('serverurl', this.serverUrl)
      if (type === 1) {
        this.imgSrc = `
        ${this.serverUrl}/images/${r.data.filename}`
      } else {
        this.imgSrc2 = `${this.serverUrl}/images/${r.data.filename}`
      }
      if (files.length === 0) {
        this.upload[`img${type}`] = ''
      } else {
        this.upload[`img${type}`] = r.data.filename
      }
    },
    async uploadFile(files, type) {
      console.log('files', files)
      const r = await this.$upload('/api/upload/file', files[0])
      console.log('response', r)
      if (files.length === 0) {
        this.upload[`file${type}`] = ''
      } else {
        this.upload[`file${type}`] = r.data.filename
      }
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
  z-index: 5; /* 다른 요소 위에 표시되도록 설정 */
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
  box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.1),
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
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
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
.img-tag {
  display: flex;
  margin-bottom: 0.3rem;
  align-items: center;
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
