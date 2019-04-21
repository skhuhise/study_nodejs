var sanitizeHtml = require('sanitize-html');

module.exports = {
    html:function(title, list, body, control, login) {
        return `
        <!doctype html>
        <html>
        <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1><a href="/">Testing</a></h1>
            ${login}
            <a href="/author">author</a>
            <h2>${title}</h2>
            ${list}
            ${control}
            ${body}
        </body>
        </html>
        `;
    },

    login:function(isLogin) {
        if(isLogin) {
            return `
            <form action="/auth/logout" method="post">
                <input type="submit" value="logout" />
            </form>`;
        }

        return `<a href="/auth/login">login</a> | <a href="/auth/regist">regist</a>`;
    },

    list:function(topics) {
        var orderList = '<ol>';
        var unorderList = '<ul>';
        var i = 0;
    
        while(i < topics.length) {
            orderList = orderList + `<li><a href="/topic/${topics[i].id}">${sanitizeHtml(topics[i].title)}</a></li>`;
            unorderList = unorderList + `<li><a href="/topic/${topics[i].id}">${sanitizeHtml(topics[i].title)}</a></li>`;
            i++;
        }
    
        orderList += '</ol>';
        unorderList += '</ul>';
    
        var list = orderList + unorderList;
    
        return list;
    },
    authorSelect:function(select, selected) {
        var options = '';
        for(var i = 0; i < select.length; ++i) {
            var selectedTag = '';
            if(selected === select[i].id)
                selectedTag = 'selected';
                
            options = options + `<option value="${select[i].id}" ${selectedTag}>${sanitizeHtml(select[i].name)}</option>`
        }

        return `
        <select name="authorId">
            ${options}
        </select>`
    },
    authorTable:function(authors, isLogin) {
        var tag = '<table>';
        if(isLogin) {
            for(var i = 0; i < authors.length; ++i) {
                tag += `
                <tr>
                    <td>${sanitizeHtml(authors[i].name)}</td>
                    <td>${sanitizeHtml(authors[i].profile)}</td>
                    <td><a href="/author/update/${authors[i].id}">update</a></td>
                    <td>
                        <form action="/author/delete" method="post">
                            <input type="hidden" name="id" value=${authors[i].id} />
                            <input type="submit" value="delete" />
                        </form>
                    </td>
                </tr>
                `
            }
        }

        else {
            for(var i = 0; i < authors.length; ++i) {
                tag += `
                <tr>
                    <td>${sanitizeHtml(authors[i].name)}</td>
                    <td>${sanitizeHtml(authors[i].profile)}</td>
                </tr>
                `
            }
        }

        tag += '</table>';

        return tag;
    }

}