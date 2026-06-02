import { useState, type FormEvent } from 'react';
import { tokens } from '../tokens';
import { useAuth } from '../context/AuthContext';

export function LoginPanel() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    background: tokens.surfaceAlt,
    border: `1px solid ${tokens.border}`,
    borderRadius: 6,
    color: tokens.text,
    fontFamily: "'Outfit', sans-serif",
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.15s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: "'DM Mono', monospace",
    fontSize: 9,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: tokens.text3,
    marginBottom: 6,
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: '100%', height: '100vh', background: tokens.bg,
    }}>
      <form onSubmit={handleSubmit} style={{
        width: 360,
        background: tokens.surface,
        border: `1px solid ${tokens.border}`,
        borderRadius: 10,
        padding: '36px 32px',
      }}>
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 28, letterSpacing: 3, color: tokens.text,
            marginBottom: 4,
          }}>
            FUNDI-X ADMIN
          </div>
          <div style={{ fontSize: 12, color: tokens.text3, fontFamily: "'DM Mono', monospace" }}>
            Sign in to continue
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@fundix.ke"
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={inputStyle}
          />
        </div>

        {error && (
          <div style={{
            background: tokens.errorDim,
            border: `1px solid ${tokens.errorBorder}`,
            borderRadius: 6,
            padding: '9px 14px',
            fontSize: 12,
            color: tokens.error,
            marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 0',
            background: loading ? tokens.surfaceAlt : tokens.green,
            border: 'none',
            borderRadius: 6,
            color: loading ? tokens.text3 : '#0A0A0A',
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '1px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {loading ? 'SIGNING IN…' : 'SIGN IN'}
        </button>
      </form>
    </div>
  );
}
