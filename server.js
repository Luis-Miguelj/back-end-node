import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { DatabaseMemory } from './database-memory.js'
import { DatabasePostgres } from './database-postgres.js'

const server = fastify()

server.register( fastifyCors, {
  origin: 'http://localhost:3000/',
  methods: ['GET, POST, PUT, DELETE']
})

const database = new DatabasePostgres()
//POST http://localhost:3333/videos

server.post('/videos', async (request, response)=>{
  const { title, description, duration } = request.body
  // console.log(body)

  await database.create({
    title,
    description,
    duration,
  })

  return response.status(201).send()
})

server.get('/videos',async (request, response)=>{
  const search = request.query.search


  const videos = database.list(search)

  return videos
})

server.put('/videos/:id', async (request, response)=>{
  const videosId = request.params.id
  const { title, description, duration } = request.body

  await database.update(videosId, {
    title,
    description,
    duration,
  })

  return response.status(204).send()
})

server.delete('/videos/:id', async (request, response)=>{
  const videosId = request.params.id
  await database.delete(videosId)

  return response.status(204).send()
})


server.listen({
  host: '0.0.0.0',
  port: process.env.PORT ?? 3333,
})