module.exports = {
    html:function(title, list, body, control) {
        return `
        <!doctype html>
        <html>
        <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1><a href="/">Testing</a></h1>
            <h2>${title}</h2>
            ${list}
            ${control}
            ${body}
        </body>
        </html>
        `;
    },

    list:function(topics) {
        var orderList = '<ol>';
        var unorderList = '<ul>';
        var i = 0;
    
        while(i < topics.length) {
            orderList = orderList + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
            unorderList = unorderList + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
            i++;
        }
    
        orderList += '</ol>';
        unorderList += '</ul>';
    
        var list = orderList + unorderList;
    
        return list;
    },
    selectAuthor:function(select, selected) {
        var options = '';
        for(var i = 0; i < select.length; ++i) {
            var selectedTag = '';
            if(selected === select[i].id)
                selectedTag = 'selected';
                
            options = options + `<option value="${select[i].id}" ${selectedTag}>${select[i].name}</option>`
        }

        return `
        <select name="author">
            ${options}
        </select>`
    }
}