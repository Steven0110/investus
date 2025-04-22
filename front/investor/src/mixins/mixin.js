/*	Métodos globales */

import { store } from '@/store/store'
import api from '@/plugins/axios'

export default {
	methods: {
		renovateSession: function() {

			store.commit("setRenovationStatus", true)
			return api.get("renovate-session")
			.then(result => store.commit("setUser", result.data.user ))
			.finally(() => store.commit("setRenovationStatus", false ))
		},
		$clone: function( obj ) {
			return JSON.parse(JSON.stringify(obj))
		},
		$wait: function(ms, fn) {
			setTimeout(fn, ms)
		}
	}
}