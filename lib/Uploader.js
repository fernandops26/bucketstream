const AWS = require('aws-sdk');

module.exports = class Uploader {
	constructor(config) {
		AWS.config.update(config);

		this.defaultBucket = config.Bucket;
		this.s3 = new AWS.S3(this.config);
	}

	upload(options, StreamObject) {
		return new Promise((resolve, reject) => {
			const config = {
				Bucket: options.bucketName || this.defaultBucket,
				Body: StreamObject.stream,
				Key: StreamObject.name + StreamObject.extension
			};

			this.s3.upload(config, (err, data) => {
				if (err) return reject(err);
				return resolve(data);
			});
		});
	}
};
