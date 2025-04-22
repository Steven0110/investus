<template lang="pug">
	.updates-timeline
		v-timeline(align-top)
			timeline-step(
				v-for="update in updates",
				:key="update.title",
				@showGallery="showGallery"
				:item="update")
				
		.image-viewer
			.images.clearfix.d-none(ref="gallery", v-viewer="{rotatable: false, scalable: false, movable: true}")
				img(v-for="image in gallery", :src="image", :key="image")
</template>

<script>
	import TimelineStep 	from "@/components/dashboard/elements/projects/sections/timeline/TimelineStep.vue"

	export default {
		props: ["updates"],
		data() {
			return {
				gallery: [
                ]
			}
		},
		methods: {
			showGallery: function(pictures) {
				console.log( pictures )
				this.gallery = pictures
				const gallery = this.$refs.gallery.$viewer
				gallery.show()

			}
		},
		components: {
			TimelineStep
		}
	}
</script>

<style lang="sass">
	.updates-timeline
</style>