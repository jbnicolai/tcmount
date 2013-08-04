"use strict";

var clc = require('cli-color');
var fs = require('fs');


module.exports = {
    varify: varify,
    stringify: stringify
};

function varify(link) {
    return (varifyFolder(link.source) && varifyFolder(link.target));
}

function stringify(link) {
    return link.id + " : " + clc.green(link.source) + " ---> " + clc.green(link.target);
}

////////////////////////////////////////////////////////////////////////////////


function varifyFolder(folder) {
    return folder && folder[folder.length-1] == '/' && folderExists(folder);
}

function folderExists(folder) {

    return fs.existsSync(folder);
}