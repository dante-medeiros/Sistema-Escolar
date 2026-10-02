<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content=""/>
    <title>Gestão de Matrículas</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #eef2f5; margin: 0; padding: 20px; color: #333; }
        .box { max-width: 850px; margin: auto; background: #fff; padding: 25px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.08); }
        .menu { margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #eaeaea; }
        .menu a { text-decoration: none; padding: 6px 14px; margin-right: 8px; background: #e2e8f0; color: #4a5568; border-radius: 4px; font-weight: 600; font-size: 14px; }
        .menu a.active { background: #3182ce; color: white; }
        h2 { color: #2d3748; margin-top: 0; }
        .form-box { background: #f7fafc; padding: 15px; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 20px; }
        label { display: block; font-weight: 600; margin-bottom: 5px; font-size: 14px; color: #4a5568; }
        input { width: 100%; padding: 8px; margin-bottom: 12px; border: 1px solid #cbd5e0; border-radius: 4px; box-sizing: border-box; }
        button { padding: 8px 15px; cursor: pointer; border: none; border-radius: 4px; font-weight: 600; }
        #salvar { background: #48bb78; color: white; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; font-size: 14px; }
        th { background: #3182ce; color: white; }
        tr:nth-child(even) { background: #f8fafc; }
        .excluir { background: #e53e3e; color: white; padding: 5px 10px; border-radius: 3px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="box">
        <div class="menu">
            <a href="${createLink(controller: 'aluno', action: 'index')}">Alunos</a>
            <a href="${createLink(controller: 'curso', action: 'index')}">Cursos</a>
            <a href="${createLink(controller: 'matricula', action: 'index')}" class="active">Matrículas</a>
        </div>

        <h2>Gestão de Matrículas</h2>

        <div class="form-box">
            <h3 style="margin-top:0; color: #2d3748; font-size: 16px;">Cadastrar Matrícula</h3>
            
            <label>ID do Aluno:</label>
            <input type="number" id="alunoId" placeholder="Digite o ID do aluno" />
            
            <label>ID do Curso:</label>
            <input type="number" id="cursoId" placeholder="Digite o ID do curso" />
            
            <label>Valor Pago:</label>
            <input type="number" step="0.01" id="valorPago" placeholder="0.00" />

            <label>Data da Matrícula:</label>
            <input type="date" id="dataMatricula" />
            
            <button id="salvar">Salvar</button>
        </div>

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Aluno</th>
                    <th>Curso</th>
                    <th>Valor Pago</th>
                    <th>Data</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody id="lista"></tbody>
        </table>
    </div>

    <script>
        function carregar() {
            $.ajax({
                url: '${createLink(controller: "matricula", action: "index")}',
                data: { format: 'json' },
                type: 'GET',
                success: function(dados) {
                    let html = '';
                    for (let i = 0; i < dados.length; i++) {
                        let m = dados[i];
                        let nomeAluno = m.aluno ? m.aluno.nome : '';
                        let nomeCurso = m.curso ? m.curso.titulo : '';
                        let valorFmt = m.valorPago ? 'R$ ' + parseFloat(m.valorPago).toFixed(2) : 'R$ 0.00';
                        let dataFmt = m.dataMatricula ? m.dataMatricula.substring(0, 10) : '';

                        html += '<tr>';
                        html += '<td>' + m.id + '</td>';
                        html += '<td>' + nomeAluno + '</td>';
                        html += '<td>' + nomeCurso + '</td>';
                        html += '<td>' + valorFmt + '</td>';
                        html += '<td>' + dataFmt + '</td>';
                        html += '<td><button class="excluir" data-id="' + m.id + '">Excluir</button></td>';
                        html += '</tr>';
                    }
                    $('#lista').html(html);
                }
            });
        }

        $(document).ready(function() {
            carregar();

            $('#salvar').click(function() {
                let dados = {
                    alunoId: $('#alunoId').val(),
                    cursoId: $('#cursoId').val(),
                    valorPago: $('#valorPago').val(),
                    dataMatricula: $('#dataMatricula').val()
                };

                $.ajax({
                    url: '/matricula',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(dados),
                    success: function() {
                        $('#alunoId').val('');
                        $('#cursoId').val('');
                        $('#valorPago').val('');
                        $('#dataMatricula').val('');
                        carregar();
                        alert('Matrícula salva com sucesso!');
                    },
                    error: function(err) {
                        alert('Erro ao salvar matrícula: ' + (err.responseText || 'Verifique os dados'));
                    }
                });
            });

            $(document).on('click', '.excluir', function() {
                let id = $(this).data('id');
                if (confirm('Deseja excluir esta matrícula?')) {
                    $.ajax({
                        url: '/matricula/' + id,
                        type: 'DELETE',
                        success: function() {
                            carregar();
                        },
                        error: function(err) {
                            alert(err.responseText || 'Erro ao excluir');
                        }
                    });
                }
            });
        });
    </script>
</body>
</html>