const randomString = require('randomstring');

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

exports.resolveAllPromises = r => {
	return Promise.all(r.map(p => (p.catch ? p.catch(e => e) : p)));
};

exports.resolveName = (path, newName, generateName = false) => {
	let name = '';

	const chunks = path.split('/');
	const pathName = chunks[chunks.length - 1];
	const lastPoint = pathName.lastIndexOf('.');
	const extension = pathName.slice(lastPoint, pathName.length);
	name = pathName.slice(0, lastPoint);

	if (newName) {
		name = newName;
	}

	if (!newName || generateName) {
		name = randomString.generate();
	}

	return { name, extension };
};

exports.waitHooks = async (hooks, streams) => {
	const finalStream = hooks.reduce(async (c, n) => {
		const temp = await n(c);

		return temp;
	}, streams);

	return revalidateStructure(await finalStream);
};

const revalidateStructure = items => {
	if (!Array.isArray(items)) {
		throw new Error('Needs a Stream array to upload to AWS S3');
	}

	for (let item of items) {
		if (
			!typeof item == 'object' ||
			!item.stream ||
			!item.path ||
			!item.extension ||
			!item.name ||
			!item.fullName
		) {
			throw new Error('Some Stream instance is not valid');
		}
	}

	return items;
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
