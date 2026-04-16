function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-type": "application/json" });
  return res.end(JSON.stringify(data));
}

module.exports = { sendJSON };
