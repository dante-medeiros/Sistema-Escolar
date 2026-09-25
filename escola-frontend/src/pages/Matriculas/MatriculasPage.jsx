import { useState, useEffect } from 'react';
import { matriculaService } from '../../api/matriculaService';

export default function MatriculasPage() {
  const [matriculas, setMatriculas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [exibirFormulario, setExibirFormulario] = useState(false);
  
  const [matriculaAtual, setMatriculaAtual] = useState({ alunoId: '', cursoId: '', dataMatricula: '', valorPago: '' });

  useEffect(() => {
    carregarLista();
  }, []);

  const carregarLista = async () => {
    try {
      setCarregando(true);
      const dados = await matriculaService.listar();
      setMatriculas(dados);
    } catch (erro) {
      alert('Não foi possível carregar a lista de matrículas.');
    } finally {
      setCarregando(false);
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        alunoId: Number(matriculaAtual.alunoId),
        cursoId: Number(matriculaAtual.cursoId),
        dataMatricula: matriculaAtual.dataMatricula,
        valorPago: Number(matriculaAtual.valorPago)
      };

      if (matriculaAtual.id) {
        payload.id = matriculaAtual.id;
      }

      await matriculaService.salvar(payload);
      alert('Matrícula salva com sucesso!');
      setExibirFormulario(false);
      setMatriculaAtual({ alunoId: '', cursoId: '', dataMatricula: '', valorPago: '' });
      carregarLista();
    } catch (erro) {
      if (erro.response && erro.response.data) {
        alert('Erro detalhado do Grails: ' + erro.response.data);
      } else {
        alert('Erro desconhecido ao salvar.');
      }
    }
  };

  const handleEditar = (matricula) => {
    setMatriculaAtual({
      id: matricula.id,
      alunoId: matricula.aluno?.id || '',
      cursoId: matricula.curso?.id || '',
      dataMatricula: matricula.dataMatricula ? matricula.dataMatricula.substring(0, 10) : '',
      valorPago: matricula.valorPago || ''
    });
    setExibirFormulario(true);
  };

  const handleExcluir = async (id) => {
    const confirmou = window.confirm('Tem a certeza que deseja excluir esta matrícula?');
    if (!confirmou) return;

    try {
      await matriculaService.excluir(id);
      carregarLista();
    } catch (erro) {
      if (erro.response && erro.response.data) {
        alert('Erro detalhado: ' + erro.response.data);
      } else {
        alert('Erro ao tentar excluir a matrícula.');
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Gestão de Matrículas</h2>

      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          onClick={() => { setMatriculaAtual({ alunoId: '', cursoId: '', dataMatricula: '', valorPago: '' }); setExibirFormulario(true); }}
          style={{ padding: '8px 16px', backgroundColor: '#0056b3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          + Nova Matrícula
        </button>
      </div>

      {exibirFormulario && (
        <form onSubmit={handleSalvar} style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
          <h3>{matriculaAtual.id ? 'Editar Matrícula' : 'Cadastrar Nova Matrícula'}</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>ID do Aluno (existente):</label>
            <input 
              type="number" 
              required
              value={matriculaAtual.alunoId || ''}
              onChange={(e) => setMatriculaAtual({ ...matriculaAtual, alunoId: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>ID do Curso (existente):</label>
            <input 
              type="number" 
              required
              value={matriculaAtual.cursoId || ''}
              onChange={(e) => setMatriculaAtual({ ...matriculaAtual, cursoId: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Data da Matrícula:</label>
            <input 
              type="date" 
              required
              value={matriculaAtual.dataMatricula || ''}
              onChange={(e) => setMatriculaAtual({ ...matriculaAtual, dataMatricula: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Valor Pago (R$):</label>
            <input 
              type="number" 
              step="0.01"
              min="0"
              required
              value={matriculaAtual.valorPago || ''}
              onChange={(e) => setMatriculaAtual({ ...matriculaAtual, valorPago: e.target.value })}
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
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Aluno</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Curso</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Data</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Valor (R$)</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {matriculas.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '12px', textAlign: 'center' }}>Nenhuma matrícula encontrada.</td>
              </tr>
            ) : (
              matriculas.map((matricula) => (
                <tr key={matricula.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}>{matricula.id}</td>
                  <td style={{ padding: '12px' }}>{matricula.aluno?.id || matricula.alunoId || '-'}</td>
                  <td style={{ padding: '12px' }}>{matricula.curso?.id || matricula.cursoId || '-'}</td>
                  <td style={{ padding: '12px' }}>
                    {matricula.dataMatricula ? new Date(matricula.dataMatricula).toLocaleDateString('pt-BR') : ''}
                  </td>
                  <td style={{ padding: '12px' }}>{matricula.valorPago}</td>
                  <td style={{ padding: '12px' }}>
                    <button onClick={() => handleEditar(matricula)} style={{ marginRight: '8px', padding: '4px 8px', cursor: 'pointer' }}>Editar</button>
                    <button onClick={() => handleExcluir(matricula.id)} style={{ padding: '4px 8px', color: 'red', cursor: 'pointer' }}>Excluir</button>
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