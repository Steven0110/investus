<template lang="pug">
	transition(name="fade-transition")
		.huge-field(v-if="value")
			.huge-field-text
				|{{ text }}
			.huge-field-value
				|{{ value }}
</template>

<script>
	export default {
		props: ["value", "text"]
	}
</script>

<style lang="sass">
	.huge-field
		padding-top: 10px
		.huge-field-value
			font-family: Roboto
			color: #666
			font-size: 1.5rem
		.huge-field-text
			color: #176580
			margin-top: 10px
			font-family: Roboto
			text-transform: uppercase
			font-weight: 600
			font-size: 1.2rem
			letter-spacing: 1px
			line-height: 1.5rem
</style>