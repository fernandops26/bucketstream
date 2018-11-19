const fs = require('fs');
const Stream = require('./Stream');
const { ensureStructure } = require('./util');

const getFileStream = item => {
	const { path, name } = item;

	if (!path) {
		throw new Error('Needs to especify a path file');
	}

	if (!fs.existsSync(path)) {
		throw new Error(`File ${path} not exist`);
	}

	const stream = fs.createReadStream(path);
	const ext = path.slice(path.lastIndexOf('.'), path.length);

	return new Stream(stream, path, name, ext);
};

exports.prepareStreams = async objective => {
	return ensureStructure(objective).map(item => getFileStream(item));
};
