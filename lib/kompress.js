const UglifyJS = require("uglify-es");
const fs = require('fs');
const htmlMinify = require('html-minifier').minify;
const jsonminify = require("jsonminify");
const mkdirp = require('mkdirp');
const getDirName = require('path').dirname;
const stringUtil = require('node7js-utils').string;
const glob = require("glob");
const uglifycss = require('uglifycss');




// var fileList = [];

// // fileList = fileList.concat(glob.sync("./src/asset/**/*.js"));
// // fileList = fileList.concat(glob.sync("./src/asset/**/*.css"));
// // fileList = fileList.concat(glob.sync("./src/page/!(_shared)/main.bundle.js"));
// // fileList = fileList.concat(glob.sync("./src/page/!(_shared)/index.html"));



// for(let i = 0; i < config.PageBuilder.dist.filesToBuild.length; i++){
//     fileList = fileList.concat(glob.sync(`${__dirname}/../../${config.PageBuilder.src.root}/${config.PageBuilder.dist.filesToBuild[i]}`));
// }
// for(let i = 0; i < config.PageBuilder.pageList.length; i++){
//     fileList = fileList.concat(glob.sync(`${__dirname}/../../${config.PageBuilder.src.pageRoot}/${config.PageBuilder.pageList}/main.bundle.js`));
//     fileList = fileList.concat(glob.sync(`${__dirname}/../../${config.PageBuilder.src.pageRoot}/${config.PageBuilder.pageList}/index.html`));
// }

// for (let i = 0; i < fileList.length; i++) {
//     let srcFilePath = fileList[i];
//     let distFilePath = stringUtil.replaceAll(srcFilePath, `/${config.PageBuilder.src.root}/`, `/${config.PageBuilder.dist.root}/${config.PageBuilder.dist.version}/`);
//     buildFile(srcFilePath, distFilePath);
// }



function build(srcFilePath, distFilePath){
    buildFile(srcFilePath, distFilePath);
}

module.exports = {
    build: build,
}

//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------


function buildFile(srcFilePath, distFilePath) {
    if (srcFilePath.endsWith('.js'))
        buildJs(srcFilePath, distFilePath);
    else if (srcFilePath.endsWith('.html'))
        buildHtml(srcFilePath, distFilePath);
    else if (srcFilePath.endsWith('.css'))
        buildCss(srcFilePath, distFilePath);
    else if (srcFilePath.endsWith('.json'))
        buildJson(srcFilePath, distFilePath);
}




function buildJs(srcFilePath, distFilePath) {
    let content = fs.readFileSync(srcFilePath, 'utf8');
    var options = {
        compress: true,
        mangle: false,
    }

    var result = UglifyJS.minify(content, options);

    mkdirp(getDirName(distFilePath), function (err) {
        fs.writeFileSync(distFilePath, result.code, 'utf8');
        console.log("BUILD JS DONE => " + distFilePath);
    });

}

function buildHtml(srcFilePath, distFilePath) {
    let content = fs.readFileSync(srcFilePath, 'utf8');
    var result = htmlMinify(content, {
        collapseWhitespace: true,
        removeComments: true,

    });
    mkdirp(getDirName(distFilePath), function (err) {
        fs.writeFileSync(distFilePath, stringUtil.replaceAll(result, '\n', ' '), 'utf8');
        console.log("BUILD HTML DONE => " + distFilePath);
    });
}


function buildCss(srcFilePath, distFilePath) {
    let content = fs.readFileSync(srcFilePath, 'utf8');
    var uglified = uglifycss.processString(content);

    mkdirp(getDirName(distFilePath), function (err) {
        fs.writeFileSync(distFilePath, uglified, 'utf8');
        console.log("BUILD CSS DONE => " + distFilePath);
    });
}

function buildJson(srcFilePath, distFilePath) {
    let content = fs.readFileSync(srcFilePath, 'utf8');
    let minJson = jsonminify(content);

    mkdirp(getDirName(distFilePath), function (err) {
        fs.writeFileSync(distFilePath, minJson, 'utf8');
        console.log("BUILD JSON DONE => " + distFilePath);
    });

}


