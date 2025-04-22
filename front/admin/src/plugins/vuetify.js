import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import es from 'vuetify/es5/locale/es'


/*	Icons 	*/
//import Home       from '@/components/icons/Home.vue'

Vue.use(Vuetify)

const opts = {
  	icons: {
    	values: {
          //chome:      { component: Home },
    	},
    	iconfont: 'mdiSvg'
  	},
  	theme: {
  		themes: {
	  		light: {
          primary: "#176580",
          secondary: "#ba7127"
	  		}
  		}
  	},
    lang: {
      locales: {
        es
      },
      current: "es"
    }
}

export default new Vuetify(opts)