package escola_api
class Matricula {
    Date dataMatricula
    BigDecimal valorPago

    static belongsTo = [aluno: Aluno,curso: Curso]
    static constraints = {
        dataMatricula nullable: false
        valorPago min: 0.0,nullable: false
    }
}
