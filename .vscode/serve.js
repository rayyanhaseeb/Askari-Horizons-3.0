const http = require("http");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const contentTypes = {
	".html": "text/html; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".svg": "image/svg+xml",
	".webp": "image/webp",
};

http
	.createServer((request, response) => {
		let pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
		if (pathname === "/") pathname = "/index.html";

		const file = path.resolve(root, `.${pathname}`);
		if (!file.startsWith(root + path.sep)) {
			response.writeHead(403).end("Forbidden");
			return;
		}

		fs.readFile(file, (error, data) => {
			if (error) {
				response.writeHead(404).end("Not found");
				return;
			}
			response
				.writeHead(200, {
					"Content-Type": contentTypes[path.extname(file)] || "application/octet-stream",
				})
				.end(data);
		});
	})
	.listen(8000, "127.0.0.1", () => {
		console.log("Askari Academy running at http://localhost:8000");
	});
