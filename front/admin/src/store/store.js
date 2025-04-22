import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
	state: {
		user: 			{},
		lastAction: 	null,
		isSessionActive:false,
		renovating: 	false,
		checkingSession:false,
		companies: 		[],
		currentProject: {
			title: "Cargando información...",
			progress: null,
			totalInvested: null,
			updates: [],
			description: null,
			developer: {}
		},
		currentDeveloper: {}
	},
	mutations: {
		/*	User*/
		setUser(state, user){
			if(state.user.profilePicture)
				user.profilePicture = state.user.profilePicture

			state.user = user
		},
		setUserData(state, {key, value}){
			state.user[ key ] = value
		},
		setSecurityQuestions(state, quantity){
			state.user.securityQuestions = quantity
		},
		setTFA(state, status){
			state.user.tfa = status
		},
		setSessionActive(state, status){
			state.isSessionActive = status
		},
		setSecretImage(state, status){
			state.user.secretImage = true
		},
		setRenovationStatus(state, status){
			state.renovating = status
		},
		setCheckingSession(state, status){
			state.checkingSession = status
		},
		setCompanies(state, companies){
			state.companies = companies
		},

		/*	Projects 	*/
		setCurrentProject(state, project){
			state.currentProject = project
		},
		rateCurrentProject(state, {rate, index}){
			state.currentProject.documents[ index ].rate = rate
			state.currentProject.documents[ index ].processed = true
			state.currentProject.documents[ index ].valid = true
			state.currentProject.documents[ index ].processing = false

		},
		/*	Developer 	*/
		setCurrentDeveloper(state, developer){
			state.currentDeveloper = developer
		},
	},
	getters: {
		user: 					state => state.user,
		lastAction: 			state => state.lastAction,
		isSessionActive: 		state => state.isSessionActive,
		renovating: 			state => state.renovating,
		checkingSession: 		state => state.checkingSession,
		companies: 				state => state.companies,
		currentProject: 		state => state.currentProject,
		currentDeveloper: 		state => state.currentDeveloper,
	}

})