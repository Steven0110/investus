<template lang="pug">
	v-dialog(:value="value", content-class="approve-project-dialog", max-width="800", persistent)
		v-card
			v-card-title
				|Aprobar factura
			v-card-text
				p
					|Por favor verifique y modifique la información siguiente:
				v-row
					v-col(cols="6")
						.subtitle-1.font-weight-bold
							|Información del solicitante:
						simple-field(:value="project.developer.name", text="Nombre")
						div(v-if="project.developer.info")
							simple-field(:value="project.developer.rfc", text="RFC")
							simple-field(:value="project.developer.type", text="Persona")
						div.mt-2(v-else)
							v-alert(color="#e08600", dark)
								|El usuario no ha subido su INE
						v-row
							v-col(cols="8", offset-md="2")
								risk-level(risk="medium")
						.divider
					v-col(cols="6")
						.subtitle-1.font-weight-bold
							|Información de la factura:
						v-form(ref="form")
							v-row
								v-col.pb-0(cols="6", offset-md="3")
									v-text-field(
										append-icon="mdi-percent-outline",
										color="primary",
										type="number",
										step="1",
										hide-details,
										:rules="form.validations.required",
										label="Descuento",
										outlined,
										v-model="input.discount")
								v-col.pt-0(cols="12")
									medium-field.text-center(:value="'$' + project.total", text="Total original")
									huge-field.text-center(:value="discountTotal", text="Total publicado")
			v-card-actions
				v-spacer
				v-btn(color="secondary", text, @click="$emit('input', false)")
					|Cancelar
				v-btn(color="primary", @click="approve", :loading="status.loading")
					|Aprobar factura
</template>

<script>
	import RiskLevel 		from "@/components/dashboard/elements/projects/kpi/RiskLevel.vue"
	import SingleMetric 	from "@/components/dashboard/elements/projects/kpi/SingleMetric.vue"
	import SimpleField 		from "@/components/dashboard/elements/projects/kpi/SimpleField.vue"
	import MediumField 		from "@/components/dashboard/elements/projects/kpi/MediumField.vue"
	import HugeField 		from "@/components/dashboard/elements/projects/kpi/HugeField.vue"

	export default {
		props: ["project", "value"],
		data() {
			return {
				notes: "",
				status: {
					loading: false
				},
				input: {
					discount: 0
				},
				form: {
					validations: {
				      	required: [
				        	v => !!v || 'El campo es requerido',
				      	]
					}
				}
			}
		},
		computed: {
			discountTotal: function() {
				return "$" + (this.project.total - (this.project.total * this.input.discount / 100))
			}
		},
		methods: {
			approve: function() {
				this.$swal({
					title: "¿Deseas aprobar esta factura?",
					text: "Una vez aprobada será publicada y podrá ser fondeada por inversionistas. Esta acción no se puede revertir",
					type: "warning",
					cancelButtonText: "No, regresar",
					showCancelButton: true,
					reverseButtons: true,
					confirmButtonText: "Aprobar"
				})	
				.then(result => {
					if( result.value ){
						this.status.loadingApproval = true

						this.$projects.get(`publish/${this.project._id}`)
						.then( ({data}) => {
							this.state.snackbar = true
							this.$router.push({path: "/dashboard/facturas?message=Factura publicada exitosamente"})
						})
						.catch( err => this.$report(err, {swal: true}) )
						.finally( () => this.status.loadingApproval = false )
					}
				})
			}
		},
		components: {
			RiskLevel,
			SingleMetric,
			SimpleField,
			MediumField,
			HugeField,
		}
	}
</script>

<style lang="sass">
	
</style>