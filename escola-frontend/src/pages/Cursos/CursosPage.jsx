import { useState, useEffect } from 'react';
import { cursoService } from '../../api/cursoService';

export default function CursosPage() {
  const [cursos, setCursos] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  const [exibirFormulario, setExibirFormulario] = useState(false);
  const [cursoAtual, setCursoAtual] = useState({ titulo: '', cargaHoraria: '', descricao: '' });

  useEffect(() => {
    carregarLista();
  }, [termoBusca]);

  const carregarLista = async () => {
    try {
      setCarregando(true);
      const dados = await cursoService.listar(termoBusca);
      setCursos(dados);
    } catch (erro) {
      alert('Não foi possível carregar a lista de cursos.');
    } finally {
      setCarregando(false);
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      await cursoService.salvar(cursoAtual);
      alert('Curso salvo com sucesso!');
      setExibirFormulario(false);
      setCursoAtual({ titulo: '', cargaHoraria: '', descricao: '' });
      carregarLista();
    } catch (erro) {
      alert('Erro ao salvar os dados do curso.');
    }
  };

  const handleEditar = (curso) => {
    setCursoAtual(curso);
    setExibirFormulario(true);
  };

  const handleExcluir = async (id) => {
    const confirmou = window.confirm('Tem a certeza que deseja excluir este curso?');
    if (!confirmou) return;

    try {
      await cursoService.excluir(id);
      carregarLista();
    } catch (erro) {
      alert('Erro ao tentar excluir o curso.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Gestão de Cursos</h2>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
        <input 
          type="text" 
          placeholder="Pesquisar curso..." 
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          style={{ padding: '8px', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button 
          onClick={() => { setCursoAtual({ titulo: '', cargaHoraria: '', descricao: '' }); setExibirFormulario(true); }}
          style={{ padding: '8px 16px', backgroundColor: '#0056b3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          + Novo Curso
        </button>
      </div>

      {exibirFormulario && (
        <form onSubmit={handleSalvar} style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
          <h3>{cursoAtual.id ? 'Editar Curso' : 'Cadastrar Novo Curso'}</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Nome Do Curso:</label>
            <input 
              type="text" 
              required
              maxLength="100"
              placeholder="Ex: Matemática, Java Web"
              value={cursoAtual.titulo || ''}
              onChange={(e) => setCursoAtual({ ...cursoAtual, titulo: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Carga Horária (mínimo 1):</label>
            <input 
              type="number" 
              required
              min="1"
              placeholder="Ex: 40"
              value={cursoAtual.cargaHoraria || ''}
              onChange={(e) => setCursoAtual({ ...cursoAtual, cargaHoraria: Number(e.target.value) })}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Descrição (Opcional):</label>
            <textarea 
              maxLength="400"
              placeholder="Descreva o foco e os objetivos do curso..."
              value={cursoAtual.descricao || ''}
              onChange={(e) => setCursoAtual({ ...cursoAtual, descricao: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px', resize: 'vertical' }}
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
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Título</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Carga Horária</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Descrição</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {cursos.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '12px', textAlign: 'center' }}>Nenhum curso encontrado.</td>
              </tr>
            ) : (
              cursos.map((curso) => (
                <tr key={curso.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}>{curso.id}</td>
                  <td style={{ padding: '12px' }}>{curso.titulo}</td>
                  <td style={{ padding: '12px' }}>{curso.cargaHoraria}h</td>
                  <td style={{ padding: '12px' }}>{curso.descricao}</td>
                  <td style={{ padding: '12px' }}>
                    <button onClick={() => handleEditar(curso)} style={{ marginRight: '8px', padding: '4px 8px', cursor: 'pointer' }}>Editar</button>
                    <button onClick={() => handleExcluir(curso.id)} style={{ padding: '4px 8px', color: 'red', cursor: 'pointer' }}>Excluir</button>
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