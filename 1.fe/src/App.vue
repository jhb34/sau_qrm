<template>
  <div class="window">
    <div class="side">
      <side-nav />
    </div>
    <main class="main">
      <router-view />
    </main>
  </div>
</template>
<script>
import SideNav from './views/SideNav.vue'
export default {
  components: {
    SideNav
  }
}
</script>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-decoration: none;
}

html {
  font-size: 100%;
} /*16px*/

body {
  background: #f8fafc;
  color: #0f172a;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: 400;
  line-height: 1;
}

.window {
  display: grid;
  grid-template-columns: 1fr;
}
.main {
  width: 90vw;
  margin: 0 auto;
  padding: 2rem 0;
}

@media (min-width: 992px) {
  .window {
    grid-template-columns: auto 1fr;
  }
  .main {
    width: 90%;
  }
}
.btn {
  cursor: pointer;
  color: #fff;
  background: #49a6e9;
  border-radius: 0.25rem;
  letter-spacing: 1px;
  padding: 0.375rem 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: 0.3s ease-in-out all;
  text-transform: capitalize;
  display: inline-block;
}
.btn:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
table {
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 0.9em;
  font-family: sans-serif;
  min-width: 400px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}
table td,
th {
  padding: 5px;
}
table thead th {
  background-color: #54585d;
  color: #ffffff;
  font-weight: bold;
  font-size: 13px;
  border: 1px solid #54585d;
}
table tbody td {
  color: #636363;
  border: 1px solid #dddfe1;
}
table tbody tr {
  background-color: #f9fafb;
}
table tbody tr:hover {
  background-color: lightblue;
}
</style>
