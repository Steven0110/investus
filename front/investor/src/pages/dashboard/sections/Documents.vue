<template lang="pug">
	.documents-subpanel
		.subpanel-title.d-none.d-md-block
			|Documents
		.subpanel-description
			|In this section you can upload documents required for investing in Investus.
		.main-documents
			v-row(v-if="documents.length > 0")
				v-col(md="3", v-for="doc in documents", :key="doc.type")
					uploader(
						:doc="doc",
						@upload="uploadedDocument( doc )")
			v-row(v-else)
				v-col(md="12")
					v-layout(row, align-center)
						v-flex
							v-img.mx-auto.mt-5(src="/assets/icons/documents-ok.png", :width="imageWidth")
							.done-documents.text-center
								|You don't have any documents pending upload. We'll notify you when you need to upload any documents.
</template>

<script>
	import Uploader from "@/components/tools/files/Uploader.vue"
	export default {
		data() {
			return {
			}
		},
		computed: {
			documents: function() {
				let docs = []
				if( this.$store.getters.user && this.$store.getters.user.pendingDocuments ){
					console.log( this.$store.getters.user )
					for( let i = 0 ; i < this.$store.getters.user.pendingDocuments.length ; i++ ){
						let doc = this.$store.getters.user.pendingDocuments[ i ]
						doc.status = null
						switch(doc.type){
							case "ine_anverso":
							case "ine_reverso":
								doc.uploadText = "Click or drag an image"
								doc.accept = "image/*"
								doc.helper = {
									images: [
										"/assets/images/helper01.jpg",
										"/assets/images/helper02.jpg",
									],
									title: "Document Capture Guide"
								}
								break
						}
						docs.push( doc )
					}
				}

				return docs
			},
			imageWidth: function() {
				if( this.$vuetify.breakpoint.smAndDown )
					return "70%"
				else
					return "30%"
			}
		},
		methods: {
			uploadedDocument: function( doc ){
				console.log( doc )

				if( doc.type == "ine_anverso" || doc.type == "ine_reverso"){
					this.$swal("Done!", "The document has been uploaded successfully. It's currently being processed for validation, you'll receive a notification when the process is complete.", "success")
					doc.status = "processing"
				}else{
					doc.status = "uploaded"
					this.$swal("Done!", "The document has been uploaded successfully", "success")
				}
			}
		},
		components: {
			Uploader
		}
	}
</script>

<style lang="sass">
	.documents-subpanel
		.subpanel-title
			text-transform: uppercase
			font-family: Raleway
			letter-spacing: 1px
			color: black
			font-size: 25px
			font-weight: 600
		.subpanel-description
			font-family: Raleway
			font-size: 18px
			color: #444
		.main-documents
			.done-documents
				font-family: Raleway
				margin-top: 20px
				font-size: 1.5rem
				padding-left: 25%
				padding-right: 25%
	@media only screen and (max-width: 600px)
		.documents-subpanel
			.main-documents
				.done-documents
					padding-left: 15px
					padding-right: 15px
</style>