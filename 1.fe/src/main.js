import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Mixin from './mixins'
import vueCookies from 'vue-cookies'

// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap/dist/js/bootstrap.min.js'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

const app = createApp(App)

library.add(faBars)
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(vueCookies)
app.use(store)
app.use(router)
app.mixin(Mixin)
app.mount('#app')
