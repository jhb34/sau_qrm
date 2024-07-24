<template>
  <div>
    <h1>NCR List</h1>
    <br />
    <hr />
    <br />
    <div>
      From
      <input
        type="date"
        style="margin-left: 0.5rem; margin-right: 1rem"
        v-model="dateValue1"
      />
      To
      <input type="date" style="margin-left: 0.5rem" v-model="dateValue2" />
      <label style="margin-left: 2rem" for="select">귀책구분</label>
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
      </select>
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
        <tr v-for="a in data" :key="a">
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
      dateValue1: '',
      dateValue2: new Date().toISOString().slice(0, 10),
      data: '',
      REP_GB: '%',
      REP_GBs: '',
      lines: '',
      vendors: '',
      WRK_CD: '%',
      ERR_GB: '%',
      ERR_GBs: ''
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
        path: '/ncrform'
      })
    }
  }
}
</script>
