<template lang="pug">
	.projects-subpanel
		.subpanel-title.d-none.d-md-block
			|Mis proyectos
		.subpanel-description
			|En esta sección podrás consultar tus proyectos así como revisar el estatus y actualizarlos.
		.content
			//filter-bar(v-model="filters", @search="filter", @filter="filter", @sort="filter")

			row-card-loader(:show="status.loading")

			.projects-container()
				transition-group(name="fade-transition", tag="div", class="row")
					project(v-for="(project, index) in projects", :project="project", :key="project._id", @delete="removeProject(index)")
					project-add-card(key="-1")


</template>

<script>
	import Project 			from "@/components/dashboard/elements/projects/Project.vue"
	import FilterBar 		from "@/components/dashboard/elements/projects/FilterBar.vue"
	import ProjectAddCard 	from "@/components/dashboard/elements/projects/creators/ProjectAddCard.vue"
	import Uploader 		from "@/components/tools/files/Uploader.vue"
	import RowCardLoader 	from "@/components/tools/loader/RowCardLoader.vue"

	export default {
		data() {
			return {
				status: {
					loading: false
				},
				filters: {
					goal: [100000, 10000000],
					sort: "none"
				},
				page: 1,
				projects: [],
			}
		},
		computed: {
		},
		methods: {
			filter: function() {
				let filters = this.filters
				let page = this.page

				this.findProjects()
			},
			findProjects: function() {
				
				if( !this.status.loading ){
					this.projects = []
					this.status.loading = true

					this.$projects.get("find")
					.then(result => {
						let projects = result.data.projects

						// Agrega uno por uno los proyectos para generar un efecto de 
						setTimeout(() => {
							for( let i = 0 ; i < projects.length ; i++ )
								(i => {
									setTimeout(() => {
										 this.projects.push( projects[ i ] )
									}, 150 * i)
								})(i);
						}, 500)

					})
					.catch(err => {
						console.error( err )
						this.$swal("Error", "Hubo un error al consultar los proyectos disponibles, por favor vuelva a intentarlo.", "warning")
						this.$sentry.captureException( new Error(err) )
					})
					.finally(() => this.status.loading = false)
				}
			},
			removeProject: function( index ) {
				this.projects.splice(index, 1)
			}
		},
		mounted(){
			this.findProjects()

			// Define la página actual
			this.page = this.$route.query.page || 1

		},
		activated(){
			this.findProjects()

			// Define la página actual
			this.page = this.$route.query.page || 1

		},
		components: {
			Uploader,
			RowCardLoader,
			Project,
			FilterBar,
			ProjectAddCard
		}
	}
</script>

<style lang="sass">
	.projects-subpanel
		.subpanel-title
			text-transform: uppercase
			font-family: Raleway
			letter-spacing: 1px
			color: black
			font-size: 25px
			font-weight: 600
		.subpanel-description
			font-family: Raleway
			font-size: 18px
			color: #444
	@media only screen and (max-width: 600px)
		.projects-subpanel
</style>