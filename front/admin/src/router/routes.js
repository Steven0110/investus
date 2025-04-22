import Login 			from "@/pages/Login.vue"
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
import Projects			from "@/pages/dashboard/sections/Projects.vue"
//import InvoiceViewer	from "@/pages/dashboard/sections/InvoiceViewer.vue"
import ProjectReviewer 	from "@/pages/dashboard/sections/ProjectReviewer.vue"
import Companies 		from "@/pages/dashboard/sections/Companies.vue"
import Developers 		from "@/pages/dashboard/sections/Developers.vue"
import Investors 		from "@/pages/dashboard/sections/Investors.vue"
import Profile			from "@/pages/dashboard/sections/Profile.vue"
import Files			from "@/pages/dashboard/sections/Files.vue"

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
					panel: Projects
				},
				name: "Proyectos"
			},
			{
				path: 'autenticacion',
				components: {
					panel: AuthPanel
				},
				name: "Autenticación"
			},
			{
				path: 'perfil',
				components: {
					panel: Profile
				},
				name: "Mi perfil"
			},

			/*	Facturas 	*/
			{
				path: 'proyectos',
				components: {
					panel: Projects
				},
				name: "Proyectos"
			},
			/*{
				path: 'factura/visualizar/:id',
				components: {
					panel: InvoiceViewer
				},
				name: "Factura"
			},*/
			{
				path: 'proyecto/revisar/:id',
				components: {
					panel: ProjectReviewer
				},
				name: "Revisión de proyecto"
			},
			{
				path: 'catalogo-empresas',
				components: {
					panel: Companies
				},
				name: "Catálogo de Empresas"
			},
			{
				path: 'solicitantes',
				components: {
					panel: Developers
				},
				name: "Solicitantes"
			},
			{
				path: 'inversionistas',
				components: {
					panel: Investors
				},
				name: "Inversionistas"
			},
			{
				path: "expediente/:id",
				components: {
					panel: Files
				},
				name: "Expediente",
			}
		]
	},
];