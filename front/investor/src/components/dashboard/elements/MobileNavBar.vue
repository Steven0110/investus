<template lang="pug">
	.mobile-nav-bar.d-md-none.d-block
		v-toolbar(color="#0e4052", dark)
			v-app-bar-nav-icon(@click="$emit('toggle')")
			v-toolbar-title
				|{{ pageTitle }}
			v-spacer
			.settings-container
				v-menu(offset-y, content-class="settings-menu")
					template(v-slot:activator="{ on }")
						v-btn.submenu-button(icon)
							v-avatar(v-on="on")
								img(src="/assets/icons/avatar.svg")
							v-icon(v-on="on")
								|mdi-menu-down
					v-list
						v-list-item(@click="$router.push({path: '/dashboard/perfil'})")
							v-icon
								|mdi-settings
							v-list-item-title
								|Profile
						v-list-item(@click="$router.push({path: '/dashboard/autenticacion'})")
							v-icon
								|mdi-account
							v-list-item-title
								|Authentication
						v-list-item(@click="logout")
							v-icon
								|mdi-exit-to-app
							v-list-item-title
								|Sign out
</template>

<script>
	export default {
		methods: {
			logout: function() {
				
				this.$swal({
					title: "Are you sure you want to sign out?",
					type: "warning",
					confirmButtonText: "Yes, sign out.",
					cancelButtonText: "No, go back.",
					showLoaderOnConfirm: true,
					showCancelButton: true,
					reverseButtons: true,
					preConfirm: () => {
						let resource = "logout"
						return this.$auth.get( resource )
					}
				})
				.then(result => {
					if(!result.dismiss){
						this.$store.commit("setSessionActive", false)
						this.$swal({
							title: `Session successfully closed.`,
							text: "",
							type: "success",
							showConfirmButton: false,
							timer: 3000,
							onClose: () => {
								this.$router.push({path: "/"})
							}
						})
					}
				})
				.catch(err => {
					console.log( err )
				})
			}
		},
		computed: {
			pageTitle: function() {
				return this.$route.name
			}
		}
	}
</script>

<style lang="sass">
	.mobile-nav-bar
		.v-toolbar
			.settings-container
				.submenu-button
					button.v-icon
						position: absolute
						right: -20px
	.settings-menu
		.v-list-item__title
			padding-left: 10px
</style>// Test comment
