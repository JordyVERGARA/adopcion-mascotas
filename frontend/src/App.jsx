import { Routes, Route, Link } from 'react-router-dom';
import Menu from './components/Menu';
import Inicio from './pages/Inicio';
import Registro from './pages/Registro';
import Lista from './pages/Lista';

function App() {
  return (
    <>
      <Menu />
      <main className="contenedor">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/lista" element={<Lista />} />
          <Route
            path="*"
            element={<p>Página no encontrada. <Link to="/">Volver al inicio</Link></p>}
          />
        </Routes>
      </main>
    </>
  );
}

export default App;