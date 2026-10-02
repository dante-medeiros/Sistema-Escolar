package escola_api.api

class UrlMappings {

    static mappings = {
        "/aluno"(controller: "aluno", action: "index", method: "GET")
        "/aluno/$id"(controller: "aluno", action: "show", method: "GET")
        "/aluno"(controller: "aluno", action: "save", method: "POST")
        "/aluno/$id"(controller: "aluno", action: "delete", method: "DELETE")
        "/aluno/$id"(controller: "aluno", action: "update", method: "PUT")

        

        "/curso"(controller: "curso", action: "index", method: "GET")
        "/curso/$id"(controller: "curso", action: "show", method: "GET")
        "/curso"(controller: "curso", action: "save", method: "POST")
        "/curso/$id"(controller: "curso", action: "delete", method: "DELETE")
        "/curso/$id"(controller: "curso", action: "update", method: "PUT")




        "/matricula"(controller: "matricula", action: "index", method: "GET")
        "/matricula/$id"(controller: "matricula", action: "show", method: "GET")
        "/matricula"(controller: "matricula", action: "save", method: "POST")
        "/matricula/$id"(controller: "matricula", action: "delete", method: "DELETE")
        "/matricula/$id"(controller: "matricula", action: "update", method: "PUT") //

        "500"(view: '/error')
        "404"(view: '/notFound')
    }
}