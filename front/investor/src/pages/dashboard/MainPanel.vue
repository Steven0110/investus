<template lang="pug">
	.main-panel
		v-container
			h1.display-1.mb-4 Dashboard Overview
			v-row
				v-col(cols="12", sm="6", lg="3")
					v-card(elevation="2", class="mb-4")
						v-card-title(class="primary white--text") Projects
						v-card-text(class="text-center")
							div.display-2.mt-2 8
							div.subtitle-1 Active Investments

				v-col(cols="12", sm="6", lg="3")
					v-card(elevation="2", class="mb-4")
						v-card-title(class="success white--text") Total Invested
						v-card-text(class="text-center")
							div.display-2.mt-2 $256,450
							div.subtitle-1 Total Portfolio Value

				v-col(cols="12", sm="6", lg="3")
					v-card(elevation="2", class="mb-4")
						v-card-title(class="info white--text") Returns
						v-card-text(class="text-center")
							div.display-2.mt-2 15.4%
							div.subtitle-1 Avg. Annual Return

				v-col(cols="12", sm="6", lg="3")
					v-card(elevation="2", class="mb-4")
						v-card-title(class="warning white--text") Expected Dividends
						v-card-text(class="text-center")
							div.display-2.mt-2 $12,320
							div.subtitle-1 Next Quarter

			v-row
				v-col(cols="12", md="8")
					v-card(elevation="2", class="mb-4")
						v-card-title Expected Revenue (Next 12 Months)
						v-card-text
							.revenue-chart
								.chart-legend.mb-4
									.d-flex.align-center.mb-2
										v-avatar(size="12", color="primary", class="mr-2")
										span Projected Revenue
									.d-flex.align-center
										v-avatar(size="12", color="success", class="mr-2")
										span Actual Revenue 
								
								.chart-container
									.y-axis
										.y-label(v-for="val in yAxisLabels") {{ val }}
									.chart-area
										.projected-chart
											v-sparkline(
												:value="revenueData",
												:gradient="['#1976D2', '#2196F3']",
												:labels="revenueLabels",
												auto-draw
												auto-line-width
												padding="16"
												stroke-linecap="round"
												line-width="2"
												show-labels
												height="160"
											)
										.actual-chart
											v-sparkline(
												:value="actualRevenueData", 
												:gradient="['#4CAF50', '#81C784']",
												padding="16"
												line-width="2"
												stroke-linecap="round"
												height="160"
											)
									.y-axis-title Revenue ($)
								
								.text-center.mt-5 Monthly Projected and Actual Revenue

				v-col(cols="12", md="4")
					v-card(elevation="2", class="mb-4")
						v-card-title Project Distribution
						v-card-text(class="distribution-container")
							.distribution-chart
								.chart-legend
									.d-flex.flex-column
										.d-flex.align-center.mb-2(v-for="item in portfolioItems", :key="item.name")
											v-avatar(size="12", :color="item.color", class="mr-2")
											span {{ item.name }}: {{ item.value }}%
								.progress-bars
									.distribution-item(v-for="item in portfolioItems", :key="item.name")
										.label {{ item.name }}
										v-progress-linear(
											:value="item.value",
											height="20",
											:color="item.color",
											background-color="grey lighten-3",
											class="mb-3"
										)
											template(v-slot:default="{ value }")
												strong {{ value }}%

			v-row
				v-col(cols="12")
					v-card(elevation="2", class="mb-4")
						v-card-title Latest Investments
						v-card-text
							v-data-table(
								:headers="latestInvestmentsHeaders",
								:items="latestInvestments",
								:items-per-page="5")
								template(v-slot:item.status="{ item }")
									v-chip(:color="statusColor(item.status)", dark) {{ item.status }}
</template>

<script>
	export default {
		data() {
			return {
				revenueLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
				revenueData: [4200, 4500, 5100, 4900, 6000, 7000, 7500, 8200, 8900, 9500, 10200, 11000],
				actualRevenueData: [4300, 4600, 5200, 5000, 6100, 7200, 0, 0, 0, 0, 0, 0],
				yAxisLabels: ['$0', '$2,000', '$4,000', '$6,000', '$8,000', '$10,000', '$12,000'],
				
				portfolioItems: [
					{ name: 'Real Estate', value: 42, color: '#1976D2' },
					{ name: 'Technology', value: 23, color: '#4CAF50' },
					{ name: 'Renewable Energy', value: 15, color: '#FF9800' },
					{ name: 'Retail', value: 12, color: '#9C27B0' },
					{ name: 'Hospitality', value: 8, color: '#F44336' },
				],

				latestInvestmentsHeaders: [
					{ text: 'Project', value: 'project' },
					{ text: 'Date', value: 'date' },
					{ text: 'Amount', value: 'amount' },
					{ text: 'Status', value: 'status' },
					{ text: 'Expected Return', value: 'return' },
				],
				latestInvestments: [
					{
						project: 'Commercial Building A',
						date: '2023-08-15',
						amount: '$45,000',
						status: 'active',
						return: '12%',
					},
					{
						project: 'Residential Complex B',
						date: '2023-06-22',
						amount: '$30,000',
						status: 'active',
						return: '15%',
					},
					{
						project: 'Tech Startup X',
						date: '2023-05-10',
						amount: '$75,000',
						status: 'funding',
						return: '22%',
					},
					{
						project: 'Solar Energy Plant',
						date: '2023-03-18',
						amount: '$50,000',
						status: 'active',
						return: '18%',
					},
					{
						project: 'Retail Center Expansion',
						date: '2023-01-30',
						amount: '$65,000',
						status: 'completed',
						return: '14%',
					},
					{
						project: 'Hotel Development',
						date: '2022-11-15',
						amount: '$80,000',
						status: 'active',
						return: '16%',
					},
				]
			}
		},
		mounted() {
		},
		methods: {
			statusColor(status) {
				if (status === 'active') return 'success'
				if (status === 'funding') return 'warning'
				if (status === 'completed') return 'info'
				return 'primary'
			}
		}
	}
</script>

<style lang="sass">
	.main-panel
		padding: 20px
		.v-card
			transition: all 0.3s
			&:hover
				transform: translateY(-5px)
				box-shadow: 0 5px 15px rgba(0,0,0,0.1) !important
		.v-card__title.primary,
		.v-card__title.success,
		.v-card__title.info,
		.v-card__title.warning
			font-weight: 700
		
		.revenue-chart
			display: flex
			flex-direction: column
			height: 100%
			
			.chart-container
				position: relative
				display: flex
				height: 350px
				margin-left: 10px
				
				.y-axis
					display: flex
					flex-direction: column
					justify-content: space-between
					padding-right: 10px
					font-size: 12px
					color: #666
					
					.y-label
						height: 20px
						display: flex
						align-items: center
				
				.chart-area
					flex-grow: 1
					position: relative
					
					.projected-chart, .actual-chart
						position: absolute
						top: 0
						left: 0
						width: 100%
						height: 100%
				
				.y-axis-title
					position: absolute
					transform: rotate(-90deg)
					left: -40px
					top: 50%
					font-weight: 500
					color: #666
			
		.distribution-container
			display: flex
			flex-direction: column
			height: 100%
			
			.distribution-chart
				height: 100%
				display: flex
				flex-direction: column
				
				.chart-legend
					margin-bottom: 20px
				
				.progress-bars
					flex-grow: 1
					
					.distribution-item
						margin-bottom: 15px
						
						.label
							font-weight: 600
							margin-bottom: 5px
			
	@media only screen and (min-width: 1904px)
	@media only screen and (max-width: 1903px)
	@media only screen and (max-width: 1264px)
	@media only screen and (max-width: 960px)
	@media only screen and (max-width: 600px)
		.main-panel
			padding: 10px
</style>