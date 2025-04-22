<template lang="pug">
	.legal
		v-row
			v-col(cols="12")
				h4
					|En esta sección se encuentran los documentos pendientes por firmar 
		v-row
			v-spacer
			v-btn(color="primary", @click="status.showM.dialog = true")
				|Términos y condiciones
			v-btn(color="primary", @click="status.showC.dialog = true")
				|Contrato
			v-spacer

		manifest-dialog(v-model="status.showM.dialog", @close="status.showM.dialog = false")
		contract-dialog(v-model="status.showC.dialog", @close="status.showC.dialog = false")

</template>
	
<script>
	import ManifestDialog 	from "@/components/dashboard/elements/profile/info/manifest/ManifestDialog.vue"
	import ContractDialog 	from "@/components/dashboard/elements/profile/info/contract/ContractDialog.vue"

	export default {
		data() {
			return {
				status: {
					showM: {
						dialog: false
					},
					showC: {
						dialog: false
					}
				}
			}
		},
		computed: {
			agreed: function() {
				return false
			}
		},
		methods: {
		},
		components: {
			ManifestDialog,
			ContractDialog
		}
	}
</script>

<style lang="sass">
	.legal
		padding: 30px
		.v-btn
			margin-right: 15px
	@media only screen and (min-width: 1904px)
		.legal
	@media only screen and (max-width: 1903px)
		.legal
	@media only screen and (max-width: 1264px)
		.legal
	@media only screen and (max-width: 960px)
		.legal
</style>