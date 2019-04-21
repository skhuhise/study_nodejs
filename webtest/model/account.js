module.exports = (obj) => {
    var account = {
        id : '',
        email : '',
        password : '',
        nickname : ''
    }

    account.id = obj.id;
    account.email = obj.email;
    account.password = obj.password;
    account.nickname = obj.nickname;

    return account;
}