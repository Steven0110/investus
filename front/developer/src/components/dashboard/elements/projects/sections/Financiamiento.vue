<template lang="pug">
	.financiamiento
		v-row
			v-col(cols="12", md="4")
				v-card
					v-card-text
						v-text-field(v-model="input.goal.amount", type="number", label="Monto a financiar (MXN)" prepend-icon="mdi-currency-usd", outlined, @change="changeGoal")
						v-text-field(:value="warranty", label="Garantía inmobiliaria", type="number", prepend-icon="mdi-currency-usd", outlined, disabled, hide-details)
			v-col(cols="12", md="8")
				v-card
					v-card-title
						|Cobertura de financiamiento
					v-card-text
						v-row
							v-col(cols="6")
								.cobertura
									v-chip(color="secondary")
										|{{ warranty | currency }}
									v-divider.mt-2.mb-2.mr-8
									v-chip(color="secondary")
										|{{ input.goal.amount || 0 | currency }}
									.equals
										|=
							v-col(cols="6")
								.resultado
									v-chip(color="primary", absolute)
										|{{ coverage }}

		v-row.pt-4.pb-4
			v-col(cols="12")
				h3.text-center
					|Propiedades para garantía inmobiliaria:
			v-col(cols="12")
				v-row
					v-spacer
					v-btn(color="primary", @click="addEstate", :loading="status.loading")
						|Agregar propiedad
						v-icon
							|mdi-plus
					v-spacer
		transition-group(name="slide-x-transition", class="row" tag="div", mode="out-in")
			v-col(cols="12", sm="6", md="4", xl="3", v-for="(estate, index) in $store.getters.currentProject.estates", :key="estate.estateId")
				estate-card(:estate="estate", :index="index")
</template>

<script>
	import EstateAddCard 	from "@/components/dashboard/elements/projects/creators/EstateAddCard.vue"
	import EstateCard 		from "@/components/dashboard/elements/projects/creators/EstateCard.vue"

	export default {
		props: ["value"],
		data() {
			return {
				status: {
					loading: false
				},
				input: {
					goal: {
						amount: null
					},
					warranty: 0
				}
			}
		},
		methods: {
			addEstate: function( estate ) {
				this.status.loading = true

				this.$projects.get(`add-estate/${this.$store.getters.currentProject._id}`)
				.then( ({data}) => this.$store.commit("addEstate", data.estate))
				.catch( err => this.$report( err, {swal: true}) )
				.finally( () => this.status.loading = false)
			},
			changeGoal: function(value) {
				this.$store.commit("setProjectData", {key: "goal", value: Number(value)})
			}
		},
		computed: {
			coverage: function() {
				return Number(parseFloat(this.warranty / (this.input.goal.amount || this.warranty)).toFixed(2))
			},
			warranty: function() {
				let sum = 0
				for(let estate of this.$store.getters.currentProject.estates )
					sum += Number( estate.value )

				return Number( parseFloat( sum ).toFixed(2) )
			}
		},
		filters: {
			currency: value => "$" + parseFloat(value).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " MXN"
		},
		components: {
			EstateAddCard,
			EstateCard,
		}
	}
</script>

<style lang="sass">
	.financiamiento
		.cobertura
			position: relative
			text-align: center
			.equals
				position: absolute
				display: inline-block
				right: 0
				top: 0
				bottom: 0
				margin-top: auto
				margin-bottom: auto
				font-size: 3em
				height: 25px
				color: #d7d7d7
		.resultado
			.v-chip
				position: absolute
				font-size: 2em
				top: 40px
				bottom: 0
				margin-top: auto
				margin-bottom: auto
				height: 30px
				padding-left: 25px
				padding-top: 25px
				padding-right: 25px
				padding-bottom: 25px


</style>