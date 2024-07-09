<template>
  <div v-if="isLoggedIn">
    <h1>Welcome, {{ user.name }}</h1>
    <button @click="logout">Logout</button>
  </div>
  <div v-else>
    <p>Please login to access the main page.</p>
    <router-link to="/login">Login</router-link>
  </div>
</template>

<script>
export default {
  computed: {
    isLoggedIn() {
      return this.$store.state.isLoggedIn
    },
    user() {
      return this.$store.state.user
    }
  },
  methods: {
    logout() {
      this.$store.commit('logout')
      this.$router.push('/login')
    }
  },
  created() {
    if (this.isLoggedIn) {
      this.$store.dispatch('fetchUser')
    }
  }
}
</script>
