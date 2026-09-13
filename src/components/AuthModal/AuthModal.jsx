import React, { useState } from 'react';
import { X, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/apiClient';
import styles from './AuthModal.module.css';

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const { signIn, signUp } = useAuth();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        const { error: err } = await signIn(form.email, form.password);
        if (err) {
          setError(err.message || 'Invalid email or password');
        } else {
          onClose();
        }
      } else if (mode === 'signup') {
        if (!form.fullName.trim()) {
          setError('Full name is required');
          setLoading(false);
          return;
        }
        const { error: err } = await signUp(form.email, form.password, form.fullName, form.phone);
        if (err) {
          setError(err.message || 'Signup failed. Please try again.');
        } else {
          onClose();
        }
      } else if (mode === 'forgot') {
        await apiRequest('/api/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify({
            email: form.email.trim(),
            redirectTo: `${window.location.origin}/update-password`,
          }),
        });
        setResetSent(true);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(m => m === 'login' ? 'signup' : 'login');
    setError('');
  };

  const goBackToLogin = () => {
    setMode('login');
    setError('');
    setResetSent(false);
  };

  // ── Forgot Password screen ──────────────────────────────────────────────
  if (mode === 'forgot') {
    return (
      <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className={styles.modal}>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>

          {resetSent ? (
            /* Success state */
            <div className={styles.resetSuccess}>
              <div className={styles.resetSuccessIcon}>
                <CheckCircle size={36} />
              </div>
              <h2 className={styles.title}>Check your inbox</h2>
              <p className={styles.resetSuccessText}>
                We've sent a password reset link to{' '}
                <strong>{form.email}</strong>. Click the link in the email to set a new password.
              </p>
              <p className={styles.resetSuccessHint}>
                Didn't receive it? Check your spam folder or try again.
              </p>
              <button className={styles.submitBtn} onClick={goBackToLogin}>
                Back to Login
              </button>
            </div>
          ) : (
            /* Send reset email form */
            <>
              <button
                type="button"
                className={styles.backBtn}
                onClick={goBackToLogin}
              >
                <ArrowLeft size={15} />
                Back to Login
              </button>

              <div className={styles.header}>
                <div className={styles.resetIcon}>
                  <Mail size={24} />
                </div>
                <h2 className={styles.title}>Forgot Password?</h2>
                <p className={styles.subtitle}>
                  Enter your email and we'll send you a link to reset your password.
                </p>
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="reset-email">Email *</label>
                  <input
                    className={styles.input}
                    type="email"
                    id="reset-email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    autoFocus
                  />
                </div>

                <button className={styles.submitBtn} type="submit" disabled={loading}>
                  {loading ? (
                    <div className={styles.spinner}></div>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className={styles.header}>
          <div className={styles.logoIcon}>A</div>
          <h2 className={styles.title}>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className={styles.subtitle}>
            {mode === 'login'
              ? 'Sign in to place your purchase order'
              : 'Register to start ordering from Amba Enterprises'}
          </p>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${mode === 'login' ? styles.activeTab : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            Login
          </button>
          <button
            className={`${styles.tab} ${mode === 'signup' ? styles.activeTab : ''}`}
            onClick={() => { setMode('signup'); setError(''); }}
          >
            Sign Up
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="auth-fullName">Full Name *</label>
                <input
                  className={styles.input}
                  type="text"
                  id="auth-fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="auth-phone">Phone</label>
                <input
                  className={styles.input}
                  type="tel"
                  id="auth-phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
              </div>
            </>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="auth-email">Email *</label>
            <input
              className={styles.input}
              type="email"
              id="auth-email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.passwordLabelRow}>
              <label className={styles.label} htmlFor="auth-password">Password *</label>
              {mode === 'login' && (
                <button
                  type="button"
                  className={styles.forgotLink}
                  onClick={() => { setMode('forgot'); setError(''); }}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <input
              className={styles.input}
              type="password"
              id="auth-password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              minLength={6}
              required
            />
          </div>

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? (
              <div className={styles.spinner}></div>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <p className={styles.switchText}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span className={styles.switchLink} onClick={switchMode}>
            {mode === 'login' ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}
