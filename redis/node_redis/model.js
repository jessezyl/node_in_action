/**
 * Created by Jesse on 16/4/26.
 */

/**
 * 模块依赖
 * */
var redis = require('redis');


/**
 * 创建客户端
 * */

var client = redis.createClient();


/**
 * 用户模型
 */

function User (id,data){
    this.id = id;
    this.data = data;
}

User.find = function(id,fn){
    client.hgetall('user:' + id + ':data', function (err, obj) {
        if(err) return fn(err);
        fn(null,new User(id,obj));
    })
};

User.prototype.save = function (fn) {
    if(!this.id){
        this.id = String(Math.random()).substr(3);
    }

    client.hmset('user:' + this.id + ':data', this.data, fn);
};

User.prototype.follow = function (user_id, fn) {
    client.multi()
        .sadd('user:' + user_id + ':followers', this.id)
        .sadd('user:' + this.id + ':follows', user_id)
        .exec(fn);
};

User.prototype.unfollow = function (user_id, fn) {
    client.multi()
        .srem('user:' + user_id + 'followers', this.id)
        .srem('user:' + this.id + 'follows', user_id)
        .exec(fn);
};

User.prototype.getFollowers = function (fn) {
    client.smembers('user:' + this.id + ':followers', fn);
};

User.prototype.getFollows = function (fn) {
    client.smembers('user:' + this.id + ':follows',fn);
};

User.prototype.getFriends = function (fn) {
    client.sinter('user:' + this.id + ':follows', 'user:' + this.id + ':followers',fn);
};


module.exports = User;
