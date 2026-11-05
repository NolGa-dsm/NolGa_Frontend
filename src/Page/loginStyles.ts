export const loginStyles = `
.login {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}

/* Brand panel */
.login__brand {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 clamp(32px, 8vw, 120px);
  background:
    radial-gradient(
      ellipse at 20% 0%,
      rgba(var(--primary-rgb), 0.12),
      transparent 60%
    ),
    var(--bg);
}

.logo {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text);
  margin: 0 0 72px;
}

.login__headline {
  margin: 0 0 20px;
  font-size: clamp(32px, 3.4vw, 44px);
  line-height: 1.25;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.login__desc {
  margin: 0;
  max-width: 440px;
  color: var(--text-muted);
  font-size: 16px;
  line-height: 1.7;
}

.login__stats {
  display: flex;
  gap: 40px;
  margin-top: 64px;
  padding-top: 40px;
  max-width: 440px;
}

.stat__value {
  display: block;
  font-size: 24px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.stat__label {
  display: block;
  margin-top: 4px;
  font-size: 13px;
  color: var(--text-faint);
}

/* Form panel */
.login__panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  background: var(--surface);
}

.card {
  width: 100%;
  max-width: 420px;
}

.tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 4px;
  margin-bottom: 40px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.tab {
  padding: 11px 0;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--text-muted);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.tab:hover {
  color: var(--text);
}

.tab[aria-selected='true'] {
  background: var(--surface-2);
  color: var(--text);
}

.card__title {
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.card__subtitle {
  margin: 0 0 32px;
  color: var(--text-muted);
  font-size: 15px;
}

.field {
  display: block;
  margin-bottom: 20px;
}

.field__label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
}

.field__input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg);
  color: var(--text);
  font-size: 15px;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.field__input::placeholder {
  color: var(--text-faint);
}

.field__input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--focus-ring);
}

.error {
  margin: -4px 0 16px;
  font-size: 13px;
  color: var(--error);
}

.notice {
  margin: 0 0 16px;
  font-size: 13px;
  color: var(--primary);
}

.btn {
  width: 100%;
  height: 48px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, opacity 0.15s;
}

.btn:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.btn--primary {
  margin-top: 4px;
  border: 0;
  background: var(--primary);
  color: var(--primary-ink);
}

.btn--primary:hover:not(:disabled) {
  background: var(--primary-hover);
}

.btn--primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn--outline {
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
}

.btn--outline:hover {
  border-color: var(--text-faint);
  background: var(--surface-2);
}

.divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 28px 0;
  color: var(--text-faint);
  font-size: 13px;
}


.help {
  margin: 24px 0 0;
  font-size: 13px;
  color: var(--text-faint);
}

@media (max-width: 860px) {
  .login {
    grid-template-columns: 1fr;
  }

  .login__brand {
    display: none;
  }

  .login__panel {
    background: var(--bg);
  }
}
`
