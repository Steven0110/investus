<template lang="pug">
	.security-questions
		v-card
			v-img(src="/assets/images/question.jpg", :height="imgHeight")
			v-card-title
				|Security Questions
				v-tooltip(top, max-width="500")
					template(v-slot:activator="{ on, attrs }")
						v-icon(right, color="black", v-on="on")
							|mdi-help-circle
					div
						p
							|Security questions help restore your account or password.
						p
							|If you need to reset your password, you'll be asked to answer one of your security questions, and then the question will be removed.
						p
							|If your account is locked due to 3 failed login attempts, you can unlock it by answering a security question, and then the question will be removed.
						p
							|Once you have no remaining security questions, you can set them up again.
			v-card-subtitle
				|Set up your security questions in case you need to recover your password.
			v-card-actions
				v-spacer
				v-btn(color="#176580", dark, v-if="$store.getters.user.securityQuestions == 0", @click="showConfig = true")
					|Configure Questions
				v-btn(color="green", dark, v-else)
					|Questions Configured
					v-icon(right)
						|mdi-check

		v-dialog(v-model="showConfig", max-width="700", persistent)
			v-card.security-questions-card()
				v-card-title.mb-5
					|Security Questions Configuration
				v-card-text
					v-form(ref="securityQuestionsForm")
						v-row.question(v-for="(q, index) in questions", :key="q.id", align="center", justify="center")
							v-col.pb-0.pt-0(md="6", cols="12")
								v-text-field(
									v-model="q.question",
									label="Secret Question",
									:rules="form.validations.required",
									placeholder="e.g. Name of my first pet",
									name="Question name")
							v-col.pb-0.pt-0(md="5", cols="10")
								v-text-field(
									v-model="q.answer",
									label="Question Answer",
									:rules="form.validations.required",
									name="Question answer")
							v-col.pb-0.pt-0(md="1", cols="2")
								v-icon(color="red", bottom, @click="removeQuestion( index )")
									|mdi-close
							v-col(cols="12")
								v-divider.d-block.d-md-none
					.d-flex
						v-spacer
						v-btn(text, color="blue", @click="addQuestion")
							|Add Question +
						v-spacer
					.d-flex
						v-spacer
						v-alert.text-center(color="orange", ref="questionsAlert", :value="false", dismissible)
							|You need to add at least 2 security questions
						v-spacer
				v-card-actions
					v-spacer
					v-btn(text, color="primary", @click="showConfig = false")
						|Close
					v-btn(color="primary", @click="saveQuestions")
						|Save
</template>

<script>

	export default {
		data() {
			return {
				showConfig: false,
				questions: [],
				form: {
					validations: {
						required: [
				        	v => !!v || 'This field is required',
				      	],
					}
				}
			}
		},
		mounted() {
		},
		methods: {
			addQuestion: function() {
				this.questions.push( {question: "", answer: "", id: this.randomString(10)} )
			},
			sanitizeQuestions: function() {
				for( let i = 0 ; i < this.questions.length ; i++ ){
					this.questions[ i ].question = this.$sanitizer.sanitizeXSS( this.questions[ i ].question )
					this.questions[ i ].answer = this.$sanitizer.sanitizeXSS( this.questions[ i ].answer )
				}
			},
			saveQuestions: function() {
				if( this.$refs.securityQuestionsForm.validate() ){

					if( this.questions.length < 2 )
						this.$refs.questionsAlert.toggle()
					else{
						this.$swal({
							title: "Are you sure these will be your security questions?",
							text: "You won't be able to configure them again until you have no questions left",
							type: "warning",
							confirmButtonText: "Yes, save them",
							cancelButtonText: "Go back",
							showCancelButton: true,
							reverseButtons: true,
							showLoaderOnConfirm: true,
							preConfirm: () => {

								this.sanitizeQuestions() //	Anti-XSS

								return this.$security.post("set-security-questions", {questions: this.questions})
								.then( result => {
									
									this.renovateSession()
									this.$store.commit("setSecurityQuestions", this.questions.length)
									this.showConfig = false


									return this.$swal("Done!", "Security questions have been configured correctly", "success")
								})
								.catch( error => {
									//this.$sentry.captureException( error )
									this.$swal("Something went wrong", "Please try again", "error")
								})
							}
						})
					}
				}
			},
			removeQuestion: function( index ) {
				this.questions.splice( index, 1)
			},
			randomString: function(length) {
			    let result           = ''
			    let universe 		 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
			    let charactersLength = universe.length

			    for( let i = 0; i < length; i++ )
			       result += universe.charAt(Math.floor(Math.random() * charactersLength))

			    return result
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
		}
	}
</script>

<style lang="sass">
	.security-questions
	.security-questions-card
		.question
		.v-card__text
			padding-bottom: 0 !important

	@media only screen and (min-width: 1904px)
	@media only screen and (max-width: 1903px)
	@media only screen and (max-width: 1264px)
	@media only screen and (max-width: 960px)
	@media only screen and (max-width: 600px)

</style>