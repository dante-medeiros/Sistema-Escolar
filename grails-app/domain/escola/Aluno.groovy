package escola
class Aluno { String nome
    String email
    String data_nascimento
    static hasMany = [matriculas: Matricula]
    static  constraints ={
        nome blank: false,maxSize: 80
        email email: true,blank: false,unique: true
        data_nascimento nullable: false
    }


}
