export async function fetchShipments() {
  const res = await fetch('/api/shipments');
  if (!res.ok) throw new Error('Error al cargar envíos');
  return await res.json();
}
