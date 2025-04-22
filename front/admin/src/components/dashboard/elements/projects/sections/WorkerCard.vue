<template lang="pug">
	v-card.worker-card(min-height="250")
		v-img(height="175", src="/assets/images/lider-banner.png")
		v-card-title
			|{{ worker.name }}
		v-card-actions
			v-spacer
			v-btn(color="primary", v-if="worker.linkedin", @click="goLinkedin")
				v-icon(right)
					|mdi-linkedin
			v-btn(color="primary", v-if="worker.cv", @click="downloadCV", :loading="status.downloading.cv")
				|CV
				v-icon(right)
					|mdi-download
			v-btn(color="primary", v-if="worker.cedula", @click="downloadCedula", :loading="status.downloading.cedula")
				|Cédula
				v-icon(right)
					|mdi-download
</template>

<script>
	export default {
		props: ["worker"],
		data() {
			return {
				status: {
					removing: false,
					downloading: {
						cv: false,
						cedula: false,
					}
				}
			}
		},
		methods: {
			downloadCV: function() {

				this.status.downloading.cv = true

				let resource = `download?key=${this.worker.cedula}&username=${this.$store.getters.currentProject.developer.username}`
				let config = {responseType: 'arraybuffer'}

				this.$fileserver.get(resource, config)
				.then(result => {

					const url = window.URL.createObjectURL(new Blob([ result.data ]))
		            const link = document.createElement('a')
		            link.href = url
		            link.setAttribute('download', `${this.$store.getters.currentProject.developer.name}_CV.pdf`)
		            document.body.appendChild(link)
		            link.click()

				})
				.catch(err => this.$report(err, {swal: true}) )
				.finally(this.status.downloading.cv = false)
			
			},
			downloadCedula: function() {
				this.status.downloading.cedula = true

				let resource = `download?key=${this.worker.cedula}&username=${this.$store.getters.currentProject.developer.username}`
				let config = {responseType: 'arraybuffer'}

				this.$fileserver.get(resource, config)
				.then(result => {

					const url = window.URL.createObjectURL(new Blob([ result.data ]))
		            const link = document.createElement('a')
		            link.href = url
		            link.setAttribute('download', `${this.$store.getters.currentProject.developer.name}_Cedula.pdf`)
		            document.body.appendChild(link)
		            link.click()

				})
				.catch(err => this.$report(err, {swal: true}) )
				.finally(this.status.downloading.cedula = false)
			},
			goLinkedin: function() {
				window.open(this.worker.linkedin, "_blank")
			}
		}
	}
</script>

<style lang="sass">
	.worker-card
		.v-image
			overflow: unset
</style>