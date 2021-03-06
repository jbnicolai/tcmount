'use strict';

var chalk = require('chalk');
var rek = require('rekuire');
var path = require('path');
var fs = require('fs');

var SettingsFacade = rek('SettingsFacade');

function getUserHome() {
  return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}

var settings = new SettingsFacade(getUserHome() + '/.tcmount');

///////////////

function isSuffixOf(short, long) {
  return long.substr(long.length - short.length) == short;
}

function getMaxId() {
  var links = settings.read('links') || [];
  var maxId = links.reduce(function(prev, curr, index, array) {
    return Math.max(prev, curr.id);
  }, settings.read('maxid') || 0);
  return maxId;
}

///////////////

function all() {
  return settings.read('links') || [];
}

function add(link) {
  var links = settings.read('links') || [];
  var dupe = links.some(function(v,i,a) {
    return link.file == v.file && link.mountpoint == v.mountpoint;
  });
  if (dupe) {
    console.log(chalk.red('Link already exists!'));
    return false;
  }

  var maxid = getMaxId() + 1;
  link.id = maxid;
  links.push(link);
  settings.write('links', links);
  settings.write('maxid', maxid);
  console.log(chalk.green('Link created with id #' + link.id));
  return true;
}

function get(id) {
  var links = settings.read('links') || [];
  links = links.filter(function(link) {
    return link.id == id;
  });
  return links[0];
}

function removeById(id) {
  var links = settings.read('links') || [];
  var originalLength = links.length;
  links = links.filter(function(link) {
    if (link.id == id) {
      return false;
    }
    return true;
  });
  var newLength = links.length;
  if (originalLength == newLength) {
    return false;
  }
  settings.write('links', links);
  return true;
}

function linkWithSuffix(suffix) {
  var links = settings.read('links') || [];
  return links.filter(function(link) {
    return (link.file && link.mountpoint) && (isSuffixOf(suffix, link.file) || isSuffixOf(suffix, link.mountpoint));
  })[0];
}

function guessLink(hint) {
  var byid = get(parseInt(hint));
  if (byid) {
    return byid;
  }
  hint = hint.replace(/\/$/,'');
  var location = path.resolve(hint);
  var bySuffix;
  if (fs.existsSync(location)) {
    bySuffix = linkWithSuffix(location);
    if (bySuffix) {
      return bySuffix;
    } else {
      return location;
    }
  }
  bySuffix = linkWithSuffix(hint);
  if (bySuffix) {
    return bySuffix;
  }
  console.log(chalk.red('What did you mean by that??'));
  console.log('Try "tcmount -h" for help.');
  return false;
}

/////////////////////////////////

module.exports = {
  all: all,
  add: add,
  get: get,
  removeById: removeById,
  guessLink: guessLink
};
