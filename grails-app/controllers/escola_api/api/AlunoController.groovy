package escola_api.api

import escola_api.Aluno
import grails.gorm.transactions.Transactional // Importação necessária para o delete funcionar

class AlunoController {
    static responseFormats = ['json', 'xml']
    def alunoService

    def index() {
        respond alunoService.listar()
    }

    def show(Long id) {
        def aluno = alunoService.buscarPorId(id)
        if (!aluno) {
            render status: 404
            return
        }
        respond aluno
    }

    def save() {
        def aluno = new Aluno(
                nome: request.JSON.nome,
                email: request.JSON.email,
                dataNascimento: request.JSON.dataNascimento
        )

        if (!aluno.validate()) {
            respond aluno.errors, status: 400
            return
        }

        alunoService.salvarAluno(aluno)
        respond aluno, status: 201
    }

    def update(Long id) {
        def aluno = alunoService.buscarPorId(id)
        if (!aluno) {
            render status: 404
            return
        }
        aluno.properties = request.JSON

        if (!aluno.validate()) {
            respond aluno.errors, status: 400
            return
        }

        alunoService.salvarAluno(aluno)
        respond aluno, status: 200
    }

    @Transactional
    def delete(Long id) {
        try {
            def aluno = alunoService.buscarPorId(id)
            if (!aluno) {
                render status: 404, text: "Aluno não encontrado."
                return
            }
            
            // Apaga o registo diretamente na base de dados
            aluno.delete(flush: true)
            render status: 204
            
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            // Se a base de dados bloquear (porque o aluno tem uma matrícula associada), devolvemos um erro claro
            render status: 400, text: "Não é possível excluir o aluno porque ele já possui matrículas associadas. Exclua a matrícula primeiro!"
        } catch (Exception e) {
            // Qualquer outro erro genérico
            render status: 400, text: "Erro interno ao tentar excluir o aluno: " + e.message
        }
    }
}