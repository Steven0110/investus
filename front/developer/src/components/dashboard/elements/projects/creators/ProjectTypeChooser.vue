<template lang="pug">
	v-dialog(content-class="project-type-chooser", max-width="500" , :value="show", persistent)
		v-card.project-type-card
			v-card-title.text-center
				|Selecciona el tipo de proyecto
			v-card-text
				v-row.project-type-container
					v-col(cols="6")
						.project-type(@click="type = 'debt'", :class="{active: type == 'debt'}")
							.project-type-inner
								div
									v-icon(size="60")
										|mdi-office-building
								.project-type-text
									|Deuda
						.project-helper(@click="showVideo('dFAiChOmoGI')")
							|¿Qué es deuda?
					v-col(cols="6")
						.project-type(@click="type = 'co-ownership'", :class="{active: type == 'co-ownership'}")
							.project-type-inner
								div
									v-icon(size="60")
										|mdi-domain
								.project-type-text
									|Copropiedad
						.project-helper(@click="showVideo('dFAiChOmoGI')")
							|¿Qué es copropiedad?

			v-card-actions
				v-spacer
				v-btn(text, color="#B05900", @click="$emit('close')")
					|Cancelar
				v-btn(color="primary", @click="createProject", :loading="status.creating")
					|Crear proyecto

		v-dialog(content-class="video-dialog", max-width="700", :value="status.show.video")
			v-card.video-card
				v-card-title
				v-card-text
					youtube(:video-id="videoId", :player-vars="{autoplay: 0}", height="400")
				v-card-actions
					v-spacer
					v-btn(color="#B05900", tile, @click="status.show.video = false", dark)
						|Cerrar
						v-icon(right)
							|mdi-close
					v-spacer
</template>

<script>
	export default {
		props: ["show"],
		data() {
			return {
				type: "debt",
				videoId: "dFAiChOmoGI",
				status: {
					show: {
						video: false
					},
					creating: false
				}
			}
		},
		methods: {
			showVideo: function( videoId ) {
				this.videoId = videoId
				this.status.show.video = true
			},
			createProject: function() {
				this.status.creating = true

				const resource = "create-project"
				const body = {
					type: this.type
				}
				
				this.$projects.post( "create-project", body )
				.then(result => {
					if( result && result.data && result.data._id ){
						this.$router.push({path: `/dashboard/proyecto/publicacion/${result.data._id}`})
					}else
						this.$swal("Error", "Hubo un error al crear un proyecto nuevo, por favor vuelve a intentarlo.", "warning")
				})
				.catch(err => {
					if( err.response && err.response.status ){
						if( err.response.status == 406 ){
							this.$swal({
								title: "Acceso denegado",
								text: "Tu cuenta necesita ser aprobada antes de poder publicar proyectos. Para ello requieres tener tu cuenta verificada, activar el segundo factor de autenticación, subir los documentos solicitados, firmar los términos y condiciones y haber subido una foto de perfil.",
								type: "warning",
								showCancelButton: false,
								confirmButtonText: "Ok."
							})
							this.$emit('close')
						}else{
							this.$swal("Error al crear proyecto", "Por favor vuelve a intentarlo, si el problema persiste comunícate con nosotros.", "error")
							this.$report( err )
						}
					}else{
						this.$emit('close')
						this.$report( err )
					}
				})
				.finally(() => {
					this.status.creating = false
				})
			}
		},
		computed: {

		}
	}
</script>

<style lang="sass">
	.project-type-chooser
		.project-type-card
			.project-type-container
				.project-type
					position: relative
					display: table
					width: 100%
					padding-top: 50px
					padding-bottom: 50px
					border: 1px solid rgba(0, 0, 0, 0.3)
					border-radius: 7px
					background-color: rgba(0, 0, 0, 0.02)
					transition: 0.2s linear all
					.project-type-inner
						position: relative
						display: table-cell
						vertical-align: middle
						text-align: center
						.project-type-text
							text-transform: uppercase
							font-size: 1.2rem
							font-family: Raleway
							font-weight: 600
							padding-top: 10px
					&:hover
						cursor: pointer
						background-color: rgba(0, 0, 0, 0.1)
						transition: 0.2s linear all

					&.active
						background-color: rgba(176, 89, 0, 0.2)
						border-color: #b05900
						.project-type-inner
							.project-type-text, i
								color: #b05900
				.project-helper
					font-size: 1rem
					color: #b05900
					font-weight: 500
					text-align: center
					padding-top: 7px
					&:hover
						cursor: pointer
</style>
