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

    list:function(fileList) {
        var orderList = '<ol>';
        var unorderList = '<ul>';
        var i = 0;
    
        while(i < fileList.length) {
            orderList = orderList + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
            unorderList = unorderList + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
            i++;
        }
    
        orderList += '</ol>';
        unorderList += '</ul>';
    
        var list = orderList + unorderList;
    
        return list;
    }
}