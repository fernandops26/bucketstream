const { cleanedParams, resolveAllPromises } = require('./util');
const { Psmitter } = require('psmitter');
const StreamManager = require('./StreamManager');
const Uploader = require('./Uploader');

module.exports = opts => {
	this.hooks = [];
	this.uploader = new Uploader(opts);
	this.emitter = new Psmitter();

	this.__emitFinished = data => {
		this.emitter.emit('finished', data);
	};

	this.__uploadOne = async (fileString, options) => {
		let stream = null;
		try {
			stream = await StreamManager.getFileStream(fileString);
			await this.uploader.upload(options, stream);
			this.emitter.emit('upload', stream);

			return stream;
		} catch (e) {
			this.emitter.emit('error upload', e);
			throw e;
		}
	};

	this.__uploadMany = async (files, options) => {
		files = files.map(item => {
			return uploadOne(item, options);
		});

		return resolveAllPromises(files);
	};

	const simpleUpload = (f, opts, c = null) => {
		return new Promise(async (resolve, reject) => {
			let { file, options, cb } = cleanedParams(f, opts, c);

			try {
				let result = null;

				if (Array.isArray(file)) {
					result = await this.__uploadMany(file, options, cb);
				}

				if (typeof file == 'string') {
					result = await this.__uploadOne(file, options, cb);
				}

				this.__emitFinished(result);

				return cb ? cb(null, result) : resolve(result);
			} catch (e) {
				return cb ? cb(e, null) : reject(e);
			}
		});
	};

	const onUpload = cb => {
		this.emitter.on('upload', cb);
	};

	const onFinish = cb => {
		this.emitter.on('finished', cb);
	};

	const onError = cb => {
		this.emitter.on('error upload', cb);
	};

	const beforeUpload = cb => {
		this.hooks.push(cb);
	};

	return {
		simpleUpload,
		onUpload,
		onFinish,
		onError,
		beforeUpload
	};
};
