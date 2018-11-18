const fs = require('fs');
const Stream = require('./Stream');

exports.getFileStream = async (path, name) => {
	if (!fs.existsSync(path)) {
		throw new Error('File not exist');
	}

	const stream = fs.createReadStream(path);
	const ext = path.slice(path.lastIndexOf('.'), path.length);

	return new Stream(stream, name, ext);
};
