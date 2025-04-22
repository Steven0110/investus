<template lang="pug">
	.project-publisher
		v-stepper(non-linear, v-model="step", v-if="!isReady")
			v-stepper-header.elevation-0
				v-stepper-step(
					:editable="!isViabilityCompleted",
					step="1",
					:complete="isViabilityCompleted",
					complete-icon="mdi-check",
					edit-icon="mdi-check")
					|Legal Viability
				v-divider
				v-stepper-step(
					:editable="!isEvaluacionCompleted",
					step="2",
					v-show="isViabilityCompleted"
					:complete="isEvaluacionCompleted")
					|Quantitative and Qualitative Evaluation
				v-divider
				v-stepper-step(
					editable,
					v-show="isEvaluacionCompleted",
					step="3")
					|Financing Amounts and Real Estate Guarantee
			v-stepper-items
				v-stepper-content.elevation-0(step="1")
					.step-header
						.description.mb-2
							|Upload the documents required by the General Provisions referred to in article 58 of the LRITF.
					.step-subcontent
						v-row.documents(v-if="viabilidadDocs.length > 0")
							v-col(md="3", v-for="doc in viabilidadDocs", :key="doc.type")
								uploader(
									:doc="doc",
									:project="$store.getters.project"
									@upload="uploadedDocument( doc )")

				v-stepper-content.elevation-0(step="2")
					.step-header(v-if="evaluacionDocs.length > 0")
						.description
							|Upload the documents required by the General Provisions Applicable to Financial Technology Institutions.
					.step-subcontent
						v-row.documents(v-if="evaluacionDocs.length > 0")
							v-col(md="3", v-for="doc in evaluacionDocs", :key="doc.type")
								uploader(
									:doc="doc",
									@upload="uploadedDocument( doc )")

						v-divider.mt-2.mb-2(v-if="evaluacionDocs.length > 0")
							
						v-row
							v-col(cols="12")
								h3.text-center
									|Project Leader and First Line Staff:
						transition-group(name="slide-x-transition", class="row" tag="div", mode="out-in")
							v-col(cols="12", sm="6", md="4", xl="3", v-for="(worker, index) in mockWorkers", :key="worker.name")
								worker-card(:worker="worker", :index="index")
							v-col.pb-10(cols="12", sm="6", md="4", xl="3", key="-1")
								worker-add-card(@add="addWorker")

				v-stepper-content.elevation-0(step="3")
					.step-subcontent
						financiamiento(v-model="cobertura", v-if="$store.getters.currentProject && $store.getters.currentProject.stage == 'montos'")
		v-card(v-else)
			v-card-text
				v-alert.text-center(color="success", dark, icon="mdi-check")
					|You currently have no pending documents or information to upload.

</template>

<script>
	import Uploader 		from "@/components/tools/files/Uploader.vue"
	import WorkerAddCard 	from "@/components/dashboard/elements/projects/creators/WorkerAddCard.vue"
	import WorkerCard 		from "@/components/dashboard/elements/projects/creators/WorkerCard.vue"
	import Financiamiento	from "@/components/dashboard/elements/projects/sections/Financiamiento.vue"

	export default {
		data() {
			return {
				step: 1,
				status: {
					loading: {
						createEstate: false
					}
				},
				cobertura: 0,
				mockDocuments: [
					{
						name: "Legal Entity Registration",
						type: "legal_registration",
						status: "uploaded",
						processed: true,
						valid: true,
						stage: "viabilidad",
						path: "/assets/images/helper01.jpg"
					},
					{
						name: "Tax Registration Certificate",
						type: "tax_certificate",
						status: null,
						processed: false,
						valid: false,
						stage: "viabilidad",
						path: null
					},
					{
						name: "Business Operating License",
						type: "business_license",
						status: "uploaded",
						processed: true,
						valid: true,
						stage: "viabilidad",
						path: "/assets/images/helper02.jpg"
					},
					{
						name: "Financial Statements",
						type: "financial_statements",
						status: "uploaded",
						processed: true,
						valid: false,
						stage: "evaluacion",
						path: "/assets/images/helper01.jpg"
					},
					{
						name: "Market Analysis",
						type: "market_analysis",
						description: "Market Analysis",
						status: null,
						processed: false,
						valid: false,
						stage: "evaluacion",
						helper: {
							title: "Market Analysis document",
							footer: "This document is required to evaluate the market analysis of the project.",
						},
						path: null
					},
					{
						name: "Project Timeline",
						type: "project_timeline",
						status: null,
						processed: false,
						valid: false,
						stage: "evaluacion",
						path: null
					}
				],
				mockWorkers: [
					{
						name: "John Smith",
						position: "Project Manager",
						email: "john.smith@example.com",
						phone: "555-123-4567"
					},
					{
						name: "Maria Rodriguez",
						position: "Financial Analyst",
						email: "maria.rodriguez@example.com",
						phone: "555-987-6543"
					}
				]
			}
		},
		methods: {
			uploadedDocument: function( doc ){
				doc.status = "uploaded"
				doc.processing = true
				this.$swal("Success!", "The document has been uploaded successfully. It is now being processed to verify its validity.", "success")

				/*	Check if all pending documents have been uploaded 	*/
				for(let doc of this.mockDocuments)
					if( doc.status != "uploaded" )
						return true // End function execution

				// If code continues here, it means all documents have been uploaded
				this.$emit("ready")
				
			},
			addWorker: function( worker ) {
				this.mockWorkers.push(worker)
				this.$emit("newWorker", worker)
			},
		},
		computed: {
			pendingDocs: function() {
				// Use mockDocuments instead of store data for demo
				return this.mockDocuments.filter(doc => !doc.status || (doc.processed && !doc.valid))
			},
			viabilidadDocs: function() {
				let documents = this.pendingDocs //array
				let filtered = documents.filter(doc => doc.stage == 'viabilidad')

				return filtered
			},
			evaluacionDocs: function() {
				let documents = this.pendingDocs //array
				let filtered = documents.filter(doc => doc.stage == 'evaluacion')
				
				return filtered
			},
			isViabilityCompleted: function() {
				// Check if all viability documents are processed and valid
				const viabilityDocs = this.mockDocuments.filter(doc => doc.stage == 'viabilidad')
				for(let doc of viabilityDocs)
					if(!doc.processed || !doc.valid)
						return false
				return true
			},	
			isEvaluacionCompleted: function() {
				// For demo purposes, we'll make this return true to show all steps
				return true
			},		
			isReady: function() {
				// For demo purposes, we'll make this return false to show the stepper
				return false
			},
		},
		mounted(){
			// Mock setting data that would normally come from the store
			if(this.$store && this.$store.getters && !this.$store.getters.currentProject) {
				// If store exists but no current project, we could mock it here
				// This is just a safety check for demo purposes
			}
			
			/*	Set step based on mock data	*/
			// For demo purposes, let's start at step 2
			this.step = 2
		},
		components: {
			Uploader,
			WorkerAddCard,
			WorkerCard,
			Financiamiento
		}
	}
</script>

<style lang="sass">
	.project-publisher
		.step-header
			margin-bottom: 20px
			.description
				font-size: 16px
				color: #555
		.step-subcontent
			padding: 10px
			
</style>
