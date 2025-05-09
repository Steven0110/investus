<template lang="pug">
	.register
		v-row
			v-col.pt-0.pb-0(cols="12", md="4", offset-md="4")
				v-row
					v-col.pt-0.pb-0(cols="12")
						.register-panel
							img.login-logo(src="/assets/images/logo.png")
							p.welcome-message
								|Create your developer account
							p.login-message
								span
									|Already have an account?
								span
									router-link(:to="{path: '/login'}")
										|Log in
							v-form(ref="registerForm", v-on:submit.prevent="")
								v-radio-group(v-model="register.type", row)
									v-spacer
									v-radio(label="Individual", value="fisica")
									v-radio(label="Business", value="moral")
									v-spacer
								v-text-field(
									append-icon="mdi-account",
									v-model="register.name",
									label="Full name",
									color="#176580",
									background-color="transparent",
									:rules="form.validations.name",
									outlined,
									dense,
									required)
								v-text-field(
									append-icon="mdi-email",
									v-model="register.username",
									label="Email",
									color="#176580",
									background-color="transparent",
									:rules="form.validations.email",
									outlined,
									dense,
									required)

								v-tooltip(top, v-model="passwordFocus")
									template(v-slot:activator="{ on, attrs }")
										.tooltip-anchor(dark, v-on="on")
									.password-tooltip-validator
										.lowercase-validation
											v-icon(color="green", left, v-if="passwordChecker.lowercase")
												|mdi-check-circle
											v-icon(color="red", left, v-else)
												|mdi-close-circle
											span
												|Contains at least one #[strong lowercase letter]
										.uppercase-validation
											v-icon(color="green", left, v-if="passwordChecker.uppercase")
												|mdi-check-circle
											v-icon(color="red", left, v-else)
												|mdi-close-circle
											span
												|Contains at least one #[strong uppercase letter]
										.number-validation
											v-icon(color="green", left, v-if="passwordChecker.number")
												|mdi-check-circle
											v-icon(color="red", left, v-else)
												|mdi-close-circle
											span
												|Contains at least one #[strong number]
										.special-validation
											v-icon(color="green", left, v-if="passwordChecker.special")
												|mdi-check-circle
											v-icon(color="red", left, v-else)
												|mdi-close-circle
											span
												|Contains at least one #[strong special character] (!@#$%^&amp;?_+-=)
										.length-validation
											v-icon(color="green", left, v-if="passwordChecker.length")
												|mdi-check-circle
											v-icon(color="red", left, v-else)
												|mdi-close-circle
											span
												|Has at least #[strong 8 characters in length]
								v-text-field(
									append-icon="mdi-lock",
									v-model="register.password",
									label="Password",
									:rules="form.validations.password",
									outlined,
									dense,
									background-color="transparent",
									color="#176580",
									@input="validate",
									@focus="passwordFocus = true",
									@blur="passwordFocus = false",
									type="password",
									required)
								v-text-field(
									append-icon="mdi-lock",
									v-model="register.rpassword",
									label="Repeat password",
									:rules="form.validations.password",
									color="#176580",
									outlined,
									dense,
									background-color="transparent",
									@input="validate",
									type="password",
									required)

								p.accept-terms
									span
										|By clicking on <strong>Register</strong> you accept our
									span
										router-link(:to="{path: '/register'}")
											|Terms of Use 
									span
										|and 
									span
										router-link(:to="{path: '/register'}")
											|Privacy Policy

								v-alert(color="warning", transition="scale-transition", v-show="error")
									|{{ error }}

								v-btn(
									color="#176580",
									:loading="loading",
									raised,
									block,
									x-large,
									@click="submitRegister")
									|Register

							.copyright
								p
									|Copyright Investus &copy; 2020
								p
									span
										router-link(:to="{path: '/'}")
											|Terms of Use 
									span
										|/ 
									span
										router-link(:to="{path: '/'}")
											|Privacy Policy

			.contact.d-none.d-md-block
				.social-networks
					.social-icon
						a(href="#")
							v-img(src="assets/icons/ic_facebook.svg")
					.social-icon
						a(href="#")
							v-img(src="assets/icons/ic_twitter.svg")
					.social-icon
						a(href="#")
							v-img(src="assets/icons/ic_instagram.svg")
				.contact-info
					.contact-item
						.contact-icon
							v-img(src="assets/icons/ic_communicate.svg")
						span
							|+55 1234 5678
					.contact-item
						.contact-icon
							v-img(src="assets/icons/ic_communicate.svg")
						span
							|contacto@investus.mx

</template>

<script>
	export default {
		data() {
			return {
				register: {
					name: "",
					username: "",
					password: "",
					rpassword: "",
					type: "fisica"
				},
				passwordFocus: false,
				loading: false,
				error: "",
				form: {
					validations: {
						email: [
				        	v => !!v || 'Email is required',
				        	v => /.+@.+\..+/.test(v) || 'Email is invalid',
				      	],
				      	password: [
				        	v => !!v || 'Password is required',
				        	v => this.register.password === this.register.rpassword || 'Passwords do not match',
				        	v => /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[A-Za-z\d*.!@#$%^&\(\)\{\}\[\]\:\;\,\.\?\/\~\_\+\-\=\|\\])[A-Za-z\d*.!@#$%^&\(\)\{\}\[\]\:\;\,\.\?\/\~\_\+\-\=\|\\]{8,}/g.test(this.register.password) || "Password format is incorrect"
				      	],
				      	name: [
				        	v => !!v || 'Your name is required',
				      	]
					}
				}
			}
		},
		computed: {
			passwordChecker: function() {
				let check = {
					length: false,
					lowercase: false,
					uppercase: false,
					number: false,
					special: false,
				}

				if( this.register.password.match(/[A-Z]/g) )
					check.uppercase = true
				if( this.register.password.match(/[a-z]/g) )
					check.lowercase = true
				if( this.register.password.match(/[0-9]/g) )
					check.number = true
				if( this.register.password.match(/[*\.!@#$%^&\(\)\{\}\[\]\:\;\,\.\?\/\~\_\+\-\=\|\\]/g) )
					check.special = true
				if( this.register.password.length >= 8 )
					check.length = true

				return check
			}
		},
		methods: {
			submitRegister: function(){
				
				this.error = ""

				if( this.validate() ){
					this.loading = true
					this.error = ""

					let body = {
						"username": this.$sanitizer.sanitizeXSS(this.register.username),
						"password": this.$sanitizer.sanitizeXSS(this.register.password),
						"type": this.$sanitizer.sanitizeXSS(this.register.type),
						"name": this.$sanitizer.normalFormatText(this.$sanitizer.sanitizeXSS(this.register.name))
					}
					
					let url = "register"
					this.$auth.post(url, body)
					.then( response => {
						this.$swal({
							title: "Done!",
							text: "Your account has been created successfully. We have sent you an email to verify your account.",
							type: "success",
							confirmButtonText: "Ok"
						})
						.then(result => {
							if(result.value) {
								this.$router.push({path: "/login"})
							}
						})
					})
					.catch( error => {
						if( error ){ //Not intercepted
							if( error.response.status == 406 ){
								this.error = "An account with this email already exists."
							}else
								this.$swal("Unknown error", JSON.stringify( error ), "warning")
						}
					})
					.finally( () => {
						this.loading = false
					})
				}
			},
			back: function(){
				this.$router.go(-1)
			},
			validate: function(){
				return this.$refs.registerForm.validate()
			}
		}
	}
</script>

<style lang="sass">
	.register
		background: url("/assets/images/login-wallpaper.jpg")
		background-repeat: no-repeat
		background-size: cover
		background-position: center
		height: 100vh
		overflow-x: hidden

		&>.row
			height: 100%
			&>div
				//height: 100%
				&>.row
					height: 100%

		.register-panel
			background-color: rgba(255, 255, 255, 0.9)
			position: relative
			top: 50%
			transform: translateY(-50%)
			text-align: center
			padding: 35px
			
			.login-logo
				display: inline-block
				max-height: 150px
			.register-topbar
				.v-icon
					margin-left: -3px
			.welcome-message
				font-size: 18pt
				font-family: Roboto, sans-serif
				font-weight: 800
				margin-bottom: 5px
			.simple-message
				font-size: 12pt
				font-family: Roboto, sans-serif
				font-weight: 600
				color: #555555
			.login-message
				text-align: center
				color: #aaa
				font-family: Roboto, sans-serif
				font-weight: 700
				a
					padding-left: 5px
					font-size: 12pt
					font-family: Roboto, sans-serif
					font-weight: 800
					color: #113f67
					text-decoration: none
					transition: 0.2s linear all
					&:hover
						color: #33537d
						text-decoration: none
						transition: 0.2s linear all
			.accept-terms
				text-align: center
				color: #aaa
				font-family: Roboto, sans-serif
				font-weight: 700
				margin-top: 0px
				margin-bottom: 5px
				a
					padding-left: 5px
					font-size: 12pt
					font-family: Roboto, sans-serif
					font-weight: 800
					color: #176580
					text-decoration: none
					transition: 0.2s linear all
					&:hover
						color: #33537d
						text-decoration: none
						transition: 0.2s linear all
			.forgot-password
				text-align: center
				margin-bottom: 25px
				a
					color: #176580
					font-size: 12pt
					font-family: Roboto, sans-serif
					font-weight: 800
					text-decoration: none
					&:hover
						color: #2963b4
						text-decoration: none
			.copyright
				position: absolute
				width: 100%
				bottom: 5px
				left: 0
				p
					text-align: center
					margin-bottom: 0px
					font-family: Roboto, sans-serif
					font-size: 8pt
					font-weight: 700
					span
						a
							color: black
							text-decoration: none
							transition: 0.2s linear all
							&:hover
								color: #2963b4
								text-decoration: none
								transition: 0.2s linear all
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
				.v-input--radio-group
					margin-top: 0px
					.v-input__slot
						margin-bottom: 0
					.v-radio
						.v-input--selection-controls__ripple
							z-index: 10
				.v-btn
					font-size: 12pt
					font-family: Roboto, sans-serif
					font-weight: 700
					color: white
					border-radius: 15px
					margin-bottom: 25px

		.contact
			text-align: right
			padding-right: 40px
			position: absolute
			right: 0
			bottom: 15px
			.social-networks
				text-align: right
				.social-icon
					display: inline-block
					height: 15px
					width: 15px
					margin-left: 15px
					transition: 0.2s linear all
					&:hover
						border-bottom: 1px solid white
						transition: 0.2s linear all
			.contact-info
				margin-top: 5px
				.contact-item
					display: inline-block
					margin-left: 15px
					.contact-icon
						height: 14px
						width: 14px
						display: inline-block
						margin-right: 5px
					span
						display: inline-block
						color: white
						font-family: Roboto, sans-serif
						font-size: 10pt
						font-weight: 600
	@media only screen and (max-width: 768px)
		.register
			height: auto
			min-height: 100vh
			&>.row
				min-height: 100vh
				&>div
					//height: 100%
					&>.row
						height: 100%
			.register-panel
				padding-left: 30px
				padding-right: 30px
				height: 100%
				.welcome-message
					text-align: center
				.simple-message
					text-align: center
				.create-account
					text-align: center
				.copyright
					position: relative
					margin-top: 30px
					p
						font-size: 16px
</style>