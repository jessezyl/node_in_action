/**
 * Created by Jesse on 16/4/26.
 */

/**
 * 模块依赖
 * @type {User|exports|module.exports}
 */
var User = require('./model');
var Q = require('q');


/**
 * 创建测试用户
 * */


var testUsers = {
    'mark@facebook.com':{name:'Mark Zuckerberg'},
    'bill@microsoft.com':{name:'Bill Gate'},
    'jeff@amazon.com':{name:'Jeff Bezos'},
    'fred@fedex.com':{name:'Fred Smith'}
};

/**
 * 用于创建用户的函数
 * */
function create(users){
    console.log('test++');
    var defer = Q.defer();
    var defers = [];
    //var total = Object.keys(users).length;
    for (var i in users){
        (function (email, data) {
            var defer = Q.defer();
            var user = new User(email,data);
            user.save(function (err) {
                if (err) defer.reject(err);
                //--total || fn();
                defer.resolve('create ' + email + ' sucess!');
            });
            defers.push(defer.promise);
        })(i,users[i]);
    }

    Q.all(defers)
        .then(function (data) {
            for(var i in data){
                console.log(data[i]);
            }
            defer.resolve(users);
        }, console.error);

    return defer.promise;
}

/**
 * 用于水合用户的函数
 * */
function hydrate (users){
    var defer = Q.defer();
    var defers = [];
    //var total = Object.keys(users).length;
    for(var i in users){
        (function (email) {
            var defer = Q.defer();
            User.find(email, function (err, user) {
                if(err) defer.reject(err);
                users[email] = user;
                defer.resolve('hydrate user: ' + email + ' success.');
                //--total || fn();
            });
            defers.push(defer.promise);
        })(i);
    }

    Q.all(defers)
        .then(function (data) {
            for(var i in data){
                console.log(data[i]);
            }
            defer.resolve(users);
        },console.error);

    return defer.promise;
}

/**
 * 创建测试用户
 * */

//回调地狱版本
/*create(testUsers, function () {
    hydrate(testUsers, function () {
        testUsers['bill@microsoft.com'].follow('jeff@amazon.com', function (err) {
            if(err) throw err;
            console.log('+ bill followed jeff');

            testUsers['jeff@amazon.com'].getFollowers(function (err, users) {
                if(err) throw err;
                console.log("jeff's followers",users);

                testUsers['jeff@amazon.com'].getFriends(function (err, users) {
                    if(err) throw err;
                    console.log("jeff's friends",users);

                    testUsers['jeff@amazon.com'].follow('bill@microsoft.com', function (err) {
                        if(err) throw err;
                        console.log('+ jeff followed bill');

                        testUsers['jeff@amazon.com'].getFriends(function (err, users) {
                            if(err) throw err;

                            console.log("jeff's friends",users);
                            process.exit();
                        })
                    })
                })
            });
        });
    });
});*/


//Promise版本,非常漂亮的链式结构,当然可以用Q.denodeify简化
create(testUsers)
    .then(hydrate,console.error)
    .then(function (testUsers) {
        var defer = Q.defer();
        testUsers['bill@microsoft.com'].follow('jeff@amazon.com', function (err) {
            if(err) defer.reject(err);
            console.log('+ bill followed jeff');
            defer.resolve(testUsers);
        });
        return defer.promise;
    },console.error)
    .then(function (testUsers) {
        var defer = Q.defer();
        testUsers['jeff@amazon.com'].getFollowers(function (err, users) {
            if(err) defer.reject(err);
            console.log("jeff's followers",users);
            defer.resolve(testUsers);
        });
        return defer.promise;
    },console.error)
    .then(function (testUsers) {
        var defer = Q.defer();
        testUsers['jeff@amazon.com'].getFriends(function (err, users) {
            if(err) defer.reject(err);
            console.log("jeff's friends",users);
            defer.resolve(testUsers);
        });
        return defer.promise;
    },console.error)
    .then(function (testUsers) {
        var defer = Q.defer();
        testUsers['jeff@amazon.com'].follow('bill@microsoft.com', function (err) {
            if(err) defer.reject(err);
            console.log('+ jeff followed bill');
            defer.resolve(testUsers);
        });
        return defer.promise;
    },console.error)
    .then(function (testUsers) {
        var defer = Q.defer();
        testUsers['jeff@amazon.com'].getFriends(function (err, users) {
            if(err) defer.reject(err);
            console.log("jeff's friends",users);
            defer.resolve('done.');
        });
        return defer.promise;
    },console.error)
    .done(function (data) {
        console.log(data);
        process.exit();
    });

