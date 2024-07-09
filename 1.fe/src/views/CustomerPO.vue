<template>
  <div class="main1">
    <h1 class="">Customer PO Manager</h1>
    <br />
    <hr />
    <br />
    <div style="display: flex; align-items: center">
      <div id="selectbox" @change="getPOS">
        <label for="inputEmail4" class="">Select Customer</label>
        <input
          style="margin-left: 2rem"
          type="radio"
          id="MAL"
          value="S1300"
          v-model="cust"
        />
        <label style="margin-left: 0.5rem" for="MAL">MAL</label>
        <input
          style="margin-left: 2rem"
          type="radio"
          id="MGA"
          value="S1301"
          v-model="cust"
        />
        <label style="margin-left: 0.5rem" for="MGA">MGA</label>
        <input
          style="margin-left: 2rem"
          type="radio"
          id="HMMA"
          value="S0800"
          v-model="cust"
        />
        <label style="margin-left: 0.5rem" for="HMMA">HMMA</label>
      </div>
      <button class="btn" style="margin-left: 5rem" @click="isModalShow = true">
        Add New PO
      </button>
      <span style="margin-left: 2rem; font-weight: 500"
        >( MAL: S1300 / MGA: S1301 / HMMA: S0800 )</span
      >
    </div>
    <table class="table table-hover">
      <thead class="table-dark">
        <tr style="position: sticky; top: 0">
          <th v-for="b in headers" :key="b">{{ b.title }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in rows" :key="a" @click="onRowClick(a)">
          <td v-for="c in headers" :key="c">{{ a[c.key] }}</td>
        </tr>
      </tbody>
    </table>

    <div
      :class="['modal-overlay', { 'show-modal': isModalShow }]"
      id="exampleModal"
    >
      <div class="modal-container">
        <div class="modal-content">
          <div class="modal-header">
            <div v-if="id.partnumber === ''">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Add New PO
              </h1>
            </div>
            <div v-else>
              <h1 class="modal-title fs-5" id="exampleModalLabel">Edit PO</h1>
            </div>
            <button type="button" class="close-modal-btn" @click="reset">
              X
            </button>
          </div>
          <div class="modal-body">
            <div class="m-1 mb-3 row">
              <label for="iname" class="form-label">Part Number</label>
              <div class="col-sm-8">
                <input
                  type="text"
                  v-model="po.PART_NO"
                  class="form-input"
                  id="iname"
                  placeholder="must be filled in"
                />
              </div>
            </div>
            <div class="m-1 mb-3 row">
              <label for="CUST_CODE" class="form-label">Customer Code</label>
              <div class="col-sm-8">
                <input
                  type="text"
                  v-model="po.CUST_CODE"
                  class="form-input"
                  id="CUST_CODE"
                  placeholder="must be filled in"
                />
              </div>
            </div>
            <div class="m-1 mb-3 row">
              <label for="CUST_PART" class="form-label">Customer Part</label>
              <div class="col-sm-8">
                <input
                  type="text"
                  v-model="po.CUST_PART"
                  class="form-input"
                  id="CUST_PART"
                />
              </div>
            </div>
            <div class="m-1 mb-3 row">
              <label for="PO_NO" class="form-label">PO Number</label>
              <div class="col-sm-8">
                <input
                  type="text"
                  v-model="po.PO_NO"
                  class="form-input"
                  id="PO_NO"
                />
              </div>
            </div>
            <div class="m-1 mb-3 row">
              <label for="LINE_NO" class="form-label">Line Number</label>
              <div class="col-sm-8">
                <input
                  type="text"
                  v-model="po.LINE_NO"
                  class="form-input"
                  id="LINE_NO"
                />
              </div>
            </div>
            <div class="m-1 mb-3 row">
              <label for="CUST_NAME" class="form-label">Customer Name</label>
              <div class="col-sm-8">
                <input
                  type="text"
                  v-model="po.CUST_NAME"
                  class="form-input"
                  id="CUST_NAME"
                />
              </div>
            </div>
            <div class="m-1 mb-3 row">
              <label for="SHIP_TO_PLANT" class="form-label">Ship To</label>
              <div class="col-sm-8">
                <input
                  type="text"
                  v-model="po.SHIP_TO_PLANT"
                  class="form-input"
                  id="SHIP_TO_PLANT"
                />
              </div>
            </div>
            <div class="m-1 mb-3 row">
              <label for="UOM" class="form-label">UOM</label>
              <div class="col-sm-8">
                <input
                  type="text"
                  v-model="po.UOM"
                  class="form-input"
                  id="UOM"
                />
              </div>
            </div>
            <div class="m-1 mb-3 row">
              <label for="SUPPLIER_NAME" class="form-label"
                >Supplier Name</label
              >
              <div class="col-sm-8">
                <input
                  type="text"
                  v-model="po.SUPPLIER_NAME"
                  class="form-input"
                  id="SUPPLIER_NAME"
                />
              </div>
            </div>
            <div class="m-1 mb-3 row">
              <label for="SUPPLIER_CODE" class="form-label"
                >Supplier Code</label
              >
              <div class="col-sm-8">
                <input
                  type="text"
                  v-model="po.SUPPLIER_CODE"
                  class="form-input"
                  id="SUPPLIER_CODE"
                />
              </div>
            </div>
            <div class="m-1 mb-3 row">
              <label for="DOCK_NO" class="form-label">Dock Number</label>
              <div class="col-sm-8">
                <input
                  type="text"
                  v-model="po.DOCK_NO"
                  class="form-input"
                  id="DOCK_NO"
                />
              </div>
            </div>
            <div class="m-1 mb-3 row">
              <label for="PART_DESC" class="form-label">Part Desc</label>
              <div class="col-sm-8">
                <input
                  type="text"
                  v-model="po.PART_DESC"
                  class="form-input"
                  id="PART_DESC"
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <div v-if="id.partnumber === ''">
              <button @click="doSave" class="btn" style="background: green">
                Add
              </button>
            </div>
            <div v-else>
              <button
                @click="doDelete"
                class="btn btn-danger me-5"
                style="background: red"
              >
                Delete
              </button>
              <button
                @click="doChange"
                class="btn btn-primary"
                style="margin-left: 3rem; background: #2d87c8"
              >
                Edit
              </button>
            </div>
            <button
              type="button"
              class="btn btn-secondary"
              style="background: gray"
              @click="reset"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      isModalShow: false,
      rows: [],
      cust: 'S1300',
      headers: [
        { title: 'PART_NO', key: 'PART_NO' },
        { title: 'CUST', key: 'CUST_CODE' },
        { title: 'CUST_PART', key: 'CUST_PART' },
        { title: 'PO_NO', key: 'PO_NO' },
        { title: 'LINE_NO', key: 'LINE_NO' },
        { title: 'CUST_NAME', key: 'CUST_NAME' },
        { title: 'SHIP_TO', key: 'SHIP_TO_PLANT' },
        { title: 'UOM', key: 'UOM' },
        { title: 'SUPPLIER_NAME', key: 'SUPPLIER_NAME' },
        { title: 'SUPPLIER', key: 'SUPPLIER_CODE' },
        { title: 'DOCK', key: 'DOCK_NO' },
        { title: 'PART_DESC', key: 'PART_DESC' }
      ],
      po: {
        PART_NO: '',
        CUST_CODE: '',
        CUST_PART: '',
        PO_NO: '',
        LINE_NO: '',
        CUST_NAME: '',
        SHIP_TO_PLANT: '',
        UOM: '',
        SUPPLIER_NAME: '',
        SUPPLIER_CODE: '',
        DOCK_NO: '',
        PART_DESC: ''
      },
      id: {
        partnumber: '',
        customercode: ''
      }
    }
  },
  setup() {},
  created() {},
  mounted() {
    this.getPOS()
  },
  unmounted() {},
  methods: {
    async doSave() {
      const save = confirm('Do you really want to save?')
      if (save) {
        const r = await this.$post('/api/customerpo/add', {
          param: this.po
        })
        this.reset()
        if (r.status === 200) {
          alert('Saved! PO has been saved.')
        } else {
          alert('Failed! Please try again')
        }
        this.getPOS()
      }
    },

    async doChange() {
      const change = confirm('Do you really want to change?')
      if (change) {
        const r = await this.$post('/api/customerpo/change', {
          id: this.id,
          param: this.po
        })
        this.reset()
        if (r.status === 200) {
          alert('Changed! PO has been changed.')
        } else {
          alert('Failed! Please try again')
        }
        this.getPOS()
      }
    },
    async doDelete() {
      const del = confirm('Do you really want to delete?')
      if (del) {
        const r = await this.$post('/api/customerpo/delete', this.id)
        this.reset()
        if (r.status === 200) {
          alert('Deleted! PO has been deleted.')
        } else {
          alert('Failed! Please try again')
        }
        this.getPOS()
      }
    },
    async getPOS() {
      const pos = await this.$post('/api/customerpo/getpos', {
        param: this.cust
      })
      this.rows = pos.data.recordset
    },
    async getPO() {
      const po = await this.$post('/api/customerpo/getpo', this.id)
      this.po = po.data.recordset[0]
    },
    onRowClick(a) {
      this.id.partnumber = a.PART_NO
      this.id.customercode = a.CUST_CODE
      this.isModalShow = true
      this.getPO()
    },
    reset() {
      this.isModalShow = false
      this.po = {
        PART_NO: '',
        CUST_CODE: '',
        CUST_PART: '',
        PO_NO: '',
        LINE_NO: '',
        CUST_NAME: '',
        SHIP_TO_PLANT: '',
        UOM: '',
        SUPPLIER_NAME: '',
        SUPPLIER_CODE: '',
        DOCK_NO: '',
        PART_DESC: ''
      }
      this.id.partnumber = ''
      this.id.cu = ''
    }
  }
}
</script>

<style scoped>
.main1 {
  position: relative;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
  z-index: -1;
  visibility: hidden;
  opacity: 0;
}
.show-modal {
  opacity: 1;
  visibility: visible;
  z-index: 10;
  transition-property: opacity;
  transition-duration: 0.1s;
}
.modal-container {
  background: white;
  width: 40vw;
  height: 80vh;
  border-radius: 0.25rem;
  max-width: 1120px;
  text-align: center;
  display: grid;
  place-items: center;
  position: relative;
}

.close-modal-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 2rem;
  font-weight: 700;
  background: transparent;
  padding: 0 5px;
  cursor: pointer;
  color: red;
}
.form-label {
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  text-transform: capitalize;
  letter-spacing: 1px;
  line-height: 1.5;
}
.row {
  margin-top: 0.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  place-items: center;
}
.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  color: #0f172a;
}
.form-input,
.form-select,
.form-btn {
  height: 35px;
}
.form-row {
  margin-bottom: 1rem;
}
.modal-footer {
  margin-top: 1rem;
  display: flex;
  justify-content: space-evenly;
}
</style>
