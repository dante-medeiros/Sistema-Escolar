package escola_api.api

import escola_api.Curso
class CursoController {
    static responseFormats = ['json']
    def cursoService

    def index() {
        respond cursoService.listar()
    }

    def show(Long id) {
        def curso = cursoService.buscarPorId(id)
        if (!curso) {
            render status: 404
            return
        }
        respond curso
    }

    def save() {
        def curso = new Curso(request.JSON)
        if (cursoService.salvarCurso(curso)) {
            respond curso, status: 201
        } else {
            respond curso.errors, status: 400
        }

    }

    def delete(Long id) {
        if (cursoService.deletarCurso(id)) {
            render status: 204
        } else {
            render status: 404
        }
    }
}
