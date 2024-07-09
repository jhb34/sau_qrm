<template>
  <div>
    <h1>Login</h1>
    <br />
    <hr />
    <br />
    <form @submit.prevent="login">
      <input type="text" v-model="username" placeholder="Username" required />
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        style="margin-left: 0.5rem; margin-right: 0.5rem"
        required
      />
      <button type="submit" class="btn">Login</button>
    </form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  mounted() {
    if (this.$cookies.get('userCookie')) {
      this.$router.push('/main')
    } else {
      this.$store.commit('setUser', null)
      this.$router.push('/login')
    }
  },

  methods: {
    async login() {
      const r = await this.$post('/api/login', {
        params: { username: this.username, password: this.password }
      })
      if (r.data) {
        // 로그인 성공 시 세션 확인 및 사용자 정보 저장
        const user = r.data
        const now = new Date()
        const time = now.getTime()
        console.log(time)
        this.$cookies.set('userCookie', { user, time }, '8h')
        this.$store.commit('setUser', user)
        this.$router.push('/main') // 메인 화면으로 이동
      } else {
        alert('please check ID & PW')
        location.reload()
      }
    }
  }
}
</script>
