<template lang="pug">
	.project-viewer
		.project-title.d-none.d-md-block
			v-icon(left, color="black", large, @click="back")
				|mdi-chevron-left
			span
				|{{ project.title }}

		.content
			project-card-loader(:show="status.loading")

			v-row(v-if="!status.loading")

				v-col(cols="12", md="7")
					.project-main-video(v-if="videoId")
						youtube(:video-id="videoId", :player-vars="{autoplay: 0}", height="400")
					.project-main-image(v-else)
						v-img(:src="project.mainImage", max-height="400", lazy-src="/assets/images/image-loader.jpg")
							template(v-slot:placeholder)
								v-row.fill-height.ma-0(align="center", justify="center")
									v-progress-circular(indeterminate, color="grey lighten-5")

				v-col.main-metrics(cols="12", md="5")
					v-row
						v-col.pb-0(cols="12")
							goal-slider(:value="project.progress", :totalInvested="project.totalInvested", :goal="project.goal")
						v-col(cols="12", md="6")
							single-metric(:value="project.investors || 15", text="Investors")
							single-metric(:value="project.daysRemaining || 66", text="Days remaining")
							single-metric(:value="project.roi + '%'", text="ROI")
						v-col(cols="12", md="6")
							risk-level(:risk="project.risk")
						//v-col(cols="12")
							.project-actions
								v-btn(color="primary", block, large)
									|Invest Now
									
				v-col.project-carousel(cols="12")
					slider-gallery(:images="project.gallery")

				v-col.pb-0(cols="12")
					.project-content
						
						v-tabs(v-model="tab", color="#B05900")
							v-tab(key="description")
								|Description
							v-tab(key="updates")
								|Updates
							v-tab(key="simulator")
								|Investment Simulator

						v-tabs-items(v-model="tab")
							v-tab-item(key="description")
								description
							v-tab-item(key="updates")
								updates(:updates="project.updates")
							v-tab-item(key="simulator")
								simulator(:invested="project.totalInvested", :goal="project.goal", :roi="project.roi")

</template>

<script>
	import ProjectCardLoader 	from "@/components/tools/loader/ProjectCardLoader.vue"
	import SingleMetric 		from "@/components/dashboard/elements/projects/kpi/SingleMetric.vue"
	import GoalSlider 			from "@/components/dashboard/elements/projects/kpi/GoalSlider.vue"
	import RiskLevel 			from "@/components/dashboard/elements/projects/kpi/RiskLevel.vue"
	import SliderGallery		from "@/components/dashboard/elements/projects/gallery/SliderGallery.vue"
	import Description			from "@/components/dashboard/elements/projects/sections/Description.vue"
	import Updates				from "@/components/dashboard/elements/projects/sections/Updates.vue"
	import Simulator			from "@/components/dashboard/elements/projects/sections/Simulator.vue"

	export default {
		data() {
			return {
				status: {
					loading: true
				},
				project: {
					title: "Loading information...",
					progress: 0,
					totalInvested: 0,
					updates: []
				},
				tab: null,
				mockProjects: {
					"proj1": {
						_id: "proj1",
						title: "Urban Living Tower",
						description: "Modern apartment complex with co-working spaces in downtown area. This state-of-the-art building offers residential units with smart home technology, common areas with co-working spaces, rooftop garden, fitness center, and 24/7 security services. Located in a prime downtown location with easy access to public transportation, shopping centers, and entertainment venues.",
						mainImage: "/assets/images/estate.jpg",
						status: "active",
						progress: 68,
						goal: 2500000,
						totalInvested: 1700000,
						roi: 12.5,
						risk: "medium",
						investors: 24,
						daysRemaining: 45,
						createdAt: new Date("2023-10-15"),
						location: "Downtown",
						type: "Residential",
						gallery: [
							"/assets/images/estate.jpg",
							"/assets/images/estate2.png",
							"/assets/images/project-default.png"
						],
						updates: [
							{
								title: "Construction Progress Update",
								date: "2024-02-15",
								content: "Foundation work completed. Starting structural framework next week."
							},
							{
								title: "Project Timeline",
								date: "2024-01-10",
								content: "Project on track for completion by end of year. All permits approved."
							}
						]
					},
					"proj2": {
						_id: "proj2",
						title: "Commercial Plaza Centre",
						description: "Multi-purpose commercial building with retail spaces and offices. The Commercial Plaza Centre is strategically located in the financial district, offering premium office spaces and retail locations. The building features modern architecture, energy-efficient systems, flexible floor plans, and state-of-the-art telecommunications infrastructure.",
						mainImage: "/assets/images/estate2.png",
						status: "revision",
						progress: 30,
						goal: 4200000,
						totalInvested: 1260000,
						roi: 14.2,
						risk: "medium-high",
						investors: 18,
						daysRemaining: 87,
						createdAt: new Date("2023-12-03"),
						location: "Financial District",
						type: "Commercial",
						gallery: [
							"/assets/images/estate2.png",
							"/assets/images/estate.jpg",
							"/assets/images/project-default.png"
						],
						updates: [
							{
								title: "Design Changes Approved",
								date: "2024-02-20",
								content: "Final design approved by city planning department. Construction to begin in March."
							}
						]
					},
					"proj3": {
						_id: "proj3",
						title: "Green View Residences",
						description: "Eco-friendly residential development with solar panels and green spaces. Green View Residences is designed with sustainability in mind. Features include solar panels on all units, rainwater collection systems, energy-efficient appliances, and abundant green spaces. The community will include walking trails, community gardens, and electric vehicle charging stations.",
						mainImage: "/assets/images/project-default.png",
						status: "pending",
						progress: 0,
						goal: 1800000,
						totalInvested: 0,
						roi: 10.8,
						risk: "low",
						investors: 0,
						daysRemaining: 120,
						createdAt: new Date("2024-01-20"),
						location: "Suburbs",
						type: "Residential",
						gallery: [
							"/assets/images/project-default.png"
						],
						updates: []
					},
					"proj4": {
						_id: "proj4",
						title: "Tech Innovation Hub",
						description: "Modern office space designed for technology startups and innovation. The Tech Innovation Hub provides flexible office spaces specifically designed for technology startups. The building offers high-speed internet, conference rooms with advanced AV equipment, private phone booths, relaxation areas, and 24/7 access. Located in the heart of the tech district with easy access to public transportation and nearby amenities.",
						mainImage: "/assets/images/estate.jpg",
						status: "completed",
						progress: 100,
						goal: 3000000,
						totalInvested: 3000000,
						roi: 15.5,
						risk: "medium",
						investors: 32,
						daysRemaining: 0,
						createdAt: new Date("2023-05-10"),
						location: "Tech District",
						type: "Commercial",
						gallery: [
							"/assets/images/estate.jpg",
							"/assets/images/estate2.png"
						],
						updates: [
							{
								title: "Project Completed",
								date: "2024-01-25",
								content: "All construction completed. Building fully occupied with 95% of office spaces leased."
							},
							{
								title: "First Dividend Payment",
								date: "2023-12-15",
								content: "First quarterly dividend payment of 3.8% distributed to all investors."
							},
							{
								title: "Grand Opening",
								date: "2023-11-01",
								content: "Official grand opening ceremony with city officials and local business leaders."
							}
						]
					}
				}
			}
		},
		methods: {
			load: function() {
				this.status.loading = true
				let id = this.$route.params.id

				// Simulate API call with mock data
				setTimeout(() => {
					// Check if we have this project in mock data
					const mockProject = this.mockProjects[id]
					
					if (mockProject) {
						// If project exists in mock data, use it
						this.$wait(500, () => {
							this.project = mockProject
							this.status.loading = false
						})
					} else {
						// If project doesn't exist, use a default one
						this.$wait(500, () => {
							this.project = this.mockProjects["proj1"]
							this.status.loading = false
						})
					}
				}, 1000)
			},
			back: function() {
				this.$router.go( -1 )
			}
		},
		computed: {
			videoId: function() {
				if( this.project.mainVideo ){
					const url = this.project.mainVideo
					const qs = url.split("?")[1]
					if( qs ){
						const params = new URLSearchParams( qs )
						const v = params.get("v")
						return v
					}else
						return false
				}else
					return false
			}
		},
		mounted(){
			console.log("mounted")
			//this.load()
		},
		activated(){
			console.log("activated")
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
			Simulator
		}
	}
</script>

<style lang="sass">
	.project-viewer
		.project-title
			text-transform: uppercase
			font-family: Raleway
			letter-spacing: 1px
			color: black
			font-size: 25px
			font-weight: 600

			span
				vertical-align: middle
		.content
			.project-main-video
				iframe
					width: 100%
			.project-content
				margin-left: -15px
				margin-right: -15px
				margin-bottom: -15px
				padding: 25px
				padding-top: 10px
				background-color: white
				.v-tabs-items
					padding-top: 25px
					padding-bottom: 25px

	@media only screen and (min-width: 1905px)
		.project-viewer
	@media only screen and (max-width: 1904px)
		.project-viewer
	@media only screen and (max-width: 600px)
		.project-viewer
</style>