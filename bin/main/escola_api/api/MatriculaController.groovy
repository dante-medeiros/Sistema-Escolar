package escola_api.api

import escola_api.Matricula
import escola_api.Aluno
import escola_api.Curso
import java.text.SimpleDateFormat
import grails.gorm.transactions.Transactional

@Transactional 
class MatriculaController {
    static responseFormats = ['json']

    def index() {
        respond Matricula.list()
    }

    def show(Long id) {
        respond Matricula.get(id)
    }

    def save() {
        try {
            def json = request.JSON
            def matricula = new Matricula()
            
            if (json.alunoId) matricula.aluno = Aluno.get(json.alunoId as Long)
            if (json.cursoId) matricula.curso = Curso.get(json.cursoId as Long)
            if (json.valorPago != null) matricula.valorPago = json.valorPago as BigDecimal
            
            if (json.dataMatricula) {
                matricula.dataMatricula = new SimpleDateFormat("yyyy-MM-dd").parse(json.dataMatricula.toString().substring(0, 10))
            } else {
                matricula.dataMatricula = new Date()
            }

            if (matricula.save(flush: true)) {
                respond matricula, status: 201
            } else {
                def msgErro = matricula.errors.allErrors.collect { it.defaultMessage ?: it.toString() }.join(" | ")
                render status: 400, text: "Recusado pelo Banco: " + msgErro
            }
        } catch (Exception e) {
            render status: 400, text: "Crash no Código: " + e.message
        }
    }

    def update(Long id) {
        try {
            def matricula = Matricula.get(id)
            if (!matricula) {
                render status: 404, text: "Matrícula não encontrada"
                return
            }

            def json = request.JSON
            if (json.alunoId) matricula.aluno = Aluno.get(json.alunoId as Long)
            if (json.cursoId) matricula.curso = Curso.get(json.cursoId as Long)
            if (json.valorPago != null) matricula.valorPago = json.valorPago as BigDecimal
            
            if (json.dataMatricula) {
                matricula.dataMatricula = new SimpleDateFormat("yyyy-MM-dd").parse(json.dataMatricula.toString().substring(0, 10))
            }

            if (matricula.save(flush: true)) {
                respond matricula, status: 200
            } else {
                def msgErro = matricula.errors.allErrors.collect { it.defaultMessage ?: it.toString() }.join(" | ")
                render status: 400, text: "Recusado pelo Banco: " + msgErro
            }
        } catch (Exception e) {
            render status: 400, text: "Crash no Código: " + e.message
        }
    }

    def delete(Long id) {
        def matricula = Matricula.get(id)
        if (matricula) {
            matricula.delete(flush: true)
            render status: 204
        } else {
            render status: 404
        }
    }
}