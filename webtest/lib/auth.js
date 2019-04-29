const template = require('./template')
const pool = require('../db/pool')

exports.login = async (req, res, next) => {
    if(req.user) {
        res.redirect('/')
        return false
    }
    let flashMessage = req.flash()
    let feedback = ''
    if(flashMessage.error) {
        feedback = flashMessage.error[0]
    }

    try {
        const conn = await pool.getConnection()
        let topics = await conn.query('select * from topic')
        await conn.release()

        let title = 'Login'
        let body = `
        <div style="color : red;">${feedback}</div>
        <form action="/auth/login" method="post">
            <p><input type="text" name="email" placeholder="email"></p>
            <p><input type="password" name="password" placeholder="password"></p>
            <p><input type="submit" value="create" /></p>
        </form>`
        let control = ''
        let login = template.login(false)
        let list = template.list(topics)
        let html = template.html(title, list, body, control, login)

        res.send(html)
    } catch(err) {
        return next(err)
    }
}

exports.regist = async (req, res, next) => {
    if(req.user) {
        res.redirect('/')
        return false
    }
    let flashMessage = req.flash()
    let feedback = ''
    if(flashMessage.error) {
        feedback = flashMessage.error[0]
    }

    try {
        const conn = await pool.getConnection()
        let topics = await conn.query('select * from topic')
        await conn.release()

        let title = 'Regist'
        let body = `
        <div style="color : red;">${feedback}</div>
        <form action="/auth/regist" method="post">
            <p><input type="text" name="email" placeholder="email"></p>
            <p><input type="password" name="password" placeholder="password"></p>
            <p><input type="password" name="passwordValid" placeholder="password"></p>
            <p><input type="text" name="nickname" placeholder="nickname"></p>
            <p><input type="submit" value="create" /></p>
        </form>`
        let control = ''
        let login = template.login(false)
        let list = template.list(topics)
        let html = template.html(title, list, body, control, login)

        res.send(html)
    } catch(err) {
        return next(err)
    }
}

exports.registProcess = async (req, res, next) => {
    if(req.user) {
        res.redirect('/')
        return false
    }
    let account = require('../model/account')(req.body)

    try {
        const conn = await pool.getConnection()
        await conn.query('insert into account(email, password, nickname) values(?, ?, ?)', [account.email, account.password, account.nickname])
        await conn.release()
        res.redirect(`/`)
    } catch(err) {
        return next(err)
    }
}

exports.logout = async (req, res, next) => {
    req.logout()
    req.session.save(function(){
        res.redirect('/')
    })
}

exports.isLogin = (req, res, next) => {
    if(req.user) {
        return true
    }

    else {
        return false
    }
}