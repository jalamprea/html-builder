# html-builder
This project is a template to start other HTML based projects that don't require any bundler (react, vue, angular, etc...) This is useful to create a static HTML site with a javascript plain project.

This project use the latest features of Gulp to compile Javascript (including ES6) into a simple JS, combine all output files into one file, and minify all scripts inot one optimized JS File.

The same for CSS, this project could understand SCSS or SASS files and convert them into one optimized CSS file.

The HTML file will use the pure JS and CSS files without any optimization in the development mode, but then it will change to the optimized CSS and JS files and it will use cache burst technice to rename the optimized files using the timestamp in the build moment. This will ensure a correct cache validation on production.


##Usage
- Clone this project
- Replace the body of the index.html with your own body and your dev files (js files)
- Copy your JS files inot the assets/js folder
- Copy your SCSS files into assets/scss folder (if you don't have scss, then copy your css files, they will work too)
- run the initial installation:
  `npm install`
- start development server:
  `npm start`
- View your project on http://localhost:3000


Into the HTML File you will see some special tags used to replace your development files with your production files

If you want to change the port or any other feature, feel free to change it in the gulpfile.js file.
Lear more of gulp on https://gulpjs.com/


### Test it in production:
To create the production files, just run the production build command:
  `npm run prod`
Thiw will generate the dist folder with all yopur production-ready files.

If you want to test this project, you could use any local server, for instance 'serve' command.
Ex:
- (if you don't have serve installed): `npm i -g serve`
- go to the dist folder `cd dist`
- Start the production test server `serve .`
- Test the production website on http://localhost:5000/


### Features:
This project will optimize your files thanks to:
- gulp
- gulp-accessibility
- gulp-autoprefixer
- gulp-babel
- gulp-concat
- gulp-cssmin
- gulp-html-replace
- gulp-jshint
- gulp-newer
- gulp-rename
- gulp-sass
- gulp-sourcemaps
- gulp-uglify
- jshint
- node-sass
