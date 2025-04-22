<template lang="pug">
	transition(name="fade")
		v-card.estate-add-card(min-height="250", outlined)
			//v-img(height="125", src="/assets/images/lider-banner.png")
			v-card-title.text-center
				|Agregar personal
			v-card-text
				v-form(ref="estateForm", onSubmit="return false;")
					v-text-field.mb-4(
						label="Nombre *",
						prepend-icon="mdi-account",
						:rules="form.validations.required",
						color="primary",
						outlined,
						hide-details,
						v-model="input.name")
					v-text-field(
						label="URL Linkedin",
						placeholder="https://www.linkedin.com/in/ejemplo"
						prepend-icon="mdi-linkedin",
						color="primary",
						outlined,
						hide-details,
						v-model="input.linkedin")
					v-row.pt-4
						v-col(cols="12")
							v-tooltip(max-width="200", top)
								template(v-slot:activator="{ on, attrs }")
									v-btn(color="primary", block, v-on="on", v-bind="attrs", outlined, @click="$refs.cv_file.click()")
										|{{ files.cv }}
										v-icon(right)
											|mdi-upload
								span
									|Curriculum Vitae en formato PDF del personal (Máximo 4 MB.)
						v-col.pt-0(cols="12")
							v-tooltip(max-width="200", top)
								template(v-slot:activator="{ on, attrs }")
									v-btn(color="primary", block, v-on="on", v-bind="attrs", outlined, @click="$refs.cedula_file.click()")
										|{{ files.cedula }}
										v-icon(right)
											|mdi-upload
								span
									|Cédula profesional en formato PDF del personal (Máximo 4 MB.)
					input.d-none(id="cedula" ref="cedula_file", type="file", accept="application/pdf", @change="setButtonText")
					input.d-none(id="cv" ref="cv_file", type="file", accept="application/pdf", @change="setButtonText")

					v-alert(color="orange darken-1", :value="!!alert", dismissible, transition="slide-y-transition")
						|{{ alert }}
			v-card-actions
				v-btn.add-estate-btn(absolute, fab, color="primary", @click="addestate", :loading="status.loading")
					v-icon
						|mdi-plus
</template>

<script>
	export default {
		data() {
			return {
				input: {
					name: "",
					linkedin: ""
				},
				files: {
					cv: "Curriculum Vitae *",
					cedula: "Cédula Profesional",
				},
				alert: false,
				status: {
					loading: false
				},
				form: {
					validations: {
						required: [
							v => !!v || 'Este campo es requerido'
						],
					}
				},
			}
		},
		methods: {
			addestate: async function() {
				this.alert = false
				if( this.$refs.estateForm.validate() ){
					if( this.$refs.cv_file.files[0] ){

						this.status.loading = true
						
						const cv = this.$refs.cv_file.files[0] || false
						const cedula = this.$refs.cedula_file.files[0] || false

						let body = {
							name: 		this.input.name,
							linkedin: 	this.input.linkedin,
							cv: 		null,
							cedula: 	null,
						}

						/*	Primero encripta los archivos y los sube a S3 	*/
						if( cedula ){
							/*	Sube la cedula profesional 	*/
							const cedulaB64 = await this.toBase64( cedula )
							let uploadBody = {
								data: cedulaB64,
								extension: "pdf"
							}
							let { data: dataA } = await this.$fileserver.post("upload-b64", uploadBody)
							const processBody = {
								type: "cedula_profesional",
								tmpPath: dataA.path,
								username: this.$store.getters.user.username
							}
							let { data: dataB } = await this.$fileserver.post("process", processBody)
							body.cedula = dataB.key
						}

						/*	Sube el CV 	*/
						const cvB64 = await this.toBase64( cv )
						let uploadBody = {
							data: cvB64,
							extension: "pdf"
						}
						let { data: dataA } = await this.$fileserver.post("upload-b64", uploadBody)
						const processBody = {
							type: "curriculum_vitae",
							tmpPath: dataA.path,
							username: this.$store.getters.user.username
						}
						let { data: dataB } = await this.$fileserver.post("process", processBody)
						body.cv = dataB.key

						this.$projects.post(`add-estate/${this.$store.getters.currentProject._id}`, body)
						.then(result => {
							this.$store.commit("addProjectestate", body)
							this.reset()
						})
						.catch(err => {
							if( err.response && err.response.status && err.response.status == 400) 
								this.$swal("Caracteres inválidos", "El nombre no puede contener números", "warning")
							else
								this.$report( err, {swal: true})
						})
						.finally(() => this.status.loading = false )

						this.alert = false
					}else{
						this.alert = "El Curriculum Vitae es requerido"
					}
				}
			},
			trimFileName: function( filename ) {
				if( filename.length > 17 ){
					let aux = filename.split(".")
					const ext = aux[ aux.length - 1 ]

					return `${filename.substr(0, 17)}(...).${ext}`
				}else
					return filename
			},
			setButtonText: function(event) {
				if( event.target.files[0] ){
					const id = event.target.id
					this.files[ id ] = this.trimFileName( event.target.files[0].name )
				}
			},
			toBase64: function( file ) {
				let reader = new FileReader()
				return new Promise((resolve, reject) => {
	                reader.onloadend = e => e.target.result ? resolve( e.target.result.split(",")[1] ) : reject( e.target.error)
	                reader.readAsDataURL( file )
				})
			},
			reset: function() {
				this.$refs.estateForm.reset()
				this.files = {
					cv: "Curriculum Vitae *",
					cedula: "Cédula Profesional",
				}
			}
		}
	}
</script>

<style lang="sass">
	.add-estate-btn
		left: 0
		right: 0
		margin-left: auto
		margin-right: auto
		bottom: -25px
</style>