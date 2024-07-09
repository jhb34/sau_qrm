<template>
  <div>
    <h1>Production History</h1>
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
      <label style="margin-left: 2rem" for="select">Choose Line:</label>
      <select id="select" v-model="line" style="margin-left: 0.5rem">
        <option value="%">--ALL--</option>
        <option v-for="a in lines" :key="a" :value="a.LINE_CD">
          {{ a.LINE_CD }}
        </option>
      </select>
      <button class="btn" style="margin-left: 2rem" @click="getPallets">
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
        <tr v-for="a in pallets" :key="a">
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
        { title: 'Line', key: 'LINE_CD' },
        { title: 'Date', key: 'PRD_YMD' },
        { title: 'Pallet No', key: 'STAG_NO' },
        { title: 'Item No', key: 'ITMNO' },
        { title: 'Item Name', key: 'ITM_NM' },
        { title: 'Start', key: 'STR_YMD' },
        { title: 'End', key: 'END_YMD' },
        { title: 'Shipping', key: 'OUT_FLAG' }
      ],
      dateValue1: new Date().toISOString().slice(0, 10),
      dateValue2: new Date().toISOString().slice(0, 10),
      customer: '%',
      data: '',
      dategroup: '',
      lines: '',
      line: '%',
      pallets: ''
    }
  },
  setup() {},
  created() {},
  mounted() {
    this.getLines()
  },
  unmounted() {},
  methods: {
    getDatesBetween() {
      // 날짜를 비교하기 위해 날짜 객체로 변환
      const start = new Date(this.dateValue1)
      const end = new Date(this.dateValue2)

      // 시작 날짜부터 종료 날짜까지 반복
      let currentDate = new Date(start) // 시작 날짜를 복사하여 사용
      const headers = [
        { title: 'Line', key: 'LINE_CD' },
        { title: 'Date', key: 'PRD_YMD' },
        { title: 'Pallet No', key: 'STAG_NO' },
        { title: 'Item No', key: 'ITMNO' },
        { title: 'Item Name', key: 'ITM_NM' },
        { title: 'Start', key: 'STR_YMD' },
        { title: 'End', key: 'END_YMD' },
        { title: 'Shipping', key: 'OUT_FLAG' }
      ] // 새로운 헤더를 저장할 배열
      const dategroup = []
      while (currentDate <= end) {
        const formattedDate = new Date(currentDate)
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, '') // YYYY-MM-DD 형식을 YYYYMMDD 형식으로 변환
        // 배열에 현재 날짜에 대한 헤더 객체 추가
        headers.push({
          title: formattedDate,
          key: formattedDate
        })
        dategroup.push({ date: formattedDate })

        // 다음 날짜로 이동
        currentDate = new Date(currentDate).setDate(
          new Date(currentDate).getDate() + 1
        )
      }
      this.headers = headers
      this.dategroup = dategroup
    },
    async getLines() {
      const r = await this.$get('/api/getlines')
      this.lines = r.recordset
    },
    async getPallets() {
      const r = await this.$post('/api/getpallets', {
        params: {
          date1: this.dateValue1,
          date2: this.dateValue2,
          line: this.line
        }
      })
      // console.log(r)
      if (r === undefined) {
        alert('Error at getData')
        return
      }
      // console.log(r.data.recordset)
      this.pallets = r.data.recordset
    },
    excelExport() {
      if (this.pallets === '') {
        return alert('There is no data to Export')
      }
      this.$excelFromTable(this.headers, this.pallets, 'Export', {})
    }
  }
}
</script>
