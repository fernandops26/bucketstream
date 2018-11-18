const randomString = require('randomstring');

module.exports = class Stream {
	constructor(stream, name, extension) {
		this.stream = stream;
		this.extension = extension;
		this.name = this._resolveName(name);
	}

	toFile(path) {}

	_resolveName(name) {
		return (name || randomString.generate()) + this.extension;
	}
};
