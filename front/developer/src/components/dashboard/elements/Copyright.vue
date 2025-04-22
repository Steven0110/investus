<template lang="pug">
	.copyright
		p
			|Copyright Investus &copy; 2021
		p
			span
				router-link(:to="{path: '/'}")
					|Terḿinos de Uso 
			span
				|/ 
			span
				router-link(:to="{path: '/'}")
					|Política de Privacidad

</template>

<style lang="sass">
	.copyright
		position: absolute
		width: 100%
		bottom: 5px
		left: 0
		p
			text-align: center
			margin-bottom: 0px !important
			font-family: Roboto, sans-serif
			font-size: 8pt
			font-weight: 700
			span
				a
					color: black
					text-decoration: none
					transition: 0.2s linear all
					&:hover
						color: #3f9690
						text-decoration: none
						transition: 0.2s linear all
	@media only screen and (max-width: 960px)
		.copyright
			position: relative
			margin-top: 30px
			p
				font-size: 16px
	@media only screen and (max-width: 600px)
		.copyright
			p
				span
					&:first-child
						a
							color: #2963b4
					&:last-child
						a
							color: #2963b4
</style>