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
				
				v-col.pb-0(cols="12")
					project-publisher(
						ref="publisher",
						@ready="setReady",
						v-if="$store.getters.currentProject._id")
				v-col.pt-10(cols="12")
					v-row
						v-spacer
						v-btn(color="primary", @click="review", x-large, :disabled="!isReady", v-if="$store.getters.currentProject.status != 'revision'")
							|Send for review
							v-icon(color="white", right)
								|mdi-folder-search-outline
						v-spacer
		title-editor(
			v-if="$store.getters.currentProject._id && status.show.titleEditor",
			:show="status.show.titleEditor",
			@update="update",
			@close="status.show.titleEditor = false")

		v-snackbar(v-model="status.show.snackbar")
			|Project updated successfully
			template(v-slot:action="{ attrs }")
				v-btn(color="#ba7127", text, v-bind="attrs", @click="status.show.snackbar = false")
					|Close

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
				mockProjects: {
					"proj1": {
						_id: "proj1",
						title: "Urban Living Tower",
						description: "Modern apartment complex with co-working spaces in downtown area. This state-of-the-art building offers residential units with smart home technology, common areas with co-working spaces, rooftop garden, fitness center, and 24/7 security services.",
						mainImage: "/assets/images/estate.jpg",
						status: "waiting",
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
						],
						pendingDocuments: [
							{
								name: "Business Plan",
								path: "/assets/images/helper01.jpg",
								required: true,
								type: "pdf"
							},
							{
								name: "Financial Projections",
								path: null,
								required: true,
								type: "excel"
							},
							{
								name: "Construction Permits",
								path: "/assets/images/helper02.jpg",
								required: true,
								type: "pdf"
							}
						],
						stage: "documentacion"
					},
					"proj2": {
						_id: "proj2",
						title: "Commercial Plaza Centre",
						description: "Multi-purpose commercial building with retail spaces and offices. The Commercial Plaza Centre is strategically located in the financial district, offering premium office spaces and retail locations.",
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
						],
						pendingDocuments: [
							{
								name: "Business Plan",
								path: "/assets/images/helper01.jpg",
								required: true,
								type: "pdf"
							},
							{
								name: "Financial Projections",
								path: "/assets/images/helper02.jpg",
								required: true,
								type: "excel"
							},
							{
								name: "Construction Permits",
								path: "/assets/images/helper01.jpg",
								required: true,
								type: "pdf"
							}
						],
						stage: "evaluacion",
						workers: []
					},
					"proj3": {
						_id: "proj3",
						title: "Green View Residences",
						description: "Eco-friendly residential development with solar panels and green spaces. Green View Residences is designed with sustainability in mind.",
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
						updates: [],
						pendingDocuments: [
							{
								name: "Business Plan",
								path: null,
								required: true,
								type: "pdf"
							},
							{
								name: "Financial Projections",
								path: null,
								required: true,
								type: "excel"
							},
							{
								name: "Construction Permits",
								path: null,
								required: true,
								type: "pdf"
							}
						],
						stage: "montos"
					},
					"proj4": {
						_id: "proj4",
						title: "Tech Innovation Hub",
						description: "Modern office space designed for technology startups and innovation. The Tech Innovation Hub provides flexible office spaces specifically designed for technology startups.",
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
						],
						pendingDocuments: [
							{
								name: "Business Plan",
								path: "/assets/images/helper01.jpg",
								required: true,
								type: "pdf"
							},
							{
								name: "Financial Projections",
								path: "/assets/images/helper02.jpg",
								required: true,
								type: "excel"
							},
							{
								name: "Construction Permits",
								path: "/assets/images/helper01.jpg",
								required: true,
								type: "pdf"
							}
						],
						stage: "evaluacion",
						workers: [
							{
								name: "John Smith",
								position: "Project Manager",
								email: "john@example.com"
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
							this.$store.commit("setCurrentProject", mockProject)
							this.status.loading = false
						})
					} else {
						// If project doesn't exist, use a default one
						this.$wait(500, () => {
							this.$store.commit("setCurrentProject", this.mockProjects["proj1"])
							this.status.loading = false
						})
					}
				}, 1000)
			},
			update: function( opt ) {
				this.$store.commit("setProjectData", opt )
				this.status.show.snackbar = true
			},
			review: function() {
				
				if(this.$store.getters.currentProject.stage == "evaluacion" && this.$store.getters.currentProject.workers.length == 0){
					this.$swal("No staff added", "You need to add at least one project leader's information", "warning")
				}else if(this.$store.getters.currentProject.stage == "montos"){
					this.$swal({
						title: "Are you sure you want to send your project for review?",
						text: "This is the final step for your project review, make sure the information is correct and complete.",
						type: "warning",
						confirmButtonText: "Yes, send it.",
						cancelButtonText: "No, go back.",
						showLoaderOnConfirm: true,
						showCancelButton: true,
						reverseButtons: true,
						preConfirm: () => {
							// Mock API call
							return new Promise(resolve => {
								setTimeout(() => {
									resolve({ data: { success: true } })
								}, 1500)
							})
						}
					})
					.then(result => {
						if(!result.dismiss){
							this.$swal({
								title: `The project has been successfully sent for review.`,
								text: "We'll notify you when the process is complete",
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
						title: "Are you sure you want to send it for review?",
						text: "Investus will review the project and evaluate the documents you've uploaded. During this process, you won't be able to make changes to the project.",
						type: "warning",
						confirmButtonText: "Yes, send it.",
						cancelButtonText: "No, go back.",
						showLoaderOnConfirm: true,
						showCancelButton: true,
						reverseButtons: true,
						preConfirm: () => {
							// Mock API call
							return new Promise(resolve => {
								setTimeout(() => {
									resolve({ data: { success: true } })
								}, 1500)
							})
						}
					})
					.then(result => {
						if(!result.dismiss){
							this.$swal({
								title: `The project has been successfully sent for review.`,
								text: "We'll notify you when the process is complete",
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
				/* Check that all enabled documents have been uploaded */
				if( this.$store.getters.currentProject.pendingDocuments ){
					for( let i = 0 ; i < this.$store.getters.currentProject.pendingDocuments.length ; i++ ){
						if( this.$store.getters.currentProject.pendingDocuments[ i ].required &&
							!this.$store.getters.currentProject.pendingDocuments[ i ].path )
							return false;
					}
				}

				// If the code continues here, it means all documents have been uploaded
				return this.$store.getters.currentProject && this.$store.getters.currentProject.status
			}
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