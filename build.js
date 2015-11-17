    
var Metalsmith = require('metalsmith');
//var serve = require('metalsmith-serve');
var templates = require('metalsmith-templates');
var partial = require('metalsmith-partial');
var nunjucks = require('nunjucks');
var debug = require('metalsmith-debug');
var asset = require('metalsmith-static');
var sass = require('metalsmith-sass');



Metalsmith(__dirname)
    .use(debug())
    .use(templates({
		"directory": "./templates",
		"engine": "nunjucks",
    }))
//.use(asset({"src": "styles/", "dest": "device/styles"})
    .use(sass({
		"outputStyle": "expanded",
                "outputDir": "css/"
    }))
		
//     .use(serve({
// 		"port": 8081,
// 		    "verbose": true
// 		    }))
//     .use(watch())
    .destination('./dist')
    .build(function(err) {
	    if (err) {
		console.log(err);
		throw err;
	    }
	});
	