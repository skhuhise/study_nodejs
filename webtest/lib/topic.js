const template = require('./template')
const pool = require('../db/pool')
const sanitizeHtml = require('sanitize-html')
const auth = require('./auth')

exports.home = async (req, res, next) => {
    let flashMessage = req.flash()
    let feedback = ''
    if(flashMessage.success) {
        feedback = flashMessage.success[0]
    }

    try {
        const conn = await pool.getConnection()
        let topics = await conn.query('select * from topic')
        await conn.release()

        let title = 'Welcome'
        let description = 'Hello, firends!'
        let body = `
        <div style="color : red">${feedback}</div>
        <h2>${title}</h1>${description}
        <img src="/image/hello.jpg" style="width:250px; display:block; margin-top:10px;"/>
        `
        let list = template.list(topics)
        let isLogin = auth.isLogin(req, res, next)
        let login = template.login(isLogin)
        let control = ''
        
        if(isLogin)
            control = `<a href="/topic/form">create</a>`
    
        let html = template.html(title, list, body, control, login)
    
        res.send(html)
    } catch(err) {
        return next(err)
    }
}

exports.page = async (req, res, next) => {
    let id = req.params.id

    try {
        const conn = await pool.getConnection()
        let topics = await conn.query('select * from topic')
        let topic = await conn.query(`select * from topic left join author on topic.authorId = author.id where topic.id = ?`, [id])
        await conn.release()

        if(topic[0] === undefined) return next('route')

        let topicModel = require('../model/topic')(topic[0])
        let list = template.list(topics)
        let body = `<h2>${sanitizeHtml(topicModel.title)}</h2>${sanitizeHtml(topicModel.description)} <p>by ${sanitizeHtml(topicModel.authorName)}</p>`
        let isLogin = auth.isLogin(req, res, next)
        let login = template.login(isLogin)
        let control = ''

        if(isLogin)
            control = `
                <a href="/topic/form">create</a>
                <a href="/topic/update/${id}">update</a>
                <form action="/topic/delete" method="post">
                    <input type="hidden" name="id" value=${id} />
                    <input type="submit" value="delete" />
                <form>
                `

        let html = template.html(topicModel.title, list, body, control, login)

        res.send(html)
    } catch(err) {
        return next(err)
    }
}

exports.create = async (req, res, next) => {
    try {
        const conn = await pool.getConnection()
        let topics = await conn.query('select * from topic')
        let authors = await conn.query('select * from author')
        await conn.release()

        let title = 'Create'
        let authorSelect = template.authorSelect(authors, 0)
        let list = template.list(topics)
        let body = `
        <form action="/topic/create" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
                ${authorSelect}
            </p>
            <p>
                <input type="submit" value="create">
            </p>
        </form>`
        let login = `
        <form action="/auth/logout" method="post">
            <input type="submit" value="logout" />
        </form>`
        let control = ''

        let html = template.html(title, list, body, control, login)

        res.send(html)
    } catch(err) {
        return next(err)
    }
}

exports.createProcess = async (req, res, next) => {
    let isLogin = auth.isLogin(req, res, next)
    if(!isLogin) {
        res.redirect('/')
        return false
    }
    let topic = require('../model/topic')(req.body)

    try {
        const conn = await pool.getConnection()
        let result = await conn.query('insert into topic(title, description, created, authorId) values(?, ?, now(), ?)', [topic.title, topic.description, topic.authorId])
        await conn.release()
        let id = result.insertId
        res.redirect(`/topic/${id}`)
    } catch(err) {
        return next(err)
    }
}

exports.update = async (req, res, next) => {
    let isLogin = auth.isLogin(req, res, next)
    if(!isLogin) {
        res.redirect('/')
        return false
    }
    let id = req.params.id

    try {
        const conn = await pool.getConnection()
        let topics = await conn.query('select * from topic')
        let topic = await conn.query(`select * from topic where id = ?`, [id])
        let authors = await conn.query('select * from author')
        await conn.release()
        let title = 'Update'
        let topicModel = require('../model/topic')(topic[0])
        let authorSelect = template.authorSelect(authors, topicModel.authorId)
        let body = `
        <form action="/topic/update" method="post">
            <input type="hidden" name="id" value="${topicModel.id}" />
            <p><input type="text" name="title" placeholder="title" value="${sanitizeHtml(topicModel.title)}"></p>
            <p>
                <textarea name="description" placeholder="description">${sanitizeHtml(topicModel.description)}</textarea>
            </p>
            <p>
                ${authorSelect}
            </p>
            <p>
                <input type="submit" value="update">
            </p>
        </form>`
        let list = template.list(topics)
        let control = ''
        login = `
            <form action="/auth/logout" method="post">
                <input type="submit" value="logout" />
            </form>`

        let html = template.html(title, list, body, control, login)

        res.send(html)
    } catch(err) {
        return next(err)
    }
}

exports.updateProcess = async (req, res, next) => {
    let isLogin = auth.isLogin(req, res, next)
    if(!isLogin) {
        res.redirect('/')
        return false
    }

    let topic = require('../model/topic')(req.body)

    try {
        const conn = await pool.getConnection()
        await conn.query('update topic set title = ?, description = ?, authorId = ? where id = ?', [topic.title, topic.description, topic.authorId, topic.id])
        await conn.release()
        res.redirect(`/topic/${topic.id}`)
    } catch(err) {
        return next(err)
    }
}

exports.deleteProcess = async (req, res, next) => {
    let isLogin = auth.isLogin(req, res, next)
    if(!isLogin) {
        res.redirect('/')
        return false
    }
    let post = req.body
    let id = post.id

    try {
        const conn = await pool.getConnection()
        await conn.query('delete from topic where id = ?', [id])
        await conn.release()
        res.redirect('/')
    } catch(err) {
        return next(err)
    }
}