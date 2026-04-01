export const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const nxToast = (msg) => {
  let el = document.getElementById('nx-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'nx-toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 3000);
};

export const getModelCtxDisplay = (m, MODEL_VARS) => {
  const vars = MODEL_VARS[m.id];
  if (vars && vars.length) return vars[0].ctx || '—';
  return '128K';
};

export const getModelPriceDisplay = (m) => {
  const p = m.price_start;
  if (p === 0) return 'Free';
  if (!p) return 'Free';
  return '$' + p.toFixed(2);
};
