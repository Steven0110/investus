<template lang="pug">
	v-dialog(content-class="developer-summary", persistent, max-width="400", :value="show")
		v-card
			v-img(
				v-if="$store.getters.currentDeveloper.profilePicture",
				:src="$store.getters.currentDeveloper.profilePicture",
				max-height="300")
			v-card-title
				|{{ $store.getters.currentDeveloper.name || 'Cargando información ...' }}
			v-card-text
				project-card-loader(v-if="!$store.getters.currentDeveloper._id")
				.developer-summary-container(v-else)

					.summary-field
						|Email:
					.summary-value
						|{{ $store.getters.currentDeveloper.username }}

					.summary-field
						|Last session:

					.summary-value
						|{{ $store.getters.currentDeveloper.lastSession | moment('MMMM D, h:mm:ss a') }}

					.summary-field
						|Search in blacklists:

					blacklist(:result="$store.getters.currentDeveloper.searchResults")
						
			v-card-actions
				v-spacer
				v-btn(text, color="secondary", @click="$emit('close')")
					|Close
</template>

<script>
	import ProjectCardLoader from "@/components/tools/loader/ProjectCardLoader.vue"
	import Blacklist from "@/components/dashboard/elements/users/Blacklist.vue"

	export default {
		props: ["show"],
		methods: {
		},
		mounted() {
			const mockDeveloper = {
						_id: this.$store.getters.currentProject.developer._id,
						name: this.$store.getters.currentProject.developer.name || "ABC Development Corp",
						username: this.$store.getters.currentProject.developer.email || "info@abcdev.com",
						profilePicture: null,
						lastSession: new Date(),
						searchResults: {
							status: "completed",
							pep: false,
							ofac: false,
							onu: false,
							score: 10,
							scorePercentage: 5
						},
						phone: "+1 (555) 123-4567",
						address: "123 Business St, New York, NY",
						website: "www.abcdev.com",
						yearFounded: 2010,
						projectsCompleted: 15,
						totalInvestment: 45000000
					};
			this.$store.commit("setCurrentDeveloper", mockDeveloper)
		},
		activated() {
			console.log("activated ds")
		},
		components: {
			Blacklist,
			ProjectCardLoader,
		}
	}
</script>

<style lang="sass">
	.developer-summary
			
		&::-webkit-scrollbar-track
			-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
			background-color: rgba(255, 255, 255, 0.2)
		&::-webkit-scrollbar
			width: 10px
			background-color: rgba(255, 255, 255, 0.2)
		&::-webkit-scrollbar-thumb
			background-color: #176580
			
		.summary-field
			color: #176580
			margin-top: 10px
			font-family: Raleway
			text-transform: uppercase
			font-weight: 600
			font-size: 0.7rem
			letter-spacing: 1px
		.summary-value
			font-family: Raleway
			color: #666
			font-size: 1rem
</style>