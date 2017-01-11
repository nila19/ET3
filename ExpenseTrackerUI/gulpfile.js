var gulp = require('gulp'),
	runSequence = require('run-sequence'),
	streamqueue = require('streamqueue'),
	del = require('del'),
	chalk = require('chalk'),
	supportsColor = require('supports-color'),
	gulpif = require('gulp-if'),
	plugins = require('gulp-load-plugins')();

plugins.util.colors = chalk;

//****************************** Intermediate path variables ******************************//
var	dir = {
	src: 'WebContent/webdev',
	dest: 'WebContent/webapp'
};

var path = {
	excludes: {
		bower: dir.src + '/bower_components/**/*.*',
		theme: dir.src + '/a_theme/**/*.*'
	},
	js: {
		modules: dir.src + '/**/*.module.js',
		all: dir.src + '/**/*.js'
	},
	less: dir.src + '/**/*.less',
	css: dir.src + '/**/*.css',
	htm: dir.src + '/**/*.htm*',
	images: dir.src + '/images/**/*.*',
	ico: dir.src + '/**/*.ico'
};

function buildExcludes() {
	var paths = ['!' + path.excludes.bower, '!' + path.excludes.theme];
	for (var i = 0; i < arguments.length; i++) {
		paths.concat('!' + arguments[i]);
	}
	return paths;
}

//*** Unused
function checkColor() {
	if (supportsColor) {
		if (supportsColor.has16m) {
		    console.log('Terminal supports 16 Million colors (truecolor)');
		} else if (supportsColor.has256) {
		    console.log('Terminal supports 256 colors');
		} else {
		    console.log('Terminal has basic support for color');
		}
	}
}
//*********************** Source & Destination paths used in Tasks ***********************//
var flag = {
	prod: !!plugins.util.env.prod,		//gulp --prod
	merge: !!plugins.util.env.merge,	//gulp --merge
	maps: !plugins.util.env.prod,		//Do not generate sourcemaps for --prod
	//less_preserve: !plugins.util.env.prod,		//Do not preserve less for --prod
};

var src = {
	js: [path.js.all].concat(buildExcludes()),
	less: [path.less].concat(buildExcludes()),
	css: [path.css].concat(buildExcludes()),
	htm: [path.htm].concat(buildExcludes()),
	images: [path.images].concat(buildExcludes()),
	ico: [path.ico].concat(buildExcludes()),
	jsModules: [path.js.modules].concat(buildExcludes()),
	jsOthers: [path.js.all].concat(buildExcludes(path.js.modules)),
	bower: path.excludes.bower,
	theme: path.excludes.theme
};

var dest = {
	root: dir.dest,
	images: dir.dest + '/images/',
	bower: dir.dest + '/bower_components/',
	theme: dir.dest + '/a_theme/',
	appjs: 'app.js'
};

//******************************** Plumber Error Handling ********************************//

//Reassign gulp.src to have an inbuilt error handling in the pipe.
var gulp_src = gulp.src;
gulp.src = function() {
	return gulp_src.apply(gulp, arguments).pipe(plugins.plumber(function(error) {
		plugins.util.log(plugins.util.colors.red('Error (' + error.plugin + '): ' + error.message));
		this.emit('end');
	}));
};

function log(task, status) {
	plugins.util.log(plugins.util.colors.yellow('********** ' + status + ' :: ' + task + ' **********'));
}

//******************************** Tasks ********************************//

gulp.task('default', function(done) {
	return runSequence('clean', 'js', 'less', 'less-pr', 'css', 'htm', 'images', 'ico', 
			'theme', 'bower', function() {
		log('default', 'END');
		plugins.util.log(plugins.util.colors.yellow('***** COMPLETED ALL DEFAULT TASKS *****'));
		done();
	})
});

gulp.task('watch', ['default'], function() {
	gulp.watch(src.js, ['js']);
	gulp.watch(src.less, ['less','less-pr']);
	gulp.watch(src.css, ['css']);
	gulp.watch(src.htm, ['htm']);
//	gulp.watch(src.images, ['images']);
//	gulp.watch(src.theme, ['theme']);
//	gulp.watch(src.bower, ['bower']);
	plugins.util.log(plugins.util.colors.cyan('***** WATCHING FOR SOURCE CHANGES *****'));
});

gulp.task('clean', function() {
	del.sync(dest.root + '/*');
	log('Destination clean-up', 'COMPLETED');
});

gulp.task('bower', function() {
	return gulp.src(src.bower)
		.pipe(gulp.dest(dest.bower));
});

gulp.task('theme', function() {
	return gulp.src(src.theme)
		.pipe(gulp.dest(dest.theme));
});

gulp.task('ico', function() {
	return gulp.src(src.ico)
		.pipe(gulp.dest(dest.root));
});

gulp.task('images', function() {
	return gulp.src(src.images)
		.pipe(gulp.dest(dest.images));
});

gulp.task('htm', function() {
	return gulp.src(src.htm)
		.pipe(gulp.dest(dest.root));
});

gulp.task('less-pr', function() {
	return gulp.src(src.less)
		.pipe(gulp.dest(dest.root));
});

gulp.task('css', function() {
	return gulp.src(src.css)
		.pipe(gulp.dest(dest.root));
});

gulp.task('less', function() {
	return gulp.src(src.less)
		.pipe(gulpif(flag.maps, plugins.sourcemaps.init()))
		.pipe(plugins.less())
		.pipe(gulpif(flag.prod, plugins.cleanCss()))
		.pipe(gulpif(flag.maps, plugins.sourcemaps.write('.')))
		.pipe(gulp.dest(dest.root));
});

gulp.task('js', function(done) {
	return runSequence('js-jshint', 'js-merge', function() {
		log('js processing', 'COMPLETED');
		done();
	});
});

gulp.task('js-jshint', function() {
	return gulp.src(src.js)
		.pipe(plugins.jshint())
		.pipe(plugins.jshint.reporter(plugins.stylish))
		.pipe(plugins.jscs())
		.pipe(plugins.jscs.reporter());
});

gulp.task('js-merge', function() {
	return streamqueue({objectMode: true}, gulp.src(src.jsModules), gulp.src(src.jsOthers))
		.pipe(gulpif((flag.maps && flag.merge), plugins.sourcemaps.init()))
		.pipe(gulpif(flag.merge, plugins.concat(dest.appjs)))
		.pipe(gulpif(flag.prod, plugins.uglify()))
		.pipe(gulpif((flag.maps && flag.merge), plugins.sourcemaps.write('.')))
		.pipe(gulp.dest(dest.root));
});
