<template lang="pug">
	.unlock
		v-row
			v-col.pt-0.pb-0(cols="12", md="4", offset-md="4")
				v-row
					v-col.pt-0.pb-0(cols="12")
						.unlock-panel
							
							img.login-logo(src="/assets/images/logo.png")
							p.welcome-message
								|Desbloqueo de cuenta

							p.instructions
								|Por favor ingresa el correo electrónico de cuenta

							v-form(ref="unlockForm", v-on:submit.prevent="")
								v-text-field(
									append-icon="mdi-email",
									v-model="input.username",
									label="Correo electrónico",
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
									@click="sendUnlockEmail")
									|Confirmar

							p.unlock-message.text-center
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
				input: {
					username: "",
				},
				message: "",
				status: {
					loading: false,
				},
				form: {
					validations: {
						email: [
				        	v => !!v || 'El email es requerido',
				        	v => /.+@.+\..+/.test(v) || 'El email no es válido',
				      	],
					}
				}
			}
		},
		methods: {
			sendUnlockEmail: function() {

				this.status.loading = true
				
				let body = {
					username: this.input.username
				}

				this.$security.post("send-unlock-email", body)
				.then(result => {
					return this.$swal("¡Listo!", "Te hemos enviado un enlace a tu correo electrónico al que deberás ingresar para poder desbloquear tu cuenta.", "success")
				})
				.then(() => {
					this.$router.push({ path: "/" })
				})
				.catch(error => {
					if( error.response.status == 406 )
						this.message = "No existe alguna cuenta con el correo solicitado o ya se envió el correo electrónico para realizar el desbloqueo."
					else{
						console.error( error )
						this.$sentry.captureException( err )
					}
				})
				.finally(() => this.status.loading = false)
			},
			back: function(){
				this.$router.go(-1)
			},
		},
		components: {
			Copyright,
			Contact
		}
	}
</script>

<style lang="sass">
	.unlock
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

		.unlock-panel
			background-color: rgba(255, 255, 255, 0.9)
			position: relative
			top: 50%
			transform: translateY(-50%)
			text-align: center
			padding: 35px
			.login-logo
				display: inline-block
				max-height: 150px
			.unlock-topbar
				.v-icon
					margin-left: -3px
			.welcome-message
				font-size: 18pt
				font-family: Roboto, sans-serif
				font-weight: 800
				margin-bottom: 5px
			.instructions
				color: #555555
				font-family: Roboto, sans-serif
				margin-bottom: 10px
				font-size: 18px
				font-weight: 500

			.simple-message
				font-size: 12pt
				font-family: Roboto, sans-serif
				font-weight: 600
				color: #555555
			.unlock-message
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
			.unlock-password
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
		.unlock
			height: auto
			min-height: 100vh
			&>.row
				min-height: 100vh
				&>div
					//height: 100%
					&>.row
						height: 100%
			.unlock-panel
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