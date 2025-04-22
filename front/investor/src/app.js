import Vue from "vue"

import App from "./App.vue"
import router from "./router"

//Vue.use( VueAxios, instance )

/*	Sweet Alert 2 	*/
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
const options = {
	confirmButtonColor: '#176580',
	cancelButtonColor: '#db5756'
}
Vue.use( VueSweetalert2, options )

/*	Vue Moment 	*/
const moment = require('moment')
require('moment/locale/es')
 
Vue.use(require('vue-moment'), {
    moment
})

/*	Custom Sanitizer 	*/
import sanitizer from '@/plugins/sanitizer'

/*	Catalogo de documentos 	*/
import catalog from '@/plugins/catalog'

/*	Axios 	*/
import axios from '@/plugins/axios'

/*	Vuetify 	*/
import vuetify from '@/plugins/vuetify'

/* 	Vue Mask 	*/
import VueMask from 'v-mask'
Vue.use(VueMask)

/*	Vue Youtube 	*/
import VueYoutube from 'vue-youtube'
Vue.use(VueYoutube)

/*	3D Carousel */
import Carousel3d from 'vue-carousel-3d'
Vue.use(Carousel3d)

/*	Image Viewer 	*/
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
Vue.use(Viewer)

/*	Vue File Drag And Drop 	*/
import "vue2-dropzone/dist/vue2Dropzone.min.css"

/*	Vuex 	*/
import { store } from '@/store/store'

/*	Sentry 	*/
import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';
Sentry.init({
  dsn: 'https://cca6b29e2f31485b9539eeef30fe038e@o412240.ingest.sentry.io/5288683',
  integrations: [new VueIntegration({Vue, attachProps: true})],
  environment: process.env.ENV
});
Vue.prototype.$sentry = Sentry

/*	Mixin 	*/
import mixin from "@/mixins/mixin"
Vue.mixin( mixin )

/*	Global variables 	*/
Vue.prototype.FS = process.env.FILESERVER

new Vue({
	//mixins: [mixin],
	el: "#app",
	router,
	vuetify,
	store,
	render: h => h( App ),
})