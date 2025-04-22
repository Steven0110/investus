<template lang="pug">
	v-col(cols="12", md="3", lg="4", xl="3")
		v-card.project-card(height="320", @click="status.show.projectCreator = true")
			v-card-text
				.middle-container
					p.mb-1
						v-icon(x-large, color="#999")
							|mdi-plus
					p.mb-0.middle-container-text
						|Add Project
		project-type-chooser(:show="status.show.projectCreator", @close="status.show.projectCreator = false")
</template>

<script>
	import ProjectTypeChooser 	from "@/components/dashboard/elements/projects/creators/ProjectTypeChooser.vue"
	export default {
		data() {
			return {
				status: {
					show: {
						projectCreator: false
					}
				}
			}
		},
		methods: {
		},
		components: {
			ProjectTypeChooser
		}
	}
</script>

<style lang="sass">
	.project-card
		.v-card__text
			display: table
			height: 100%
			.middle-container
				display: table-cell
				vertical-align: middle
				text-align: center
				.middle-container-text
					font-family: Raleway
					text-transform: uppercase
					font-size: 1.2rem
					font-weight: 600
					color: #999

</style>
