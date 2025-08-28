

# React + PHP Form Demo

This minimal demo shows a React front-end form with client-side validation and a PHP endpoint that validates and accepts JSON submissions.

### Requirements
- PHP 7.4+ installed and available on your PATH
- A modern browser (Chrome, Safari, Firefox)

### Run the project locally

This project includes a small helper script, `start.sh`, that starts the PHP built-in web server in the background, opens your browser, and writes a logfile and PID file for easy management.

1) Make the helper executable (only needed once):

```bash
chmod +x ./start.sh
```

2) Start the dev server from the project root (default port 8000):

```bash
./start.sh
```

Or specify a different port:

```bash
./start.sh 8080
```

The script will:
- Start `php -S` in the background
- Write logs to `/tmp/react-php-server.log`
- Save the server PID to `/tmp/react-php-server.pid`
- Open your browser to `http://localhost:<PORT>/index.php`

If you prefer to start the server manually, the equivalent command is still:

```bash
php -S localhost:8000 -t .
```

#### Stopping the dev server

If you used `start.sh` (recommended) the script writes a PID file and a log in `/tmp`.

macOS / Linux (when using `start.sh`):

```bash
# stop using the PID file the script writes
kill "$(cat /tmp/react-php-server.pid)" 2>/dev/null || echo "process not found"
rm -f /tmp/react-php-server.pid

# optionally confirm the port is free (default 8000)
lsof -i :8000
```

macOS / Linux (if you started php manually in background):

```bash
# find and kill by port 
lsof -i :8000 -t | xargs -r kill
```

### What to expect
- The page should render a contact form (React mounts into `<div id="root"></div>`).
- Form submissions use `fetch` to POST JSON to `submit.php` and will show a success or validation message.

### Notes
- This setup uses babel-standalone and CDN React which are convenient for demos but not suitable for production. For production, build `app.jsx` with a bundler (Vite/webpack) and serve the compiled assets.
- The PHP `submit.php` included here is a simple demo and does not persist data — add proper sanitization, CSRF protection, and storage if you productionize the app.

