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

exports.ensureStructure = objectives => {
	let cleanedObjectives = [];

	if (Array.isArray(objectives)) {
		cleanedObjectives = objectives.map(item => stringOrObject(item));
	} else {
		cleanedObjectives.push(stringOrObject(objectives));
	}

	return cleanedObjectives.filter(item => item);
};

const stringOrObject = item => {
	if (!item) {
		return null;
	}

	if (typeof item == 'string') {
		item = { path: item };
	}

	return item;
};

exports.resolveAllPromises = r => {
	return Promise.all(r.map(p => (p.catch ? p.catch(e => e) : p)));
};
