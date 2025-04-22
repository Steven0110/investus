<template lang="pug">
	.companies-subpanel
		.subpanel-title.d-none.d-md-block
			|Catálogo de Empresas
		.subpanel-description
			|En esta sección podrás consultar y administrar el catálogo de empresas de la platafoma
		.content
			v-data-table.companies-table(
				:headers="headers",
				:items="companies",
				loading-text="Cargando facturas...",
				no-result-text="Sin empresas",
				:footer-props="{'items-per-page-text': 'Mostrar:'}"
				no-data-text="Sin empresas",
				:loading="status.loading")
				
				//template(v-slot:top)
					v-toolbar(flat)
						v-spacer
						v-btn(color="primary", @click="status.show.create = true")
							v-icon(left)
								|mdi-plus
							|Agregar empresa

				template(v-slot:item._id="{ item }")
					.actions
						v-tooltip(bottom, max-width="300px")
							template(v-slot:activator="{ on, attrs }")
								v-icon.ml-2(color="primary darken-2", v-bind="attrs", v-on="on", @click="")
									|mdi-eye
							span
								|Ver detalle

		//create(v-model="status.show.create", @add="addCompany")
		//edit(v-model="updateEdit", @update="updateCompany")

		//v-snackbar(v-model="state.infoSnack", color="#176580", dark, bottom)
			template(v-slot:action="{ attrs }")
				v-btn(v-bind="attrs", text)
					v-icon(color="white")
						|mdi-check
			|Cambio hecho exitosamente
</template>

<script>
	//import Create 	from "@/components/dashboard/elements/companies/Create.vue"
	//import Edit 	from "@/components/dashboard/elements/companies/Edit.vue"

	export default {
		data() {
			return {
				companies: [],
				headers: [
					{ text: "Nombre", value: "name" },
					{ text: "Clave", value: "clave" },
					{ text: "Tipo", value: "tipoAnalisis" },
					{ text: "Publicación", value: "fechaPublicacion", sortable: false },
					{ text: "Rating", value: "type" },
					{ text: "Acciones", value: "_id", sortable: false },
				],
				status: {
					loading: false,
					show: {
						create: false,
						update: false,
					}
				},
				state: {
					infoSnack: false
				},
				updateEdit: false
			}
		},
		methods: {
			init: function() {

				if( !this.status.loading ){
					this.status.loading = true

					this.$projects.get("companies")
					.then(result => this.companies = result.data.companies)
					.catch(err => {
						this.$swal("Error", "Hubo un error al consultar las empresas disponibles, por favor vuelva a intentarlo.", "warning")
						this.$report( err )
					})
					.finally(() => this.status.loading = false)
				}

			},
			addCompany: function(company) {
				this.companies.push( company )
				this.state.infoSnack = true
			},
			updateCompany: function(company) {
				let index = this.companies.map(c => c._id).indexOf(company._id)
				this.companies[ index ] = company
				this.state.infoSnack = true
			},
			deleteCompany: function(company) {
				this.$swal({
					title: `¿Seguro que deseas borrar ${company.name}?`,
					text: "Esta acción no se puede deshacer",
					type: "warning",
					confirmButtonText: "Sí, borrar",
					cancelButtonText: "Cancelar",
					showCancelButton: true,
					reverseButtons: true
				})
				.then(result => {
					if( result.value ){
						this.status.loading = true
						this.$projects.delete(`companies/${company._id}`)
						.then(result => {
							this.companies.splice(this.companies.map(c => c._id).indexOf(company._id), 1)
							this.$swal("¡Listo!", `La empresa ${company.name} ha sido borrada exitosamente`, "success")
						})
						.catch(err => {
							if( err.response && err.response.status ){
								if( err.response.status == 404 ){
									this.$swal("No encontrada", "La empresa no existe.", "error")
								}else
									this.$report( err, {swal: true} )
							}else
								this.$report( err, {swal: true} )
						})
						.finally(() => this.status.loading = false)
					}
				})
			}
		},
		mounted: function() {
			this.init()
		},
		activated: function() {
			this.init()
		},
		components: {
			//Create,
			//Edit
		}
	}
</script>

<style lang="sass">
	.companies-subpanel
		.subpanel-title
			text-transform: uppercase
			font-family: Roboto
			letter-spacing: 1px
			color: black
			font-size: 25px
			font-weight: 600
		.subpanel-description
			font-family: Roboto
			font-size: 18px
			color: #444
			margin-bottom: 15px
</style>