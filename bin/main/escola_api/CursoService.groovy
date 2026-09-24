package escola_api
import escola_api.Curso
import grails.gorm.transactions.Transactional

@Transactional
class CursoService {
    def listar() {
        Curso.list()
    }

    def buscarPorId(Long id) {
        Curso.get(id)
    }

    def salvarCurso(Curso curso) {
        curso.save()
        return curso
    }

    def deletarCurso(Long id) {
        def curso = buscarPorId(id)
        if (!curso) {
            return false
        }
        curso.delete()
        return true
    }
}
