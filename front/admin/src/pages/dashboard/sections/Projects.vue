<template lang="pug">
	.projects-subpanel
		.subpanel-title.d-none.d-md-block
			|Projects
		.subpanel-description
			|In this section you can view and manage projects that have been uploaded to the platform.
		.content
			//filter-bar(v-model="filters", @search="filter", @filter="filter", @sort="filter")

			v-tabs(v-model="tab", color="secondary", fixed-tabs)
				v-tab(key="revision-tab")
					|Pending Review
				v-tab(key="waiting-tab")
					|Waiting for Documents
				v-tab(key="published-tab")
					|Published
				v-tab(key="rejected-tab")
					|Rejected

			v-tabs-items(v-model="tab", touchless)
				// Pending Review
				v-tab-item(key="revision-tab")
					projects-table(:projects="revisionprojects", :headers="headers", :loading="status.loading")

				// Waiting for Documents
				v-tab-item(key="waiting-tab")
					projects-table(:projects="waitingprojects", :headers="headers", :loading="status.loading")
				
				// Published
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
				mockProjects: [
					{
						_id: "proj1",
						title: "Urban Living Tower",
						description: "Modern apartment complex with co-working spaces in downtown area",
						mainImage: "/assets/images/estate.jpg",
						status: "revision",
						goal: {
							amount: 2500000
						},
						totalInvested: 0,
						roi: 12.5,
						risk: "medium",
						createdAt: new Date("2023-10-15"),
						location: "Downtown",
						type: "debt",
						developer: {
							name: "ABC Development Corp",
							email: "info@abcdev.com"
						}
					},
					{
						_id: "proj2",
						title: "Commercial Plaza Centre",
						description: "Multi-purpose commercial building with retail spaces and offices",
						mainImage: "/assets/images/estate2.png",
						status: "waiting",
						goal: {
							amount: 4200000
						},
						totalInvested: 1260000,
						roi: 14.2,
						risk: "medium-high",
						createdAt: new Date("2023-12-03"),
						location: "Financial District",
						type: "debt",
						developer: {
							name: "Urban Builders LLC",
							email: "projects@urbanbuilders.com"
						}
					},
					{
						_id: "proj3",
						title: "Green View Residences",
						description: "Eco-friendly residential development with solar panels and green spaces",
						mainImage: "/assets/images/project-default.png",
						status: "published",
						goal: {
							amount: 1800000
						},
						totalInvested: 1800000,
						roi: 10.8,
						risk: "low",
						createdAt: new Date("2024-01-20"),
						location: "Suburbs",
						type: "co-ownership",
						developer: {
							name: "EcoHomes Group",
							email: "contact@ecohomes.com"
						}
					},
					{
						_id: "proj4",
						title: "Tech Innovation Hub",
						description: "Modern office space designed for technology startups and innovation",
						mainImage: "/assets/images/estate.jpg",
						status: "rejected",
						goal: {
							amount: 3000000
						},
						totalInvested: 0,
						roi: 15.5,
						risk: "medium",
						createdAt: new Date("2023-05-10"),
						location: "Tech District",
						type: "debt",
						developer: {
							name: "Future Spaces Inc",
							email: "dev@futurespaces.com"
						}
					},
					{
						_id: "proj5",
						title: "Waterfront Apartments",
						description: "Luxury apartments with waterfront views and premium amenities",
						mainImage: "/assets/images/estate2.png",
						status: "published",
						goal: {
							amount: 5500000
						},
						totalInvested: 4200000,
						roi: 18.3,
						risk: "high",
						createdAt: new Date("2023-09-05"),
						location: "Harbor District",
						type: "co-ownership",
						developer: {
							name: "Premium Developers",
							email: "info@premiumdev.com"
						}
					},
					{
						_id: "proj6",
						title: "Mixed-Use Complex",
						description: "Combined residential and commercial spaces with integrated facilities",
						mainImage: "/assets/images/project-default.png",
						status: "waiting",
						goal: {
							amount: 3900000
						},
						totalInvested: 1100000,
						roi: 13.7,
						risk: "medium",
						createdAt: new Date("2024-02-15"),
						location: "City Center",
						type: "debt",
						developer: {
							name: "Integrated Spaces",
							email: "projects@integratedspaces.com"
						}
					},
					{
						_id: "proj7",
						title: "Suburban Housing Development",
						description: "Family-oriented housing community with parks and schools nearby",
						mainImage: "/assets/images/estate.jpg",
						status: "revision",
						goal: {
							amount: 2900000
						},
						totalInvested: 0,
						roi: 11.9,
						risk: "low",
						createdAt: new Date("2024-03-01"),
						location: "South Suburbs",
						type: "co-ownership",
						developer: {
							name: "Family Homes LLC",
							email: "info@familyhomes.com"
						}
					},
					{
						_id: "proj8",
						title: "Historical Building Renovation",
						description: "Restoration of historic building into boutique hotel and retail spaces",
						mainImage: "/assets/images/estate2.png",
						status: "rejected",
						goal: {
							amount: 4800000
						},
						totalInvested: 0,
						roi: 16.2,
						risk: "high",
						createdAt: new Date("2023-08-20"),
						location: "Old Town",
						type: "debt",
						developer: {
							name: "Heritage Restoration Group",
							email: "projects@heritagegroup.com"
						}
					}
				],
				headers: [
					{ text: "Requester", value: "developer.name", align: "start" },
					{ text: "Name", value: "title"},
					//{ text: "Upload Date", value: "createdAt"},
					{ text: "Target", value: "goal"},
					{ text: "Invested", value: "totalInvested"},
					{ text: "Type", value: "type"},
					{ text: "Status", value: "status", sortable: false},
					{ text: "Actions", value: "_id", sortable: false},
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

					// Use mock data instead of API call
					setTimeout(() => {
						this.projects = this.mockProjects
						this.status.loading = false
					}, 1000)
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