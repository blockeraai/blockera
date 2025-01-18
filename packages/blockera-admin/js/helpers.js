// @flow

export const getCurrentPage = (
	pages: Array<string>,
	dashboardPage: string = 'dashboard'
): string => {
	const location = window.location;

	for (const page of pages) {
		if (-1 === location.search.indexOf(page)) {
			continue;
		}

		return page;
	}

	return dashboardPage;
};
