<template lang="pug">
	v-dialog(content-class="edit-rate-project-dialog", persistent, :value="show", max-width="600")
		v-card
			v-card-title.mb-8
				|Editando: {{ $catalog[ doc.type ].name }}
			v-card-text.pb-0
				v-slider(
					:thumb-size="40",
					:color="color",
					:thumb-color="color",
					min="1",
					max="10",
					hide-details,
					step="1",
					ticks="always",
					tick-size="4",
					:tick-labels="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]",
					v-model="input.rate"
					thumb-label="always")
				p.text-center.mt-4
					v-chip.detalle(:color="color", dark)
						|{{ text }}
				v-textarea.mt-2(
					auto-grow,
					label="Notas adicionales",
					outlined,
					v-model="input.notes")

			v-card-actions
				v-spacer
				v-btn(color="secondary", text, @click="$emit('close')")
					|Regresar
				v-btn(color="primary", @click="rate", :loading="status.loading")
					|Ponderar
</template>

<script>
	export default {
		props: ["show", "doc", "developer", "_id"],
		data() {
			return {
				status: {
					loading: false
				},
				input:{
					rate: this.doc.rate,
					notes: ""
				}
			}
		},
		computed: {
			color: function() {
				if( this.input.rate == 10)
					return "#038523"
				else if( this.input.rate < 10 && this.input.rate > 6)
					return "#8db01a"
				else if( this.input.rate <= 6 && this.input.rate > 3)
					return "#a6a002"
				else if( this.input.rate <= 3 && this.input.rate > 1)
					return "#a87c03"
				else
					return "#a80303"
			},
			text: function() {
				switch(this.input.rate){
					case 1:
						return "Sin cumplimiento con contexto en contra"
					case 2:
						return "Sin cumplimiento con contexto neutro"
					case 3:
						return "Sin cumplimiento contexto a favor"
					case 4:
						return "Cumplimiento parcial con contexto en contra"
					case 5:
						return "Cumplimiento parcial con contexto neutro"
					case 6:
						return "Cumplimiento parcial con contexto a favor"
					case 7:
						return "Cumplimiento con contexto en contra"
					case 8:
						return "Cumplimiento con contexto neutro"
					case 9:
						return "Cumplimiento con contexto a favor"
					case 10:
						return "Cumplimiento sobresaliente"
				}
			}
		},
		methods: {
			rate: function() {
				this.status.loading = true
				const body = this.input

				this.$projects.put(`/project/${this._id}/document-rate/${this.doc.type}`, body)
				.then(result => this.$emit("edited", result.data.rate ) )
				.catch( err => this.$report( err, {swal: true}) )
				.finally( () => this.status.loading = false )

			}
		}
	}
</script>

<style lang="sass">
	.edit-rate-project-dialog
		.v-slider
			.v-slider__thumb-container
				.v-slider__thumb-label-container
					span
						margin-top: 7px
						display: inline-block
						font-size: 1.3rem
						font-weight: bold
			.v-slider__ticks-container
				.v-slider__tick,.v-slider__tick.v-slider__tick--filled
					background-color: rgba(0, 0, 0, 0.25) !important
		.detalle
			font-weight: bold
</style>