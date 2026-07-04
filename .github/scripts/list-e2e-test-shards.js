const {
	getAllCategories,
	getEnvProfile,
	getFilteredCategoriesFromPrEnv,
	sortCategories,
} = require('./e2e-categories-lib');

const BASE_CHUNK_SIZE = Number.parseInt(
	process.env.E2E_BASE_CHUNK_SIZE || '4',
	10
);

const chunkArray = (items, size) => {
	const chunks = [];

	for (let index = 0; index < items.length; index += size) {
		chunks.push(items.slice(index, index + size));
	}

	return chunks;
};

const buildShards = (categories) => {
	const byEnv = new Map();

	categories.forEach((category) => {
		const env = getEnvProfile(category);

		if (!byEnv.has(env)) {
			byEnv.set(env, []);
		}

		byEnv.get(env).push(category);
	});

	const shards = [];

	byEnv.forEach((envCategories, env) => {
		const sortedEnvCategories = sortCategories(envCategories);

		if (env === 'base') {
			const chunks = chunkArray(sortedEnvCategories, BASE_CHUNK_SIZE);

			chunks.forEach((chunk, index) => {
				shards.push({
					shard: `base-${index + 1}`,
					env: 'base',
					categories: chunk,
				});
			});

			return;
		}

		shards.push({
			shard: env,
			env,
			categories: sortedEnvCategories,
		});
	});

	return shards.sort((left, right) => left.shard.localeCompare(right.shard));
};

const main = () => {
	let categories = getAllCategories();
	const prFilteredCategories = getFilteredCategoriesFromPrEnv();

	if (prFilteredCategories) {
		const allowed = new Set(prFilteredCategories);
		categories = categories.filter((category) => allowed.has(category));
	}

	if (!categories.length) {
		console.log(JSON.stringify([]));
		return;
	}

	console.log(JSON.stringify(buildShards(categories)));
};

main();
