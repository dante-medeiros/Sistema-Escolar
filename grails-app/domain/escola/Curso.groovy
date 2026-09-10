package escola
class Curso {
    String titulo
    String descricao
    Integer cargaHoraria
    static hasMany = [matriculas: Matricula]
    static constraints = {
        titulo blank: false,maxSize: 100
        descricao nullable: true,maxSize: 400
        cargaHoraria min: 1
    }
}
