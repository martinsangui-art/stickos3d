interface Props {
  done: boolean;
  onSkip: () => void;
}

export function Preloader({ done, onSkip }: Props) {
  return (
    <div className={'preloader' + (done ? ' done' : '')} id="preloader" aria-hidden="true" onClick={onSkip}>
      <div className="rig">
        <div className="bed">
          <span className="lay">
            <span className="wm">
              <span className="wm-b">
                STICKOS<em>3D</em>
              </span>
              <span className="wm-t">
                STICKOS<em>3D</em>
              </span>
            </span>
          </span>
          <div className="gantry">
            <div className="rail"></div>
            <div className="head">
              <svg viewBox="0 0 19 24" fill="none">
                <path d="M2 1h15v9l-4.5 6.5V23h-6v-6.5L2 10z" fill="#FF5A1F" />
                <rect x="5" y="3.5" width="9" height="1.6" fill="#14120F" opacity=".45" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="plabel">Imprimiendo…</div>
      <div className="pbar">
        <i></i>
      </div>
    </div>
  );
}
