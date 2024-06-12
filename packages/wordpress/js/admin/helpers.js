// @flow

export const handleCurrentActiveMenuPage = (page: string): void => {
	window.history.pushState(
		'',
		'',
		window.location.origin +
			window.location.pathname +
			'?page=blockera-settings-' +
			page
	);

	const current = document.querySelector(
		'li#toplevel_page_blockera-settings ul li.current'
	);

	if (current) {
		current.classList.remove('current');

		const items = document.querySelectorAll(
			'li#toplevel_page_blockera-settings ul li'
		);

		items.forEach((item) => {
			if (item.classList.contains('blockera-disable-first-item')) {
				item.style.display = 'none';
			}

			if (-1 === item.innerHTML.indexOf(page)) {
				return;
			}

			item.classList.add('current');
		});
	}
};
