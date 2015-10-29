var express = require('express');
var router = express.Router();
var request=require("request");
var cheerio=require("cheerio");

var goldenPrize;

request('https://news.ycombinator.com/', function(error, response, html){
    if (!error && response.statusCode == 200) {
        var hasJavascript = (getFirstTitle(html, '.title a', checkForKeyword));
        if (hasJavascript) {
            request('https://www.reddit.com/r/Web_Development/', function(error, response, html){
                var hasJavascript2 = getFirstTitle(html, '.title .may-blank', checkForKeyword);
                if(hasJavascript2){
                    request('https://developer.mozilla.org/en-US/docs/Web/JavaScript', function(error, response, html){
                        if (!error && response.statusCode == 200) {
                            console.log(html);
                            goldenPrize = getFirstImg(html, 'https://developer.mozilla.org/en-US/docs/Web/JavaScript');
                            return goldenPrize;
                        }
                    });
                }
            });
        }
        else {
            request('https://www.python.org/', function(error, response, html){
                if (!error && response.statusCode == 200) {
                    goldenPrize = getFirstImg(html, 'https://www.python.org');
                    return goldenPrize;
                }
            });
        }
    }
});

function getFirstTitle(html, selectorQuery, cb){
    var $ = cheerio.load(html);
    // isolate first title
    var title = ($.html(selectorQuery).split('>')[1].split(" "));
    // clean it up
    var lastWord = title.splice(title.length-1, 1);
    lastWord = lastWord[0].split('');
    lastWord.splice(-3, 3);
    title.push(lastWord.join(""));
    return cb(title);
}

function getFirstImg(html, url) {
    var $ = cheerio.load(html);
    console.log("$$$:", $('img').attr('src'));
    var src = $('img').attr('src');
    var pic = url + src;
    return pic;
};

function checkForKeyword(title){
    return (title.indexOf('javascript') !== -1);
}

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', img: goldenPrize });
});

router.get('/goldenPrize', function(req, res, next) {
  res.json({img: goldenPrize});
});

module.exports = router;
