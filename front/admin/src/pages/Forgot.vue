<template lang="pug">
	.forgot
		v-row
			v-col.pt-0.pb-0(cols="12", md="4", offset-md="4")
				v-row
					v-col.pt-0.pb-0(cols="12")
						.forgot-panel
							
							img.login-logo(src="/assets/images/logo.png")
							p.welcome-message
								|Recuperación de cuenta
							v-form(ref="forgotForm", v-on:submit.prevent="")
								v-text-field(
									append-icon="mdi-email",
									v-model="forgot.username",
									label="Correo electrónico de tu cuenta",
									background-color="transparent",
									color="primary",
									:rules="form.validations.email",
									outlined,
									dense,
									required)
									
								v-alert(color="warning", transition="scale-transition", v-show="message")
									|{{ message }}

								v-btn(
									color="primary",
									:loading="status.loading",
									raised,
									block,
									x-large,
									@click="sendResetMail")
									|Confirmar
							
							p.forgot-message.text-center
								span
									|
								span
									router-link(:to="{path: '/login'}")
										|&lt; Regresar
							copyright

			contact
</template>

<script>
	import Copyright 	from "@/components/dashboard/elements/Copyright.vue"
	import Contact 		from "@/components/dashboard/elements/Contact.vue"
	
	export default {
		data() {
			return {
				forgot: {
					username: "",
				},
				status: {
					loading: false,
				},
				stage: "email",
				message: "",
				form: {
					validations: {
						email: [
				        	v => !!v || 'El email es requerido',
				        	v => /.+@.+\..+/.test(v) || 'El email debe ser válido',
				      	],
					}
				}
			}
		},
		methods: {
			sendResetMail: function(){
				if( this.validate() ){

					this.message = ""
					this.status.loading = true

					let body = {
						username: this.$sanitizer.sanitizeXSS( this.forgot.username )
					}

					this.$security.post("send-reset-email", body)
					.then(result => {
						this.forgot.username = ""
						return this.$swal("¡Listo!", "Te hemos enviado un correo electrónico para continuar con el proceso de recuperación de tu cuenta.", "success")
					})
					.then(() => {
						this.$router.push({ path: "/" })
					})
					.catch(err => {
						if( err.response.status == 401 )
							this.message = "La cuenta no existe o ya inició el proceso de recuperación"
						else{
							this.message = "Algo salió mal, por favor vuelve a intentarlo. Si el problema persiste comuníquese a soporte@investus.mx"
							this.$sentry.captureException( err )
						}
					})
					.finally(() => this.status.loading = false)
				}
			},
			back: function(){
				this.$router.go(-1)
			},
			validate: function(){
				return this.$refs.forgotForm.validate()
			}
		},
		components: {
			Copyright,
			Contact
		}
	}
</script>

<style lang="sass">
	.forgot
		background: url("/assets/images/login-wallpaper.jpg")
		background-repeat: no-repeat
		background-size: cover
		background-position: center
		height: 100vh

		&>.row
			height: 100%
			&>div
				//height: 100%
				&>.row
					height: 100%

		.forgot-panel
			background-color: rgba(255, 255, 255, 0.9)
			position: relative
			top: 50%
			transform: translateY(-50%)
			text-align: center
			padding: 35px
			.login-logo
				display: inline-block
				max-height: 150px
			.forgot-topbar
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
			.forgot-message
				text-align: left
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
				margin-top: 25px
				margin-bottom: 25px
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
	@media only screen and (max-width: 768px)
		.forgot
			height: auto
			min-height: 100vh
			&>.row
				min-height: 100vh
				&>div
					//height: 100%
					&>.row
						height: 100%
			.forgot-panel
				padding-left: 30px
				padding-right: 30px
				height: 100%
				.welcome-message
					text-align: center
				.simple-message
					text-align: center
				.create-account
					text-align: center
</style>