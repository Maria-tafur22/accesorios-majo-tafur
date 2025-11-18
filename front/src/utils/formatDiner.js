export function formatearDinero(digito) {
  const n = Number(digito) || 0;
  const formateado = n.toLocaleString("es-ES");
  return `$${formateado}`;
}
