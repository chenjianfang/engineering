var webpack = require('webpack');
var path = require("path");

module.exports = {
	entry:{
		re_invest:['./src/js/re_invest.js']
	},
	output:{
		path:"dist/js/invest/",
		filename:'[name].js'
	},
	module:{
		loaders:[
			{ test: /\.js$/, exclude: /node_modules/, loader: "babel?presets[]=es2015"}
		]
	}
};
