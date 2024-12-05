#!/usr/bin/env node
const {program} = require('commander');
const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');

program
	.command('init')
	.description('Initialize Nodebox')
	.action(async () => {
		console.log('Initializing Nodebox...');
		execSync('npm install express');
		copyDirSync('node_modules/nodebox-framework/testsite/', '.');
		console.log('Test Site copied.');
		console.log(execSync('ls -la', {encoding: 'utf-8'}));

});

function copyDirSync(src, dest) {
	let entries = fs.readdirSync(src, { withFileTypes: true });

	// Ensure the destination directory exists
	if (!fs.existsSync(dest)) {
	  fs.mkdirSync(dest, { recursive: true });
	}

	for (let entry of entries) {
	  let srcPath = path.join(src, entry.name);
	  let destPath = path.join(dest, entry.name);

	  if (entry.isDirectory()) {
		copyDirSync(srcPath, destPath);
	  } else {
		fs.copyFileSync(srcPath, destPath);
	  }
	}
  }

program.parse(process.argv);