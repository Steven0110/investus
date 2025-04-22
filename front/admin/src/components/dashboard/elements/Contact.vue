<template lang="pug">
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

<style lang="sass">
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
</style>