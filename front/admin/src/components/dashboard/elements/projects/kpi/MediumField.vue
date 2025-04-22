<template lang="pug">
	transition(name="fade-transition")
		.medium-field(v-if="value")
			.medium-field-text
				|{{ text }}
			.medium-field-value
				|{{ value }}
</template>

<script>
	export default {
		props: ["value", "text"]
	}
</script>

<style lang="sass">
	.medium-field
		padding-top: 10px
		.medium-field-value
			font-family: Roboto
			color: #666
			font-size: 1.2rem
		.medium-field-text
			color: #176580
			margin-top: 10px
			font-family: Roboto
			text-transform: uppercase
			font-weight: 600
			font-size: 0.9rem
			letter-spacing: 1px
			line-height: 1.2rem
</style>