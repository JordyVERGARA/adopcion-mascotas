function Mensaje({ tipo = 'info', children }) {
  return (
    <div
      className={`mensaje mensaje--${tipo}`}
      role={tipo === 'error' ? 'alert' : 'status'}
    >
      {children}
    </div>
  );
}

export default Mensaje;