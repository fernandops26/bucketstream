const fs = require('fs');
const Stream = require('./Stream');
const { ensureStructure } = require('./util');

const getFileStream = (item, options) => {
	const { path, name, assignName } = item;

	if (!path) {
		throw new Error('Needs to especify a path file');
	}

	if (!fs.existsSync(path)) {
		throw new Error(`File ${path} not exist`);
	}

	const stream = fs.createReadStream(path);
	return new Stream(stream, path, name, assignName || options.assignName);
};

exports.prepareStreams = async (objective, options) => {
	return ensureStructure(objective).map(item => getFileStream(item, options));
};
