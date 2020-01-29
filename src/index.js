const express = require('express')

const server = express()

const projects = []
var reqNum = 0

server.use(express.json())

function checkProjectExists (req, res, next ) {
	const { id } = req.params
	const exist = projects.find(p => p.id == id)
	if(!exist){
		return res.status(400).json({error: 'Projeto Não Encontrado'})
	}
	return next()
}

function reqCount (req, res, next ){

	console.log('Número de Requisições: ', ++reqNum)
	next()
}

server.post('/projects', reqCount, (req, res) => {
	const { id, title } = req.body
	const project = {
		id,
		title,
		tasks: []
	}

	projects.push(project)
	return res.send(project)
})

server.get('/projects', reqCount, (req, res) => {
	return res.send(projects)
})

server.put('/projects/:id', checkProjectExists, reqCount, (req, res) => {
	const { id } = req.params
	const { title } = req.body
	const indice = projects.findIndex(p => p.id == id)
	projects[indice].title = title
	return res.send(projects[indice])
})

server.post('/projects/:id/tasks', checkProjectExists, reqCount, (req, res) => {
	const { id } = req.params
	const project = projects.find(p => p.id == id)
	project.tasks.push(req.body.title)
	return res.json(project.tasks)
})

server.listen(3000)