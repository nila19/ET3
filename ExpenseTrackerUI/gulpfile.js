var gulp = require('gulp'),
	runSequence = require('run-sequence'),
	streamqueue = require('streamqueue'),
	del = require('del'),
	fs = require('fs'),
	chalk = require('chalk'),
	supportsColor = require('supports-color'),
	gulpif = require('gulp-if'),
	plugins = require('gulp-load-plugins')();

plugins.util.colors = chalk;

//****************************** Intermediate path variables ******************************//
var	dir = {
	src: 'WebContent/webdev',
	dest: 'WebContent/webapp',
	appSrc: 'WebContent/webdev/app',
	appDest: 'WebContent/webapp/app'
};

var path = {
	excludes: {},
	js: {
		modules: dir.appSrc + '/**/*.module.js',
		all: dir.appSrc + '/**/*.js'
	},
	less: dir.appSrc + '/**/*.less',
	htm: dir.appSrc + '/**/*.htm',
	bower: dir.src + '/bower_components/**/*.*',
	theme: dir.src + '/theme/**/*.*',
	template: dir.src + '/template/**/*.*',
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
	htm: [path.htm].concat(buildExcludes()),
	jsModules: [path.js.modules].concat(buildExcludes()),
	jsOthers: [path.js.all].concat(buildExcludes(path.js.modules)),
	bower: path.bower,
	theme: path.theme,
	template: path.template
};

var dest = {
	root: dir.dest,
	app: dir.dest + '/app/',
	bower: dir.dest + '/bower_components/',
	theme: dir.dest + '/theme/',
	template: dir.dest + '/template/',
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

//***********************************************************************//
//******************************** Tasks ********************************//

gulp.task('non-app', function(done) {
	return runSequence('theme', 'template', 'bower', function() {
		log('NON-APP', 'END');
		plugins.util.log(plugins.util.colors.yellow('***** COMPLETED ALL NON-APP TASKS *****'));
		done();
	})
});

gulp.task('app', function(done) {
	return runSequence('app.clean', 'js', 'css', 'htm', function() {
		log('APP', 'END');
		plugins.util.log(plugins.util.colors.yellow('***** COMPLETED ALL APP TASKS *****'));
		done();
	})
});

gulp.task('watch', ['app', 'bower'], function() {
	gulp.watch(src.js, ['js']);
	gulp.watch(src.less, ['css']);
	gulp.watch(src.htm, ['htm']);
	gulp.watch(src.bower, ['bower']);
	plugins.util.log(plugins.util.colors.cyan('***** WATCHING FOR SOURCE CHANGES *****'));
});

gulp.task('app.clean', function() {
	if(fs.existsSync(dest.app)) {
		del.sync(dest.app + '/*');
	}
	log('App clean-up', 'COMPLETED');
});

//*************************** Non-App Sources ***************************//
gulp.task('bower', function() {
	var d = dest.bower;
	if(fs.existsSync(d)) {
		del.sync(d + '/*');
	}
	return gulp.src(src.bower)
		.pipe(gulp.dest(d));
});

gulp.task('template', function() {
	var d = dest.template;
	if(fs.existsSync(d)) {
		del.sync(d + '/*');
	}
	return gulp.src(src.template)
		.pipe(gulp.dest(d));
});

gulp.task('theme', function() {
	var d = dest.theme;
	if(fs.existsSync(d)) {
		del.sync(d + '/*');
	}
	return gulp.src(src.theme)
		.pipe(gulp.dest(d));
});

//***************************** App Sources *****************************//
gulp.task('htm', function() {
	return gulp.src(src.htm)
		.pipe(gulp.dest(dest.app));
});

gulp.task('css', function(done) {
	return runSequence('less-pr', 'less', function() {
		log('css processing', 'COMPLETED');
		done();
	});
});
gulp.task('less-pr', function() {
	return gulp.src(src.less)
		.pipe(gulp.dest(dest.app));
});
gulp.task('less', function() {
	return gulp.src(src.less)
		.pipe(gulpif(flag.maps, plugins.sourcemaps.init()))
		.pipe(plugins.less())
		.pipe(gulpif(flag.prod, plugins.cleanCss()))
		.pipe(gulpif(flag.maps, plugins.sourcemaps.write('.')))
		.pipe(gulp.dest(dest.app));
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
		.pipe(gulp.dest(dest.app));
});
