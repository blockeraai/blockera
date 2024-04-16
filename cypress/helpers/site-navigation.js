import { getWPDataObject, disableGutenbergFeatures } from './editor';

/**
 * Login to our test WordPress site
 */
export function loginToSite() {
	return goTo('/wp-login.php', true).then(() => {
		// eslint-disable-next-line
		cy.wait(250);

		cy.get('#user_login').type(Cypress.env('wpUsername'));
		cy.get('#user_pass').type(Cypress.env('wpPassword'));
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
 */
export function createPost({ postType = 'post' } = {}) {
	goTo('/wp-admin/post-new.php?post_type=' + postType).then(() => {
		// eslint-disable-next-line
		cy.wait(2000);
		disableGutenbergFeatures();
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
