/**
 * Created by Jesse on 16/4/26.
 */

/**
 * 模块依赖
 * @type {User|exports|module.exports}
 */
var User = require('./model');


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
function create(users, fn){
    var total = Object.keys(users).length;
    for (var i in users){
        (function (email, data) {
            var user = new User(email,data);
            user.save(function (err) {
                if (err) throw err;
                --total || fn();
            });
        })(i,users[i]);
    }
}

/**
 * 用于水合用户的函数
 * */
function hydrate (users, fn){
    var total = Object.keys(users).length;
    for(var i in users){
        (function (email) {
            User.find(email, function (err, user) {
                if(err) throw err;
                users[email] = user;
                --total || fn();
            });
        })(i);
    }
}

/**
 * 创建测试用户
 * */
create(testUsers, function () {
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
});