import * as http from 'http'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'

import { DbWatcher } from './dbWatcher'
import { configureRoutes } from './routes'
import { configureRedisClient } from './redis'
import { configureSockets } from './sockets'
import { JolocomLib } from 'jolocom-lib'
import { privateIdentityKey } from '../config'

const app = express()
const server = new http.Server(app)

app.use(express.static('dist'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

const { getAsync, setAsync, delAsync } = configureRedisClient()
const registry = JolocomLib.registry.jolocom.create()

configureRoutes(app, {setAsync, getAsync, delAsync})

registry.authenticate(privateIdentityKey).then(identityWallet => {
  configureSockets(server, identityWallet, new DbWatcher(getAsync), {getAsync, setAsync, delAsync})
})

server.listen(9000, () => {
  console.log('Demo service started, listening on port 9000')
})
