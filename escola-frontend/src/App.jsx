import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import AlunosPage from './pages/Alunos/AlunosPage';
import CursosPage from './pages/Cursos/CursosPage';
import MatriculasPage from './pages/Matriculas/MatriculasPage';

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ background: '#333', padding: '15px', display: 'flex', gap: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '20px', color: 'white', marginRight: '30px' }}>Sistema Escolar</h1>
        <Link to="/alunos" style={{ color: 'white', textDecoration: 'none', fontSize: '18px' }}>Alunos</Link>
        <Link to="/cursos" style={{ color: 'white', textDecoration: 'none', fontSize: '18px' }}>Cursos</Link>
        <Link to="/matriculas" style={{ color: 'white', textDecoration: 'none', fontSize: '18px' }}>Matrículas</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to="/alunos" />} />
        
        <Route path="/alunos" element={<AlunosPage />} />
        <Route path="/cursos" element={<CursosPage />} />
        <Route path="/matriculas" element={<MatriculasPage />} />
      </Routes>
    </BrowserRouter>
  );
}