<template lang="pug">
	.project-publisher
		.project-title.d-none.d-md-block
			v-icon(left, color="black", large, @click="back")
				|mdi-chevron-left
			span
				|{{ $store.getters.currentProject.title }}
			v-icon(color="black", @click="status.show.titleEditor = true", v-if="!status.loading")
				|mdi-pencil

		.content
			project-card-loader(:show="status.loading")

			v-row(v-if="!status.loading")

				//v-col(cols="12", md="4")
					v-hover
						template(v-slot:default="{ hover }")
							.image-video-container
								.project-main-video(v-if="videoId")
									youtube(:video-id="videoId", :player-vars="{autoplay: 0}", height="400")
								.project-main-image(v-else)
									v-img.white-background(:src="project.mainImage", max-height="400", lazy-src="/assets/images/image-loader.jpg")
										template(v-slot:placeholder)
											v-row.fill-height.ma-0(align="center", justify="center")
												v-progress-circular(indeterminate, color="grey lighten-5")
								v-fade-transition
									v-overlay( v-if="hover", absolute, color="#ba7127")
										v-btn(color="primary", @click="status.show.imageVideoEditor = true")
											|Cambiar imagen o video

				//v-col.main-metrics(cols="12", md="5")
					v-row
						v-col.pb-0(cols="12")
							goal-slider(:value="project.progress", :totalInvested="project.totalInvested", :goal="project.goal")
						v-col(cols="12", md="6")
							single-metric(:value="15", text="Inversionistas")
							single-metric(:value="66", text="días restantes")
							single-metric(:value="project.roi + '%'", text="de retorno de inversión")
						v-col(cols="12", md="6")
							risk-level(:risk="project.risk")
						v-col(cols="12")
							.project-actions
								v-btn(color="primary", block, large)
									|Editar información
									v-icon(right)
										|mdi-pencil
									
				//v-col.project-carousel(cols="12")
					slider-gallery(:images="project.gallery")
				
				//v-col(cols="12", md="4", offset-md="4")
					v-btn(block, color="primary")
						|Editar galería
						v-icon(right)
							|mdi-pencil


				//v-col.pb-0(cols="12")
					.project-content
						
						v-tabs(v-model="tab", color="#B05900")
							v-tab(key="description")
								|Descripción
							v-tab(key="documents")
								|Documentación
								v-badge(
									color="#FC8B19",
									dot)
							v-tab(key="observations")
								|Observaciones
								v-badge(
									color="#FC8B19",
									dot)

						v-tabs-items(v-model="tab")
							v-tab-item(key="description")
								description(v-model="project.description", @updated="status.show.snackbar = true", v-if="project.description != null")
							v-tab-item(key="documents")
								documents(:pendingDocuments="project.pendingDocuments")
							v-tab-item(key="observations")
								observations
				
				v-col.pb-0(cols="12")
					project-publisher(
						ref="publisher",
						@ready="setReady",
						v-if="$store.getters.currentProject._id")
				v-col.pt-10(cols="12")
					v-row
						v-spacer
						v-btn(color="primary", @click="review", x-large, :disabled="!isReady", v-if="$store.getters.currentProject.status != 'revision'")
							|Enviar a revisión
							v-icon(color="white", right)
								|mdi-folder-search-outline
						v-spacer
		title-editor(
			v-if="$store.getters.currentProject._id && status.show.titleEditor",
			:show="status.show.titleEditor",
			@update="update",
			@close="status.show.titleEditor = false")

		v-snackbar(v-model="status.show.snackbar")
			|Proyecto actualizado correctamente
			template(v-slot:action="{ attrs }")
				v-btn(color="#ba7127", text, v-bind="attrs", @click="status.show.snackbar = false")
					|Cerrar

</template>

<script>
	import ProjectCardLoader 	from "@/components/tools/loader/ProjectCardLoader.vue"
	import SingleMetric 		from "@/components/dashboard/elements/projects/kpi/SingleMetric.vue"
	import GoalSlider 			from "@/components/dashboard/elements/projects/kpi/GoalSlider.vue"
	import RiskLevel 			from "@/components/dashboard/elements/projects/kpi/RiskLevel.vue"
	import SliderGallery		from "@/components/dashboard/elements/projects/gallery/SliderGallery.vue"
	import Description			from "@/components/dashboard/elements/projects/sections/Description.vue"
	import Updates				from "@/components/dashboard/elements/projects/sections/Updates.vue"
	import Observations			from "@/components/dashboard/elements/projects/sections/Observations.vue"
	import Documents			from "@/components/dashboard/elements/projects/sections/Documents.vue"
	import TitleEditor 			from "@/components/dashboard/elements/projects/editors/TitleEditor.vue"
	import ProjectPublisher 	from "@/components/dashboard/elements/projects/creators/ProjectPublisher.vue"

	export default {
		data() {
			return {
				status: {
					loading: true,
					show: {
						titleEditor: false,
						snackbar: false,
						imageVideoEditor: true,
					}
				},
			}
		},
		methods: {
			load: function() {
				this.status.loading = true
				let id = this.$route.params.id

				this.$projects.get(`find/${id}`)
				.then(result => {
					this.$wait(500, () => this.$store.commit("setCurrentProject", result.data.project) )
				})
				.catch(err => this.$report(err, {swal: true}) )
				.finally(() => this.status.loading = false)
			},
			update: function( opt ) {
				this.$store.commit("setProjectData", opt )
				this.status.show.snackbar = true
			},
			review: function() {
				
				if(this.$store.getters.currentProject.stage == "evaluacion" && this.$store.getters.currentProject.workers.length == 0){
					this.$swal("Sin personal agregado", "Es necesario agregar al menos la información sobre un líder de proyecto", "warning")
				}else if(this.$store.getters.currentProject.stage == "montos"){
					this.$swal({
						title: "¿Estás seguro que deseas enviar tu proyecto a revisión?",
						text: "Este es el último paso para la revisión de tu proyecto, assegúrate de que la información esté correcta y completa.",
						type: "warning",
						confirmButtonText: "Sí, enviar.",
						cancelButtonText: "No, regresar.",
						showLoaderOnConfirm: true,
						showCancelButton: true,
						reverseButtons: true,
						preConfirm: () => {
							const resource = `project/${this.$route.params.id}/review`
							const body = {
								goal: {
									amount: this.$store.getters.currentProject.goal
								},
								title: this.$store.getters.currentProject.title
							}
							return this.$projects.post( resource, body )
						}
					})
					.then(result => {
						if(!result.dismiss){
							this.$swal({
								title: `El proyecto ha sido enviado a revisión exitosamente.`,
								text: "Te notificaremos cuando el proceso haya sido terminado",
								type: "success",
								showConfirmButton: false,
								timer: 3000,
								onClose: () => {
									this.$router.push({path: "/dashboard/proyectos"})
								}
							})
						}
					})
					.catch(err => this.$report(err, {swal: true}) )
				}else{
					this.$swal({
						title: "¿Estás seguro que deseas enviarlo a revisión?",
						text: "Investus revisará el proyecto y dictaminará los documentos que has subido. Durante este proceso no podrás realizar modificaciones al proyecto.",
						type: "warning",
						confirmButtonText: "Sí, enviar.",
						cancelButtonText: "No, regresar.",
						showLoaderOnConfirm: true,
						showCancelButton: true,
						reverseButtons: true,
						preConfirm: () => {
							const resource = `project/${this.$route.params.id}/review`
							const body = {
								title: this.$store.getters.currentProject.title
							}
							return this.$projects.post( resource, body )
						}
					})
					.then(result => {
						if(!result.dismiss){
							this.$swal({
								title: `El proyecto ha sido enviado a revisión exitosamente.`,
								text: "Te notificaremos cuando el proceso haya sido terminado",
								type: "success",
								showConfirmButton: false,
								timer: 3000,
								onClose: () => {
									this.$router.push({path: "/dashboard/proyectos"})
								}
							})
						}
					})
					.catch(err => this.$report(err, {swal: true}) )
				}
			},
			setReady: function() {
				this.$store.commit("setCurrentProjectStatus", true)
				let k = this.isReady
			},
			back: function() {
				this.$router.push({ path: "/dashboard/proyectos"})
			},
		},
		computed: {
			videoId: function() {
				if( this.$store.getters.currentProject.mainVideo ){
					const url = this.$store.getters.currentProject.mainVideo
					const qs = url.split("?")[1]
					if( qs ){
						const params = new URLSearchParams( qs )
						const v = params.get("v")
						return v
					}else
						return false
				}else
					return false
			},
			isReady: function() {
				if( this.$store.getters.currentProject && this.$store.getters.currentProject.documents ){
					/*	Revisa que todos los documentos habilitados se hayan subido 	*/
					
					if( this.$store.getters.currentProject.stage == "montos" )
						return this.$store.getters.currentProject.estates.length > 0 && this.$store.getters.currentProject.goal > 0

					for(let doc of this.$store.getters.currentProject.documents)
						if( doc.status != "uploaded" )
							return false // Termina la ejecución de la función

					// Si el código continúa aquí significa que todos los documentos han sido subidos
					return true
				}else
					return false
			},
			viabilidadDocs: function() {
				let documents = this.$store.getters.currentProject.documents || [] //array
				let filtered = documents
				.filter(doc => {
					return ["escritura_propiedad", "posesion_material", "escritura_propiedad_colateral", "certificado_libertad_gravamen", "extincion_expropiacion"].includes(doc.type)
				})
				.filter(doc => doc.status != "uploaded" )

				return filtered
			},
			evaluacionDocs: function() {
				let documents = this.$store.getters.currentProject.documents || [] //array
				let filtered = documents
				.filter(doc => {
					return ["plan_negocios", "estudio_mercado", "estudio_viabilidad", "estado_resultados", "estado_resultados", "estado_flujos", "balance_general", "reporte_credito"].includes(doc.type)
				})
				.filter(doc => doc.status != "uploaded" )
				
				return filtered
			},
			montosDocs: function() {
				let documents = this.$store.getters.currentProject.documents || [] //array
				let filtered = documents
				.filter(doc => {
					return ["null"].includes(doc.type)
				})
				.filter(doc => doc.status != "uploaded" )
				
				return filtered
			},
		},
		activated(){
			this.load()
		},
		components: {
			ProjectCardLoader,
			SingleMetric,
			GoalSlider,
			RiskLevel,
			SliderGallery,
			Description,
			Updates,
			Documents,
			Observations,
			TitleEditor,
			ProjectPublisher
		}
	}
</script>

<style lang="sass">
	.project-publisher
		.project-title
			text-transform: uppercase
			font-family: Raleway
			letter-spacing: 1px
			color: black
			font-size: 25px
			font-weight: 600

			span
				vertical-align: middle
				padding-right: 10px
		.content
			.image-video-container
				position: relative
				.project-main-video
					iframe
						width: 100%
				.project-main-image
					.white-background
						background: white
			.project-content
				margin-bottom: -15px
				background-color: white
				.v-tabs
					.v-tab
						.v-badge
							margin-left: 5px
				.v-tabs-items
					padding: 15px

	@media only screen and (min-width: 1905px)
		.project-publisher
	@media only screen and (max-width: 1904px)
		.project-publisher
	@media only screen and (max-width: 600px)
		.project-publisher
</style>