// src/server/server.ts
function EnableHotReload() {
  const socket = new WebSocket(server_ws);
  socket.addEventListener('message', (event) => {
    if (event.data === 'reload') {
      window.location.reload();
    }
  });
}
var host = '127.0.0.1';
var port = '8000';
var server_ws = `ws://${host}:${port}`;
var server_http = `http://${host}:${port}`;

// src/hotreload.bundle.ts
EnableHotReload();

//# debugId=5B9A0A644F282C2264756E2164756E21
//# sourceMappingURL=hotreload.bundle.js.map
