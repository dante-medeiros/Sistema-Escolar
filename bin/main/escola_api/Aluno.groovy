package escola_api
class Aluno {
    String nome
    String email
    String dataNascimento
    static hasMany = [matriculas:Matricula]
    static  constraints ={
        nome blank: false,maxSize: 80
        email email: true,blank: false,unique: true
        dataNascimento nullable: false
    }


}
