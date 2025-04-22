<template lang="pug">
	.login
		v-row
			v-col.pt-0.pb-0(cols="12", md="4", offset-md="4")
				v-row
					v-col.pt-0.pb-0(cols="12")
						.login-panel
							img.login-logo(src="/assets/images/logo.png")
							p.dashboard-title
								|Panel de administración
							p.simple-message
								|Ingresa tu correo electrónico.
							v-form(ref="preLoginForm", onSubmit="return false;")
								v-text-field(
									append-icon="mdi-email",
									name="email",
									v-model="login.username",
									label="Correo electrónico",
									background-color="transparent",
									color="primary",
									:rules="form.validations.email",
									outlined,
									v-on:keyup.enter="prepareLogin",
									dense,
									required)
								v-alert.text-center(color="warning", transition="scale-transition", v-show="preGetError")
									|{{ preGetError }}
								v-btn(
									color="primary",
									:loading="status.preparing",
									raised,
									block,
									x-large,
									@click="prepareLogin")
									|Continuar

							.action-buttons
								.forgot-password
									router-link(:to="{path: '/forgot'}")
										|¿Olvidaste tu contraseña?&nbsp;&nbsp;&nbsp;
								.blocked-account
									router-link(:to="{path: '/unlock'}")
										|¿Tu cuenta está bloqueada?
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
							|Estimado administrador, por favor verifique la siguiente información previo a ingresar su contraseña de acceso:
						.secret-image(v-if="pre.secretImage")
							img(:src="'/assets/images/secret/' + pre.secretImage")
						.obfuscated-name-container
							.title
								|Nombre:
							.obfuscated-name
								|{{ pre.name }}
						v-text-field(
							ref="password",
							append-icon="mdi-lock",
							v-model="login.password",
							label="Contraseña",
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
							|Iniciar sesión
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
					secretImage: ""
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
				        	v => !!v || 'El email es requerido',
				        	v => /.+@.+\..+/.test(v) || 'El email no es válido',
				      	],
				      	password: [
				        	v => !!v || 'La contraseña es requerida',
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
					/*	Obtiene imagen secreta e iniciales del usuario */
					this.$auth.get("preget-user/" + this.login.username)
					.then(result => {
						this.extendLogin = true

						this.pre = result.data.user
						setTimeout(() =>  {
							this.$refs.password.focus()
						}, 200)
					})
					.catch( err => {
						if( err.response ){
							if( err.response.status == 404 ){
								this.preGetError = `El usuario ${this.login.username} no se encuentra registrado.`
							}else{
								this.preGetError = "Error al iniciar sesión. Por favor vuelve a intentarlo."
								this.$sentry.captureException( err )
							}
						}else{
							this.preGetError = "Error al iniciar sesión. Por favor vuelve a intentarlo."
							this.$sentry.captureException( err )
						}
					})
					.finally( () => this.status.preparing = false)
				}
			},
			submitLogin: function(){
				if( this.$refs.loginForm.validate() ){
					this.status.loading = true
					this.error = ""
					this.message = ""

					let body = {
						"username": this.$sanitizer.sanitizeXSS(this.login.username),
						"password": this.$sanitizer.sanitizeXSS(this.login.password)
					}

					if( this.login.otp )
						body.otp = this.login.otp.replace(/\s/g, "")
					
					let resource = "login"

					this.$auth.post(resource, body)
					.then( response => {
						this.status.loading = false
						let user = response.data.user
						if( user.name ){
							this.$store.commit("setUser", user)
							this.$store.commit("setSessionActive", true)
						
							this.$swal({
								title: `Bienvenido ${user.name}.`,
								text: "En breve serás redireccionado a tu dashboard",
								type: "success",
								showConfirmButton: false,
								timer: 3000,
								onClose: () => {
									this.$router.push({path: "/dashboard/"})
								}
							})
						}else{
							/*	Algo ocurrió al iniciar sesión 	*/
							this.$swal("No se pudo iniciar sesión", "Por favor, espera un momento y vuelve a intentarlo", "warning")
						}
					})
					.catch( error => {
						this.status.loading = false
						if( error.response.status == 401 )
							this.error = "Usuario y contraseña incorrectos"
						else if( error.response.status == 409 )
							this.error = "Código de verificación inválido"
						else if( error.response.status == 402 )
							this.error = "La cuenta ha sido bloqueada tras 3 intentos de inicio de sesión fallidos"
						else if( error.response.status == 410 )
							this.error = "La cuenta se encuentra bloqueada"
						else if( error.response.status == 408 )
							this.error = "Ya hay una sesión activa en otro equipo. Si acabas de cerrarla, por favor espera 5 minutos y vuelve a intentarlo."
						else if( error.response.status == 406 ){
							this.message = "Por favor ingresa el código que aparece en Google Authenticator:"
							this.status.otp = true

							this.$nextTick(() => {
								this.$refs["otp-input"].focus()
							})
						}else
							this.error = "Error al procesar la solicitud."
					})
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
					color: #176580
					text-decoration: none
					transition: 0.1s linear all
					&:hover
						transition: 0.1s linear all
						color: #4f7fbf
						text-decoration: none
			.action-buttons
				text-align: center
				.forgot-password,.blocked-account
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