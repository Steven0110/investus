<template lang="pug">
	.projects-subpanel
		.subpanel-title.d-none.d-md-block
			|My Projects
		.subpanel-description
			|In this section you can view your projects as well as check their status and update them.
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
				mockProjects: [
					{
						_id: "proj1",
						title: "Urban Living Tower",
						description: "Modern apartment complex with co-working spaces in downtown area",
						mainImage: "/assets/images/estate.jpg",
						status: "active",
						progress: 68,
						goal: 2500000,
						totalInvested: 1700000,
						roi: 12.5,
						risk: "medium",
						createdAt: new Date("2023-10-15"),
						location: "Downtown",
						type: "Residential"
					},
					{
						_id: "proj2",
						title: "Commercial Plaza Centre",
						description: "Multi-purpose commercial building with retail spaces and offices",
						mainImage: "/assets/images/estate2.png",
						status: "revision",
						progress: 30,
						goal: 4200000,
						totalInvested: 1260000,
						roi: 14.2,
						risk: "medium-high",
						createdAt: new Date("2023-12-03"),
						location: "Financial District",
						type: "Commercial"
					},
					{
						_id: "proj3",
						title: "Green View Residences",
						description: "Eco-friendly residential development with solar panels and green spaces",
						mainImage: "/assets/images/project-default.png",
						status: "pending",
						progress: 0,
						goal: 1800000,
						totalInvested: 0,
						roi: 10.8,
						risk: "low",
						createdAt: new Date("2024-01-20"),
						location: "Suburbs",
						type: "Residential"
					},
					{
						_id: "proj4",
						title: "Tech Innovation Hub",
						description: "Modern office space designed for technology startups and innovation",
						mainImage: "/assets/images/estate.jpg",
						status: "completed",
						progress: 100,
						goal: 3000000,
						totalInvested: 3000000,
						roi: 15.5,
						risk: "medium",
						createdAt: new Date("2023-05-10"),
						location: "Tech District",
						type: "Commercial"
					}
				]
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

					// Simulate API call with mock data
					setTimeout(() => {
						let projects = this.mockProjects

						// Add projects one by one to create an effect
						setTimeout(() => {
							for( let i = 0 ; i < projects.length ; i++ )
								(i => {
									setTimeout(() => {
										 this.projects.push( projects[ i ] )
									}, 150 * i)
								})(i);
						}, 500)

						this.status.loading = false
					}, 1000)
				}
			},
			removeProject: function( index ) {
				this.projects.splice(index, 1)
			}
		},
		mounted(){
			this.findProjects()

			// Define the current page
			this.page = this.$route.query.page || 1

		},
		activated(){
			this.findProjects()

			// Define the current page
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