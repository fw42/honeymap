class HttpServer
  constructor: (port, cache) ->
    @http = require('http').createServer(@handler)
    @port = port || 80
    @url = require('url')
    ns = require('node-static')
    @static = new(ns.Server)("../client", { cache: cache || 600 })

  listen: ->
    @http.listen(@port)

  handler: (req, res) =>
    try
      @static.serve(req, res, (err, _) ->
        unless err
          HttpServer.log(req)
          return
        HttpServer.log(req, err.status)
        res.writeHead(err.status, err.headers)
        res.end()
      )
    catch err
      console.error(err)
      res.writeHead(500)
      res.end('Internal Server Error')

  @log: (req, status) ->
    console.log("[HttpServer] %s:%d %s %s",
      req.connection.remoteAddress, req.connection.remotePort, status || "OK", req.url)
