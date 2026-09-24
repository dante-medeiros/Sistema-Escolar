package escola_api.api

import escola_api.Aluno

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
}