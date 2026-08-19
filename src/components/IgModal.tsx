import { useIgModalContext } from '../context/IgModalContext';

export function IgModal() {
  const { show, hide } = useIgModalContext();

  return (
    <div className={'ig-backdrop' + (show ? ' show' : '')} onClick={(e) => { if (e.target === e.currentTarget) hide(); }}>
      <div className="ig-modal">
        <button className="ig-modal-close" aria-label="Cerrar" onClick={hide}>✕</button>
        <div className="ig-modal-icon">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
          </svg>
        </div>
        <div className="ig-modal-eyebrow">@stickos3de</div>
        <h4>Mirá lo último del taller</h4>
        <p>Fotos de piezas recién salidas de la impresora, colores en vivo, y lo próximo que se viene — antes de que llegue al catálogo.</p>
        <a href="https://instagram.com/stickos3de" target="_blank" rel="noopener" className="ig-modal-follow">Seguir en Instagram</a>
        <button className="ig-modal-dismiss" onClick={hide}>Ahora no</button>
      </div>
    </div>
  );
}
