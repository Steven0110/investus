<template lang="pug">
	.companies-subpanel
		.subpanel-title.d-none.d-md-block
			|Company Catalog
		.subpanel-description
			|In this section you can view and manage the platform's company catalog
		.content
			v-data-table.companies-table(
				:headers="headers",
				:items="companies",
				loading-text="Loading companies...",
				no-result-text="No companies",
				:footer-props="{'items-per-page-text': 'Show:'}"
				no-data-text="No companies",
				:loading="status.loading")
				
				template(v-slot:top)
					v-toolbar(flat)
						v-spacer
						v-btn(color="primary", @click="status.show.create = true")
							v-icon(left)
								|mdi-plus
							|Add company

				template(v-slot:item._id="{ item }")
					.actions
						v-tooltip(bottom, max-width="300px")
							template(v-slot:activator="{ on, attrs }")
								v-icon.ml-2(color="primary darken-2", v-bind="attrs", v-on="on", @click="viewCompanyDetails(item)")
									|mdi-eye
							span
								|View details

		//create(v-model="status.show.create", @add="addCompany")
		//edit(v-model="updateEdit", @update="updateCompany")

		v-snackbar(v-model="state.infoSnack", color="primary", dark, bottom)
			template(v-slot:action="{ attrs }")
				v-btn(v-bind="attrs", text)
					v-icon(color="white")
						|mdi-check
			|Change successfully made
</template>

<script>
	//import Create 	from "@/components/dashboard/elements/companies/Create.vue"
	//import Edit 	from "@/components/dashboard/elements/companies/Edit.vue"

	export default {
		data() {
			return {
				companies: [],
				headers: [
					{ text: "Name", value: "name" },
					{ text: "Code", value: "clave" },
					{ text: "Type", value: "tipoAnalisis" },
					{ text: "Publication Date", value: "fechaPublicacion", sortable: false },
					{ text: "Rating", value: "type" },
					{ text: "Actions", value: "_id", sortable: false },
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
				if(!this.status.loading) {
					this.status.loading = true
					
					// Mock data instead of API call
					setTimeout(() => {
						this.companies = [
							{
								_id: "comp1",
								name: "Global Investments Ltd",
								clave: "GIL2023",
								tipoAnalisis: "Financial",
								fechaPublicacion: "2023-02-15",
								type: "AAA+",
								description: "Global leader in investment management with a strong track record in real estate development financing."
							},
							{
								_id: "comp2",
								name: "Horizon Development Group",
								clave: "HDG2022",
								tipoAnalisis: "Construction",
								fechaPublicacion: "2022-07-30",
								type: "AA",
								description: "Specializes in commercial property development with focus on sustainability and innovation."
							},
							{
								_id: "comp3",
								name: "Capital Ventures Inc",
								clave: "CVI2023",
								tipoAnalisis: "Financial",
								fechaPublicacion: "2023-04-10",
								type: "A+",
								description: "Provides equity and debt financing for mid-size development projects across North America."
							},
							{
								_id: "comp4",
								name: "Urban Modern Builders",
								clave: "UMB2021",
								tipoAnalisis: "Construction",
								fechaPublicacion: "2021-11-05",
								type: "AAA",
								description: "Award-winning construction company specializing in modern urban residential projects."
							},
							{
								_id: "comp5",
								name: "Evergreen Real Estate Partners",
								clave: "EREP2022",
								tipoAnalisis: "Investment",
								fechaPublicacion: "2022-09-18",
								type: "AA+",
								description: "Focuses on sustainable real estate development with strong environmental commitments."
							},
							{
								_id: "comp6",
								name: "Metropolitan Financing Solutions",
								clave: "MFS2023",
								tipoAnalisis: "Financial",
								fechaPublicacion: "2023-01-22",
								type: "A",
								description: "Specializes in structured financing solutions for large-scale urban development projects."
							},
							{
								_id: "comp7",
								name: "Elite Property Holdings",
								clave: "EPH2022",
								tipoAnalisis: "Investment",
								fechaPublicacion: "2022-12-05",
								type: "BBB+",
								description: "Investment group focused on luxury residential and commercial properties."
							}
						];
						
						this.status.loading = false;
					}, 1000);
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
					title: `Are you sure you want to delete ${company.name}?`,
					text: "This action cannot be undone",
					type: "warning",
					confirmButtonText: "Yes, delete",
					cancelButtonText: "Cancel",
					showCancelButton: true,
					reverseButtons: true
				})
				.then(result => {
					if(result.value) {
						this.status.loading = true
						
						// Mock API call
						setTimeout(() => {
							// Remove company from the array
							const index = this.companies.findIndex(comp => comp._id === company._id);
							if (index !== -1) {
								this.companies.splice(index, 1);
							}
							
							this.$swal("Done!", `The company ${company.name} has been successfully deleted`, "success");
							this.status.loading = false;
						}, 1000);
					}
				})
			},
			viewCompanyDetails: function(company) {
				// Implement the logic to view company details
				console.log("Viewing details for:", company);
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