import React, { useState } from 'react';
import { subscribeEmail } from '../../services/subscribe';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setStatus({ type: 'error', message: 'Please enter your email.' });
      return;
    }

    try {
      setSubmitting(true);
      setStatus({ type: '', message: '' });
      await subscribeEmail(trimmed);
      setStatus({ type: 'success', message: 'Subscribed successfully. Check your inbox!' });
      setEmail('');
    } catch (err) {
      setStatus({
        type: 'error',
        message: err?.message || 'Please enter a valid email and try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section alt" style={{ padding: '3.5rem 2.5rem', background: 'linear-gradient(135deg,var(--text) 0%,#2D2A24 100%)', textAlign: 'center' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.75rem' }}>Stay ahead of the curve</div>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.03em', color: 'white', marginBottom: '0.75rem', lineHeight: 1.2 }}>New models drop every week.<br />Don't miss a release.</h2>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', lineHeight: 1.6 }}>Get a curated weekly digest: new model releases, benchmark comparisons, pricing changes, and prompt engineering tips — straight to your inbox.</p>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            <input
              type="email"
              placeholder="your@email.com"
              className="hsb-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ flex: 1, minWidth: '220px', maxWidth: '320px', padding: '0.7rem 1.1rem', borderRadius: '2rem', border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: 'white' }}
            />
            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ padding: '0.7rem 1.5rem', borderRadius: '2rem', opacity: submitting ? 0.8 : 1 }}>
              {submitting ? 'Subscribing...' : 'Subscribe free →'}
            </button>
          </div>
          {status.message && (
            <div style={{ fontSize: '0.85rem', color: status.type === 'success' ? '#86efac' : '#fecaca' }}>
              {status.message}
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
