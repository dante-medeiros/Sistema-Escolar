package escola_api
import escola_api.Matricula
import grails.gorm.transactions.Transactional

@Transactional
class MatriculaService {
    def listar() {
        Matricula.list()
    }

    def buscarId  (Long id) {
        Matricula.get(id)
    }

    def matricular(Long alunoId,Long cursoId,BigDecimal valorPago) {
         def aluno = Aluno.get(alunoId)
        def curso = Curso.get(cursoId)

        if (!aluno || !curso) {
            return null
        }

         def matricula = new Matricula(
                aluno: aluno,
                curso: curso,
                dataMatricula: new Date(),
                valorPago: valorPago
        )

        matricula.save()
        return matricula
    }


    def apagarMatricula(Long id) {
        def matricula = buscarId(id)
        if (!matricula) {
            return false
        }
        matricula.delete()
        return true
    }
}


