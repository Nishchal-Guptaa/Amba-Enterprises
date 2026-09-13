import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../lib/apiClient';
import styles from './UpdatePasswordPage.module.css';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const tokenHash = new URLSearchParams(window.location.search).get('token_hash');
      const endpoint = tokenHash
        ? '/api/auth/reset-password'
        : '/api/auth/update-password';
      const body = tokenHash
        ? { tokenHash, newPassword: password }
        : { newPassword: password };

      await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
      });
    } catch (updateError) {
      setLoading(false);
      setError(updateError.message || 'Could not update your password. Please try again.');
      return;
    }

    setLoading(false);
    setMessage('Your password has been updated. You can now sign in with your new password.');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <h1>Update Password</h1>
        <p className={styles.subtitle}>Choose a new password for your account.</p>

        {error && <div className={styles.error}>{error}</div>}
        {message && <div className={styles.success}>{message}</div>}

        {!message && (
          <form onSubmit={handleSubmit}>
            <label htmlFor="new-password">New password</label>
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              autoComplete="new-password"
              required
            />

            <label htmlFor="confirm-password">Confirm password</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={6}
              autoComplete="new-password"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        <Link className={styles.backLink} to="/">
          Back to home
        </Link>
      </div>
    </section>
  );
}
