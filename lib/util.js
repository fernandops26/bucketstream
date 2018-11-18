exports.cleanedParams = (file = null, opts = {}, c = null) => {
	if (!file || (Array.isArray(file) && file.length == 0)) {
		throw new Error('Needs file name');
	}

	let options = opts,
		cb = c;

	if (typeof opts != 'object' || typeof opts != 'function') {
		options = {};
	}

	if (typeof opts == 'function') {
		cb = opts;
		options = {};
	}

	return { file, options, cb };
};

exports.resolveAllPromises = r =>
	Promise.all(r.map(p => (p.catch ? p.catch(e => e) : p)));
