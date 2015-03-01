/*
 * grunt-sass-directory-import
 * https://github.com/neagle/grunt-sass-directory-import
 *
 * Copyright (c) 2013 Nate Eagle
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	grunt.registerMultiTask(
		'sass_directory_import',
		'Include all the .sass files in a directory by including a ' +
		'dynamically maintained _*.sass file.',
		function () {
			var files = this.filesSrc;

			// Merge task-specific and/or target-specific options with these defaults.
			var options = this.options({
				quiet: false,
				quotes: 'double'
			});

			// Iterate over all specified file groups.
			files.forEach(function (filepath) {
				//
				// Create an array that we'll ultimately use to populate our includes file
				var newFileContents = [
					// Header
					'// This file imports all other underscore-prefixed .sass files in this directory.',
					'// It is automatically generated by the grunt sass-directory-includes task.',
					'// Do not directly modify this file.',
					''
				];

				console.log(filepath);
				var directory = filepath.substring(0, filepath.lastIndexOf('/'));
				//
				// Search for underscore-prefixed sass files (partials)
				// Then remove the file we're writing the imports to from that set
				var filesToInclude = grunt.file.expand([directory + '/_*.sass', '!' + filepath]);

				if (!options.quiet) {
					grunt.log.writeln('\n' + filepath.yellow + ':');
				}

				if (!options.quiet && !filesToInclude.length) {
					grunt.log.writeln('No files found in ' + directory.cyan + ' to import.');
				}

				// TODO: Currently, this regenerates the _all.sass file every time. We
				// could make it smarter by checking for current includes and only
				// adding entries for any new files.
				filesToInclude.forEach(function (includeFilepath) {

					// The include file is the filepath minus the directory slash and the
					// initial underscore
					var includeFile = includeFilepath.substring(includeFilepath.lastIndexOf('/') + 2);

					// Remove .sass extension
					includeFile = includeFile.replace('.sass', '');

					if (!options.quiet) {
						grunt.log.writeln('Importing ' + includeFile.cyan);
					}

					var quotes = (options.quotes === 'single') ? '\'' : '"';
					newFileContents.push('@import ' + quotes + includeFile + quotes + '');
				});

				newFileContents = newFileContents.join('\n') + '\n\n';
				grunt.file.write(filepath, newFileContents);
			});
		});

};
