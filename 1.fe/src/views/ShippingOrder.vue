<template>
  <div>
    <h1>Shipping Order</h1>
    <br />
    <hr />
    <br />
    <div>
      Date :
      <input
        type="date"
        style="margin-left: 0.5rem; margin-right: 1rem"
        v-model="dateValue1"
      />
      <label for="select" style="margin-left: 2rem">Choose Customer:</label>
      <select id="select" style="margin-left: 0.5rem" v-model="customer">
        <option value="%">--ALL--</option>
        <option value="S1300">MAL</option>
        <option value="S1301">MGA</option>
        <option value="S0800">HMMA</option>
      </select>
      <button class="btn" style="margin-left: 2rem" @click="getOrder">
        Search
      </button>
      <button
        class="btn"
        style="margin-left: 2rem; background-color: darkorange"
        @click="excelExport"
      >
        Export
      </button>
      <span style="margin-left: 2rem; font-weight: 500"
        >( MAL: S1300 / MGA: S1301 / HMMA: S0800 )</span
      >
    </div>
    <div>
      <table class="table table-hover" style="float: left">
        <thead class="table-dark">
          <tr style="position: sticky; top: 0">
            <th v-for="b in headers1" :key="b">{{ b.title }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="a in order"
            :key="a"
            @click="getList(a.SAL_YMD, a.CUST_CD, a.TRAILER_NO)"
          >
            <td v-for="c in headers1" :key="c">
              {{ a[c.key] }}
            </td>
          </tr>
        </tbody>
      </table>
      <div style="float: left; width: 2rem; visibility: hidden">as</div>
      <table class="table table-hover" style="float: left">
        <thead class="table-dark">
          <tr style="position: sticky; top: 0">
            <th v-for="b in headers2" :key="b">{{ b.title }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in data" :key="a">
            <td v-for="c in headers2" :key="c">{{ a[c.key] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      headers1: [{ title: 'TRAILER NO', key: 'TRAILER_NO' }],
      headers2: [
        { title: 'Date', key: 'SAL_YMD' },
        { title: 'CUSTOMER', key: 'CUST_CD' },
        { title: 'TRAILER NO', key: 'TRAILER_NO' },
        { title: 'Item No', key: 'ITMNO' },
        { title: 'Item Name', key: 'ITM_NM' },
        { title: 'QTY', key: 'ORD_QTY' }
      ],
      dateValue1: new Date().toISOString().slice(0, 10),
      dateValue2: new Date().toISOString().slice(0, 10),
      customer: '%',
      data: '',
      order: '',
      dategroup: ''
    }
  },
  setup() {},
  created() {},
  mounted() {},
  unmounted() {},
  methods: {
    getDatesBetween() {
      // 날짜를 비교하기 위해 날짜 객체로 변환
      const start = new Date(this.dateValue1)
      const end = new Date(this.dateValue2)

      // 시작 날짜부터 종료 날짜까지 반복
      let currentDate = new Date(start) // 시작 날짜를 복사하여 사용
      const headers = [
        { title: 'Customer', key: 'cust_cd' },
        { title: 'Part_No', key: 'itmno' },
        { title: 'Part_Name', key: 'itm_nm' }
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
    async getData() {
      this.getDatesBetween()
      const r = await this.$post('/api/dailyshipping', {
        params: {
          date1: this.dateValue1,
          date2: this.dateValue2,
          customer: this.customer,
          dategroup: this.dategroup
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
    async getOrder() {
      const r = await this.$post('/api/shippingorder/getorder', {
        params: {
          date1: this.dateValue1,
          customer: this.customer
        }
      })
      // console.log(r)
      if (r === undefined) {
        alert('Error at getData')
        return
      }
      // console.log(r.data.recordset)
      this.order = r.data.recordset
      this.data = ''
    },
    async getList(a, b, c) {
      // console.log(a, b, c)
      const r = await this.$post('/api/shippingorder/getlist', {
        params: {
          date: a,
          customer: b,
          trailer: c
        }
      })
      // console.log(r)
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
      this.$excelFromTable(this.headers2, this.data, 'Export', {})
    }
  }
}
</script>
