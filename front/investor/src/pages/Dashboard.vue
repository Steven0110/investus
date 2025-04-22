<template lang="pug">
	.dashboard-menu
		investus-menu(ref="menu")
		.panel
			mobile-nav-bar(@toggle="toggleMenu")
			.sub-panel
				transition(name="slide-x-transition", mode="out-in")
					keep-alive
						router-view(name="panel")
</template>

<script>
	import InvestusMenu	from "@/components/dashboard/elements/InvestusMenu.vue"
	import MobileNavBar from "@/components/dashboard/elements/MobileNavBar.vue"

	export default {
		data() {
			return {
				status: {
					sessionWarning: true
				}
			}
		},
		mounted() {
		},
		methods: {
			checkSession: function() {
				// Mock implementation for demo purposes
				setTimeout(() => {
					// Create mock user data
					const user = {
						name: "Demo User",
						email: "demo@example.com",
						role: "investor",
						permissions: ["dashboard.access", "portfolio.view"],
						lastAction: new Date().toISOString(),
						verified: true,
						securityQuestions: 3,
						secretImage: "2556363yrhfj6869uojk088jhg.jpg"
					}

					this.$store.commit("setSessionActive", true)
					this.$store.commit("setUser", user)

					// Configure Sentry with user data
					this.$sentry.configureScope(scope => {
						scope.setUser({"user": user})
					})

					this.monitorSession()
				}, 1000)
			},
			monitorSession: function() {
				// Mock implementation for demo purposes
				// Instead of checking with the server, we'll just keep the session alive
				const sessionRefreshInterval = 60000 // 1 minute
				
				const keepSessionAlive = () => {
					if (this.$store.getters.isSessionActive) {
						const user = this.$store.getters.user;
						
						// Update the lastAction timestamp to keep the session fresh
						if (user) {
							user.lastAction = new Date().toISOString();
							this.$store.commit("setUser", user);
							
							console.log("Session refreshed at: " + user.lastAction);
						}
						
						// Schedule the next refresh
						setTimeout(keepSessionAlive, sessionRefreshInterval);
					}
				}
				
				// Start the refresh cycle
				setTimeout(keepSessionAlive, sessionRefreshInterval);
			},
			sessionAlert: function() {
				// In our mock implementation, we don't need to flash the title
				// as the session never expires, but we'll keep this function
				// for compatibility
				this.$wait(2000, () => {
					// No action needed in demo mode
					this.sessionAlert()
				})
			},
			resetTitle: function() {
				document.title = "Investor Dashboard | Investus"
			},
			toggleMenu: function() {
				this.$refs.menu.toggle()
			},
			logout: function() {
				// Mock implementation for demo purposes
				return new Promise((resolve) => {
					// Just resolve immediately
					setTimeout(() => {
						this.$store.commit("setSessionActive", false)
						this.$store.commit("setUser", null)
						resolve()
					}, 500)
				})
			}
		},
		created(){
			this.checkSession()
			this.sessionAlert()
		},
		components: {
			InvestusMenu,
			MobileNavBar
		}
	}
</script>

<style lang="sass">
	.dashboard-menu
		.logout
			.v-btn__content
				font-family: Raleway
				color: white
				font-weight: 700
		.panel
			position: fixed
			top: 0
			left: 256px
			right: 0
			bottom: 0
			overflow: auto
			
			&::-webkit-scrollbar-track
				-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
				background-color: rgba(255, 255, 255, 0.2)
			&::-webkit-scrollbar
				width: 10px
				background-color: rgba(255, 255, 255, 0.2)
			&::-webkit-scrollbar-thumb
				background-color: #176580

			.sub-panel
				min-height: 100%
				padding: 15px
				background-color: rgba(0, 0, 0, 0.1)
	@media only screen and (min-width: 1904px)
		.dashboard-menu
			.logout
				.v-btn__content
			.panel
				left: 256px
	@media only screen and (max-width: 1903px)
	@media only screen and (max-width: 1264px)
	@media only screen and (max-width: 960px)
		.dashboard-menu
			.logout
				.v-btn__content
			.panel
				left: 0
				top: 0

				.sub-panel
					overflow-x: hidden
	@media only screen and (max-width: 600px)
		.dashboard-menu
			.logout
				.v-btn__content
			.panel
				.sub-panel
					padding-top: 15px

</style>