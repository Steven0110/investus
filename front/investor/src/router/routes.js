import Login 			from "@/pages/Login.vue"
import Register			from "@/pages/Register.vue"
import Forgot			from "@/pages/Forgot.vue"
import ResetAccount		from "@/pages/ResetAccount.vue"
import Unlock			from "@/pages/Unlock.vue"

/*	Status 	*/
import ValidatedAccount from "@/pages/status/ValidatedAccount.vue"
import ValidateError 	from "@/pages/status/ValidateError.vue"
import UnlockedAccount 	from "@/pages/status/UnlockedAccount.vue"
import UnlockError 		from "@/pages/status/UnlockError.vue"
import ResetNoQuestions from "@/pages/status/ResetNoQuestions.vue"
import InvalidReset 	from "@/pages/status/InvalidReset.vue"

/*	Dashboard Panel 	*/
import Dashboard		from "@/pages/Dashboard.vue"
/*	Dashboard subpanels 	*/
import MainPanel		from "@/pages/dashboard/MainPanel.vue"
import AuthPanel		from "@/pages/dashboard/AuthPanel.vue"
import Maintenance		from "@/pages/dashboard/Maintenance.vue"
import Documents		from "@/pages/dashboard/sections/Documents.vue"
import Projects			from "@/pages/dashboard/sections/Projects.vue"
import ProjectViewer	from "@/pages/dashboard/sections/ProjectViewer.vue"
import Profile			from "@/pages/dashboard/sections/Profile.vue"

export default [
	{
		path: '/',
		redirect: "login",
	},
	{
		path: '/login',
		component: Login,
		name: "Login"
	},
	{
		path: '/register',
		component: Register,
		name: "Registro"
	},
	{
		path: '/forgot',
		component: Forgot,
		name: "Olvidé mi contraseña"
	},
	{
		path: '/reset-account',
		component: ResetAccount,
		name: "Reestablecer"
	},
	{
		path: '/unlock',
		component: Unlock,
		name: "Desbloquear"
	},
	{
		path: '/validated-account',
		component: ValidatedAccount,
		name: "Cuenta validada"
	},
	{
		path: '/validate-error',
		component: ValidateError,
		name: "Error de enlace"
	},
	{
		path: '/unlocked-account',
		component: UnlockedAccount,
		name: "Cuando desbloqueada"
	},
	{
		path: '/unlock-error',
		component: UnlockError,
		name: "Error en desbloqueo"
	},
	{
		path: '/invalid-reset',
		component: InvalidReset,
		name: "Enlace inválido"
	},
	{
		path: '/reset-no-questions',
		component: ResetNoQuestions,
		name: "Error"
	},
	
	/*	Dashboard 	*/
	{
		path: '/dashboard',
		component: Dashboard,
		children: [
			{
				path: '/',
				components: {
					panel: MainPanel
				},
				name: "Dashboard"
			},
			{
				path: 'autenticacion',
				components: {
					panel: AuthPanel
				},
				name: "Autenticación"
			},
			{
				path: 'documentos',
				components: {
					panel: Documents
				},
				name: "Documentos"
			},
			{
				path: 'estado-de-cuenta',
				components: {
					panel: Maintenance
				},
				name: "Estado de cuenta"
			},
			{
				path: 'perfil',
				components: {
					panel: Profile
				},
				name: "Mi perfil"
			},
			{
				path: 'inversiones',
				components: {
					panel: Maintenance
				},
				name: "Mis inversiones"
			},
			{
				path: 'proyectos',
				components: {
					panel: Projects
				},
				name: "Projectos"
			},
			{
				path: 'proyecto/:id',
				components: {
					panel: ProjectViewer
				},
				name: "Proyecto"
			},
		]
	},
];