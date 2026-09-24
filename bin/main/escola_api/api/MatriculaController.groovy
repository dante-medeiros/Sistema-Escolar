package escola_api.api
import escola_api.Matricula
class MatriculaController {
    static responseFormats = ['json']
    def matriculaService

    def index() {
        respond matriculaService.listar()
    }

    def show(Long id) {
        def matricula = matriculaService.buscarPorId(id)
        if (!matricula) {
            render status: 404
            return
        }
        respond matricula
    }

    def save() {
        def json = request.JSON
        def matricula = matriculaService.matricular(json.alunoId, json.cursoId, json.valorPago)

        if (matricula) {
            respond matricula, status: 201
        } else {
            render status: 400
        }
    }

    def delete(Long id) {
        if (matriculaService.apagarMatricula(id)) {
            render status: 204
        } else {
            render status: 404
        }
    }
}
