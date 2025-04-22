<template lang="pug">
	.project-reviewer
		.project-title.d-none.d-md-block
			v-icon(left, color="black", large, @click="back")
				|mdi-chevron-left
			span
				|Proyecto: {{ $store.getters.currentProject.title }}
			v-btn(
				color="primary",
				absolute,
				right,
				top,
				@click="status.show.developer = true",
				v-if="$store.getters.currentProject.developer._id")
				|Ver solicitante

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

				this.$projects.get(`find/${id}`)
				.then(result => this.$wait(500, () => this.$store.commit("setCurrentProject", result.data.project)) )
				.catch(err => this.$report(err, {swal: true}) )
				.finally( () => this.status.loading = false )
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