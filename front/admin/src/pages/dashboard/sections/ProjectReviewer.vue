<template lang="pug">
	.project-reviewer
		.project-title.d-none.d-md-block
			v-icon(left, color="black", large, @click="back")
				|mdi-chevron-left
			span
				|Project: {{ $store.getters.currentProject.title }}
			v-btn(
				color="primary",
				absolute,
				right,
				top,
				@click="status.show.developer = true",
				v-if="$store.getters.currentProject.developer._id")
				|View requester

		.content
			project-card-loader(:show="status.loading")
				
			documents(v-if="$store.getters.currentProject.documents")

			developer-summary(,
				@close="status.show.developer = false",
				:show="status.show.developer",
				v-if="$store.getters.currentProject.developer._id")

</template>

<script>
	import ProjectCardLoader 	from "@/components/tools/loader/ProjectCardLoader.vue"
	import DeveloperSummary 	from "@/components/dashboard/elements/developers/DeveloperSummary.vue"
	import Documents 			from "@/components/dashboard/elements/projects/sections/Documents.vue"
	import ProjectInfo 			from "@/components/dashboard/elements/projects/ProjectInfo.vue"

	export default {
		data() {
			return {
				status: {
					loading: true,
					show: {
						developer: false
					}
				},
				project: {title: "..."},
			}
		},
		methods: {
			load: function() {
				this.status.loading = true
				let id = this.$route.params.id

				// Mock data instead of API call
				setTimeout(() => {
					const mockProject = {
						_id: id,
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
						estates: [
							{
								value: 1000000,
								percentage: 50
							},
							
						],
						documents: [
							{
								type: "legal_doc_1",
								name: "Articles of Incorporation",
								stage: "viabilidad",
								processed: true,
								valid: true,
								rate: 8,
								url: "#",
								goal: {
									amount: 2500000
								}
							},
							{
								type: "legal_doc_2",
								name: "Property Title",
								stage: "viabilidad",
								processed: true,
								valid: true,
								rate: 9,
								url: "#"
							},
							{
								type: "legal_doc_3",
								name: "Land Use Permit",
								stage: "viabilidad",
								processed: true,
								valid: true,
								rate: 7,
								url: "#"
							},
							{
								type: "financial_doc_1",
								name: "Market Study",
								stage: "evaluacion",
								processed: true,
								valid: true,
								rate: 8,
								url: "#"
							},
							{
								type: "financial_doc_2",
								name: "Financial Projections",
								stage: "evaluacion",
								processed: true,
								valid: true,
								rate: 7,
								url: "#"
							},
							{
								type: "financial_doc_3",
								name: "Risk Assessment",
								stage: "evaluacion",
								processed: true,
								valid: true,
								rate: 6,
								url: "#"
							}
						],
						developer: {
							_id: "dev1",
							name: "ABC Development Corp",
							email: "info@abcdev.com",
							phone: "+1 (555) 123-4567",
							address: "123 Business St, New York, NY",
							website: "www.abcdev.com",
							yearFounded: 2010,
							projectsCompleted: 15,
							totalInvestment: 45000000
						}
					}
					
					this.$store.commit("setCurrentProject", mockProject)
					this.status.loading = false
				}, 1000)
			},
			back: function() {
				this.$router.push({path: "/dashboard/proyectos"})
			}
		},
		activated(){
			this.load()
		},
		components: {
			ProjectInfo,
			ProjectCardLoader,
			Documents,
			DeveloperSummary
		}
	}
</script>

<style lang="sass">
	.project-reviewer
		.project-title
			text-transform: uppercase
			font-family: Roboto
			letter-spacing: 1px
			color: black
			font-size: 25px
			font-weight: 600
			margin-bottom: 10px

			span
				vertical-align: middle
		.content
	@media only screen and (min-width: 1905px)
		.project-reviewer
	@media only screen and (max-width: 1904px)
		.project-reviewer
	@media only screen and (max-width: 960px)
		.project-reviewer
	@media only screen and (max-width: 600px)
		.project-reviewer
</style>