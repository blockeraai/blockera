const {
	getAllCategories,
	getFilteredCategoriesFromPrEnv,
} = require('./e2e-categories-lib');

const main = () => {
	let categories = getAllCategories();
	const prFilteredCategories = getFilteredCategoriesFromPrEnv();

	if (prFilteredCategories) {
		const allowed = new Set(prFilteredCategories);
		categories = categories.filter((category) => allowed.has(category));
	}

	console.log(JSON.stringify(categories));
};

main();
