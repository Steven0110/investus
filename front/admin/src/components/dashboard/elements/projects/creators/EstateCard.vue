<template lang="pug">
	v-card.estate-card(min-height="250")
		v-img(height="175", src="/assets/images/estate2.png")
		v-card-title
			|{{ estate.name }}
		v-card-text
			.text-center
				small
					|Valor:
			.text-center
				v-chip(color="green darken-2", dark)
					|{{ estate.value | currency }}
			.documents-title
				strong
					|Documentos:
			.documents-section
				v-btn.mb-2(block, color="primary", :disabled="!hasDocument('escritura_propiedad')", @click="download('escritura_propiedad')", :loading="status.downloading.escritura_propiedad")
					|Propiedad
					v-icon(right)
						|mdi-download
				v-btn.mb-2(block, color="primary", :disabled="!hasDocument('escritura_propiedad_colateral')", @click="download('escritura_propiedad_colateral')", :loading="status.downloading.escritura_propiedad_colateral")
					|Propiedad (colateral)
					v-icon(right)
						|mdi-download
				v-btn.mb-2(block, color="primary", :disabled="!hasDocument('posesion_material')", @click="download('posesion_material')", :loading="status.downloading.posesion_material")
					|Posesión material
					v-icon(right)
						|mdi-download
				v-btn.mb-2(block, color="primary", :disabled="!hasDocument('certificado_libertad_gravamen')", @click="download('certificado_libertad_gravamen')", :loading="status.downloading.certificado_libertad_gravamen")
					|Libertad de gravamen
					v-icon(right)
						|mdi-download
				v-btn.mb-2(block, color="primary", :disabled="!hasDocument('extincion_expropiacion')", @click="download('extincion_expropiacion')", :loading="status.downloading.extincion_expropiacion")
					|Extinción - Expropiación
					v-icon(right)
						|mdi-download
</template>

<script>

	export default {
		props: ["estate", "index"],
		data() {
			return {
				status: {
					downloading: {
						escritura_propiedad: false,
						escritura_propiedad_colateral: false,
						posesion_material: false,
						certificado_libertad_gravamen: false,
						extincion_expropiacion: false,
					}
				},
			}
		},
		filters: {
			currency: value => "$" + parseFloat(value).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " MXN"
		},
		methods: {
			hasDocument: function( type ) {
				return this.estate.documents.some(doc => doc.type == type )
			},
			download: function( type ) {
				this.status.downloading[ type ] = true

				let targetDocument = this.getDocumentByType( type )

				if( targetDocument === false )
					this.$swal("Error en la descarga", "No se pudo descargar el documento solicitado, por favor, inténtelo de nuevo.")
				else{

					let resource = `download?key=${targetDocument.key}&username=${this.$store.getters.currentProject.developer.username}`
					let config = {responseType: 'arraybuffer'}

					this.$fileserver.get(resource, config)
					.then(result => {

						const url = window.URL.createObjectURL(new Blob([ result.data ]))
			            const link = document.createElement('a')
			            link.href = url
			            link.setAttribute('download', `${this.$store.getters.currentProject.developer.name}_${type}.pdf`)
			            document.body.appendChild(link)
			            link.click()

			            this.status.downloading[ type ] = false

					})
					.catch(err => this.$report(err, {swal: true}))
				}

			},
			getDocumentByType: function( type ) {
				for( let i = 0 ; i < this.estate.documents.length ; i++ )
					if( this.estate.documents[ i ].type === type )
						return this.estate.documents[ i ]

				return false
			}
		},
		components: {
		}
	}
</script>

<style lang="sass">
	.estate-card
		margin-bottom: 15px
		.v-image
			overflow: unset
			.edit-button
				right: 45px
			.delete-button
	.estate-editor-dialog

</style>