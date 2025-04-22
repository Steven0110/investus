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
						|Legal Viability
					v-divider
					v-stepper-step(
						v-if="evaluacionDocs.length > 0",
						editable,
						step="2")
						|Evaluation
					v-divider
					v-stepper-step(
						v-if="$store.getters.currentProject.stage == 'montos'",
						editable,
						step="3")
						|Real Estate Guarantee
				v-stepper-items
					v-stepper-content.elevation-0(step="1")
						.step-header
							.description
								|Documents required by the General Provisions regarding Article 58 of the LRITF.
						.step-subcontent
							v-row.documents(v-if="$store.getters.currentProject.documents.length > 0")
								v-col(cols="12", md="6", lg="4", xl="3", v-for="(doc, index) in viabilidadDocs", :key="doc.type")
									span
										|{{ doc.name }}
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
									|Approve documents
								v-spacer

					v-stepper-content.elevation-0(step="2")
						.step-header
							.description
								|Documents required by the General Provisions Applicable to Financial Technology Institutions.
						.step-subcontent
							v-row.documents()
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
										|Project leader and first-line staff:
							transition-group(name="slide-x-transition", class="row" tag="div", mode="out-in")
								v-col(cols="12", sm="6", md="4", xl="3", v-for="worker in $store.getters.currentProject.workers", :key="worker.name")
									worker-card(:worker="worker")

							v-row(v-if="stage == 'evaluacion'")
								v-spacer
								v-btn.mt-2(
									color="primary",
									size="x-large",
									:disabled="!isEvaluacionReady",
									:loading="status.loading",
									:style="{height: '55px'}",
									@click="validate")
									|Approve documents and information
								v-spacer

					v-stepper-content.elevation-0(step="3")
						.step-header
							.description
								|Project financing amounts and real estate guarantee.
						financiamiento

						v-row
							v-spacer
							v-btn(color="primary", @click="calculateRisk")
								|Calculate project risk level
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
																|Category
														th
															h3
																|Rating
												tbody
													tr
														td
															|Legal viability
														td
															|{{ rating.viabilidad | percentage }}
													tr
														td
															|Qualitative and quantitative evaluation
														td
															|{{ rating.evaluacion | percentage }}
													tr
														td
															|Financial amount and real estate guarantee
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
											|Approve project

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
				globalRate: 0,
				// Mock documents for demo
				mockDocuments: [
					{
						type: "legal_doc_1",
						name: "Articles of Incorporation",
						stage: "viabilidad",
						processed: true,
						valid: true,
						rate: 8,
						url: "#",
						goal: {
							amount: 2500000
						}
					},
					{
						type: "legal_doc_2",
						name: "Property Title",
						stage: "viabilidad",
						processed: true,
						valid: true,
						rate: 9,
						url: "#",
						goal: {
							amount: 2500000
						}
					},
					{
						type: "legal_doc_3",
						name: "Land Use Permit",
						stage: "viabilidad",
						processed: true,
						valid: true,
						rate: 7,
						url: "#",
						goal: {
							amount: 2500000
						}
					},
					{
						type: "financial_doc_1",
						name: "Market Study",
						stage: "evaluacion",
						processed: true,
						valid: true,
						rate: 8,
						url: "#",
						goal: {
							amount: 2500000
						}
					},
					{
						type: "financial_doc_2",
						name: "Financial Projections",
						stage: "evaluacion",
						processed: true,
						valid: true,
						rate: 7,
						url: "#",
						goal: {
							amount: 2500000
						}
					},
					{
						type: "financial_doc_3",
						name: "Risk Assessment",
						stage: "evaluacion",
						processed: true,
						valid: true,
						rate: 6,
						url: "#",
						goal: {
							amount: 2500000
						}
					}
				],
				mockWorkers: [
					{
						name: "John Smith",
						position: "Project Manager",
						experience: "15 years",
						education: "MBA - Harvard Business School",
						image: "/assets/images/project-default.png"
					},
					{
						name: "Emily Johnson",
						position: "Financial Director",
						experience: "12 years",
						education: "Master in Finance - Stanford",
						image: "/assets/images/project-default.png"
					},
					{
						name: "Michael Chen",
						position: "Lead Architect",
						experience: "20 years",
						education: "Architecture - MIT",
						image: "/assets/images/project-default.png"
					}
				]
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
						text = "Once validated, the requester will be notified and document upload for quantitative and qualitative evaluation will be enabled."
						break
					case "evaluacion":
						text = "Once validated, the requester will be notified and the amounts and real estate guarantee module will be enabled."
						break
					default:
						text = "Once validated, the requester will be notified and document upload for quantitative and qualitative evaluation will be enabled."
				}

				this.$swal({
					title: "Validate documents?",
					text: text,
					type: "warning",
					confirmButtonText: "Confirm",
					cancelButtonText: "Go back",
					showCancelButton: true,
					reverseButtons: true
				}).then(result => {
					if( result.value ){
						this.status.loading = true

						// Mock API call
						setTimeout(() => {
							this.status.loading = false
							this.$router.push({path: "/dashboard/proyectos"})
							
							if(this.stage == "montos"){
								this.$swal("Done!", "The project has been successfully published and is ready to be funded", "success")
							} else {
								this.$swal("Done!", "The documents in this stage have been approved", "success")
							}
						}, 1000)
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
				console.log(filtered)
				return filtered
			},
			evaluacionDocs: function() {
				let documents = this.$store.getters.currentProject.documents || []
				let filtered = documents.filter(doc => doc.stage == 'evaluacion')
				console.log(filtered)
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
		},
		mounted() {
			// Initialize mock data if no documents exist
			//this.$store.commit("setCurrentProject", this.mockDocuments[0])
			if (this.$store.getters.currentProject) {
				// Add mock data to the project
				const project = this.$store.getters.currentProject;
				
				if (!project.documents) {
					project.documents = this.mockDocuments;
				}
				
				if (!project.workers) {
					project.workers = this.mockWorkers;
				}
				
				if (!project.estates) {
					project.estates = [
						{ value: 3000000, location: "Downtown" },
						{ value: 1500000, location: "Suburbs" }
					];
				}
				
				// Update the store
				//this.$store.commit("setCurrentProject", project);
				
				// Initialize risk calculation after a short delay
				setTimeout(() => {
					this.calculateRisk();
				}, 1500);
			}
		}
	}
</script>

<style lang="sass">
	.project-publisher
	
</style>
