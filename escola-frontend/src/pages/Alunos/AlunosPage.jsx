import { useState, useEffect } from 'react';
import { alunoService } from '../../api/alunoService';

export default function AlunosPage() {
  const [alunos, setAlunos] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  const [exibirFormulario, setExibirFormulario] = useState(false);
  const [alunoAtual, setAlunoAtual] = useState({ nome: '', email: '', dataNascimento: '' });

  useEffect(() => {
    carregarLista();
  }, [termoBusca]);

  const carregarLista = async () => {
    try {
      setCarregando(true);
      const dados = await alunoService.listar(termoBusca);
      setAlunos(dados);
    } catch (erro) {
      alert('Não foi possível carregar a lista de alunos.');
    } finally {
      setCarregando(false);
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      await alunoService.salvar(alunoAtual);
      alert('Aluno salvo com sucesso!');
      setExibirFormulario(false);
      setAlunoAtual({ nome: '', email: '', dataNascimento: '' });
      carregarLista();
    } catch (erro) {
      alert('Erro ao salvar os dados do aluno.');
    }
  };

  const handleEditar = (aluno) => {
    setAlunoAtual({
      id: aluno.id,
      nome: aluno.nome,
      email: aluno.email,
      dataNascimento: aluno.dataNascimento ? aluno.dataNascimento.substring(0, 10) : ''
    });
    setExibirFormulario(true);
  };

  const handleExcluir = async (id) => {
    const confirmou = window.confirm('Tem a certeza que deseja excluir este aluno?');
    if (!confirmou) return;

    try {
      await alunoService.excluir(id);
      carregarLista();
    } catch (erro) {
      // Se o back-end enviar a mensagem de que o aluno tem matrícula vinculada, mostra ela aqui
      if (erro.response && erro.response.data) {
        alert(erro.response.data);
      } else {
        alert('Erro ao tentar excluir o aluno.');
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Gestão de Alunos</h2>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
        <input 
          type="text" 
          placeholder="Pesquisar aluno por nome..." 
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          style={{ padding: '8px', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button 
          onClick={() => { setAlunoAtual({ nome: '', email: '', dataNascimento: '' }); setExibirFormulario(true); }}
          style={{ padding: '8px 16px', backgroundColor: '#0056b3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          + Novo Aluno
        </button>
      </div>

      {exibirFormulario && (
        <form onSubmit={handleSalvar} style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
          <h3>{alunoAtual.id ? 'Editar Aluno' : 'Cadastrar Novo Aluno'}</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Nome:</label>
            <input 
              type="text" 
              required
              placeholder="Nome completo"
              value={alunoAtual.nome || ''}
              onChange={(e) => setAlunoAtual({ ...alunoAtual, nome: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>E-mail:</label>
            <input 
              type="email" 
              required
              placeholder="exemplo@email.com"
              value={alunoAtual.email || ''}
              onChange={(e) => setAlunoAtual({ ...alunoAtual, email: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Data de Nascimento:</label>
            <input 
              type="date" 
              required
              value={alunoAtual.dataNascimento || ''}
              onChange={(e) => setAlunoAtual({ ...alunoAtual, dataNascimento: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Salvar
            </button>
            <button 
              type="button" 
              onClick={() => setExibirFormulario(false)}
              style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {carregando ? (
        <p>A carregar dados...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>ID</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Nome</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>E-mail</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Data de Nascimento</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {alunos.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '12px', textAlign: 'center' }}>Nenhum aluno encontrado.</td>
              </tr>
            ) : (
              alunos.map((aluno) => (
                <tr key={aluno.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}>{aluno.id}</td>
                  <td style={{ padding: '12px' }}>{aluno.nome}</td>
                  <td style={{ padding: '12px' }}>{aluno.email}</td>
                  <td style={{ padding: '12px' }}>
                    {aluno.dataNascimento ? new Date(aluno.dataNascimento).toLocaleDateString('pt-BR') : ''}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button onClick={() => handleEditar(aluno)} style={{ marginRight: '8px', padding: '4px 8px', cursor: 'pointer' }}>Editar</button>
                    <button onClick={() => handleExcluir(aluno.id)} style={{ padding: '4px 8px', color: 'red', cursor: 'pointer' }}>Excluir</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}