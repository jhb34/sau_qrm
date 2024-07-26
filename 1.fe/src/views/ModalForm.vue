<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h1 class="modal-title fs-5">품번 검색</h1>
        <button type="button" class="close-modal-btn" @click="close">X</button>
      </div>
      <div class="modal-body">
        <input
          type="text"
          placeholder="입력"
          v-model="search"
          @input="itemsearch"
          ref="modalInput"
        />
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>품번</th>
                <th>품명</th>
                <th>품목</th>
                <th>차종</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in items" :key="a" @click="selectItem(a.ITMNO)">
                <td>{{ a.ITMNO }}</td>
                <td>{{ a.ITM_NM }}</td>
                <td>{{ a.PUMMK }}</td>
                <td>{{ a.CHAJONG }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-secondary"
          style="background: gray"
          @click="close"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    str: {
      type: String
    }
  },
  data() {
    return {
      search: this.str,
      items: '',
      item: ''
    }
  },
  watch: {},
  setup() {},
  created() {},
  mounted() {
    this.$refs.modalInput.focus()
  },
  unmounted() {},
  methods: {
    async itemsearch() {
      const r = await this.$post('/api/modal/getitems', {
        params: { search: this.search }
      })
      console.log(r)
      this.items = r.data.recordset
    },
    selectItem(item) {
      this.$emit('select', item)
      this.$emit('close')
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
  z-index: 10;
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
.modal-header {
}
.modal-body {
  margin-top: 2rem;
  width: 90%;
  max-width: 500px;
}
.modal-footer {
  margin-top: 2rem;
  display: flex;
  justify-content: space-evenly;
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

input {
  line-height: 2rem;
  width: 100%;
  padding: 0.3rem 0.2rem;
  border: 1px solid lightgray;
}

input:focus {
  outline: none;
  border-color: #9ecaed;
  box-shadow: 0 0 10px #9ecaed;
}
.bd1 {
  border: 1px red solid;
}
.bd2 {
  border: 1px blue solid;
}

.table-container {
  margin-top: 1rem;
  height: 40vh;
  overflow-y: auto; /* Enable vertical scroll */
}

thead {
  position: sticky; /* Make the table header sticky */
  top: 0; /* Position the table header at the top */
}
table tbody tr:hover {
  background-color: lightblue;
  cursor: pointer;
}
</style>
