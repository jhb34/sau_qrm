<template>
  <div>
    <h1>사내외불량관리</h1>
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
      <label style="margin-left: 2rem" for="select">상태</label>
      <select id="select" v-model="state" style="margin-left: 0.5rem">
        <option value="%">- ALL -</option>
        <option v-for="a in states" :key="a" :value="a.ASGUB">
          {{ a.ASDES }}
        </option>
      </select>
      <button class="btn" style="margin-left: 2rem" @click="getDefectLists">
        Search
      </button>
      <button
        class="btn"
        style="margin-left: 2rem; background-color: darkorange"
        @click="excelExport"
      >
        Export
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
        { title: '상태', key: 'STS_NM' },
        { title: '접수번호', key: 'defect_number' },
        { title: '라인', key: 'WRK_CD' },
        { title: '공정', key: 'RUT_CD' },
        { title: '발생일자', key: 'GDATE' },
        { title: '품번', key: 'ITMNO' },
        { title: '품명', key: 'ITM_NM' },
        { title: 'LOTNO', key: 'LOTNO' },
        { title: '불량구분', key: 'ERR_CD1_NM' },
        { title: '불량현상', key: 'ERR_CD2_NM' },
        { title: '수량', key: 'QTY' },
        { title: '업체', key: 'REP_CUST' },
        { title: '4M', key: 'M4_NM' },
        { title: '귀책', key: 'REP_NM' },
        { title: '등록자', key: 'DNAME' }
      ],
      dateValue1: '',
      dateValue2: new Date().toISOString().slice(0, 10),
      state: '%',
      states: '',
      customer: '%',
      data: '',
      dategroup: '',
      lines: '',
      line: '%'
    }
  },
  setup() {},
  created() {},
  mounted() {
    // this.getLines()
    this.getState()
    this.getfirstDayOfMonth()
  },
  unmounted() {},
  methods: {
    // 시작일 매월 1일로
    getfirstDayOfMonth() {
      const currentDate = new Date() // 현재 날짜 가져오기
      currentDate.setDate(1) // 현재 월의 1일로 설정
      this.dateValue1 = currentDate.toISOString().slice(0, 10)
    },
    async getState() {
      const r = await this.$get('/api/defect/getstate')
      this.states = r.recordset
    },
    async getLines() {
      const r = await this.$get('/api/getlines')
      this.lines = r.recordset
    },
    async getDefectLists() {
      const r = await this.$post('/api/defect/getlists', {
        params: {
          date1: this.dateValue1.replace(/-/g, ''),
          date2: this.dateValue2.replace(/-/g, ''),
          state: this.state
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
      this.$excelFromTable(this.headers, this.pallets, 'Export', {})
    }
  }
}
</script>
