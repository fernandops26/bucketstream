const { cleanedParams, resolveAllPromises, waitHooks } = require('./util');
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

	this.__uploadOne = async (stream, options) => {
		try {
			await this.uploader.upload(options, stream);
			this.emitter.emit('upload', stream);

			return stream;
		} catch (e) {
			this.emitter.emit('error upload', e);
			throw e;
		}
	};

	this.__upload = async preparedStreams => {
		const jobs = preparedStreams.map(item => {
			return this.__uploadOne(item, {});
		});

		return resolveAllPromises(jobs);
	};

	const simpleUpload = (objectives, opts, c = null) => {
		return new Promise(async (resolve, reject) => {
			let { file, options, cb } = cleanedParams(objectives, opts, c);

			try {
				let streams = await StreamManager.prepareStreams(file, options);
				streams = await waitHooks(this.hooks, streams);
				const result = await this.__upload(streams);
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
