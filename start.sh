#!/usr/bin/env zsh
set -euo pipefail

PORT=${1:-8000}
DIR="$(cd "$(dirname "$0")" && pwd)"

# Ensure php is available
if ! command -v php >/dev/null 2>&1; then
  echo "php not found on PATH. Install PHP or add it to PATH." >&2
  exit 1
fi

# Check if port is in use
if lsof -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port $PORT already in use. Choose another port or stop the process using it." >&2
  exit 1
fi

LOG=/tmp/react-php-server.log
PIDFILE=/tmp/react-php-server.pid

# Start server in background and save PID
php -S localhost:"$PORT" -t "$DIR" > "$LOG" 2>&1 &
PID=$!
echo $PID > "$PIDFILE"

echo "Started PHP dev server (PID $PID) on http://localhost:$PORT"
# Give server a short moment to start
sleep 0.2

# Open the browser to the index page
open "http://localhost:$PORT/index.php"

echo "Server log: $LOG"
echo "To stop the server: kill $PID (or kill \$(cat $PIDFILE) && rm $PIDFILE)"
