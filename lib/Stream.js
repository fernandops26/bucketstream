const { resolveName } = require('./util');

module.exports = class Stream {
	constructor(stream, path, newName, assignName) {
		this.stream = stream;
		this.path = path;

		const { extension, name } = resolveName(path, newName, assignName);
		this.extension = extension;
		this.name = name;
		this.fullName = name + extension;
	}

	toFile(path) {}
};
