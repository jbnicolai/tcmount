"use strict";

var fs = require('fs');
var path = require('path');

var clc = require('cli-color');
var rek = require('rekuire');

var linksData = rek('linksData');
var linksDataUtils = rek('linksDataUtils');

var spawn = require('child_process').spawn;


module.exports = {
    createLink: createLink,
    mount: mount,
    unmount: unmount,
    trash: trash,
    show: show
};


function createLink(targets) {
    if (targets.length == 2) {
        var file = resolve(targets[0]);
        var mountpoint = resolve(targets[1]);

        console.log(clc.green("file: " + file));
        console.log(clc.green("mountpoint: " + mountpoint));
        linksData.add({ file: file, mountpoint: mountpoint });
    } else {
        console.log(clc.red('Wrong number of arguments...'));
    }
}

function mount(targets) {
    if (targets.length == 2) {
        var file = resolve(targets[0]);
        var mountpoint = resolve(targets[1]);
        actualMount(file, mountpoint);
    } else if (targets.length == 1) {
        var link = linksData.guessLink(targets[0]);
        if (link) {
            actualMount(link.file, link.mountpoint);
        }
    } else {
        console.log(clc.red('Wrong number of arguments...'));
    }
}

function unmount(targets) {
    if (targets.length == 1) {
        actualUnmount(targets[0]);
    } else {
        console.log(clc.red('Wrong number of arguments...'));
    }
}

function trash(id) {
    var res = linksData.removeById(parseInt(id));
    if (!res) {
        return console.log(clc.red("Invalid id or another problem. (id: " + id + ")."));
    }
    return console.log(clc.green("Removed id #" + id));
}

function show() {
    var all = linksData.all();
    if (all.length == 0) {
        console.log(clc.yellow("There aren't any links defined yet!"));
        return;
    }
    console.log(linksDataUtils.stringifyList(all));
}

////////////////////////////////////

function resolve(location) {
    var fullPath = path.resolve(location);
    if (!fs.existsSync(fullPath)) {
        console.log(clc.red('File or mount point does not exists!'));
        process.exit();
    }
    return fullPath;
}


function actualMount(file, mountpoint) {
    shell('truecrypt', ["-t", "-k=", "--protect-hidden=no", file, mountpoint], process.exit);
}

function actualUnmount(location) {
    shell('truecrypt', ["-t", "-d", location], process.exit);
}

function shell(cmd, opts, callback) {
  process.stdin.pause();
  var p = spawn(cmd, opts, {
    customFds: [0, 1, 2]
  });
  return p.on('exit', function() {
    process.stdin.resume();
    return callback();
  });
};