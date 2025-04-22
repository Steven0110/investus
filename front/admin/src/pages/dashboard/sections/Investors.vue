<template lang="pug">
	.investors-subpanel
		.subpanel-title.d-none.d-md-block
			|Investors
		.subpanel-description
			|In this section you can view and manage the platform's investors
		.content
			v-data-table.investors-table(
				:headers="headers",
				:items="investors",
				loading-text="Loading information...",
				no-result-text="No registered investors",
				:footer-props="{'items-per-page-text': 'Show:'}"
				no-data-text="No registered investors",
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
					v-chip(color="green darken-1", v-else)
						|{{ item.pendingDocuments }}

				template(v-slot:item._id="{ item }")
					.actions
						v-tooltip(bottom, max-width="300px")
							template(v-slot:activator="{ on, attrs }")
								v-icon.ml-2(color="primary", v-bind="attrs", v-on="on", @click="viewFiles( item._id )")
									|mdi-file
							span
								|Review documents
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

	export default {
		data() {
			return {
				investors: [],
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
						this.investors = [
							{
								_id: "inv1",
								name: "John Smith",
								username: "john.smith@example.com",
								type: "fisica",
								active: true,
								verified: true,
								pendingDocuments: 0,
								investedAmount: 350000,
								investedProjects: 3,
								createdAt: new Date("2023-05-15")
							},
							{
								_id: "inv2",
								name: "Acme Investments LLC",
								username: "investments@acme.com",
								type: "moral",
								active: true,
								verified: true,
								pendingDocuments: 0,
								investedAmount: 1250000,
								investedProjects: 5,
								createdAt: new Date("2023-02-10")
							},
							{
								_id: "inv3",
								name: "Sarah Johnson",
								username: "sarah.j@example.com",
								type: "fisica",
								active: true,
								verified: false,
								pendingDocuments: 2,
								investedAmount: 150000,
								investedProjects: 1,
								createdAt: new Date("2023-09-22")
							},
							{
								_id: "inv4",
								name: "Global Partners Fund",
								username: "contact@gpfund.com",
								type: "moral",
								active: true,
								verified: true,
								pendingDocuments: 0,
								investedAmount: 3000000,
								investedProjects: 8,
								createdAt: new Date("2022-11-05")
							},
							{
								_id: "inv5",
								name: "Michael Chen",
								username: "mike.chen@example.com",
								type: "fisica",
								active: false,
								verified: false,
								pendingDocuments: 3,
								investedAmount: 0,
								investedProjects: 0,
								createdAt: new Date("2023-10-30")
							},
							{
								_id: "inv6",
								name: "Pinnacle Real Estate Group",
								username: "info@pinnacle-re.com",
								type: "moral",
								active: true,
								verified: true,
								pendingDocuments: 1,
								investedAmount: 750000,
								investedProjects: 2,
								createdAt: new Date("2023-07-18")
							},
							{
								_id: "inv7",
								name: "Emily Rodriguez",
								username: "e.rodriguez@example.com",
								type: "fisica",
								active: true,
								verified: true,
								pendingDocuments: 0,
								investedAmount: 500000,
								investedProjects: 4,
								createdAt: new Date("2023-04-12")
							}
						];
						
						this.status.loading = false;
					}, 1000);
				}
			},
			viewFiles: function(_id) {
				this.$router.push({path: `/dashboard/expediente/${_id}?type=investors`})
			},
			updateUser: function(user) {
				let index = this.investors.map(c => c._id).indexOf(user._id)
				this.investors[ index ] = user
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
							const index = this.investors.findIndex(inv => inv._id === user._id);
							if (index !== -1) {
								this.investors[index].active = false;
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
	.investors-subpanel
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