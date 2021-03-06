'use strict';

var fs = require('fs');
var path = require('path');

var chalk = require('chalk');
var rek = require('rekuire');

var linksData = rek('linksData');
var linksDataUtils = rek('linksDataUtils');

var shell = rek('shell');

////////////////////////////////

function resolve(location) {
  var fullPath = path.resolve(location);
  if (!fs.existsSync(fullPath)) {
    console.log(chalk.red('File or mount point does not exists!'));
    process.exit();
  }
  return fullPath;
}


function actualMount(file, mountpoint) {
  shell('truecrypt', ['-t', '-k=', '--protect-hidden=no', file, mountpoint], process.exit);
}

function actualUnmount(location) {
  shell('truecrypt', ['-t', '-d', location], process.exit);
}

////////////////////////////////

function createLink(targets) {
  if (targets.length == 2) {
    var file = resolve(targets[0]);
    var mountpoint = resolve(targets[1]);

    console.log(chalk.green('file: ' + file));
    console.log(chalk.green('mountpoint: ' + mountpoint));
    linksData.add({ file: file, mountpoint: mountpoint });
  } else {
    console.log(chalk.red('Wrong number of arguments...'));
  }
}

function mount(targets) {
  if (targets.length == 2) {
    var file = resolve(targets[0]);
    var mountpoint = resolve(targets[1]);
    actualMount(file, mountpoint);
  } else if (targets.length == 1) {
    var link = linksData.guessLink(targets[0]);
    if (link && typeof link == 'object') {
      actualMount(link.file, link.mountpoint);
    } else {
      console.log(chalk.red('No suitable link found :['));
    }
  } else {
    console.log(chalk.red('Wrong number of arguments...'));
  }
}

// function go(id) {
//   var link = linksData.guessLink(id);
//   if (link && typeof link == 'object') {
//     // shell('cd', [link.mountpoint], process.exit); // does not work
//     // process.chdir(link.mountpoint); // does not work
//     console.log(chalk.red('--go not implemented yet :['));
//   } else {
//     console.log(chalk.red('No suitable link found :['));
//   }
// }

function unmount(targets) {
  if (targets.length == 1) {
    var link = linksData.guessLink(targets[0]);
    if (typeof link == 'object') {
      actualUnmount(link.file);
    } else if (typeof link == 'string') {
      actualUnmount(link);
    } else {
      console.log(chalk.red('No suitable link found :['));
    }
  } else {
    console.log(chalk.red('Wrong number of arguments...'));
  }
}

function trash(id) {
  var res = linksData.removeById(parseInt(id));
  if (!res) {
    return console.log(chalk.red('Invalid id or another problem. (id: ' + id + ').'));
  }
  return console.log(chalk.green('Removed id #' + id));
}

function openLink(id) {
  var link = linksData.get(id);
  if (!link) {
    return console.log(chalk.red('no link found for id: ' + id + '.'));
  }
  shell({
    darwin: 'open',
    linux: 'xdg-open'
  }[process.platform], [link.mountpoint], process.exit);
}

function show() {
  var all = linksData.all();
  if (all.length === 0) {
    console.log(chalk.yellow('There aren\'t any links defined yet!'));
    return;
  }
  linksDataUtils.getMountedDataAndPrintList(all);
}

function showSystemData() {
  linksDataUtils.showSystemData();
}

////////////////////////////////////


module.exports = {
  createLink: createLink,
  mount: mount,
  // go: go,
  unmount: unmount,
  trash: trash,
  openLink: openLink,
  show: show,
  showSystemData: showSystemData
};
