<template lang="pug">
	.login
		v-row
			v-col.pt-0.pb-0(cols="12", md="4", offset-md="4")
				v-row
					v-col.pt-0.pb-0(cols="12")
						.login-panel
							img.login-logo(src="/assets/images/logo.png")
							p.dashboard-title
								|Investor Panel
							p.simple-message
								|Enter your email address.
							v-form(ref="preLoginForm", onSubmit="return false;")
								v-text-field(
									append-icon="mdi-email",
									name="email",
									v-model="login.username",
									label="Email address",
									background-color="transparent",
									color="primary",
									:rules="form.validations.email",
									outlined,
									v-on:keyup.enter="prepareLogin",
									dense,
									required)
								v-alert.text-center.mb-4(color="primary", outlined)
									|This is a demonstration portfolio site. All functionality is simulated and limited, no backend services are connected. Enter any email and password to access
								v-alert.text-center(color="warning", transition="scale-transition", v-show="preGetError")
									|{{ preGetError }}
								v-btn(
									color="primary",
									:loading="status.preparing",
									raised,
									block,
									x-large,
									@click="prepareLogin")
									|Continue

							.action-buttons
								.forgot-password
									router-link(:to="{path: '/forgot'}")
										|Forgot your password?&nbsp;&nbsp;&nbsp;
								.blocked-account
									router-link(:to="{path: '/unlock'}")
										|Is your account locked?
								.register-account
									router-link(:to="{path: '/register'}")
										|Don't have an account? Create one.
							copyright

			contact

		v-dialog(v-model="extendLogin", max-width="700", persistent, content-class="overflow-unset")
			v-card.login-card
				v-card-title
				v-card-text

					v-btn(color="primary", fab, absolute, top, right, @click="extendLogin = false")
						v-icon(color="white")
							|mdi-close

					v-form(ref="loginForm", onSubmit="return false;")
						.instructions
							|Dear investor, please verify the following information before entering your password:
						.secret-image(v-if="pre.secretImage")
							img(:src="'assets/images/secret/' + pre.secretImage")
						.obfuscated-name-container
							.title
								|Name:
							.obfuscated-name
								|{{ pre.name }}
						v-text-field(
							ref="password",
							append-icon="mdi-lock",
							v-model="login.password",
							label="Password",
							:rules="form.validations.password",
							outlined,
							dense,
							background-color="transparent",
							color="primary",
							v-on:keyup.enter="submitLogin"
							type="password",
							required)
						transition(name="slide-x-transition")
							input.otp-input(
								ref="otp-input",
								v-model="login.otp",
								v-if="status.otp",
								v-mask="'# # # # # #'",
								placeholder="1 2 3 4 5 6",
								v-on:keyup.enter="submitLogin")
						v-alert.text-center(color="warning", transition="scale-transition", v-show="error")
							|{{ error }}
						v-alert.text-center(color="success", dark, transition="scale-transition", v-show="message")
							|{{ message }}
						v-btn(
							color="primary",
							:loading="status.loading",
							raised,
							block,
							dark,
							x-large,
							@click="submitLogin")
							|Sign in
				v-card-actions
</template>

<script>
	import Copyright 	from "@/components/dashboard/elements/Copyright.vue"
	import Contact 		from "@/components/dashboard/elements/Contact.vue"

	export default {
		data() {
			return {
				pre: {
					name: "G**** C***** A*****",
					secretImage: "2556363yrhfj6869uojk088jhg.jpg"
				},
				login: {
					username: "",
					password: "",
					otp: ""
				},
				error: "",
				message: "",
				preGetError: "",
				extendLogin: false,
				status: {
					otp: false,
					loading: false,
					preparing: false,
				},
				form: {
					validations: {
						email: [
				        	v => !!v || 'Email is required',
				        	v => /.+@.+\..+/.test(v) || 'Email is not valid',
				      	],
				      	password: [
				        	v => !!v || 'Password is required',
				      	]
					}
				}
			}
		},
		methods: {
			obfuscateEmail: function( value ){
				let parts = value.split("@")
				let obfuscated = parts[0].charAt(0) + parts[0].charAt(1) + parts[0].charAt(2) + "...@" + parts[1]
				return obfuscated
			},
			prepareLogin: function(){
				this.preGetError = ""
				if( this.$refs.preLoginForm.validate() ){

					this.status.preparing = true
					
					// Mock implementation for demo purposes
					setTimeout(() => {
						this.extendLogin = true
						
						// Set mock user data
						this.pre = {
							name: "Demo User",
							secretImage: "2556363yrhfj6869uojk088jhg.jpg"
						}
						
						setTimeout(() =>  {
							this.$refs.password.focus()
						}, 200)
						
						this.status.preparing = false
					}, 800)
				}
			},
			submitLogin: function(){
				if( this.$refs.loginForm.validate() ){
					this.status.loading = true
					this.error = ""
					this.message = ""

					// Mock implementation for demo purposes
					setTimeout(() => {
						this.status.loading = false
						
						// Create mock user data
						const user = {
							name: "Demo User",
							email: this.login.username,
							role: "investor",
							permissions: ["dashboard.access", "portfolio.view"]
						}
						
						// Set user in store
						this.$store.commit("setUser", user)
						this.$store.commit("setSessionActive", true)
						
						this.$swal({
							title: `Welcome ${user.name}`,
							text: "You will be redirected to your dashboard",
							type: "success",
							showConfirmButton: false,
							timer: 3000,
							onClose: () => {
								this.$router.push({path: "/dashboard/"})
							}
						})
					}, 1500)
				}
			}
		},
		components: {
			Copyright,
			Contact
		}
	}
</script>

<style lang="sass">
	.login
		background: url("/assets/images/login-wallpaper.jpg")
		background-repeat: no-repeat
		background-size: cover
		background-position: center
		height: 100vh
		overflow-x: hidden

		&>.row
			height: 100%
			&>div
				&>.row
					height: 100%
		.login-panel
			background-color: rgba(255, 255, 255, 0.9)
			position: relative
			top: 50%
			transform: translateY(-50%)
			text-align: center
			padding: 35px
			padding-left: 20px
			padding-right: 20px
			padding-top: 15px
			.login-logo
				display: inline-block
				max-height: 100px
			.dashboard-title
				text-align: center
				letter-spacing: 3px
				text-transform: uppercase
				font-size: 24px
				font-weight: 700
				font-family: Roboto
				margin-bottom: 2px
			.simple-message
				font-size: 12pt
				font-family: Roboto
				font-weight: 600
				color: #555555

			.create-account
				text-align: center
				color: #aaa
				font-family: Roboto, sans-serif
				font-weight: 700
				a
					padding-left: 5px
					font-size: 12pt
					font-family: Roboto, sans-serif
					font-weight: 800
					text-decoration: none
					transition: 0.1s linear all
					&:hover
						transition: 0.1s linear all
						color: #4f7fbf
						text-decoration: none
			.action-buttons
				text-align: center
				.forgot-password,.blocked-account,.register-account
					display: inline-block
					text-align: center
					margin-bottom: 12px
					a
						font-size: 12pt
						font-family: Roboto, sans-serif
						font-weight: 800
						text-decoration: none
						transition: 0.1s linear all
						&:hover
							transition: 0.1s linear all
							color: #2963b4
							text-decoration: none
			.v-form
				.v-text-field
					label
						font-size: 12pt
						color: #999999
						font-family: Roboto, sans-serif
				.v-input--switch
					label
						font-size: 12pt
						font-family: Roboto, sans-serif
						font-weight: 700
				.v-btn
					font-size: 12pt
					font-family: Roboto, sans-serif
					font-weight: 700
					color: white
					border-radius: 15px
					margin-bottom: 25px
	.login-card
		text-align: center
		.instructions
			margin-top: 15px
			margin-bottom: 25px
			font-size: 1.2em
			text-align: center
		.secret-image
			padding-left: 25%
			padding-right: 25%
			img
				display: inline-block
				max-width: 100%
		.obfuscated-name-container
			margin-bottom: 10px
			.title
				text-align: center
			.obfuscated-name
				margin-top: 7px
				margin-bottom: 15px
				font-size: 3em
				text-align: center
				font-family: Roboto
				font-weight: 700
				letter-spacing: 1px
		.otp-input
			display: inline-block
			font-family: Roboto
			font-size: 30px
			border: 1px solid rgba(0, 0, 0, 0.5)
			border-radius: 5px
			padding: 10px
			margin-bottom: 10px
			width: 50%
			text-align: center


	@media only screen and (min-width: 1904px)
	@media only screen and (max-width: 1903px)
	@media only screen and (max-width: 1264px)
	@media only screen and (max-width: 960px)
		.login
			height: 100%

			&>.row
				//min-height: 100vh
				&>div
					//height: 100%
					&>.row
						//height: 100%
			.login-panel
				padding-left: 30px
				padding-right: 30px
				min-height: 100%
				.welcome-message
					text-align: center
				.simple-message
					text-align: center
				.create-account
					text-align: center

				.otp-input
					font-family: Roboto
					font-size: 30px
					border: 1px solid rgba(0, 0, 0, 0.5)
					border-radius: 5px
					padding: 10px
					margin-bottom: 5px
					width: 100%
					text-align: center
	@media only screen and (max-width: 600px)
		.login
			.login-panel
				.v-form
					.v-btn
						margin-bottom: 10px
				.v-input--switch
					margin-bottom: 0
				.action-buttons
					.forgot-password
						text-align: center
						margin-bottom: 5px
						margin-top: 15px
		.login-card
			.secret-image
				padding-left: 15px
				padding-right: 15px
				img
					display: inline-block
					max-width: 100%
			.obfuscated-name-container
				.obfuscated-name
					line-height: 2.5rem
					font-size: 2rem

</style>