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
					|Viabilidad Legal o Jurídica
				v-divider
				v-stepper-step(
					:editable="!isEvaluacionCompleted",
					step="2",
					v-show="isViabilityCompleted"
					:complete="isEvaluacionCompleted")
					|Evaluación Cuantitativa y Cualitativa
				v-divider
				v-stepper-step(
					editable,
					v-show="isEvaluacionCompleted",
					step="3")
					|Montos de financiamiento y Garantía Inmobiliaria
			v-stepper-items
				v-stepper-content.elevation-0(step="1")
					.step-header
						.description.mb-2
							|Sube los documentos solicitados por las Disposiciones de carácter general a las que se refiere el artículo 58 de la LRITF.
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
							|Sube los documentos solicitados por las Disposiciones de Carácter General Aplicables a las Instituciones de Tecnología Financiera.
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
									|Líder de proyecto y personal de la primera línea jerárquica:
						transition-group(name="slide-x-transition", class="row" tag="div", mode="out-in")
							v-col(cols="12", sm="6", md="4", xl="3", v-for="(worker, index) in $store.getters.currentProject.workers", :key="worker.name")
								worker-card(:worker="worker", :index="index")
							v-col.pb-10(cols="12", sm="6", md="4", xl="3", key="-1")
								worker-add-card(@add="addWorker")

				v-stepper-content.elevation-0(step="3")
					.step-subcontent
						financiamiento(v-model="cobertura", v-if="$store.getters.currentProject.stage == 'montos'")
		v-card(v-else)
			v-card-text
				v-alert.text-center(color="success", dark, icon="mdi-check")
					|Por el momento no tienes documentos documentos o informacion pendientes por subir.

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
				cobertura: 0
			}
		},
		methods: {
			uploadedDocument: function( doc ){
				doc.status = "uploaded"
				doc.processing = true
				this.$swal("¡Listo!", "El documento ha sido subido correctamente. En este momento está siendo procesado para comprobar su validez.", "success")

				/*	Revisa que todos los documentos pendientes se hayan subido 	*/
				for(let doc of this.$store.getters.currentProject.documents)
					if( doc.status != "uploaded" )
						return true // Termina la ejecución de la función

				// Si el código continúa aquí significa que todos los documentos han sido subidos
				this.$emit("ready")
				
			},
			addWorker: function( worker ) {
				this.$emit("newWorker", worker)
			},
		},
		computed: {
			pendingDocs: function() {
				if(this.$store.getters.currentProject && this.$store.getters.currentProject.documents ){
					return this.$store.getters.currentProject.documents.filter(doc => !doc.status || (doc.processed && !doc.valid))
				}else
					return []

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
				for(let doc of this.viabilidadDocs)
					if( !doc.processed || !doc.valid )
						return false
				return true
			},	
			isEvaluacionCompleted: function() {
				return this.$store.getters.currentProject.stage == "montos"
			},		
			isReady: function() {
				let ready = true
				if( this.$store.getters.currentProject && this.$store.getters.currentProject.documents ){
					
					/*	Revisa que todos los documentos habilitados se hayan subido 	*/
					if(this.$store.getters.currentProject.stage == 'evaluacion')
						ready = false
					else
						for(let doc of this.$store.getters.currentProject.documents){
							if( doc.status != "uploaded" )
								ready = false // Termina la ejecución de la función
						}

				}else
					ready = false

				return ready
			},
		},
		mounted(){
			this.renovateSession()
			
			/*	Set step 	*/
			switch( this.$store.getters.currentProject.stage ){
				case "viabilidad":
					this.step = 1
					break
				case "evaluacion":
					this.step = 2
					break
				case "montos":
					this.step = 3
					break
			}
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
	
</style>
