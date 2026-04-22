import { clsx } from 'clsx';

export function Panel({ className, children }) {
  return (
    <section className={clsx('rounded-3xl border border-white/10 bg-slate-950/40 shadow-2xl shadow-slate-950/20 backdrop-blur', className)}>
      {children}
    </section>
  );
}

export function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="space-y-2">
      {eyebrow ? <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300">{eyebrow}</p> : null}
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {description ? <p className="text-sm leading-6 text-slate-300">{description}</p> : null}
    </div>
  );
}

export function InputField({ label, children, hint }) {
  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-200">{label}</span>
        {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
      </div>
      {children}
    </label>
  );
}

export function TextInput(props) {
  return <input {...props} className={clsx('w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/80', props.className)} />;
}

export function TextArea(props) {
  return <textarea {...props} className={clsx('min-h-[110px] w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/80', props.className)} />;
}

export function Select(props) {
  return <select {...props} className={clsx('w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/80', props.className)} />;
}

export function Button({ variant = 'primary', className, ...props }) {
  const variants = {
    primary: 'bg-cyan-400 text-slate-950 hover:bg-cyan-300',
    secondary: 'bg-white/10 text-white hover:bg-white/[0.16]',
    danger: 'bg-rose-500/90 text-white hover:bg-rose-400',
  };

  return <button {...props} className={clsx('rounded-2xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-400/70 disabled:cursor-not-allowed disabled:opacity-50', variants[variant], className)} />;
}
