<template lang="pug">
	v-col(cols="12", md="3", lg="4", xl="3")
		v-card.project-card(min-height="490")
			v-img(:src="project.mainImage", height="200", lazy-src="/assets/images/image-loader.jpg")
				v-progress-linear(:value="project.progress", height="25", absolute, bottom, color="#176580")
					strong(:style="barColor")
						|{{project.progress}}%
				template(v-slot:placeholder)
					v-row.fill-height.ma-0(align="center", justify="center")
						v-progress-circular(indeterminate, color="grey lighten-5")
				v-chip.project-type(color="#B05900")
					|{{ project.type | type }}
			v-card-title
				|{{ project.title }}
			v-card-text
				.project-location(v-show="project.location", right)
					v-icon(color="#aeaeae", left, small)
						|mdi-map-marker
					|{{ project.location }}
				.project-description(v-html="")
					|{{ project.shortDescription | limit }}
				v-row.project-specs
					v-col.border-right(cols="6")
						.project-spec-title
							|Goal
						.project-spec-value
							|${{ project.goal | currency }}
					v-col.border-right(cols="3")
						.project-spec-title
							|ROI
						.project-spec-value
							|{{ project.roi }}%
					v-col(cols="3")
						.project-spec-title
							|Risk
						.project-spec-value
							.risk-dot(:style="riskColor")
			v-card-actions(bottom, absolute)
				v-spacer
				v-btn(color="#176580", :to="`/dashboard/project/${project._id}`", dark)
					|View details
					v-icon(right)
						|mdi-chevron-right
				v-spacer

</template>

<script>
	export default {
		props: ["project"],
		methods: {
		},
		filters: {
			limit: value => (value || "").length > 80 ? `${value}...` : value,
			type: value => value == "debt" ? "Debt" : "Co-ownership",
			currency: value => parseFloat(value).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
		},
		computed: {
			barColor: function() {
				if( Number(this.project.progress) > 40 )
					return {color: "white"}
				else
					return {color: "#176580"}
			},
			riskColor: function() {
				switch( this.project.risk ){
					case "medium":
						return {"background-color": "#dcaa39"}
					case "high":
						return {"background-color": "#c44545"}
					case "low":
						return {"background-color": "#44d845"}
					default:
						return {"background-color": "#666"}
				}
			}
		}
	}
</script>

<style lang="sass">
	.project-card
		.v-card__title
			padding-top: 35px
			position: relative
			padding-bottom: 5px
		.v-card__text
			padding-bottom: 0
			.project-location
				color: #aeaeae
				font-size: 0.9rem
				text-transform: uppercase
				text-align: right
				margin-bottom: 5px
				i
					margin: 2px
			.project-description
				min-height: 90px
			.project-specs
				text-align: center
				.border-right
					position: relative
					&:before
						content: ''
						position: absolute
						width: 1px
						height: 40px
						right: 0
						top: 25%
						background-color: rgba(0, 0, 0, 0.2)
				.project-spec-title
					text-transform: uppercase
					font-family: Raleway
					font-weight: 800
					color: #777
				.project-spec-value
					color: #B05900
					font-weight: 600
					font-size: 1rem
					text-transform: uppercase
					.risk-dot
						width: 15px
						height: 15px
						background-color: red
						border-radius: 50%
						display: inline-block
		.v-image
			overflow: unset
			.v-progress-linear
				bottom: -25px !important
			.project-type
				text-transform: uppercase
				position: absolute
				top: 10px
				right: 10px
				color: white
				letter-spacing: 1px
				font-weight: 600


</style>