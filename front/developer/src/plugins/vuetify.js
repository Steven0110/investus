import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'


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
  	}
}

export default new Vuetify(opts)