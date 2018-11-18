const { cleanedParams, resolveAllPromises } = require('./util');
const { Psmitter } = require('psmitter');
const StreamManager = require('./StreamManager');
const Uploader = require('./Uploader');

module.exports = opts => {
	this.hooks = [];
	this.uploader = new Uploader(opts);
	this.emitter = new Psmitter();

	const simpleUpload = (f, opts, c = null) => {
		return new Promise(async (resolve, reject) => {
			try {
				let { file, options, cb } = cleanedParams(f, opts, c);
				let result = null;

				if (Array.isArray(file)) {
					result = await uploadMany(file, options, cb);
				}

				if (typeof file == 'string') {
					result = await uploadOne(file, options, cb);
				}

				return cb ? cb(null, result) : resolve(result);
			} catch (e) {
				return cb ? cb(e, null) : reject(e);
			}
		});
	};

	const uploadOne = async (fileString, options) => {
		const Stream = await StreamManager.getFileStream(fileString);
		await this.uploader.one(options, Stream);
		this.emitter.emit('file uploaded', Stream);

		return Stream;
	};

	const uploadMany = async (files, options) => {
		files = files.map(item => {
			return uploadOne(item, options);
		});

		return resolveAllPromises(files);
	};

	const onUploaded = cb => {
		this.emitter.on('file uploaded', cb);
	};

	return {
		simpleUpload,
		onUploaded
	};
};
