<template>
  <br />
  <br />
  <h1>You're logged in. please choose menu</h1>
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
  created() {},
  mounted() {}
}
</script>
