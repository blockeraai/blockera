export const injectHelpersToCssGenerators = (
	helpers: Object,
	generators: Object
) => {
	Object.values(generators).map((generator, index) => {
		generator.forEach((item, _index) => {
			if ('function' === item?.type) {
				generators[Object.keys(generators)[index]] = {
					...item,
					function: helpers[item.function],
				};
			}
		});
	});

	return generators;
};
