<template lang="pug">
	v-card.checker(
		color="grey lighten-4",
		min-height="250px")
		v-toolbar(
			:src="image",
			height="100",
			dark)
			v-tooltip(bottom)
				template(v-slot:activator="{ on, attrs }")
					v-btn.rate-button(
						fab,
						small,
						color="green darken-2",
						absolute,
						bottom,
						right,
						@click="show.rate = true",
						v-show="doc.rate == undefined"
						v-on="on")
						v-icon
							|mdi-star
				span
					|Ponderar
			v-tooltip(bottom)
				template(v-slot:activator="{ on, attrs }")
					v-btn.review-button(fab,
						small,
						color="blue darken-2",
						absolute,
						bottom,
						right,
						v-on="on",
						@click="download",
						:loading="status.loading")
						v-icon
							|mdi-download
				span
					|Descargar
		v-card-title.pr-12.pl-0
			|{{ doc.type }}
		
		v-btn.score-button(fab, large, v-if="doc.rate != undefined", @click="show.edit = true")
			|{{ doc.rate }}

		rate(
			:show="true",
			:doc="doc",
			:_id="_id",
			:developer="developer",
			@rated="rated",
			@close="show.rate = false")

		edit-rate(
			:show="true",
			:doc="doc",
			:_id="_id",
			:developer="developer",
			@edited="edited",
			@close="show.edit = false")
</template>

<script>
	import Rate 	from "@/components/dashboard/elements/projects/dialogs/Rate.vue"
	import EditRate from "@/components/dashboard/elements/projects/dialogs/EditRate.vue"

	export default {
		props: ["doc", "developer", "_id"],
		data(){
			return {
				status: {
					loading: false,
				},
				show: {
					rate: false,
					edit: false
				}
			}
		},
		methods: {
			download: function() {
				this.status.loading = true
				let resource = `download?key=${this.doc.key}&username=${this.developer.username}`
				let config = {responseType: 'arraybuffer'}

				this.$fileserver.get(resource, config)
				.then(result => {
					const extension = this.getExtension()
					const url = window.URL.createObjectURL(new Blob([ result.data ]))
		            const link = document.createElement('a')

		            link.href = url
		            link.setAttribute('download',`${this.developer.name}_${this.doc.type}.${extension}`)
		            document.body.appendChild(link)

		            link.click()
				})
				.catch(err => this.$report( err, {swal: true}) )
				.finally(() => this.status.loading = false)
			},
			getExtension: function() {
				let key = this.doc.key
				let params = key.split(".")
				return params[ params.length - 1 ]
			},
			rated: function( rate ) {
				this.show.rate = false
				this.$emit("rated", {doc: this.doc, rate: rate} )
				this.$swal("¡Listo!", "El documento ha sido ponderado exitosamente", "success")
			},
			edited: function( rate ) {
				this.show.edit = false
				this.$emit("edited", {doc: this.doc, rate: rate} )
				this.$swal("¡Listo!", "La calificación del documento ha sido modificada exitosamente", "success")
			},
		},
		computed: {
			image: function() {
				switch(this.doc.stage){
					case "viabilidad":
						return "/assets/images/legal.jpg"
					case "evaluacion":
						return "/assets/images/rating.jpg"
					default:
						return "/assets/images/legal.jpg"
				}
			}
		},
		components: {
			Rate,
			EditRate
		}
	}
</script>

<style lang="sass">
	.checker
		padding: 15px
		border: 1px solid black
		border-radius: 12px
		.v-toolbar
			.v-toolbar__image
				.v-image
					.v-image__image.v-image__image--cover
						filter: brightness(0.75) !important
			.rate-button
				right: 35px
			.review-button
				right: 5px
		.v-btn.score-button
			position: absolute
			right: 15px
			bottom: 15px
			span
				font-size: 2rem

	@media only screen and (min-width: 1904px)
		.checker
	@media only screen and (max-width: 1903px)
	@media only screen and (max-width: 1264px)
	@media only screen and (max-width: 960px)
	@media only screen and (max-width: 600px)
</style>