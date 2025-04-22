<template lang="pug">
	.projects-subpanel
		.subpanel-title.d-none.d-md-block
			|Proyectos
		.subpanel-description
			|En esta sección podrás consultar y administrar los proyectos que se hayan subido a la plataforma.
		.content
			//filter-bar(v-model="filters", @search="filter", @filter="filter", @sort="filter")

			v-tabs(v-model="tab", color="secondary", fixed-tabs)
				v-tab(key="waiting-tab")
					|Pendientes por revisar
				v-tab(key="pending-tab")
					|En espera de documentos
				v-tab(key="published-tab")
					|Publicados
				v-tab(key="rejected-tab")
					|Rechazados

			v-tabs-items(v-model="tab", touchless)
				// Pendientes por revisar
				v-tab-item(key="revision-tab")
					projects-table(:projects="revisionprojects", :headers="headers", :loading="status.loading")

				// En espera de documentos
				v-tab-item(key="waiting-tab")
					projects-table(:projects="waitingprojects", :headers="headers", :loading="status.loading")
				
				// Publicadas
				v-tab-item(key="published-tab")
					projects-table(:projects="publishedprojects", :headers="headers", :loading="status.loading")
				
				// Rejected
				v-tab-item(key="rejected-tab")
					projects-table(:projects="rejectedprojects", :headers="headers", :loading="status.loading")

			v-snackbar(v-model="state.snackbar", color="primary", dark, bottom)
				template(v-slot:action="{ attrs }")
					v-btn(v-bind="attrs", text)
						v-icon(color="white")
							|mdi-check
				|{{ message }}
					

</template>

<script>
	import RowCardLoader 	from "@/components/tools/loader/RowCardLoader.vue"
	import ProjectsTable 	from "@/components/dashboard/elements/projects/ProjectsTable.vue"

	export default {
		data() {
			return {
				status: {
					loading: false
				},
				state: {
					snackbar: false
				},
				filters: {
					goal: [100000, 10000000],
					sort: "none"
				},
				message: "",
				page: 1,
				projects: [],
				headers: [
					{ text: "Solicitante", value: "developer.name", align: "start" },
					{ text: "Nombre", value: "title"},
					//{ text: "Fecha de subida", value: "createdAt"},
					{ text: "Objetivo", value: "goal"},
					{ text: "Invertido", value: "totalInvested"},
					{ text: "Tipo", value: "type"},
					{ text: "Estatus", value: "status", sortable: false},
					{ text: "Acciones", value: "_id", sortable: false},
				],
				tab: null
			}
		},
		methods: {
			filter: function() {
				let filters = this.filters
				let page = this.page

				this.findprojects()
			},
			findprojects: function() {
				
				if( !this.status.loading ){
					this.projects = []
					this.status.loading = true

					this.$projects.get("find")
					.then(result => this.projects = result.data.projects)
					.catch(err => {
						this.$swal("Error", "Hubo un error al consultar los proyectos disponibles, por favor vuelva a intentarlo.", "warning")
						this.$report( err )
					})
					.finally(() => this.status.loading = false)
				}
			},
		},
		computed: {
			waitingprojects: function() {
				return this.projects.filter(i => i.status == "waiting")
			},
			revisionprojects: function() {
				return this.projects.filter(i => i.status == "revision")
			},
			publishedprojects: function() {
				return this.projects.filter(i => i.status == "published")
			},
			rejectedprojects: function() {
				return this.projects.filter(i => i.status == "rejected")
			},
		},
		mounted(){
			this.findprojects()

		},
		activated(){
			this.findprojects()
			if(this.$route.query.message){
				this.message = this.$route.query.message
				this.state.snackbar = true
			}
		},
		components: {
			RowCardLoader,
			ProjectsTable
		}
	}
</script>

<style lang="sass">
	.projects-subpanel
		.subpanel-title
			text-transform: uppercase
			font-family: Roboto
			letter-spacing: 1px
			color: black
			font-size: 25px
			font-weight: 600
		.subpanel-description
			font-family: Roboto
			font-size: 18px
			color: #444
			margin-bottom: 15px
	@media only screen and (max-width: 600px)
		.projects-subpanel
</style>