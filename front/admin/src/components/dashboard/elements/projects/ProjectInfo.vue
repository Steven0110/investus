<template lang="pug">
	transition(name="fade")
		v-row.project-info(v-if="project.total")
			v-col(cols="12", md="4", xl="3", v-if="!readonly")
				v-card.rules-card
					v-card-title.justify-center
						|Reglas de negocio
					v-card-text
						rule(name="¿Vigencia de 72 horas?", :ok="isValid")
						rule(name="¿Coincide RFC emisor con RFC de usuario?", :ok="matchesEmisor")
						rule(name="¿Tiene historial previo de facturas?", :ok="project.relatedprojects && project.relatedprojects.length > 0")
						rule(name="¿El remitente es una AAA?", :ok="isAAA")

			v-col(cols="12", md="4", xl="3")
				v-card.general-card
					v-card-title.justify-center
						|Datos generales
					v-card-text
						.info-key
							|Fecha de emisión:
						.info-value
							|{{ project.fechaEmision | moment("MMMM D, h:mm:ss a") }}
						.info-key
							|Forma de pago:
						.info-value
							|{{ project.formaPago }}
						.info-key
							|Método de pago:
						.info-value
							|{{ project.metodoPago }}
						.info-key
							|Moneda:
						.info-value
							|{{ project.moneda }}
						.info-key
							|Subtotal:
						.info-value
							|{{ project.subtotal | currency }}
						.info-key
							|Total:
						.info-value
							|{{ project.total | currency }}

			v-col(cols="12", md="4", xl="3")
				v-card.general-card
					v-card-title.justify-center
						|Validaciones con el SAT
					v-card-text
						.info-key
							|Respuesta SAT:
						.info-value
							|{{ project.validations.respuestaSAT }}
						.info-key
							|Validez en SAT:
						.info-value
							|{{ project.validations.validezSAT }}
						.info-key
							|Respuesta Timbox:
						.info-value
							|{{ project.validations.respuestaTimbox }}
						.info-key
							|Adicionales:
						.info-value
							|{{ project.validations.lco }}
			v-col(cols="12", md="4", xl="3")
				v-card.emisor-card
					v-card-title.justify-center
						|Emisor
					v-card-text
						.info-key
							|RFC:
						.info-value
							|{{ project.emisor.rfc }}
						.info-key
							|Razón social:
						.info-value
							|{{ project.emisor.nombre }}
						.info-key
							|Régimen:
						.info-value
							|{{ project.emisor.regimen }}
			v-col(cols="12", md="4", xl="3")
				v-card.receptor-card
					v-card-title.justify-center
						|Receptor
					v-card-text
						.info-key
							|RFC:
						.info-value
							|{{ project.receptor.rfc }}
						.info-key
							|Razón social:
						.info-value
							|{{ project.receptor.nombre }}
						.info-key
							|USO CFDI:
						.info-value
							|{{ project.receptor.usoCFDI }}
			v-col(cols="12", md="4", xl="3")
				v-card.receptor-card
					v-card-title.justify-center
						|Impuestos
					v-card-text
						.info-key
							|Trasladados:
						.info-value
							|{{ project.impuestos.trasladados.impuesto | currency }}
						.info-key
							|Retenciones:
						.info-value
							|$0
			v-col(cols="12")
				v-card.conceptos-card
					v-card-title.justify-center
						|Conceptos
					v-card-text
						v-row(v-for="concepto in project.conceptos", :key="concepto.descripcion")
							v-col(cols="12", md="2")
								.info-key
									|Cantidad
								.info-value
									|{{ concepto.cantidad }}
							v-col(cols="12", md="2")
								.info-key
									|Unidad
								.info-value
									|{{ concepto.unidad }}
							v-col(cols="12", md="4")
								.info-key
									|Descripción
								.info-value
									|{{ concepto.descripcion }}
							v-col(cols="12", md="2")
								.info-key
									|P.U.
								.info-value
									|{{ concepto.valorUnitario | currency }}
							v-col(cols="12", md="2")
								.info-key
									|Importe
								.info-value
									|{{ concepto.importe | currency }}

			v-col(cols="12", v-if="project.relatedprojects && project.relatedprojects.length > 0")
				simple-projects-table(:projects="project.relatedprojects")

			v-col(cols="12", v-if="!readonly && project.status == 'revision'")
				v-row
					v-spacer
					v-btn(color="primary", @click="state.approveproject = true", :loading="status.loadingApproval")
						|Aprobar factura
						v-icon(right)
							|mdi-check
					v-btn.ml-2(color="orange darken-2", dark)
						|Solicitar documentos
						v-icon(right)
							|mdi-file
					v-btn.ml-2(color="red darken-4", dark, @click="state.rejectproject = project")
						|Rechazar factura
						v-icon(right)
							|mdi-close
					v-spacer

			reject(:project="state.rejectproject", @close="state.rejectproject = false", @rejected="rejected")
			approve(v-model="state.approveproject", :project="project")

			v-snackbar(v-model="state.snackbar", color="#176580", dark, bottom)
				template(v-slot:action="{ attrs }")
					v-btn(v-bind="attrs", text)
						v-icon(color="white")
							|mdi-check
				|Cambio realizado exitosamente
</template>

<script>
	import Rule 				from "@/components/dashboard/elements/projects/kpi/Rule.vue"
	import Reject 				from "@/components/dashboard/elements/projects/dialogs/Reject.vue"
	import Approve 				from "@/components/dashboard/elements/projects/dialogs/Approve.vue"
	import SimpleProjectsTable 	from "@/components/dashboard/elements/projects/SimpleProjectsTable.vue"

	export default {
		props: [ "project", "readonly"],
		data() {
			return {
				state: {
					rejectproject: false,
					approveproject: true,
					snackbar: false
				},
				status: {
					loadingApproval: false
				}
			}
		},
		methods: {
			rejected: function(project) {
				this.state.snackbar = true
				this.state.rejectproject = false
				this.push({path: "/dashboard/facturas"})
			},
			approve: function() {
			}
		},
		computed: {
			isValid: function() {
				if( this.project.fechaEmision ){
					let diff = new Date() - new Date(this.project.fechaEmision)
					let diffHours = diff / 36e5

					return diffHours > 72
				}else
					return false
			},
			matchesEmisor: function() {
				return this.project.developer.info && this.project.developer.info.rfc && this.project.developer.info.rfc == this.project.emisor.rfc

			},
			isAAA: function() {
				let companies = this.$store.getters.companies
				for(let company of companies)
					if(company.rfc === this.project.receptor.rfc && company.rate == "AAA")
						return true

				return false
			}
		},
		filters: {
			currency: function( value ) {
				return "$" + parseFloat(value).toFixed(2).replace('.', '.').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
			}
		},
		components: {
			Rule,
			Reject,
			Approve,
			SimpleProjectsTable,
		}
	}
</script>

<style lang="sass">
	.project-info
		.emisor-card,.receptor-card,.conceptos-card,.general-card,.rules-card
			.v-card__title
				text-transform: uppercase

		.info-key
			color: #176580
			margin-top: 10px
			font-family: Roboto
			text-transform: uppercase
			font-weight: 700
			font-size: 0.9rem
			letter-spacing: 1px
		.info-value
			font-family: Roboto
			color: #666
			font-size: 1rem
	
</style>