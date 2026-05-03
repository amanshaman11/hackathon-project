/**
 * Decorative only — animated vertical rails on wide viewports for the landing page.
 * pointer-events-none; hidden below lg to avoid cramped layouts.
 */
export function HomeSideRails() {
  return (
    <>
      {/* Left rail */}
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-0 left-0 top-14 z-[8] hidden w-16 lg:block xl:w-[4.75rem]"
      >
        <div className="relative mx-auto mt-12 h-[min(78vh,720px)] w-full px-6">
          <div className="absolute left-[38%] top-8 h-[88%] w-[2px] translate-x-[-50%] overflow-hidden rounded-full opacity-70">
            <div
              className="side-rail-dash h-[200%] w-full animate-side-dash-marquee rounded-full opacity-75"
              style={{
                background:
                  'repeating-linear-gradient(180deg, transparent 0 10px, rgba(45,212,191,0.55) 10px 12px)',
              }}
            />
          </div>
          <div
            className="absolute left-[20%] top-[22%] h-24 w-24 rounded-[40%] bg-teal-400/35 blur-xl animate-edge-orb-float"
            style={{ animationDelay: '-2s' }}
          />
          <div
            className="absolute bottom-[18%] left-[52%] h-16 w-16 rounded-[40%] bg-blue-400/30 blur-xl animate-edge-orb-float"
            style={{ animationDelay: '-6s' }}
          />
          <SideDots side="left" />
        </div>
      </div>

      {/* Right rail (mirror) */}
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-0 right-0 top-14 z-[8] hidden w-16 lg:block xl:w-[4.75rem]"
      >
        <div className="relative mx-auto mt-12 h-[min(78vh,720px)] w-full px-6">
          <div className="absolute right-[38%] top-8 h-[88%] w-[2px] translate-x-[50%] overflow-hidden rounded-full opacity-70">
            <div
              className="side-rail-dash h-[200%] w-full animate-side-dash-marquee-reverse rounded-full opacity-75"
              style={{
                animationDelay: '-0.6s',
                background:
                  'repeating-linear-gradient(180deg, transparent 0 10px, rgba(59,130,246,0.5) 10px 12px)',
              }}
            />
          </div>
          <div
            className="absolute right-[20%] top-[38%] h-28 w-28 rounded-[42%] bg-blue-500/35 blur-xl animate-edge-orb-float-alt"
            style={{ animationDelay: '-3s' }}
          />
          <div
            className="absolute bottom-[26%] right-[48%] h-14 w-14 rounded-full bg-teal-400/35 blur-xl animate-edge-orb-float-alt"
            style={{ animationDelay: '-9s' }}
          />
          <SideDots side="right" />
        </div>
      </div>
    </>
  );
}

function SideDots({ side }: { side: 'left' | 'right' }) {
  const pos =
    side === 'left'
      ? ['top-[12%]', 'top-[42%]', 'top-[72%]', 'bottom-[14%]']
      : ['top-[18%]', 'top-[48%]', 'top-[76%]', 'bottom-[14%]'];
  const x = side === 'left' ? 'left-[8%]' : 'right-[8%]';

  return (
    <>
      <span className={`absolute ${x} ${pos[0]} h-2 w-2 rounded-full bg-teal-500/50 shadow-[0_0_14px_rgba(20,184,166,0.55)] animate-side-dot-ring`} />
      <span
        className={`absolute ${x} ${pos[1]} h-1.5 w-1.5 rounded-full bg-teal-400/60 animate-side-dot-ring`}
        style={{ animationDelay: '-0.4s' }}
      />
      <span
        className={`absolute ${x} ${pos[2]} h-2 w-2 rounded-full bg-blue-400/55 shadow-[0_0_12px_rgba(96,165,250,0.45)] animate-side-dot-ring`}
        style={{ animationDelay: '-0.9s' }}
      />
      <span
        className={`absolute ${x} ${pos[3]} h-1.5 w-1.5 rounded-full bg-slate-400/40 animate-side-dot-ring`}
        style={{ animationDelay: '-1.4s' }}
      />
    </>
  );
}
