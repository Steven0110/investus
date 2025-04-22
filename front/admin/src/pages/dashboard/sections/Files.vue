<template lang="pug">
	.files-panel
		.panel-header
			v-icon(left, color="black", large, @click="goBack")
				|mdi-chevron-left
			span.panel-title
				|User Documents: {{ userData.name }}
			v-chip(color="primary", v-if="userData.type === 'fisica'")
				|Natural Person
			v-chip(color="primary", v-if="userData.type === 'moral'")
				|Legal Entity

		v-row
			v-col(cols="12", md="4")
				v-card.document-list
					v-card-title
						|Documents
						v-spacer
						v-chip(:color="pendingColor", small) {{ pendingLabel }}
					v-card-text
						v-list
							v-list-item(
								v-for="(doc, index) in documents", 
								:key="index", 
								@click="selectDocument(doc)",
								:class="{ 'selected-document': selectedDocument === doc }")
								v-list-item-icon
									v-icon(:color="getDocumentIcon(doc).color") {{ getDocumentIcon(doc).icon }}
								v-list-item-content
									v-list-item-title {{ doc.name }}
									v-list-item-subtitle {{ doc.status }}
									v-list-item-subtitle {{ formatDate(doc.uploadedAt) }}
			
			v-col(cols="12", md="8")
				v-card.document-viewer(v-if="selectedDocument")
					v-card-title
						|{{ selectedDocument.name }}
						v-spacer
						v-chip(:color="getStatusColor(selectedDocument.status)") {{ selectedDocument.status }}
					v-card-text
						v-row
							v-col(cols="12")
								.document-preview
									v-img(
										v-if="selectedDocument.type === 'image'",
										:src="selectedDocument.url",
										max-height="400",
										contain)
									.pdf-preview(v-else-if="selectedDocument.type === 'pdf'")
										v-img(
											src="/assets/images/project-default.png",
											height="400",
											width="100%",
											class="grey lighten-2")
										.pdf-overlay
											v-icon(size="64", color="grey darken-2") mdi-file-pdf-box
											.pdf-text PDF Document
									.doc-preview(v-else)
										v-img(
											src="/assets/images/project-default.png",
											height="400",
											width="100%",
											class="grey lighten-2")
										.doc-overlay
											v-icon(size="64", color="grey darken-2") mdi-file-document
											.doc-text Document
						v-row
							v-col(cols="12")
								v-card-subtitle Document Information
								v-simple-table
									template(v-slot:default)
										tbody
											tr
												td Document Type
												td {{ selectedDocument.documentType }}
											tr
												td Uploaded Date
												td {{ formatDate(selectedDocument.uploadedAt) }}
											tr
												td File Size
												td {{ selectedDocument.size }}
											tr
												td File Type
												td {{ selectedDocument.type.toUpperCase() }}
						v-divider.my-4
						v-row
							v-col(cols="12")
								v-card-subtitle Verification
								v-btn-toggle(v-model="selectedDocument.verificationToggle", mandatory)
									v-btn(outlined, color="success", :value="'approved'")
										v-icon(left) mdi-check
										|Approve
									v-btn(outlined, color="error", :value="'rejected'")
										v-icon(left) mdi-close
										|Reject
								v-textarea.mt-4(
									v-model="selectedDocument.notes",
									outlined,
									label="Verification Notes",
									placeholder="Add notes about document verification here...")
						v-row
							v-col(cols="12", class="text-right")
								v-btn(color="primary", @click="saveVerification") Save Verification
				v-card.empty-state(v-else)
					v-card-text.text-center.pa-8
						v-icon(size="64", color="grey lighten-1") mdi-file-document-outline
						h3.mt-4 Select a document to view
						p.grey--text Click on a document from the list to view and verify it
</template>

<script>
	export default {
		data() {
			return {
				userData: {
					_id: null,
					name: "Loading...",
					type: "fisica"
				},
				documents: [],
				selectedDocument: null,
				loading: false
			}
		},
		computed: {
			pendingColor() {
				const pending = this.documents.filter(doc => doc.status === 'pending').length;
				if (pending === 0) return "success";
				return "warning";
			},
			pendingLabel() {
				const pending = this.documents.filter(doc => doc.status === 'pending').length;
				const total = this.documents.length;
				return `${total - pending}/${total} Verified`;
			}
		},
		methods: {
			goBack() {
				this.$router.go(-1);
			},
			selectDocument(doc) {
				this.selectedDocument = {...doc, verificationToggle: doc.status === 'approved' ? 'approved' : 'rejected', notes: doc.notes || ''};
			},
			getDocumentIcon(doc) {
				const icons = {
					'image': { icon: 'mdi-image', color: 'blue' },
					'pdf': { icon: 'mdi-file-pdf-box', color: 'red' },
					'doc': { icon: 'mdi-file-word', color: 'blue darken-2' },
					'xls': { icon: 'mdi-file-excel', color: 'green' }
				};
				return icons[doc.type] || { icon: 'mdi-file', color: 'grey' };
			},
			getStatusColor(status) {
				switch(status) {
					case 'approved': return 'success';
					case 'rejected': return 'error';
					case 'pending': return 'warning';
					default: return 'grey';
				}
			},
			formatDate(date) {
				return new Date(date).toLocaleDateString('en-US', { 
					year: 'numeric', 
					month: 'short', 
					day: 'numeric' 
				});
			},
			saveVerification() {
				// Update document status
				const index = this.documents.findIndex(doc => doc.id === this.selectedDocument.id);
				if (index !== -1) {
					this.documents[index].status = this.selectedDocument.verificationToggle;
					this.documents[index].notes = this.selectedDocument.notes;
					this.documents[index].verifiedAt = new Date();
					this.selectedDocument = {...this.documents[index], verificationToggle: this.documents[index].status};
				}
				
				// Show success message
				this.$swal({
					title: "Document Verified",
					text: "The document status has been updated",
					type: "success",
					confirmButtonText: "Ok"
				});
			},
			loadUserData() {
				const userId = this.$route.params.id;
				const userType = this.$route.query.type;
				
				// Show loading
				this.loading = true;
				
				// Mock data - simulate loading delay
				setTimeout(() => {
					// Mock user data
					this.userData = {
						_id: userId,
						name: userType === 'investors' ? "John Smith" : "ABC Development Corp",
						type: userType === 'investors' ? "fisica" : "moral",
						email: userType === 'investors' ? "john.smith@example.com" : "info@abcdev.com"
					};
					
					// Mock documents
					this.documents = [
						{
							id: "doc1",
							name: "Government ID",
							documentType: "Identification",
							type: "image",
							url: "/assets/images/project-default.png",
							status: "approved",
							uploadedAt: new Date("2023-09-15"),
							verifiedAt: new Date("2023-09-20"),
							size: "1.2 MB",
							notes: "Valid government ID, properly verified."
						},
						{
							id: "doc2",
							name: "Proof of Address",
							documentType: "Utility Bill",
							type: "pdf",
							url: "#",
							status: "pending",
							uploadedAt: new Date("2023-10-05"),
							size: "850 KB"
						},
						{
							id: "doc3",
							name: "Bank Statement",
							documentType: "Financial",
							type: "pdf",
							url: "#",
							status: "approved",
							uploadedAt: new Date("2023-09-18"),
							verifiedAt: new Date("2023-09-22"),
							size: "1.5 MB",
							notes: "Bank information matches user profile."
						},
						{
							id: "doc4",
							name: "Investment Agreement",
							documentType: "Legal",
							type: "doc",
							url: "#",
							status: "approved",
							uploadedAt: new Date("2023-09-25"),
							verifiedAt: new Date("2023-09-30"),
							size: "320 KB",
							notes: "Signed agreement received."
						},
						{
							id: "doc5",
							name: "Tax ID Certificate",
							documentType: "Identification",
							type: "image",
							url: "/assets/images/project-default.png",
							status: "rejected",
							uploadedAt: new Date("2023-10-02"),
							verifiedAt: new Date("2023-10-04"),
							size: "780 KB",
							notes: "Document is expired. Please upload current version."
						}
					];
					
					// Set default selected document
					if (this.documents.length > 0) {
						this.selectDocument(this.documents[0]);
					}
					
					this.loading = false;
				}, 800);
			}
		},
		mounted() {
			this.loadUserData();
		}
	}
</script>

<style lang="sass">
	.files-panel
		padding: 20px
		
		.panel-header
			display: flex
			align-items: center
			margin-bottom: 20px
			
			.panel-title
				font-size: 24px
				font-weight: 600
				margin-right: 10px
				
		.document-list
			height: 100%
			
			.v-list-item.selected-document
				background-color: rgba(0, 0, 0, 0.05)
				
		.document-viewer
			height: 100%
			
			.document-preview
				position: relative
				background-color: #f5f5f5
				border-radius: 4px
				overflow: hidden
				
			.pdf-overlay, .doc-overlay
				position: absolute
				top: 0
				left: 0
				width: 100%
				height: 100%
				display: flex
				flex-direction: column
				justify-content: center
				align-items: center
				
				.pdf-text, .doc-text
					margin-top: 16px
					font-size: 18px
					color: #424242
					
		.empty-state
			height: 100%
			display: flex
			justify-content: center
			align-items: center
</style>