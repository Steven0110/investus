<template lang="pug">
	v-card.worker-card(min-height="250")
		v-img(height="175", src="/assets/images/lider-banner.png")
			v-btn.delete-button(absolute, bottom, right, fab, color="red darken-2", dark, @click="removeWorker", :loading="status.removing")
				v-icon
					|mdi-delete
		v-card-title
			|{{ worker.name }}
		v-card-actions
			v-spacer
			v-btn(color="primary", v-if="worker.linkedin")
				v-icon(right)
					|mdi-linkedin
			v-btn(color="primary", v-if="worker.cv")
				|CV
				v-icon(right)
					|mdi-download
			v-btn(color="primary", v-if="worker.cedula")
				|Cédula
				v-icon(right)
					|mdi-download
</template>

<script>
	export default {
		props: ["worker", "index"],
		data() {
			return {
				status: {
					removing: false
				}
			}
		},
		methods: {
			removeWorker: function() {

				this.$swal({
					title: "¿Deseas borrar a este personal?",
					text: "No podrás deshacer ésta acción.",
					type: "warning",
					showCancelButton: true,
					cancelButtonText: "Regresar",
					confirmButtonText: "Sí, borrar",
					reverseButtons: true
				})
				.then(result => {
					if( result.value ) {
						const body = {
							name: this.worker.name
						}

						this.status.removing = true
						this.$projects.post(`remove-worker/${this.$store.getters.currentProject._id}`, body)
						.then(result => this.$store.commit("removeProjectWorker", this.index))
						.catch(err => this.$report( err, {swal: true}) )
						.finally(() => this.status.removing = false )
					}
				})

			}
		}
	}
</script>

<style lang="sass">
	.worker-card
		.v-image
			overflow: unset
</style>