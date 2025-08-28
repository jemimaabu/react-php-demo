# React + PHP Form Demo

This minimal demo shows a React front-end form with client-side validation and a PHP endpoint that validates and accepts JSON submissions.

How to run (macOS / zsh):

1. Run the PHP built-in server from the workspace root.

```bash
php -S localhost:8000 -t .
```

2. Open http://localhost:8000/index.php in your browser.

3. Try submitting the form. The page uses `fetch` to POST JSON to `submit.php`.

Quick curl test (server must be running):

```bash
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","message":"Hello from curl"}' \
  http://localhost:8000/submit.php | jq
```

Notes:
- This demo uses CDN React and Babel for simplicity. For production, build React with a bundler and avoid Babel-standalone.
- The PHP endpoint performs the same validations as the client and returns JSON.
