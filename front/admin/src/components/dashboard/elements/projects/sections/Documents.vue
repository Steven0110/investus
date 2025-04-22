<template lang="pug">
	transition(name="fade")
		.project-publisher
			v-stepper(non-linear, v-model="step")
				v-stepper-header.elevation-0
					v-stepper-step(
						editable step="1",
						complete-icon="mdi-check",
						v-if="viabilidadDocs.length > 0",
						edit-icon="mdi-check")
						|Viabilidad Legal o Jurídica
					v-divider
					v-stepper-step(
						v-if="evaluacionDocs.length > 0",
						editable,
						step="2")
						|Evaluación
					v-divider
					v-stepper-step(
						v-if="$store.getters.currentProject.stage == 'montos'",
						editable,
						step="3")
						|Garantía Inmobiliaria
				v-stepper-items
					v-stepper-content.elevation-0(step="1")
						.step-header
							.description
								|Documentos solicitados por las Disposiciones de carácter general a las que se refiere el artículo 58 de la LRITF.
						.step-subcontent
							v-row.documents(v-if="$store.getters.currentProject.documents.length > 0")
								v-col(cols="12", md="6", lg="4", xl="3", v-for="(doc, index) in viabilidadDocs", :key="doc.type")
									checker(
										:doc="doc",
										:_id="$store.getters.currentProject._id",
										:developer="$store.getters.currentProject.developer"
										@edited="rate",
										@rated="rate",)
							v-row(v-if="stage == 'viabilidad'")
								v-spacer
								v-btn.mt-2(
									color="primary",
									:disabled="!isViabilidadReady",
									:loading="status.loading",
									@click="validate")
									|Aprobar documentos
								v-spacer

					v-stepper-content.elevation-0(step="2")
						.step-header
							.description
								|Documentos solicitados por las Disposiciones de Carácter General Aplicables a las Instituciones de Tecnología Financiera.
						.step-subcontent
							v-row.documents(v-if="$store.getters.currentProject.documents.length > 0")
								v-col(cols="12", md="6", lg="4", xl="3", v-for="(doc, index) in evaluacionDocs", :key="doc.type")
									checker(
										:doc="doc",
										:_id="$store.getters.currentProject._id",
										:developer="$store.getters.currentProject.developer",
										@edited="rate",
										@rated="rate")

							v-divider.mt-2

							v-row
								v-col(cols="12")
									h3.text-center
										|Líder de proyecto y personal de la primera línea jerárquica:
							transition-group(name="slide-x-transition", class="row" tag="div", mode="out-in")
								v-col(cols="12", sm="6", md="4", xl="3", v-for="worker in $store.getters.currentProject.workers", :key="worker.name")
									worker-card(:worker="worker")

							v-row(v-if="stage == 'evaluacion'")
								v-spacer
								v-btn.mt-2(
									color="primary",
									:disabled="!isEvaluacionReady",
									:loading="status.loading",
									@click="validate")
									|Aprobar documentos e información
								v-spacer

					v-stepper-content.elevation-0(step="3")
						.step-header
							.description
								|Montos de financiamiento del proyecto y garantía inmobiliaria.
						financiamiento

						v-row
							v-spacer
							v-btn(color="primary", @click="calculateRisk")
								|Calcular nivel de riesgo del proyecto
								v-icon(right)
									|mdi-gauge
							v-spacer
						v-row(v-if="risk && rating")
							v-col(offset-md="4", md="4")
								v-card
									v-card-text
										v-simple-table
											template(v-slot:default)
												thead
													tr
														th
															h3
																|Rubro
														th
															h3
																|Calificación
												tbody
													tr
														td
															|Viabilidad legal
														td
															|{{ rating.viabilidad | percentage }}
													tr
														td
															|Evaluación cualitativa y cuantitativa
														td
															|{{ rating.evaluacion | percentage }}
													tr
														td
															|Monto financiero y garantía inmobiliaria
														td
															|{{ rating.montos | percentage }}
													tr
														td
															strong
																|Total
														td
															strong
																|{{ globalRate | percentage }}

										risk-level(:risk="risk")
									v-card-actions
										v-spacer
										v-btn(color="primary", @click="")
											|Aprobar proyecto
											v-icon(right)
												|mdi-check

</template>

<script>
	import Checker 			from "@/components/tools/files/Checker.vue"
	import WorkerCard 		from "@/components/dashboard/elements/projects/sections/WorkerCard.vue"
	import Financiamiento 	from "@/components/dashboard/elements/projects/sections/Financiamiento.vue"
	import RiskLevel 		from "@/components/dashboard/elements/projects/kpi/RiskLevel.vue"


	export default {
		data() {
			return {
				status: {
					loading: false
				},
				step: 1,
				risk: null,
				rating: null,
				globalRate: 0
			}
		},
		methods: {
			rate: function(e) {
				const type = e.doc.type
				const index = this.findDocumentIndex( type )

				this.$store.commit("rateCurrentProject", {rate: e.rate, index: index})
			},
			validate: function() {
				let text = ""

				switch( this.stage ){
					case "viabilidad":
						text = "Una vez validados se le notificará al solicitante y se le habilitará la subida de documentos para la evaluación cuantitativa y cualitativa."
						break
					case "evaluacion":
						text = "Una vez validados se le notificará al solicitante y se le habilitará el módulo de montos y garantía inmobiliaria."
						break
					default:
						text = "Una vez validados se le notificará al solicitante y se le habilitará la subida de documentos para la evaluación cuantitativa y cualitativa."
				}

				this.$swal({
					title: "¿Validar los documentos?",
					text: text,
					type: "warning",
					confirmButtonText: "Confirmar",
					cancelButtonText: "Regresar",
					showCancelButton: true,
					reverseButtons: true
				}).then(result => {
					if( result.value ){
						this.status.loading = true

						this.$projects.post(`validate/${this.$store.getters.currentProject._id}/${this.stage}`)
						.then(result => {
							this.renovateSession()
							this.$router.push({path: "/dashboard/proyectos"})
							
							if(this.stage == "montos"){
								this.$swal("¡Listo!", "El proyecto ha sido publicado exitosamente y está listo para ser fondeado", "success")
							}else
								this.$swal("¡Listo!", "Los documentos en esta etapa han sido aprobados", "success")
						})
						.catch( err => this.$report(err, {swal: true}) )
						.finally( () => {
							this.status.loading = false
						})
					}
				})
			},
			findDocumentIndex: function(type) {
				let documents = this.$store.getters.currentProject.documents
				for( let i = 0 ; i < documents.length ; i++ )
			        if( documents[ i ].type === type )
			            return i
			    return -1
			},
			calculateRisk: function() {
			    let documents = this.$store.getters.currentProject.documents

			    let percentage 	= this.$store.getters.currentProject.type == "debt" ? 45 : 40
			    let viabilidad 	= 0,
			        evaluacion 	= 0,
			        montos 		= 0

			    let vDocs = documents.filter(doc => doc.stage == 'viabilidad')
			    let eDocs = documents.filter(doc => doc.stage == 'evaluacion')

			    /*	Califica documentos de fase I*/
			    for(let vDoc of vDocs)
			        if( vDoc.processed && vDoc.valid )
			            viabilidad += Number( vDoc.rate )

			    let viabilidadRate = ( viabilidad * percentage / 50) //Regla de 3

			    /*	Califica documentos de fase II*/
			    for(let eDoc of eDocs)
			        if( eDoc.processed && eDoc.valid )
			            evaluacion += Number( eDoc.rate )

			    let evaluacionRate = ( evaluacion * percentage / 30) //Regla de 3
			    
			    /*	Califica documentos de fase III*/
			    let cobertura = this.warranty / this.$store.getters.currentProject.goal.amount
			    montos = ( cobertura * 10 / 3) //Regla de 3
			    if( !this.$store.getters.currentProject.type == "debt" )
			    	montos *= 2

			    this.rating = {
			        viabilidad: viabilidadRate,
			        evaluacion: evaluacionRate,
			        montos: 	montos
			    }

			    let globalRate = this.rating.viabilidad + this.rating.evaluacion + this.rating.montos
			    this.globalRate = globalRate
			    if( globalRate > 0 && globalRate <= 40)
			    	this.risk = "high"
			    else if( globalRate > 40 && globalRate <= 70)
			    	this.risk = "medium"
			    else if( globalRate > 70 && globalRate <= 100)
			    	this.risk = "low"
			}
		},
		computed: {
			isViabilidadReady: function() {
				for(let doc of this.viabilidadDocs)
					if( !doc.processed )
						return false
				return true
			},
			isEvaluacionReady: function() {
				for(let doc of this.evaluacionDocs)
					if( !doc.processed )
						return false
				return true
			},
			ismontosReady: function() {
				for(let doc of this.montosDocs)
					if( !doc.processed )
						return false
				return true
			},
			viabilidadDocs: function() {
				let documents = this.$store.getters.currentProject.documents || [] //array
				let filtered = documents.filter(doc => doc.stage == 'viabilidad')

				return filtered
			},
			evaluacionDocs: function() {
				let documents = this.$store.getters.currentProject.documents || []
				let filtered = documents.filter(doc => doc.stage == 'evaluacion')
				
				return filtered
			},
			montosDocs: function() {
				let documents = this.$store.getters.currentProject.documents || [] //array
				let filtered = documents.filter(doc => {
					return ["null"].includes(doc.type)
				})
				
				return filtered
			},
			stage: function() {

				let string = ""

				if(this.$store.getters.currentProject.stage == 'montos'){
					string = "montos"
					this.step = 3
				}else if(this.evaluacionDocs.length > 0){
					string = "evaluacion"
					this.step = 2
				}else if(this.viabilidadDocs.length > 0){
					string = "viabilidad"
					this.step = 1
				}
				else{
					string = "published"
					this.step = 4
				}
				console.info( string )
				return string
			},
			isReady: function() {
				return false
			},
			warranty: function() {				
				let sum = 0
				for(let estate of this.$store.getters.currentProject.estates )
					sum += Number( estate.value )

				return Number( parseFloat( sum ).toFixed(2) )
			}
		},
		filters: {
			percentage: function( value ) {
				return Number(parseFloat( value ).toFixed(2)) + "%"
			}
		},
		components: {
			Checker,
			WorkerCard,
			Financiamiento,
			RiskLevel,
		}
	}
</script>

<style lang="sass">
	.project-publisher
	
</style>
