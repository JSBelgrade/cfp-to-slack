'use strict'

const Hapi    = require('hapi')
    , Boom    = require('boom')
    , Request = require('request')

let server = new Hapi.Server()

server.connection({
  port: process.env.PORT || 3000
})

server.route({
  method: 'GET',
  path:   '/',
  handler(request, reply) {
    reply('Hello, hello!')
  }
})

server.route({
  method: 'POST',
  path:   '/',
  handler(request, reply) {
    // if (request.headers['x-hub-signature'] !== process.env.GH_SECRET)
    //  return reply(Boom.unauthorized('Not so fast!'))
    
    if (request.headers['x-github-event'] !== 'issues')
      return reply('🙈 ')

    let response = {
      channel:  process.env.SLACK_CHANNEL,
      username: "JS Belgrade CFP",
      icon_url: "https://raw.githubusercontent.com/jsbelgrade/assets/master/logo/JSBelgrade-logo-512.png",
      text:     `*<${request.payload.issue.user.url}|${request.payload.issue.user.login}>* submitted a new talk proposal: "${request.payload.issue.title}". Check it here: <${request.payload.issue.url}|${request.payload.issue.url}>.`
    }

    Request.post(process.env.SLACK_URL).form({payload: JSON.stringify(response)})

    reply('Thanks Github!')
  }
})

server.start(() => console.log(`Server running at: ${server.info.uri}`))
