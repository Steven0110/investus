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
		currentProject: {
			title: "Cargando información...",
			progress: null,
			totalInvested: null,
			updates: [],
			description: null
		}
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

		/*	Projects 	*/
		setCurrentProject(state, project){
			state.currentProject = project
		},
		setCurrentProjectStatus(state, status){
			if( status === true )
				state.currentProject.documents = []
		},
		setProjectData(state, {key, value}){
			state.currentProject[ key ] = value
		},
		setProjectUpdate(state, update){
			state.currentProject.updates.unshift( update )
		},
		addProjectWorker(state, worker){
			state.currentProject.workers.push( worker )
		},
		removeProjectWorker(state, index){
			state.currentProject.workers.splice(index, 1)
		},
		addEstate(state, estate){
			state.currentProject.estates.push( estate )
		},
		updateProjectEstate(state, {index, estate}){
			state.currentProject.estates[ index ].name = estate.name
			state.currentProject.estates[ index ].value = estate.value
		},
		removeProjectEstate(state, index){
			state.currentProject.estates.splice(index, 1)
		},
	},
	getters: {
		user: 					state => state.user,
		lastAction: 			state => state.lastAction,
		isSessionActive: 		state => state.isSessionActive,
		renovating: 			state => state.renovating,
		checkingSession: 		state => state.checkingSession,
		currentProject: 		state => state.currentProject,
	}

})