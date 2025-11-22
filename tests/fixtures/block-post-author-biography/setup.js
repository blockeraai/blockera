/**
 * Setup for the post author biography block.
 *
 * @return {boolean} True if we need to createPost, false otherwise.
 */
export default function setup() {
	cy.wpCli(
		`wp user meta update 1 description 'This is a sample biography for the test WordPress user.'`
	);

	return true;
}
