package escola_api.api

import escola_api.Curso
import grails.gorm.transactions.Transactional

class CursoController {
    static responseFormats = ['json', 'xml']
    def cursoService

    def index() {
        if (request.xhr || params.format) {
            def termo = params.titulo ?: params.nome ?: params.q ?: params.termo
            if (termo && termo.trim() != '') {
                respond Curso.findAllByTituloIlike("%${termo}%")
            } else {
                respond cursoService.listar()
            }
        } else {
            render(view: "index")
        }
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

    def update(Long id) {
        def curso = cursoService.buscarPorId(id)
        if (!curso) {
            render status: 404
            return
        }
        
        curso.properties = request.JSON
        
        if (cursoService.salvarCurso(curso)) {
            respond curso, status: 200
        } else {
            respond curso.errors, status: 400
        }
    }

    @Transactional
    def delete(Long id) {
        try {
            if (cursoService.deletarCurso(id)) {
                render status: 204
            } else {
                render status: 404
            }
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            render status: 400, text: "Não é possível excluir o curso porque existem matrículas associadas a ele!"
        } catch (Exception e) {
            render status: 400, text: "Erro ao tentar excluir o curso: " + e.message
        }
    }
}