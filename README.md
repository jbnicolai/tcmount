# tcmount

[![Build Status](https://travis-ci.org/danyshaanan/tcmount.png?branch=master)](https://travis-ci.org/danyshaanan/tcmount)

## A command line tool for mounting and dismounting TrueCrypt volumes
tcmount lets you save links between truecrypt volumes and mount points, and mount and dismount them easily.

* * *
### Installation
```bash
$ npm install -g tcmount
```
* * *
### Usage

`tcmount` shows you the list of your defined links, including their ids.

Here is the result of `tcmount` in an environment with [this .tcmount file](https://github.com/danyshaanan/tcmount/blob/master/doc/dot.tcmount_example):

![Screen shot of `tcmount`](https://raw.github.com/danyshaanan/tcmount/master/doc/tcmount_example.png?raw=true)

Green files or folders are mounted, yellow are not, and grey do not exist at the time.

`tcmount <id>` will mount the link with that id.

`tcmount -u <id>` will unmount the link with that id.

`tcmount -l <file> <mountpoint>` will create a link from the file to the mountpoint.

`tcmount -t <id>` will remove the link with that id.

`tcmount <file> <mountpoint>` can be used to mount a file to a mountpoint without having it in your settings.

`tcmount -o <id>` will open the link's target folder.

Here is a flow of a few commands:

![Screen shot some tcmount commands](https://raw.github.com/danyshaanan/tcmount/master/doc/tcmount_process_example.png?raw=true)

* * *
### Info
* The links data is saved as json in ~/.tcmount
* No support for key files or hidden volumes.
* Not tested in Linux.

* * *
### Notes

```bash
alias tm='tcmount'
alias tu='tcmount -u'
```

* * *
### Feedback
* If you enjoyed this package, please star it [on Github](https://github.com/danyshaanan/tcmount).
* You are invited to [Open an issue on Github](https://github.com/danyshaanan/tcmount/issues).
* For other matters, my email address can be found on my [NpmJS page](https://www.npmjs.org/~danyshaanan), my [Github page](https://github.com/danyshaanan), or my [website](http://danyshaanan.com/).
