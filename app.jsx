const { useState } = React;

function validate(values) {
  const errors = {};
  if (!values.name || values.name.trim().length < 2) {
    errors.name = 'Name is required (min 2 chars)';
  }
  const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!values.email || !emailRe.test(values.email)) {
    errors.email = 'Valid email is required';
  }
  if (!values.message || values.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }
  return errors;
}

function validateField(name, value) {
  const v = value == null ? '' : String(value);
  if (name === 'name') {
    if (!v.trim() || v.trim().length < 2) return 'Name is required (min 2 chars)';
    return null;
  }
  if (name === 'email') {
    const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!v || !emailRe.test(v)) return 'Valid email is required';
    return null;
  }
  if (name === 'message') {
    if (!v.trim() || v.trim().length < 10) return 'Message must be at least 10 characters';
    return null;
  }
  return null;
}

function App() {
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((s) => ({ ...s, [name]: value }));
    // Optionally clear the error while typing if the field becomes valid
    if (errors[name]) {
      const err = validateField(name, value);
      setErrors((prev) => {
        if (!err) {
          const copy = { ...prev };
          delete copy[name];
          return copy;
        }
        return { ...prev, [name]: err };
      });
    }
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    const err = validateField(name, value);
    setErrors((prev) => {
      if (err) return { ...prev, [name]: err };
      if (prev[name]) {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      }
      return prev;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerMsg(null);
    const clientErrors = validate(values);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length) return;

    setLoading(true);
    try {
      const res = await fetch('submit.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.success) {
        const displayName = values.name ? values.name.trim() : '';
        const defaultMsg = `Thanks${displayName ? ', ' + displayName : ''}, your message was received`;
        setServerMsg({ type: 'success', text: data.message || defaultMsg });
        setValues({ name: '', email: '', message: '' });
        setErrors({});
      } else {
        setServerMsg({ type: 'error', text: data.message || 'Submission failed' });
        if (data.errors) setErrors(data.errors);
      }
    } catch (err) {
      setServerMsg({ type: 'error', text: 'Network or server error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Contact (React + PHP demo)</h1>
      <form onSubmit={handleSubmit} noValidate>
        <label>
          Name
          <input name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} />
          {errors.name && <div className="error">{errors.name}</div>}
        </label>

        <label>
          Email
          <input name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} />
          {errors.email && <div className="error">{errors.email}</div>}
        </label>

        <label>
          Message
          <textarea name="message" rows="6" value={values.message} onChange={handleChange} onBlur={handleBlur} />
          {errors.message && <div className="error">{errors.message}</div>}
        </label>

        <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send'}</button>
      </form>

      {serverMsg && (
        <div style={{ marginTop: 12 }} className={serverMsg.type === 'success' ? 'success' : 'error'}>
          {serverMsg.text}
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
