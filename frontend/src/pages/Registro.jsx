import FormularioSolicitud from '../components/FormularioSolicitud';

function Registro() {
  return (
    <section>
      <h2>Registrar solicitud de adopción</h2>
      <p>Completa los datos. Los campos con * son obligatorios.</p>
      <FormularioSolicitud />
    </section>
  );
}

export default Registro;