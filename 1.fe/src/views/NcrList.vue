<template>
  <div>
    <h1>NCR List</h1>
    <br />
    <hr />
    <br />
    <div>
      등록일자: From
      <input
        type="date"
        style="margin-left: 0.5rem; margin-right: 1rem"
        v-model="dateValue1"
      />
      To
      <input type="date" style="margin-left: 0.5rem" v-model="dateValue2" />
      <span>
        <label for="OCR_PLC">발생장소</label>
        <select id="OCR_PLC" v-model="OCR_PLC">
          <option value="A">-ALL-</option>
          <option value="B">사내 (라인)</option>
          <option value="C">이동</option>
          <option value="D">고객</option>
        </select>
      </span>
      <span v-if="['B'].includes(OCR_PLC)">
        <label for="OCR_LINE">라인</label>
        <select id="OCR_LINE" v-model="WRK_CD" @change="getruts">
          <option v-for="a in lines" :key="a" :value="a.WRK_CD">
            {{ a.WRK_CD }}
          </option>
        </select>
      </span>
      <span v-if="['C'].includes(OCR_PLC)">
        <label for="OCR_SHIP">이동</label>
        <select id="OCR_SHIP" v-model="WRK_CD" @change="getruts">
          <option v-for="a in shippings" :key="a" :value="a.ASGUB">
            {{ a.ASDES }}
          </option>
        </select>
      </span>
      <span v-if="['D'].includes(OCR_PLC)">
        <label for="OCR_CUSTOMER">고객</label>
        <select id="OCR_CUSTOMER" v-model="WRK_CD">
          <option v-for="a in customers" :key="a" :value="a.ASGUB">
            {{ a.ASDES }}
          </option>
        </select>
      </span>

      <span>
        <label for="REP_GB">귀책</label>
        <select id="REP_GB" v-model="REP">
          <option value="A">-ALL-</option>
          <option value="B">사내 (부서)</option>
          <option value="C">업체</option>
          <option value="D">고객</option>
        </select>
      </span>
      <span v-if="['B'].includes(REP)">
        <label for="REP_TEAM">부서</label>
        <select id="REP_TEAM" v-model="REP_GB">
          <option v-for="a in teams" :key="a" :value="a.ASGUB">
            {{ a.ASDES }}
          </option>
        </select>
      </span>
      <span v-if="['C'].includes(REP)">
        <label for="REP_VENDOR">업체</label>
        <select id="REP_VENDOR" v-model="REP_GB">
          <option v-for="a in vendors" :key="a" :value="a.CST_CD">
            {{ a.CST_NM }}
          </option>
        </select>
      </span>
      <span v-if="['D'].includes(REP)">
        <label for="REP_CUSTOMER">고객</label>
        <select id="REP_CUSTOMER" v-model="REP_GB">
          <option v-for="a in customers" :key="a" :value="a.ASGUB">
            {{ a.ASDES }}
          </option>
        </select>
      </span>

      <!-- <label style="margin-left: 2rem" for="select">귀책구분</label>
      <select id="select" v-model="REP_GB" style="margin-left: 0.5rem">
        <option value="%">- ALL -</option>
        <option v-for="a in REP_GBs" :key="a" :value="a.ASGUB">
          {{ a.ASDES }}
        </option>
      </select>
      <label style="margin-left: 2rem" for="select">라인</label>
      <select id="select" v-model="WRK_CD" style="margin-left: 0.5rem">
        <option value="%">- ALL -</option>
        <option v-for="a in lines" :key="a" :value="a.WRK_CD">
          {{ a.WRK_CD }}
        </option>
      </select>
      <label style="margin-left: 2rem" for="select">업체</label>
      <select id="select" v-model="WRK_CD" style="margin-left: 0.5rem">
        <option value="%">- ALL -</option>
        <option v-for="a in vendors" :key="a" :value="a.CST_CD">
          {{ a.CST_NM }}
        </option>
      </select> -->
      <label style="margin-left: 2rem" for="select">불량구분</label>
      <select id="select" v-model="ERR_GB" style="margin-left: 0.5rem">
        <option value="%">- ALL -</option>
        <option v-for="a in ERR_GBs" :key="a" :value="a.ASGUB">
          {{ a.ASDES }}
        </option>
      </select>
      <button class="btn" style="margin-left: 2rem" @click="getNCRLists">
        Search
      </button>
      <button
        class="btn"
        style="margin-left: 2rem; background-color: darkorange"
        @click="excelExport"
      >
        Export
      </button>
      <button
        class="btn"
        style="margin-left: 2rem; background-color: green"
        @click="goToNcrForm"
      >
        New NCR
      </button>
    </div>
    <table class="table table-hover">
      <thead class="table-dark">
        <tr style="position: sticky; top: 0">
          <th v-for="b in headers" :key="b">{{ b.title }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in data" :key="a" @click="goToScan(a.NCR_number)">
          <td v-for="c in headers" :key="c">{{ a[c.key] }}</td>
        </tr>
      </tbody>
    </table>
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
        { title: '발생장소', key: 'OCR_PLC' },
        { title: '제목', key: 'NCR_TX' },
        { title: '품번', key: 'ITMNO' },
        { title: '발생수량', key: 'OCR_QTY' },
        { title: '귀책', key: 'REP_NM' },
        { title: '라인/업체', key: 'WRK_CD' },
        { title: '불량구분', key: 'ERR_NM' },
        { title: '상태', key: 'NCR_ST' },
        { title: '유효성판정결과', key: 'EFT_TX' }
      ],
      dateValue1: '',
      dateValue2: new Date().toISOString().slice(0, 10),
      data: '',
      REP_GB: '%',
      REP_GBs: '',
      lines: '',
      vendors: '',
      WRK_CD: '%',
      ERR_GB: '%',
      ERR_GBs: '',
      OCR_PLC: 'A',
      REP: 'A'
    }
  },
  setup() {},
  created() {},
  mounted() {
    this.getERR()
    this.getREP()
    this.getlines()
    this.getvendors()
    this.getJanuaryFirst()
    this.getteams()
    this.getshippings()
    this.getcustomers()
  },
  unmounted() {},
  methods: {
    // 시작일 매년 1월1일로
    getJanuaryFirst() {
      const currentYear = new Date().getFullYear() // 현재 연도 가져오기
      const januaryFirst = new Date(currentYear, 0, 1) // 올해의 1월 1일 생성
      this.dateValue1 = januaryFirst.toISOString().slice(0, 10)
    },
    goToScan(a) {
      const input = a
      const parts = input.split('-')
      const datePart = parts[0]
      const numberPart = parts[1]
      this.$router.push({
        path: '/ncredit',
        query: { REGI_YMD: datePart, NCR_NO: numberPart }
      })
    },
    async getcustomers() {
      const r = await this.$get('/api/ncr/getcustomers')
      this.customers = r.recordset
    },
    async getteams() {
      const r = await this.$get('/api/ncr/getteams')
      this.teams = r.recordset
    },
    async getshippings() {
      const r = await this.$get('/api/ncr/getshippings')
      this.shippings = r.recordset
    },
    async getREP() {
      const r = await this.$get('/api/ncr/getREP')
      this.REP_GBs = r.recordset
    },
    async getlines() {
      const r = await this.$get('/api/ncr/getlines')
      this.lines = r.recordset
    },
    async getvendors() {
      const r = await this.$get('/api/ncr/getvendors')
      this.vendors = r.recordset
    },
    async getERR() {
      const r = await this.$get('/api/ncr/getERR1')
      this.ERR_GBs = r.recordset
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
    excelExport() {
      if (this.data === '') {
        return alert('There is no data to Export')
      }
      this.$excelFromTable(this.headers, this.data, 'Export', {})
    },
    goToNcrForm() {
      this.$router.push({
        path: '/ncrnew'
      })
    }
  }
}
</script>
<style scoped>
table tbody tr:hover {
  background-color: lightblue;
  cursor: pointer;
}
</style>
