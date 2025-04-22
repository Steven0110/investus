<template lang="pug">
	.blacklist
		.blacklist-result-text(v-if="display == 'string'")
			|{{ this.result }}
		.blacklist-result-table(v-else-if="display == 'object'")
			|JSON: {{ this.result }}
		.blacklist-result-table(v-else)
			|Aún no se ha realizado la búsqueda en listas negras
</template>

<script>
	export default {
		props: ["result"],
		methods: {

		},
		computed: {
			display: function() {
				if( this.result == undefined )
					return "undefined"
				else
					return typeof this.result
			}
		}
	}
</script>

<style lang="sass">
	.blacklist
	
</style>