import { getWPDataObject, disableGutenbergFeatures } from './editor';

/**
 * Login to our test WordPress site
 */
export function loginToSite(user = '', pass = '') {
	return goTo('/wp-login.php', true).then(() => {
		// eslint-disable-next-line
		cy.wait(250);

		cy.get('#user_login').type(user || Cypress.env('wpUsername'));
		cy.get('#user_pass').type(pass || Cypress.env('wpPassword'));
		cy.get('#wp-submit').click();
	});
}

/**
 * Go to a specific URI.
 *
 * @param {string}  path  The URI path to go to.
 * @param {boolean} login If this is a login page.
 */
export function goTo(path = '/wp-admin', login = false) {
	const testURL = Cypress.env('testURL');

	if (
		(testURL.endsWith('/') && !path.startsWith('/')) ||
		(!testURL.endsWith('/') && path.startsWith('/'))
	) {
		path = `${testURL}${path}`;
	} else if (!testURL.endsWith('/') && !path.startsWith('/')) {
		path = `${testURL}/${path}`;
	} else if (testURL.endsWith('/') && path.startsWith('/')) {
		path = `${testURL.slice(0, -1)}${path}`;
	}

	return cy.visit(path).then(() => {
		return login
			? cy.window().then((win) => {
					return win;
			  })
			: getWPDataObject();
	});
}

/**
 * Creates new post
 *
 * @param {postType} string WP post type slug
 * @param {postTitle} string WP post title
 */
export function createPost({ postType = 'post', postTitle = '' } = {}) {
	goTo('/wp-admin/post-new.php?post_type=' + postType).then(() => {
		// eslint-disable-next-line
		cy.wait(2000);

		if (postType === 'page') {
			cy.wait(7000);
			cy.get('body').then(($body) => {
				const selector = 'button[aria-label="Close"]';

				const domElement = $body.find(selector);

				// Check if the element exists in the DOM
				if (domElement.length > 0) {
					// If it exists, click on the element
					cy.get(selector).click();
				}
			});
		}

		if (['post', 'page'].includes(postType)) {
			disableGutenbergFeatures();
			setAbsoluteBlockToolbar();
		}

		if (postTitle) {
			cy.getIframeBody()
				.find(
					'h1.wp-block.wp-block-post-title, textarea[placeholder="Add title"]'
				)
				.click()
				.type(postTitle);
		}
	});
}

/**
 * Safely set absolutely block top toolbar.
 */
export function setAbsoluteBlockToolbar() {
	// open options menu.
	cy.get('[aria-label="Options"]').first().click();

	cy.get('body').then(($body) => {
		const selector =
			'div[aria-labelledby="components-menu-group-label-0"] button:first-child';
		const domElement = $body.find(selector);

		// Check if the element exists in the DOM
		if (domElement.length > 0 && domElement.find('svg').length > 0) {
			// If it exists, click on the element
			cy.get('span').contains('Top toolbar').click();
		}

		// close options menu.
		cy.get('[aria-label="Options"]').first().click();
	});
}

/**
 * Go to edit page of post
 *
 * @param {postType} string WP post type slug
 */
export function editPost({ postID = '' } = {}) {
	goTo(`/wp-admin/post.php?post=${postID}&action=edit`).then(() => {
		// eslint-disable-next-line
		cy.wait(2000);
		disableGutenbergFeatures();
	});
}
