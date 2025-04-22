<template lang="pug">
	v-col(cols="12", md="3", lg="4", xl="3")
		v-card.project-card(min-height="320")
			v-img(:src="project.mainImage", height="200", lazy-src="/assets/images/image-loader.jpg")
				v-progress-linear(:value="project.progress", height="25", absolute, bottom, color="#176580", v-show="project.status != 'new'")
					strong.white--text
						|{{project.progress}}%
				template(v-slot:placeholder)
					v-row.fill-height.ma-0(align="center", justify="center")
						v-progress-circular(indeterminate, color="grey lighten-5")
			v-card-title
				|{{ project.title }}
				.project-status
					.status-indicator(:style="statusColor")
					.status-text
						|{{ statusText }}
			//v-card-text
				v-row.project-specs(v-show="project.status == 'published'")
					v-col(cols="6")
						.project-spec-title
							|Meta de inversión
						.project-spec-value
							|${{ project.goal | currency }}
					v-col(cols="6")
						.project-spec-title
							|Progreso actual
						.project-spec-value
							|{{ project.progress }}%
			v-card-actions
				v-spacer
				//v-tooltip(bottom)
				v-tooltip(bottom, v-if="project.status == 'waiting'")
					template(v-slot:activator="{ on, attrs }")
						v-icon(right, @click="deleteDraft", v-bind="attrs", v-on="on", color="#b03930")
							|mdi-delete
					span
						|Eliminar borrador
				v-tooltip(bottom, v-if="project.status == 'publishing'")
					template(v-slot:activator="{ on, attrs }")
						v-icon(right, @click="$router.push({path: `/dashboard/proyecto/visualizar/${project._id}`})", v-bind="attrs", v-on="on", color="primary")
							|mdi-eye
					span
						|Ver proyecto
				v-tooltip(bottom, v-if="project.status != 'revision'")
					template(v-slot:activator="{ on, attrs }")
						v-icon(right, @click="$router.push({path: `/dashboard/proyecto/publicacion/${project._id}`})", v-bind="attrs", v-on="on", color="primary")
							|mdi-file-document-edit
					span
						|Revisar proceso de publicación

</template>

<script>

	export default {
		props: ["project"],
		methods: {
		},
		computed: {
			statusColor: function() {
				let style = {}
				switch(this.project.status){
					case "revision":
						style["background-color"] = "#f2a556"
						break
					case "error":
						style["background-color"] = "#e84337"
						break
					case "published":
						style["background-color"] = "#75cd51"
						break
					case "waiting":
						style["background-color"] = "#3d63ee"
						break
					case "new":
					default:
						style["background-color"] = "#b7c9c7"
						break
				}

				return style
			},
			statusText: function() {
				switch(this.project.status){
					case "revision":
						return "En revisión"
					case "waiting":
						return "Documentación"
					case "error":
						return "Rechazado"
					case "published":
						return "Publicado"
					case "finished":
						return "Finalizado"
					case "new":
						return "Borrador"
					default:
						return "Sin definir"
				}
			}
		},
		filters: {
			currency: function( value ) {
				return parseFloat(value).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
			},
		},
		methods: {
			deleteDraft: function() {

				this.$swal({
					title: "¿Estás seguro que deseas eliminar este borrador?",
					text: "No podrás recuperar la información que hayas guardado",
					type: "warning",
					confirmButtonText: "Sí.",
					cancelButtonText: "No, cancelar.",
					showLoaderOnConfirm: true,
					showCancelButton: true,
					reverseButtons: true,
					preConfirm: () => {
						return this.$projects.delete( `project/${this.project._id}` )
					}
				})
				.then(result => {
					if( result && result.value && result.value.data ){
						this.renovateSession()
						this.$swal("Proyecto eliminado exitosamente", "", "success")
						this.$emit("delete")
					}else if(!result.dismiss)
						this.$swal("Error", "Hubo un error al eliminar el borrador, por favor vuelve a intentarlo.", "warning")
				}).
				catch(err => {
					console.error( err )
					this.$swal("Error", "Hubo un error al eliminar el borrador, por favor vuelve a intentarlo.", "warning")
					this.$sentry.captureException( new Error(err) )
				})
			}
		}
	}
</script>

<style lang="sass">
	.project-card
		.v-card__title
			position: relative
			padding-right: 120px
			.project-status
				position: absolute
				top: 15px
				right: 20px
				.status-indicator
					display: inline-block
					height: 13px
					width: 13px
					border-radius: 50%
					margin-right: 5px
				.status-text
					display: inline-block
					font-size: 1rem
					font-weight: 400

		.project-description
		.project-specs
			text-align: center
			.project-spec-title
				text-transform: uppercase
				font-family: Raleway
				font-weight: 800
				color: #777
			.project-spec-value
				color: #B05900
				font-weight: 600
				font-size: 1.25rem
</style>