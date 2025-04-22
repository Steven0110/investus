<template lang="pug">
	v-card.estate-card(min-height="250")
		v-img(height="175", src="/assets/images/estate2.png")
			v-btn.delete-button(absolute, bottom, right, fab, color="red darken-2", dark, @click="removeEstate", small, :loading="status.removing")
				v-icon
					|mdi-delete
			v-btn.edit-button(absolute, bottom, right, fab, color="green darken-2", dark, @click="editEstate", small)
				v-icon
					|mdi-pencil
		v-card-title
			|{{ estate.name }}
		v-card-text
			.text-center
				small
					|Valor:
			.text-center
				v-chip(color="green darken-2", dark)
					|{{ estate.value | currency }}

		v-snackbar(v-model="status.show.snackbarUP")
			|Propiedad actualizada exitosamente
			template(v-slot:action="{ attrs }")
				v-btn(color="#ba7127", text, v-bind="attrs", @click="status.show.snackbarUP = false")
					|Cerrar
					
		v-snackbar(v-model="status.show.snackbarRM")
			|Propiedad borrada exitosamente
			template(v-slot:action="{ attrs }")
				v-btn(color="#ba7127", text, v-bind="attrs", @click="status.show.snackbarRM = false")
					|Cerrar

		v-dialog(content-class="estate-editor-dialog", max-width="1000", v-model="status.show.editor", persistent)
			v-card
				v-card-title
					|Editar propiedad
				v-card-text
					v-form(ref="estateForm")
						v-row
							v-col(cols="12", md="6")
								v-text-field(
									v-model="item.name",
									label="Nombre de la propiedad",
									:rules="form.validations.required",
									dense,
									outlined)
							v-col(cols="12", md="6")
								v-text-field(
									v-model="item.value",
									prepend-icon="mdi-currency-usd",
									label="Valor de la propiedad",
									:rules="form.validations.required",
									type="number",
									dense,
									outlined)

						v-row.project-documents(v-if="estate.documents.length > 0")
							v-col(md="4", v-for="doc in estate.documents", :key="doc.type")
								estate-uploader(
									:doc="doc",
									:estateId="estate.estateId",
									@upload="uploadedDocument( doc )")
				v-card-actions
					v-spacer
					v-btn(color="secondary", text, @click="status.show.editor = false")
						|Cancelar
					v-btn(color="primary", @click="updateEstate", :loading="status.updating")
						|Guardar
</template>

<script>
	import EstateUploader from "@/components/tools/files/EstateUploader.vue"

	export default {
		props: ["estate", "index"],
		data() {
			return {
				status: {
					removing: false,
					updating: false,
					show: {
						snackbarRM: false,
						snackbarUP: false,
						editor: false
					}
				},
				item: {},
				form: {
					validations: {
						required: [
				        	v => !!v || 'Este campo es requerido',
				      	],
					}
				}
			}
		},
		filters: {
			currency: value => "$" + parseFloat(value).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " MXN"
		},
		methods: {
			editEstate: function() {
				this.item = this.$clone(this.estate)
				this.status.show.editor = true
			},
			updateEstate: function() {
				this.status.updating = true

				let body = {
					name: this.item.name,
					value: Number(this.item.value)
				}

				this.$projects.put(`update-estate/${this.$store.getters.currentProject._id}/${this.item.estateId}`, body)
				.then(result => {
					this.$store.commit("updateProjectEstate", {index: this.index, estate: body})

					this.status.show.editor = false
					this.status.show.snackbarUP = true
				})
				.catch(err => this.$report( err, {swal: true}) )
				.finally(() => this.status.updating = false )
			},
			removeEstate: function() {
				//return this.$store.commit("removeProjectEstate", this.index)
				this.$swal({
					title: "¿Deseas borrar este inmueble?",
					text: "Toda la información que hayas guardado será borrada. No podrás deshacer ésta acción.",
					type: "warning",
					showCancelButton: true,
					cancelButtonText: "Regresar",
					confirmButtonText: "Sí, borrar",
					reverseButtons: true
				})
				.then(result => {
					if( result.value ) {
						const body = {
							name: this.estate.name
						}

						this.status.removing = true
						this.$projects.delete(`remove-estate/${this.$store.getters.currentProject._id}/${this.estate.estateId}`, body)
						.then(result => this.$store.commit("removeProjectEstate", this.index))
						.catch(err => this.$report( err, {swal: true}) )
						.finally(() => {
							this.status.removing = false
							this.status.show.snackbarRM = true
						})
					}
				})

			},
			uploadedDocument: function( doc ){
				this.$swal("¡Listo!", "El documento ha sido subido correctamente.", "success")
				doc.status = "processing"
			}
		},
		components: {
			EstateUploader
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