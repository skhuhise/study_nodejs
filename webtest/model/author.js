module.exports = (obj) => {
    var author = {
        id : '',
        name : '',
        profile : '',
    }

    author.id = obj.id;
    author.name = obj.name;
    author.profile = obj.profile;

    return author;
}