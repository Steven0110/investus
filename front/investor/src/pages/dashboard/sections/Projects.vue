<template lang="pug">
	.projects-subpanel
		.subpanel-title.d-none.d-md-block
			|Projects
		.subpanel-description
			|In this section you can view available projects and invest in them.
		.content
			filter-bar(v-model="filters", @search="filter", @filter="filter", @sort="filter")

			row-card-loader(:show="status.loading")

			.projects-container.pt-4(v-if="!status.loading")
				transition-group(name="fade-transition", tag="div", class="row")
					project(v-for="project in projects", :project="project", :key="project._id")

				v-pagination(
					v-model="page",
					:length="1",
					@input="filter",
					:total-visible="10")


</template>

<script>
	import Project 		from "@/components/dashboard/elements/projects/Project.vue"
	import FilterBar 	from "@/components/dashboard/elements/projects/FilterBar.vue"
	import Uploader 	from "@/components/tools/files/Uploader.vue"
	import RowCardLoader from "@/components/tools/loader/RowCardLoader.vue"

	export default {
		data() {
			return {
				status: {
					loading: true
				},
				filters: {
					goal: [100000, 10000000],
					sort: "none"
				},
				page: 1,
				projects: [],
			}
		},
		computed: {
		},
		methods: {
			filter: function() {
				let filters = this.filters
				let page = this.page

				this.findProjects()
			},
			findProjects: function() {
				this.projects = []
				this.status.loading = true
				
				// Mock implementation for demo purposes
				setTimeout(() => {
					// Generate mock projects data
					const mockProjects = [
						{
							_id: "proj001",
							title: "Commercial Building A",
							description: "Modern office space in the financial district with high rental potential.",
							shortDescription: 'Modern office space in the financial district with high rental potential.',
							image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
							mainImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
							goal: 3500000,
							raised: 2800000,
							totalInvested: 2800000,
							roi: 12,
							duration: 36,
							risk: 'medium',
							category: "commercial",
							location: "New York, NY",
							progress: 80,
							status: "funding",
							mainVideo: "https://www.youtube.com/watch?v=abcdefgh123",
							gallery: [
								"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
								"https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
								"https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
								"https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
							],
							updates: [
								{
									id: "upd001",
									title: "Construction Begins",
									date: "2023-05-15",
									content: "We're excited to announce that construction has officially begun on the Commercial Building A project. The foundation work is underway and we expect to complete the first phase by August."
								},
								{
									id: "upd002",
									title: "First Floor Completed",
									date: "2023-08-22",
									content: "The first floor of Commercial Building A has been completed ahead of schedule. The steel framework for floors 2-5 is now being installed."
								}
							]
						},
						{
							_id: "proj002",
							title: "Residential Complex B",
							description: "Luxury apartment complex with 200 units in a rapidly growing suburban area.",
							shortDescription: 'Luxury apartment complex with 200 units in a rapidly growing suburban area.',
							image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
							mainImage: "https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
							goal: 8500000,
							raised: 8500000,
							totalInvested: 8500000,
							roi: 15,
							duration: 48,
							risk: 'high',
							category: "residential",
							location: "Austin, TX",
							progress: 100,
							status: "active",
							gallery: [
								"https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
								"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
								"https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
							],
							updates: [
								{
									id: "upd003",
									title: "Project Fully Funded",
									date: "2023-02-10",
									content: "We're thrilled to announce that Residential Complex B has reached its funding goal. Construction will begin next month."
								},
								{
									id: "upd004",
									title: "Phase 1 Completed",
									date: "2023-06-18",
									content: "The first phase of construction has been completed. Foundation and underground parking structure are now in place."
								}
							]
						},
						{
							_id: "proj003",
							title: "Tech Startup X",
							description: "Innovative AI-powered platform for real estate market analysis.",
							shortDescription: 'Innovative AI-powered platform for real estate market analysis.',
							image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
							mainImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
							goal: 1200000,
							raised: 750000,
							totalInvested: 750000,
							roi: 22,
							duration: 24,
							risk: 'low',
							category: "technology",
							location: "San Francisco, CA",
							progress: 62,
							status: "funding",
							mainVideo: "https://www.youtube.com/watch?v=xyz12345",
							gallery: [
								"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
								"https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
								"https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
							],
							updates: [
								{
									id: "upd005",
									title: "Beta Launch",
									date: "2023-04-05",
									content: "The beta version of our platform has been launched to a select group of early users. Initial feedback has been overwhelmingly positive."
								}
							]
						},
						{
							_id: "proj004",
							title: "Solar Energy Plant",
							description: "Renewable energy facility with capacity to power 5,000 homes.",
							shortDescription: 'Renewable energy facility with capacity to power 5,000 homes.',
							image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
							mainImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
							goal: 5000000,
							raised: 4200000,
							totalInvested: 4200000,
							roi: 18,
							duration: 60,
							risk: 'low',
							category: "energy",
							location: "Phoenix, AZ",
							progress: 84,
							status: "active",
							gallery: [
								"https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
								"https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
								"https://images.unsplash.com/photo-1548336151-3dd987003c12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
							],
							updates: [
								{
									id: "upd006",
									title: "Land Acquisition Complete",
									date: "2022-12-20",
									content: "We have successfully acquired all necessary land for the solar plant installation. Environmental impact studies have been completed."
								},
								{
									id: "upd007",
									title: "First Solar Panels Installed",
									date: "2023-03-15",
									content: "Installation of solar panels has begun. The first section is now operational and producing energy."
								}
							]
						},
						{
							_id: "proj005",
							title: "Retail Center Expansion",
							description: "Expansion of successful shopping center to include 15 new store locations.",
							shortDescription: 'Expansion of successful shopping center to include 15 new store locations.',
							image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
							mainImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
							goal: 4500000,
							raised: 3800000,
							totalInvested: 3800000,
							roi: 14,
							duration: 36,
							risk: 'medium',
							category: "retail",
							location: "Chicago, IL",
							progress: 84,
							status: "active",
							gallery: [
								"https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
								"https://images.unsplash.com/photo-1550785555-41d4467b240d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
								"https://images.unsplash.com/photo-1562643389-61afa2753b89?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
							],
							updates: [
								{
									id: "upd008",
									title: "Construction Permit Approved",
									date: "2023-01-10",
									content: "All necessary permits for the expansion have been approved by the city council. Construction will begin next month."
								},
								{
									id: "upd009",
									title: "Framework Complete",
									date: "2023-05-22",
									content: "The structural framework for all 15 new store locations has been completed. Interior work will begin next week."
								}
							]
						},
						{
							_id: "proj006",
							title: "Hotel Development",
							description: "Boutique hotel development in a popular tourist destination.",
							shortDescription: 'Boutique hotel development in a popular tourist destination.',
							image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
							mainImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
							goal: 6800000,
							raised: 5200000,
							totalInvested: 5200000,
							roi: 16,
							duration: 48,
							risk: 'medium',
							category: "hospitality",
							location: "Miami, FL",
							progress: 76,
							status: "funding",
							gallery: [
								"https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
								"https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
								"https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
								"https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
							],
							updates: [
								{
									id: "upd010",
									title: "Design Finalized",
									date: "2023-02-15",
									content: "The architectural designs for the boutique hotel have been finalized and approved. We are now in the process of securing the remaining funding."
								},
								{
									id: "upd011",
									title: "Site Preparation",
									date: "2023-06-10",
									content: "Site preparation has begun. The area has been cleared and foundation work will start next month."
								}
							]
						},
					]
					
					// Apply filters if needed (just simulating for the demo)
					let filteredProjects = [...mockProjects]
					
					if (this.filters.goal) {
						const [min, max] = this.filters.goal
						filteredProjects = filteredProjects.filter(p => p.goal >= min && p.goal <= max)
					}
					
					if (this.filters.sort === "roi_high") {
						filteredProjects.sort((a, b) => b.roi - a.roi)
					} else if (this.filters.sort === "roi_low") {
						filteredProjects.sort((a, b) => a.roi - b.roi)
					} else if (this.filters.sort === "goal_high") {
						filteredProjects.sort((a, b) => b.goal - a.goal)
					} else if (this.filters.sort === "goal_low") {
						filteredProjects.sort((a, b) => a.goal - b.goal)
					}
					
					// Simulate pagination (for demo purposes)
					const startIndex = (this.page - 1) * 6
					const paginatedProjects = filteredProjects.slice(startIndex, startIndex + 6)
					
					// Add projects one by one for animation effect
					for (let i = 0; i < paginatedProjects.length; i++) {
						(i => {
							setTimeout(() => {
								this.projects.push(paginatedProjects[i])
							}, 150 * i)
						})(i)
					}
					
					this.status.loading = false
				}, 1000) // Simulate network delay
			}
		},
		mounted(){
			this.findProjects()

			// Define la página actual
			this.page = this.$route.query.page || 1

		},
		components: {
			Uploader,
			RowCardLoader,
			Project,
			FilterBar
		}
	}
</script>

<style lang="sass">
	.projects-subpanel
		.subpanel-title
			text-transform: uppercase
			font-family: Raleway
			letter-spacing: 1px
			color: black
			font-size: 25px
			font-weight: 600
		.subpanel-description
			font-family: Raleway
			font-size: 18px
			color: #444
	@media only screen and (max-width: 600px)
		.projects-subpanel
</style>