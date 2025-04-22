<template lang="pug">
	.developers-subpanel
		.subpanel-title.d-none.d-md-block
			|Developers
		.subpanel-description
			|In this section you can view and manage the platform's project developers
		.content
			v-data-table.developers-table(
				:headers="headers",
				:items="developers",
				loading-text="Loading information...",
				no-result-text="No registered requesters",
				:footer-props="{'items-per-page-text': 'Show:'}"
				no-data-text="No registered requesters",
				:loading="status.loading")

				template(v-slot:item.type="{ item }")
					v-chip(color="primary", v-if="item.type == 'fisica'", dark)
						span
							|{{ item.type | persona }}
					v-chip(color="primary", v-else, dark)
						span
							|{{ item.type | persona }}

				template(v-slot:item.active="{ item }")
					v-icon.mr-3(color="green darken-1", v-if="item.active", large)
						|mdi-check-circle
					v-icon.mr-3(color="red darken-1", v-else, large)
						|mdi-close-circle

				template(v-slot:item.verified="{ item }")
					v-icon.mr-3(color="green darken-1", v-if="item.verified", large)
						|mdi-check-circle
					v-icon.mr-3(color="red darken-1", v-else, large)
						|mdi-close-circle

				template(v-slot:item.pendingDocuments="{ item }")
					v-chip(color="secondary", v-if="item.pendingDocuments > 0", dark)
						|{{ item.pendingDocuments }}
					v-chip(color="green darken-1", v-else, dark)
						|{{ item.pendingDocuments }}

				template(v-slot:item._id="{ item }")
					.actions
						v-tooltip(bottom, max-width="300px")
							template(v-slot:activator="{ on, attrs }")
								v-icon(color="primary", v-bind="attrs", v-on="on", @click="")
									|mdi-account
							span
								|Review user account
						v-tooltip(bottom, max-width="300px")
							template(v-slot:activator="{ on, attrs }")
								v-icon.ml-2(color="red darken-2", v-bind="attrs", v-on="on", @click="blockUser(item)")
									|mdi-lock
							span
								|Block user account

		//create(v-model="status.show.create", @add="addCompany")
		//edit(v-model="updateEdit", @update="updateUser")

		v-snackbar(v-model="state.infoSnack", color="primary", dark, bottom)
			template(v-slot:action="{ attrs }")
				v-btn(v-bind="attrs", text)
					v-icon(color="white")
						|mdi-check
			|Change successfully made
</template>

<script>
	//import Create 	from "@/components/dashboard/elements/developers/Create.vue"
	//import Edit 	from "@/components/dashboard/elements/developers/Edit.vue"

	export default {
		data() {
			return {
				developers: [],
				headers: [
					{ text: "Name", value: "name" },
					{ text: "Email", value: "username" },
					{ text: "Person Type", value: "type", align: "center", },
					{ text: "Active?", value: "active", align: "center" },
					{ text: "Verified?", value: "verified", align: "center" },
					{ text: "Pending Documents", value: "pendingDocuments", align: "center" },
					{ text: "Actions", value: "_id", align: "center", sortable: false },
				],
				status: {
					loading: false,
					show: {
					}
				},
				state: {
					infoSnack: false
				},
			}
		},
		methods: {
			init: function() {
				if(!this.status.loading) {
					this.status.loading = true
					
					// Mock data instead of API call
					setTimeout(() => {
						this.developers = [
							{
								_id: "dev1",
								name: "ABC Development Corp",
								username: "info@abcdev.com",
								type: "moral",
								active: true,
								verified: true,
								pendingDocuments: 0,
								projectsSubmitted: 3,
								projectsApproved: 2,
								createdAt: new Date("2022-06-15")
							},
							{
								_id: "dev2",
								name: "Urban Builders LLC",
								username: "projects@urbanbuilders.com",
								type: "moral",
								active: true,
								verified: true,
								pendingDocuments: 1,
								projectsSubmitted: 5,
								projectsApproved: 3,
								createdAt: new Date("2022-09-10")
							},
							{
								_id: "dev3",
								name: "Robert Johnson",
								username: "robert.j@example.com",
								type: "fisica",
								active: true,
								verified: false,
								pendingDocuments: 3,
								projectsSubmitted: 1,
								projectsApproved: 0,
								createdAt: new Date("2023-02-22")
							},
							{
								_id: "dev4",
								name: "Premium Developers",
								username: "info@premiumdev.com",
								type: "moral",
								active: true,
								verified: true,
								pendingDocuments: 0,
								projectsSubmitted: 4,
								projectsApproved: 4,
								createdAt: new Date("2021-11-05")
							},
							{
								_id: "dev5",
								name: "Maria Rodriguez",
								username: "maria.r@example.com",
								type: "fisica",
								active: false,
								verified: false,
								pendingDocuments: 5,
								projectsSubmitted: 0,
								projectsApproved: 0,
								createdAt: new Date("2023-04-30")
							},
							{
								_id: "dev6",
								name: "Integrated Spaces",
								username: "projects@integratedspaces.com",
								type: "moral",
								active: true,
								verified: true,
								pendingDocuments: 0,
								projectsSubmitted: 6,
								projectsApproved: 3,
								createdAt: new Date("2022-08-18")
							},
							{
								_id: "dev7",
								name: "David Smith",
								username: "david.s@example.com",
								type: "fisica",
								active: true,
								verified: true,
								pendingDocuments: 0,
								projectsSubmitted: 2,
								projectsApproved: 1,
								createdAt: new Date("2022-12-12")
							}
						];
						
						this.status.loading = false;
					}, 1000);
				}
			},
			updateUser: function(user) {
				let index = this.developers.map(c => c._id).indexOf(user._id)
				this.developers[ index ] = user
				this.state.infoSnack = true
			},
			blockUser: function(user) {
				this.$swal({
					title: `Are you sure you want to block user ${user.name}?`,
					text: "You can undo this action later.",
					type: "warning",
					confirmButtonText: "Yes, block",
					cancelButtonText: "Cancel",
					showCancelButton: true,
					reverseButtons: true
				})
				.then(result => {
					if(result.value) {
						this.status.loading = true
						
						// Mock API call
						setTimeout(() => {
							// Update user status in the array
							const index = this.developers.findIndex(dev => dev._id === user._id);
							if (index !== -1) {
								this.developers[index].active = false;
							}
							
							this.$swal("Done!", `User ${user.name} has been successfully blocked`, "success");
							this.status.loading = false;
						}, 1000);
					}
				})
			}
		},
		mounted: function() {
			this.init()
		},
		activated: function() {
			this.init()
		},
		filters: {
			persona: value => value == "fisica" ? "Natural Person" : "Legal Entity"
		},
		components: {
			//Create,
			//Edit
		}
	}
</script>

<style lang="sass">
	.developers-subpanel
		.subpanel-title
			text-transform: uppercase
			font-family: Roboto
			letter-spacing: 1px
			color: black
			font-size: 25px
			font-weight: 600
		.subpanel-description
			font-family: Roboto
			font-size: 18px
			color: #444
			margin-bottom: 15px
</style>