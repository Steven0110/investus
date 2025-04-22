<template lang="pug">
	.secret-image
		v-card
			v-img(src="/assets/images/secret-image.jpg", :height="imgHeight")
			v-card-title
				|Secret Image
			v-card-subtitle(v-if="!$store.getters.user.secretImage")
				|Set up a secret image for more secure login.
				v-tooltip(top, max-width="500")
					template(v-slot:activator="{ on, attrs }")
						v-icon(right, color="black", v-on="on")
							|mdi-help-circle
					div
						p
							|The security image you choose will be shown when you log in to ensure you're entering your credentials on Investus
			v-card-subtitle(v-else)
				|Secret image has been successfully configured.
			v-card-actions
				v-spacer
				v-btn(color="primary", dark, v-if="!$store.getters.user.secretImage", @click="showConfig = true", :loading="status.sending")
					|Configure
				v-btn(color="green", dark, v-else)
					|Configured
					v-icon(right)
						|mdi-check

		//- Modal de configuración
		v-dialog(v-model="showConfig", max-width="1200", persistent, scrollable)
			v-card.secret-image-card
				v-card-title
					|Secret Image Configuration
				v-card-text
					.instructions
						|Please select one of the following images:
					.secret-images-container
						image-radio-group(v-model="secretImage", :images="images")
				v-card-actions
					v-spacer
					v-btn(text, color="primary", @click="showConfig = false")
						|Close
					v-btn(color="primary", @click="saveSecretImage", :loading="status.saving")
						|Save
</template>

<script>
	import ImageRadioGroup	from "@/components/tools/forms/ImageRadioGroup.vue"

	export default {
		data() {
			return {
				showConfig: false,
				secretImage: "",
				status: {
					saving: false
				},
				images: [
					"079789h8hjhgjutu5767fhnbtd6e.jpg",
					"089089jkljo79ihjkh85687th4746tfde535tdg7t86.jpg",
					"2556363yrhfj6869uojk088jhg.jpg",
					"32023948dfigohkdfjghdf98465sdd.jpg",
					"345987dfkhfdgifg894756546.jpg",
					"3647567080jojlkkgjfhget4687.jpg",
					"78657yuhgj7989iklklo879098687thjg.jpg",
					"aasqwsdwedftr45567787989898hjghg.jpg",
					"asdojkdas89jp23rbgdoiñcnoi4389.jpg",
					"aslkjñasdlksgdoij32r98sdf23409.jpg",
					"bvvbmnfgkjfidjfdiu84u8374gfj.jpg",
					"cfgjhutu447f8bldksjsd56fg.jpg",
					"cvbdfgdfgert5646fggfhfgh.jpg",
					"cvbfdghfghmhjkyu89789789.jpg",
					"cvbfghguityu567856756745.jpg",
					"cvmdfkjrtiuryuiy8737634hgsdnbdf.jpg",
					"cvmndfjeruy347623674598567899.jpg",
					"ddfrrtmtnymnyumiumou.jpg",
					"dfgooy847322d7vvvjbjgssd.jpg",
					"djgjg8678467eyfhjgkjyi6u5yetf.jpg",
					"dlflgmbmhjui68576sgxnvmbkhkh.jpg",
					"dsfsf76fsd7667g67g76dfgfdgfd.jpg",
					"flgk5857362tsghdcfjgkhi7856743.jpg",
					"ggfhffg746764ghhghgghgh.jpg",
					"guitjkrankjasdnkajsd334656.jpg",
					"khklgfjfhjd747fhjgfj69yu9hkgj5.jpg",
					"kjfgjkdfhjeruy458723892306798.jpg",
					"lhhkjgjtiutu47473636eyhnmvmbk.jpg",
					"lkjsdfkjherituh3496856dfgdg.jpg",
					"mnbxcvbkjsdfkbjasduiqwe324656.jpg",
					"nmbnbhfhdgw6465786ihkhjd3.jpg",
					"nmkhgijijuyteywtr7345.jpg",
					"partiyiu87435hdnfkknvsksdfs.jpg",
					"sdfsdfdfgkjnrg789y4378bsdfsdfs.jpg",
					"sfdfdfghuyiu63433434.jpg",
					"trlkfdglkn3489938dfglgfnldf44.jpg",
					"vbmnfgkjrtiue4872365ahgcxccvb.jpg",
					"vmbnbjgjti789089766d.jpg",
					"xcdfdtghjhjjkui89890.jpg",
					"xcvmnsdfiuhwer87236487yhfdgfgdg.jpg",
				]
			}
		},
		methods: {
			saveSecretImage: function() {


				this.$swal({
					title: "Are you sure?",
					text: "Once the secret image is configured, it cannot be changed",
					type: "warning",
					showCancelButton: true,
					cancelButtonText: "Go back",
					confirmButtonText: "Save",
					reverseButtons: true
				})
				.then(result => {
					if( result.value ){
						this.status.saving = true

						this.$store.commit("setSecretImage", true)
						
						/*	Da de alta la imagen secreta 	*/
						let body = {
							secretImage: this.secretImage
						}
						
						this.$security.post("set-secret-image", body)
						.then(result => {
							this.$swal("Done!", "Your secret image has been successfully configured. You'll see it the next time you log in", "success")
						})
						.catch(err => {
							console.error( err )
							this.$sentry.captureException( err )
							this.$swal("Could not configure your secret image", "Please try again", "warning")
						})
						.finally( () => {
							this.renovateSession()
							this.showConfig = false
							this.status.saving = false
						})

					}
				})
				
			}
		},
		computed: {
			imgHeight: function() {
				if(this.$vuetify.breakpoint.smAndDown)
					return "200"
				else
					return "300"
			}
		},
		components: {
			ImageRadioGroup
		}
	}
</script>

<style lang="sass">
	.secret-image
	.secret-image-card
		.instructions
			font-size: 1.2em
			margin-bottom: 15px
	@media only screen and (min-width: 1904px)
	@media only screen and (max-width: 1903px)
	@media only screen and (max-width: 1264px)
	@media only screen and (max-width: 960px)
	@media only screen and (max-width: 600px)

</style>