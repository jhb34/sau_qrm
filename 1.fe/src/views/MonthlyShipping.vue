<template>
  <div>
    <h1>Monthly Shipping Qty</h1>
    <br />
    <hr />
    <br />
    <div>
      <input type="month" v-model="dateValue" />
      <label for="select" style="margin-left: 2rem">Choose Customer:</label>
      <select id="select" style="margin-left: 0.5rem" v-model="customer">
        <option value="%">--ALL--</option>
        <option value="S1300">MAL</option>
        <option value="S1301">MGA</option>
        <option value="S0800">HMMA</option>
      </select>
      <button class="btn" style="margin-left: 2rem" @click="getData">
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
    <table class="table table-hover">
      <thead class="table-dark">
        <tr style="position: sticky; top: 0">
          <th>Customer</th>
          <th>Type</th>
          <th>Part No</th>
          <th>Part Name</th>
          <th>Shipping Qty</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in data" :key="a">
          <td>
            {{ a.CUST_CD }}
          </td>
          <td>{{ a.CHAJ_CD }}</td>
          <td>{{ a.ITMNO }}</td>
          <td>{{ a.ITM_NM }}</td>
          <td>{{ a.QTY }}</td>
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
        { title: 'Customer', key: 'CUST_CD' },
        { title: 'Type', key: 'CHAJ_CD' },
        { title: 'Part_No', key: 'ITMNO' },
        { title: 'Part_Name', key: 'ITM_NM' },
        { title: 'Qty', key: 'QTY' }
      ],
      dateValue: new Date().toISOString().slice(0, 7),
      customer: '%',
      data: ''
    }
  },
  setup() {},
  created() {},
  mounted() {},
  unmounted() {},
  methods: {
    async getData() {
      const r = await this.$post('/api/monthlyshipping', {
        params: { date: this.dateValue, customer: this.customer }
      })
      // console.log(r)
      if (r === undefined) {
        alert('Error at getData')
        return
      }
      this.data = r.data.recordset
    },
    excelExport() {
      if (this.data === '') {
        return alert('There is no data to Export')
      }
      this.$excelFromTable(this.headers, this.data, 'Export', {})
    }
  }
}
</script>
