import Vue from 'vue'
import axios from 'axios'

const options = service => {
    return {
        timeout: 30000,
        baseURL: `${process.env.BASE_API}/${service}`,
        withCredentials: true,
        headers: { "x-api-key": `${service}-${process.env.API_KEY}-${process.env.STAGE}`, Authorization: "db2e9b"}
    }
}

const fileserverOptions = {
    timeout: 30000,
    baseURL: process.env.FILESERVER,
    withCredentials: false,
}

const rejector = error => Promise.reject( error )
const bypass = response => response

const errorHandler = error => {
    if(error.response.status == 403){

        Vue.prototype.$sentry.captureException( new Error(error.response.data) )
        Vue.prototype.$swal("Error al procesar solicitud", "API Key inválida o sesión inválida", "error")
        return Promise.reject(false)

    }else if(error.response.status == 400){

        Vue.prototype.$sentry.captureException( new Error(error.response.data) )
        Vue.prototype.$swal("Error al procesar solicitud", "Solicitud inválida", "error")
        return Promise.reject(error)
        
    }else if(error.response.status == 500){ // Error en servidor

        Vue.prototype.$sentry.captureException( new Error(error.response.data) )
        Vue.prototype.$swal("Error inesperado", "Por favor vuelve a intentarlo, si el problema persiste, por favor envíanos un correo a soporte@investus.mx", "error")
        return Promise.reject(error)
        
    }else
        return Promise.reject(error)
}
const fileserverErrorHandler = error => {
    if(error.response.status == 403){ //Unauthorized

        Vue.prototype.$sentry.captureException( new Error(error.response.data) )
        Vue.prototype.$swal("Acceso denegado", "No estás autorizado para realizar esta acción.", "error")
        return Promise.reject(false)
    }else
        return Promise.reject(error)
}

/*  APIs Creation   */
const auth          = axios.create( options("a-auth") )
const security      = axios.create( options("a-security") )
const documents     = axios.create( options("a-documents") )
const projects      = axios.create( options("a-projects") )
const fileserver    = axios.create( fileserverOptions )

auth.interceptors.response.use(bypass, errorHandler)
security.interceptors.response.use(bypass, errorHandler)
documents.interceptors.response.use(bypass, errorHandler)
projects.interceptors.response.use(bypass, errorHandler)
fileserver.interceptors.response.use(bypass, fileserverErrorHandler)

Vue.prototype.$auth         = auth
Vue.prototype.$security     = security
Vue.prototype.$documents    = documents
Vue.prototype.$projects     = projects
Vue.prototype.$fileserver   = fileserver

export default {}