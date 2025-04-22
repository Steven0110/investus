import Vue from 'vue'
import axios from 'axios'

/*  Config Options   */
const authOptions = {
    timeout: 30000,
    baseURL: process.env.BASE_API + process.env.AUTH_API_PATH,
    withCredentials: true
}
const securityOptions = {
    timeout: 30000,
    baseURL: process.env.BASE_API + process.env.SECURITY_API_PATH,
    withCredentials: true
}
const documentsOptions = {
    timeout: 30000,
    baseURL: process.env.BASE_API + process.env.DOCUMENTS_API_PATH,
    withCredentials: true
}
const projectsOptions = {
    timeout: 30000,
    baseURL: process.env.BASE_API + process.env.PROJECTS_API_PATH,
    withCredentials: true
}
const fileserverOptions = {
    timeout: 30000,
    baseURL: process.env.FILESERVER,
    withCredentials: false
}

/*  Interceptors & Handlers   */
const authInterceptor = config => {
    config.headers["x-api-key"] = process.env.AUTH_API_SERVICE + "-" + process.env.AUTH_API_KEY
    return config
}
const securityInterceptor = config => {
    config.headers["x-api-key"] = process.env.SECURITY_API_SERVICE + "-" + process.env.SECURITY_API_KEY
    return config
}
const documentsInterceptor = config => {
    config.headers["x-api-key"] = process.env.DOCUMENTS_API_SERVICE + "-" + process.env.DOCUMENTS_API_KEY
    return config
}
const projectsInterceptor = config => {
    config.headers["x-api-key"] = process.env.PROJECTS_API_SERVICE + "-" + process.env.PROJECTS_API_KEY
    return config
}

const errorInterceptor = error => Promise.reject( error )
const responseBypass = response => response
const errorHandler = error => {
    if(error.response.status == 403){

        /*  Send notification to Sentry     */
        Vue.prototype.$sentry.captureException( new Error(error.response.data) )

        Vue.prototype.$swal("Error al procesar solicitud", "API Key inválida o sesión inválida", "error")

        return Promise.reject(false)

    }else if(error.response.status == 400){

        /*  Send notification to Sentry     */
        Vue.prototype.$sentry.captureException( new Error(error.response.data) )

        Vue.prototype.$swal("Error al procesar solicitud", "Solicitud inválida", "error")
        return Promise.reject(error)
        
    }else if(error.response.status == 500){ // Error en servidor

        /*  Send notification to Sentry     */
        Vue.prototype.$sentry.captureException( new Error(error.response.data) )

        Vue.prototype.$swal("Error inesperado", "Por favor vuelve a intentarlo, si el problema persiste, por favor envíanos un correo a soporte@investus.mx", "error")
        return Promise.reject(error)
        
    }else
        return Promise.reject(error)
}
const fileserverErrorHandler = error => {
    if(error.response.status == 403){ //Unauthorized

        /*  Send notification to Sentry     */
        Vue.prototype.$sentry.captureException( new Error(error.response.data) )
        Vue.prototype.$swal("Acceso denegado", "No estás autorizado para realizar esta acción.", "error")
        return Promise.reject(false)
    }else
        return Promise.reject(error)
}

/*  APIs Creation   */
const auth          = axios.create( authOptions )
const security      = axios.create( securityOptions )
const documents     = axios.create( documentsOptions )
const projects      = axios.create( projectsOptions )
const fileserver    = axios.create( fileserverOptions )

auth.interceptors.request.use(authInterceptor, errorInterceptor)
security.interceptors.request.use(securityInterceptor, errorInterceptor)
documents.interceptors.request.use(documentsInterceptor, errorInterceptor)
projects.interceptors.request.use(projectsInterceptor, errorInterceptor)

auth.interceptors.response.use(responseBypass, errorHandler)
security.interceptors.response.use(responseBypass, errorHandler)
documents.interceptors.response.use(responseBypass, errorHandler)
projects.interceptors.response.use(responseBypass, errorHandler)
fileserver.interceptors.response.use(responseBypass, fileserverErrorHandler)

Vue.prototype.$auth = auth
Vue.prototype.$security = security
Vue.prototype.$documents = documents
Vue.prototype.$fileserver = fileserver
Vue.prototype.$projects = projects

export default {}