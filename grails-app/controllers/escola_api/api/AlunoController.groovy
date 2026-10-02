package escola_api.api

import escola_api.Aluno
import grails.gorm.transactions.Transactional

class AlunoController {
    def alunoService

    def index() {
        if (request.xhr || params.format == 'json' || request.getHeader('Accept')?.contains('application/json')) {
            def termo = params.nome ?: params.q ?: params.termo
            if (termo && termo.trim() != '') {
                render Aluno.findAllByNomeIlike("%${termo}%") as grails.converters.JSON
            } else {
                render alunoService.listar() as grails.converters.JSON
            }
        } else {
            render(view: "index")
        }
    }

    def show(Long id) {
        def aluno = alunoService.buscarPorId(id)
        if (!aluno) {
            render status: 404
            return
        }
        render aluno as grails.converters.JSON
    }

    def save() {
        def aluno = new Aluno(
                nome: request.JSON.nome,
                email: request.JSON.email,
                dataNascimento: request.JSON.dataNascimento
        )

        if (!aluno.validate()) {
            render aluno.errors as grails.converters.JSON, status: 400
            return
        }

        alunoService.salvarAluno(aluno)
        render aluno as grails.converters.JSON, status: 201
    }

    def update(Long id) {
        def aluno = alunoService.buscarPorId(id)
        if (!aluno) {
            render status: 404
            return
        }
        aluno.properties = request.JSON

        if (!aluno.validate()) {
            render aluno.errors as grails.converters.JSON, status: 400
            return
        }

        alunoService.salvarAluno(aluno)
        render aluno as grails.converters.JSON, status: 200
    }

    @Transactional
    def delete(Long id) {
        try {
            def aluno = alunoService.buscarPorId(id)
            if (!aluno) {
                render status: 404, text: "Aluno não encontrado."
                return
            }
            
            aluno.delete(flush: true)
            render status: 204
            
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            render status: 400, text: "Não é possível excluir o aluno porque ele já possui matrículas associadas. Exclua a matrícula primeiro!"
        } catch (Exception e) {
            render status: 400, text: "Erro interno ao tentar excluir o aluno: " + e.message
        }
    }
}