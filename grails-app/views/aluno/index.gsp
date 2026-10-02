<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content=""/>
    <title>Gestão de Alunos</title>
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
        #cancelar { background: #a0aec0; color: white; margin-left: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; font-size: 14px; }
        th { background: #3182ce; color: white; }
        tr:nth-child(even) { background: #f8fafc; }
        .editar { background: #ed8936; color: white; padding: 5px 10px; border-radius: 3px; font-size: 12px; }
        .excluir { background: #e53e3e; color: white; padding: 5px 10px; border-radius: 3px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="box">
        <div class="menu">
            <a href="${createLink(controller: 'aluno', action: 'index')}" class="active">Alunos</a>
            <a href="${createLink(controller: 'curso', action: 'index')}">Cursos</a>
            <a href="${createLink(controller: 'matricula', action: 'index')}">Matrículas</a>
        </div>

        <h2>Gestão de Alunos</h2>

        <div class="form-box">
            <h3 id="titulo" style="margin-top:0; color: #2d3748; font-size: 16px;">Cadastrar Aluno</h3>
            <input type="hidden" id="id" />
            
            <label>Nome:</label>
            <input type="text" id="nome" />
            
            <label>E-mail:</label>
            <input type="email" id="email" />

            <label>Data de Nascimento:</label>
            <input type="date" id="dataNascimento" />
            
            <button id="salvar">Salvar</button>
            <button id="cancelar" style="display:none;">Cancelar</button>
        </div>

        <input type="text" id="busca" placeholder="Pesquisar aluno por nome..." style="width: 280px; margin-bottom: 10px;" />

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Data Nasc.</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody id="lista"></tbody>
        </table>
    </div>

    <script>
        function carregar(termo = '') {
            $.ajax({
                url: '${createLink(controller: "aluno", action: "index")}',
                data: { nome: termo, format: 'json' },
                type: 'GET',
                success: function(dados) {
                    let html = '';
                    for (let i = 0; i < dados.length; i++) {
                        let a = dados[i];
                        let dataFmt = a.dataNascimento ? a.dataNascimento.substring(0, 10) : '';
                        html += '<tr>';
                        html += '<td>' + a.id + '</td>';
                        html += '<td>' + a.nome + '</td>';
                        html += '<td>' + a.email + '</td>';
                        html += '<td>' + dataFmt + '</td>';
                        html += '<td>';
                        html += '<button class="editar" data-id="' + a.id + '" data-nome="' + a.nome + '" data-email="' + a.email + '" data-data="' + dataFmt + '">Editar</button> ';
                        html += '<button class="excluir" data-id="' + a.id + '">Excluir</button>';
                        html += '</td>';
                        html += '</tr>';
                    }
                    $('#lista').html(html);
                }
            });
        }

        $(document).ready(function() {
            carregar();

            $('#busca').on('input', function() {
                carregar($(this).val());
            });

            $('#salvar').click(function() {
                let id = $('#id').val();
                let dados = {
                    nome: $('#nome').val(),
                    email: $('#email').val(),
                    dataNascimento: $('#dataNascimento').val()
                };

                let metodo = id ? 'PUT' : 'POST';
                let rota = id ? '/aluno/' + id : '/aluno';

                $.ajax({
                    url: rota,
                    type: metodo,
                    contentType: 'application/json',
                    data: JSON.stringify(dados),
                    success: function() {
                        limpar();
                        carregar();
                        alert('Salvo com sucesso!');
                    },
                    error: function() {
                        alert('Erro ao salvar!');
                    }
                });
            });

            $(document).on('click', '.editar', function() {
                $('#id').val($(this).data('id'));
                $('#nome').val($(this).data('nome'));
                $('#email').val($(this).data('email'));
                $('#dataNascimento').val($(this).data('data'));
                $('#titulo').text('Editar Aluno');
                $('#cancelar').show();
            });

            $('#cancelar').click(function() {
                limpar();
            });

            function limpar() {
                $('#id').val('');
                $('#nome').val('');
                $('#email').val('');
                $('#dataNascimento').val('');
                $('#titulo').text('Cadastrar Aluno');
                $('#cancelar').hide();
            }

            $(document).on('click', '.excluir', function() {
                let id = $(this).data('id');
                if (confirm('Deseja excluir?')) {
                    $.ajax({
                        url: '/aluno/' + id,
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