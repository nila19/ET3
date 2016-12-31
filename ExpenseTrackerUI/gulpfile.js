var gulp = require('gulp'),
	runSequence = require('run-sequence'),
	streamqueue = require('streamqueue'),
	del = require('del'),
	gulpif = require('gulp-if'),
	plugins = require('gulp-load-plugins')();

//****************************** Intermediate path variables ******************************//
var	dir = {
	src: 'WebContent/webdev',
	dest: 'WebContent/webapp'
};

var path = {
	excludes: {
		bower: dir.src + '/bower_components/**/*.*'
	},
	js: {
		modules: dir.src + '/**/*.module.js',
		all: dir.src + '/**/*.js'
	},
	less: dir.src + '/**/*.less',
	htm: dir.src + '/**/*.htm',
	images: dir.src + '/images/**/*.*'
};

function buildExcludes() {
	var paths = ['!' + path.excludes.bower, '!' + path.excludes.old, '!' + path.excludes.phone];
	for (var i = 0; i < arguments.length; i++) {
		paths.concat('!' + arguments[i]);
	}
	return paths;
}

function log(task, status) {
	plugins.util.log('********** ' + status + ' :: ' + task + ' **********');
}

//*********************** Source & Destination paths used in Tasks ***********************//
var flag = {
		prod: !!plugins.util.env.prod,		//gulp --prod
		merge: !!plugins.util.env.merge,	//gulp --merge
		maps: !plugins.util.env.prod,		//Do not generate sourcemaps for --prod
	};

var src = {
	js: [path.js.all].concat(buildExcludes()),
	less: [path.less].concat(buildExcludes()),
	htm: [path.htm].concat(buildExcludes()),
	images: [path.images].concat(buildExcludes()),
	bower: path.excludes.bower,
	jsModules: [path.js.modules].concat(buildExcludes()),
	jsOthers: [path.js.all].concat(buildExcludes(path.js.modules))
};

var dest = {
	root: dir.dest,
	images: dir.dest + '/images/',
	bower: dir.dest + '/bower_components/',
	appjs: 'app.js'
};

//******************************** Tasks ********************************//

gulp.task('default', function(done) {
	return runSequence('clean', 'js', 'less', 'htm', 'images', 'bower', function() {
		log('default', 'END');
		plugins.util.log('***** COMPLETED ALL DEFAULT TASKS *****');
		done();
	})
});

gulp.task('watch', ['default'], function() {
	gulp.watch(src.js, ['js']);
	gulp.watch(src.less, ['less']);
	gulp.watch(src.htm, ['htm']);
	gulp.watch(src.images, ['images']);
	plugins.util.log('***** WATCHING FOR SOURCE CHANGES *****');
});

gulp.task('clean', function() {
	del.sync(dest.root + '/*');
	log('Destination clean-up', 'COMPLETED');
});

gulp.task('bower', function() {
	return gulp.src(src.bower)
		.pipe(gulp.dest(dest.bower)).on('end', function() {
			log('less, htm, images, bower', 'COMPLETED');
		});
});

gulp.task('images', function() {
	return gulp.src(src.images)
		.pipe(gulp.dest(dest.images));
});

gulp.task('htm', function() {
	return gulp.src(src.htm)
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
