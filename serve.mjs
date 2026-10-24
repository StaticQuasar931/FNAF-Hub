import { createServer } from "node:http";
import { createReadStream, statSync } from "node:fs";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const mime = {".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".mjs":"text/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".gif":"image/gif"};

createServer((request, response) => {
  try {
    const url = new URL(request.url || "/", "http://127.0.0.1:8765");
    const decoded = decodeURIComponent(url.pathname);
    const target = resolve(root, `.${decoded}`);
    if (target !== root && !target.startsWith(root + sep)) {
      response.writeHead(403).end("Forbidden");
      return;
    }
    const path = statSync(target).isDirectory() ? resolve(target, "index.html") : target;
    response.writeHead(200, {"Content-Type":mime[extname(path)] || "application/octet-stream","Cache-Control":"no-store"});
    createReadStream(path).pipe(response);
  } catch {
    response.writeHead(404, {"Content-Type":"text/plain; charset=utf-8"}).end("Not found");
  }
}).listen(8765, "127.0.0.1", () => console.log("FNAF Hub preview: http://127.0.0.1:8765"));
