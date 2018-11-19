const randomString = require('randomstring');

module.exports = class Stream {
	constructor(stream, path, name, extension) {
		this.stream = stream;
		this.path = path;
		this.extension = extension;
		this.name = this._resolveName(name);
	}

	toFile(path) {}

	_resolveName(name) {
		return (name || randomString.generate()) + this.extension;
	}
};
