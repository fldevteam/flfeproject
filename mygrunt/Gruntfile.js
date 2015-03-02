module.exports = function(grunt) {

  // Load all grunt tasks
  // require('load-grunt-tasks')(grunt);
  // Show elapsed time at the end
  // require('time-grunt')(grunt);

  // https://www.npmjs.com/package/imagemin-mozjpeg
  var mozjpeg = require('imagemin-mozjpeg');

  // https://www.npmjs.com/package/imagemin-webp
  var webp = require('imagemin-webp');

  // Project configuration.
  grunt.initConfig({

    // Project settings
    project: {
        app: 'app',
        dist: 'dist',
        src: 'src'
    },

    pkg: grunt.file.readJSON('package.json'),

    // https://www.npmjs.com/package/grunt-contrib-clean
    // 删除目录及其下文件 /**等同不加
    clean: {
      main: ["dist", "publish"],
      build: ["dist", "build"],
      release: ["publish"],
      css: ["dist/css/**", "!publish/css/**"]
    },

    // https://www.npmjs.com/package/grunt-contrib-uglify
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },

    // https://www.npmjs.com/package/grunt-contrib-compress
    // use a function to return the output file 
    compress: {
      main: {
        options: {
          mode: 'zip',
          archive: '<%= pkg.name %>' + '.zip'
        },
        files: [
          {expand: true, cwd: 'publish/', src: ['**'], dest: '<%= pkg.name %>/'}
        ]
      }
    },

    // https://www.npmjs.com/package/grunt-contrib-concat
    concat: {
      options: {
        separator: '',
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> */',
      },
      dist: {
        src: ['src/foo.js', 'src/bar.js'],
        dest: 'dist/output.js'
      },
      missing: {
        src: ['src/invalid_or_missing_file'],
        dest: 'build/compiled.js',
        nonull: true,
      }
    },

    // https://www.npmjs.com/package/grunt-contrib-connect
    // https://github.com/intesso/connect-livereload
    // http://www.bluesdream.com/blog/grunt-plugin-livereload-wysiwyg-editor.html
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost', //默认为0.0.0.0值，可配置为本机某个 IP，localhost 或域名,*
        livereload: 35729  //声明给 watch 监听的端口
      },

      server: {
        options: {
            open: true, //自动打开网页 http://
            base: [
                'src'  //主目录
            ]
        }
      }
    },

    // https://www.npmjs.com/package/grunt-contrib-copy
    copy: {
      main: {
        files: [
          {expand: true, src: ['path/*'], dest: 'dist/', filter: 'isFile'}, // 复制path目录下的所有文件
          {expand: true, src: ['path/**'], dest: 'publish/'}, // 复制path及其目录下的所有目录和文件
          {expand: true, cwd: 'dist/', src: ['**'], dest: 'publish/'}, // 复制相对dist目录下的所有目录和文件
          
        ]
      },
      css: {
        files : [
          {expand: true, cwd: 'dist/css/', src: ['**'], dest: 'publish/css/'},
        ]
      }

    },

    // https://www.npmjs.com/package/grunt-contrib-cssmin
    cssmin: {
      options: {
        shorthandCompacting: false, // set to false to skip shorthand compacting (default is true unless sourceMap is set when it's false)
        roundingPrecision: -1 // rounding precision; defaults to 2; -1 disables rounding
      },
      target: {
        files: {
          'dist/output.css': ['src/foo.css', 'src/bar.css']
        }
      }
    },

    // https://www.npmjs.com/package/grunt-contrib-htmlmin
    // https://github.com/kangax/html-minifier#options-quick-reference
    htmlmin:{
      dist: {                                      // Target 
        options: {                                 // Target options 
          removeComments: true,
          collapseWhitespace: true,
          useShortDoctype: true,
          minifyJS: true,                          // Minify Javascript in script elements and on* attributes (uses UglifyJS)
          minifyCSS: true                          // Minify CSS in style elements and style attributes (uses clean-css)
        },
        files: {                                   // Dictionary of files 
          'dist/sa.html': 'src/sa.html',     // 'destination': 'source' 
          'dist/mkt.html': 'src/mkt.htm'
        }
      },
      dev: {                                       // Another target 
        files: {
          'dist/sa.htm': 'src/sa.html',
          'dist/mkt.htm': 'src/mkt.htm'
        }
      }
    },


    // https://www.npmjs.com/package/grunt-contrib-imagemin
    // https://github.com/imagemin/imagemin
    /*    
    Comes bundled with the following optimizers:

    gifsicle — Compress GIF images
    jpegtran — Compress JPEG images
    optipng — Compress PNG images
    svgo — Compress SVG images
    */
    
    imagemin: {                          // Task 
      static: {                          // Target 
        options: {                       // Target options 
          optimizationLevel: 3,          // default: 3, ranges 0-7
          svgoPlugins: [{ removeViewBox: false }],
          use: [mozjpeg(),webp()]
        },
        files: {                         // Dictionary of files 
          'dist/img.png': 'src/img.png', // 'destination': 'source' 
          'dist/img.jpg': 'src/img.jpg',
          'dist/img.gif': 'src/img.gif',
          'dist/img.webp': 'src/img.png'
        }
      },
      dynamic: {                         // Another target 
        files: [{
          expand: true,                  // Enable dynamic expansion 
          cwd: 'src/',                   // Src matches are relative to this path 
          src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match 
          dest: 'build/'                  // Destination path prefix 
        }]
      }
    },


    // https://github.com/gruntjs/grunt-contrib-jshint
    // http://www.cnblogs.com/code/articles/4103070.html
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        // quotmark: 'single',
        globals: {
          jQuery: true
        }
      },
      beforeconcat: ['src/foo.js', 'src/bar.js'],
      afterconcat: ['dist/output.js']
    },

    // https://www.npmjs.com/package/grunt-contrib-watch
    // https://github.com/isaacs/minimatch#options
    // http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-
    // http://www.bluesdream.com/blog/grunt-plugin-livereload-wysiwyg-editor.html
    // 通配符http://gruntjs.cn/configuring-tasks/#globbing-patterns
    watch: {
      sass: {
        files: ['<%= project.app %>/sass/**/*.scss'],
        tasks: ['sass:dev', 'autoprefixer'],
        options: {
            spawn: false,
            livereload: true
        },
      },
      css: {
        files: ['<%= project.app %>/css/**/*.css'],
        tasks: ['cssmin:dev', 'autoprefixer'],
        options: {
            spawn: false,
            livereload: true
        }     
      },
      js: {
        files: [
            '<%= project.app %>/js/**/*.js',
            '!<%= project.app %>/js/vendor/**/*.js',
            '!<%= project.app %>/js/plugins/**/*.js'
        ],
        options: {
            livereload: true
        }
      },
      livereload: {
        //文件改变会实时刷新网页 /{,*/}*.
        files: [
          'src/**/*.css',
          'src/*.{html,htm}',
          'src/**/*.js',
          'src/images/**/*.{ico,gif,jpeg,jpg,png,svg,webp}'
        ],
        // tasks: ["htmlmin"],
        options: {
          // livereload: true,
          // spawn: false,
          livereload: '<%=connect.options.livereload%>'  //监听前面声明的端口  35729
        },
      },
    },


  });

  // Load the tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  // grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  // grunt.loadNpmTasks('grunt-contrib-less');
  // grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');


  // Default task(s).
  grunt.registerTask('default', ['cssmin', 'uglify', 'concat', 'htmlmin:dist', 'imagemin', 'jshint', '']);
  
  // 自定义任务
  grunt.registerTask('mylivedev', ['connect:server', 'watch:livereload']);
  grunt.registerTask('pubdev', ['clean:release', 'copy:main', 'compress:main']);


};