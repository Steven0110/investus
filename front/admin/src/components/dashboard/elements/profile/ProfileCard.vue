<template lang="pug">
	.profile-card-container
		v-card.profile-card
			v-card-text
				//Nombre
				.profile-name
					|Name
				.profile-value
					|{{ $store.getters.user.name }}

				//Email
				.profile-name
					|Email
				.profile-value
					|{{ $store.getters.user.username }}

				//Email
				.profile-name
					|Role
				.profile-value
					|{{ $store.getters.user.role }}
</template>

<script>

	export default {
		data() {
			return {
				state: {
					infoDialog: false,
				},
				status: {
					loading: false,
				},
				info: {
					name: "",
					type: "fisica",
					rfc: ""
				}
			}
		},
	}
</script>

<style lang="sass">
	.profile-card-container
		.profile-card
			.profile-name
				color: #176580
				margin-top: 10px
				font-family: Raleway
				text-transform: uppercase
				font-weight: 600
				font-size: 0.7rem
				letter-spacing: 1px
			.profile-value
				font-family: Raleway
				color: #666
				font-size: 1rem
		.v-snack__content
			&>div
				width: 100%
	.update-info-dialog
		.type-subtitle
			text-align: center
			color: #176580
			font-weight: 600
	@media only screen and (min-width: 1904px)
		.profile-card
	@media only screen and (max-width: 1903px)
		.profile-card
	@media only screen and (max-width: 1264px)
		.profile-card
	@media only screen and (max-width: 960px)
		.profile-card
</style>