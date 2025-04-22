<template lang="pug">
	v-col(cols="12", md="3", lg="4", xl="3")
		v-card.project-card(min-height="320")
			v-img(:src="projectImage", height="200", lazy-src="/assets/images/image-loader.jpg")
				v-progress-linear(:value="project.progress", height="25", absolute, bottom, color="#176580", v-show="project.status != 'new'")
					strong.white--text
						|{{project.progress}}%
				template(v-slot:placeholder)
					v-row.fill-height.ma-0(align="center", justify="center")
						v-progress-circular(indeterminate, color="grey lighten-5")
			v-card-title
				|{{ project.title }}
				.project-status
					.status-indicator(:style="statusColor")
					.status-text
						|{{ statusText }}
			v-card-text(v-if="project.description")
				.project-description
					|{{ truncatedDescription }}
			v-card-actions
				v-spacer
				//v-tooltip(bottom)
				v-tooltip(bottom, v-if="project.status == 'waiting'")
					template(v-slot:activator="{ on, attrs }")
						v-icon(right, @click="deleteDraft", v-bind="attrs", v-on="on", color="#b03930")
							|mdi-delete
					span
						|Delete draft
				v-tooltip(bottom, v-if="project.status == 'publishing'")
					template(v-slot:activator="{ on, attrs }")
						v-icon(right, @click="$router.push({path: `/dashboard/proyecto/visualizar/${project._id}`})", v-bind="attrs", v-on="on", color="primary")
							|mdi-eye
					span
						|View project
				v-tooltip(bottom, v-if="project.status != 'revision'")
					template(v-slot:activator="{ on, attrs }")
						v-icon(right, @click="$router.push({path: `/dashboard/proyecto/publicacion/${project._id}`})", v-bind="attrs", v-on="on", color="primary")
							|mdi-file-document-edit
					span
						|Review publication process

</template>

<script>

	export default {
		props: ["project"],
		methods: {
		},
		computed: {
			projectImage: function() {
				return this.project.mainImage || "/assets/images/project-default.png"
			},
			truncatedDescription: function() {
				if (!this.project.description) return ""
				return this.project.description.length > 100 
					? this.project.description.substring(0, 97) + "..." 
					: this.project.description
			},
			statusColor: function() {
				let style = {}
				switch(this.project.status){
					case "revision":
						style["background-color"] = "#f2a556"
						break
					case "error":
						style["background-color"] = "#e84337"
						break
					case "published":
					case "active":
						style["background-color"] = "#75cd51"
						break
					case "waiting":
					case "pending":
						style["background-color"] = "#3d63ee"
						break
					case "new":
					default:
						style["background-color"] = "#b7c9c7"
						break
					case "completed":
						style["background-color"] = "#65b0d5"
						break
				}

				return style
			},
			statusText: function() {
				switch(this.project.status){
					case "revision":
						return "Under Review"
					case "waiting":
					case "pending":
						return "Documentation"
					case "error":
						return "Rejected"
					case "published":
					case "active":
						return "Published"
					case "finished":
					case "completed":
						return "Completed"
					case "new":
						return "Draft"
					default:
						return "Undefined"
				}
			}
		},
		filters: {
			currency: function( value ) {
				return parseFloat(value).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
			},
		},
		methods: {
			deleteDraft: function() {

				this.$swal({
					title: "Are you sure you want to delete this draft?",
					text: "You won't be able to recover the information you've saved",
					type: "warning",
					confirmButtonText: "Yes.",
					cancelButtonText: "No, cancel.",
					showLoaderOnConfirm: true,
					showCancelButton: true,
					reverseButtons: true,
					preConfirm: () => {
						// Mock deletion for demo
						return new Promise(resolve => {
							setTimeout(() => {
								resolve({ data: { success: true } })
							}, 1000)
						})
					}
				})
				.then(result => {
					if( result && result.value && result.value.data ){
						if(this.renovateSession) this.renovateSession()
						this.$swal("Project successfully deleted", "", "success")
						this.$emit("delete")
					}else if(!result.dismiss)
						this.$swal("Error", "There was an error deleting the draft, please try again.", "warning")
				}).
				catch(err => {
					console.error( err )
					this.$swal("Error", "There was an error deleting the draft, please try again.", "warning")
					if(this.$sentry) this.$sentry.captureException( new Error(err) )
				})
			}
		}
	}
</script>

<style lang="sass">
	.project-card
		.v-card__title
			position: relative
			padding-right: 120px
			.project-status
				position: absolute
				top: 15px
				right: 20px
				.status-indicator
					display: inline-block
					height: 13px
					width: 13px
					border-radius: 50%
					margin-right: 5px
				.status-text
					display: inline-block
					font-size: 1rem
					font-weight: 400

		.project-description
			font-size: 0.9rem
			color: #666
			font-style: italic
		.project-specs
			text-align: center
			.project-spec-title
				text-transform: uppercase
				font-family: Raleway
				font-weight: 800
				color: #777
			.project-spec-value
				color: #B05900
				font-weight: 600
				font-size: 1.25rem
</style>