package escola
class Matricula{
    Date dataMatricula
    BigDecimal valorPago

    static belongsTo = [aluno: Aluno,curso: Curso]
    static constraints = {
        valorPago min: 0.0,nullable: falses
    }
}
