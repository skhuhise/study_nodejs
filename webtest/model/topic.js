module.exports = (obj) => {
    var topic = {
        id : '',
        title : '',
        description : '',
        created : '',
        authorId : '',
        authorName : ''
    }
    
    topic.id = obj.id;
    topic.title = obj.title;
    topic.description = obj.description;
    topic.created = obj.created;
    topic.authorId = obj.authorId;
    topic.authorName = obj.name;

    return topic;
}