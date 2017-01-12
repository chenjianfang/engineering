//添加压缩的头信息
var pkg = require('../package.json');
var banner = ['/**',
	'*<%= pkg.name %> - <%= pkg.description %>',
	'* @authors <%= pkg.author %>',
	'* @version <%= pkg.version %>',
	'* @link <%= pkg.homepage %>',
	'* @link <%= pkg.description %>',
	'* @license <%= pkg.license %>',
	'*/',
	''
].join('\n');

gulpTask("re_invest",{
	"sj":"src/js/",
	"gj":"dist/js/invest/",
	"sc":"src/scss/",
	"gc":"dist/css/invest/"
},true);

function gulpTask(projectName,fileUrl,webpackBool){
	var gulp = require("gulp");
	var webpack = require("webpack");
	var sass = require('gulp-sass');
	var uglify = require('gulp-uglify');
	var minifyCSS = require('gulp-minify-css');
	var concat = require('gulp-concat');
	var rename = require('gulp-rename');
	var webpackConfig = require("./webpack.config.js");
	var header = require('gulp-header');
	var taskArr = [];

	var sourceFile_js = fileUrl.sj; //js的源文件
	var getFile_js = fileUrl.gj; //生成js的目录 小心

	var sourceFile_scss = fileUrl.sc;  //scss源文件
	var getFile_css = fileUrl.gc //生成css的目录 小心
	var webpackBool = webpackBool || false;
	/*
	* webpack 编译
	* 
	*/
	if( webpackBool ){
		gulp.task('webpack',function(callback){
			var myConfig = Object.create(webpackConfig);
			webpack(
				myConfig
			,function(err,stats){
				callback();
			});
		});
		gulp.task('auto-webpack',function(){
			gulp.watch(sourceFile_js+'*.js',['webpack']);
		});

		taskArr = [
			'webpack',
			'sass',
			'js-uglify',
			'css-uglify',
			'auto',
			'auto-webpack'
		]
	}else{
		taskArr = [
			'sass',
			'js-uglify',
			'css-uglify',
			'auto'
		]
	}


	/*
	* sass 编译  ------> 引用 gulp-sass 包进行编译
	* 入口地址 'src/scss/*.scss'
	* 出口地址 '../../css/test' 例如：往上两层文件夹的css目录下的test文件夹
	*
	*/
	gulp.task('sass',function(){
		gulp.src(sourceFile_scss+'*.scss')
		.pipe(sass().on('error',sass.logError))
		.pipe(gulp.dest(getFile_css));
	});

	/*
	* 合并压缩JS文件  ------> 引用 gulp-uglify gulp-concat 包进行编译
	* 入口地址 'dist/js/*.js' ，dist/js 目录下的所有js文件都会被合并并压缩
	* 出口地址 'dist/js/uglify'  合并压缩的文件保存在此目录
	*
	*/
	gulp.task('js-uglify',function(){
		gulp.src(getFile_js + projectName+'.js')
			.pipe(rename({suffix:'.min'}))
			.pipe(uglify())
			.pipe(header(banner,{pkg:pkg}))
			.pipe(gulp.dest(getFile_js + 'uglify'))
	});

	gulp.task('js-flexible-uglify',function(){
		gulp.src(getFile_js+'flexible.js')
			.pipe(concat(getFile_js+'flexible_css.js'))
			.pipe(rename({suffix:'.min'}))
			.pipe(uglify())
			.pipe(gulp.dest(getFile_js + 'uglify'))
	});

	/*
	* 压缩合并CSS  ------> 引用 gulp-minify-css gulp-concat 包进行编译
	* 入口地址 'dist/js/*.js'
	* 出口地址 'dist/uglify/js'
	*
	*/
	gulp.task('css-uglify',function(){
		gulp.src(getFile_css + projectName + '.css')
		.pipe(rename({suffix:'.min'}))
		.pipe(minifyCSS())
		.pipe(header(banner,{pkg:pkg}))
		.pipe(gulp.dest(getFile_css+'uglify'))
	});


	gulp.task('auto',function(){
		gulp.watch(sourceFile_scss+'*.scss',['sass']);
		gulp.watch(getFile_js+'*.js',['js-uglify']);
		gulp.watch(getFile_css + '*.css',['css-uglify']);
	});

	gulp.task('default',taskArr);
}



