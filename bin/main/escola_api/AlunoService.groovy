package escola_api
import escola_api.Aluno
import grails.gorm.transactions.Transactional

@Transactional
class AlunoService {
    def listar() {
        Aluno.list()
    }

    def buscarPorId(Long id) {
        Aluno.get(id)
    }

    def salvarAluno(Aluno aluno) {
        aluno.save()
        return aluno
    }

    def removerAluno(Long id) {
        def aluno = buscarPorId(id)
        if (!aluno) {
            return false
        }
        aluno.delete()
        return true
    }
}