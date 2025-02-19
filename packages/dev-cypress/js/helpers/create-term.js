/**
 * Create a Term of a given taxonomy
 *
 * Reference: https://github.com/10up/cypress-wp-utils/blob/develop/src/commands/create-term.ts
 *
 * @param {string} name - Term name
 * @param {string} taxonomy - Taxonomy
 * @param {Object} [options] - Additional options
 * @param {string} [options.slug] - Taxonomy slug
 * @param {number|string} [options.parent] - Parent taxonomy (ID or name)
 * @param {string} [options.description] - Taxonomy description
 * @param {Function} [options.beforeSave] - Callable function hook
 *
 * @example
 * cy.createTerm()
 *
 * @example
 * cy.createTerm('Category')
 *
 * @example
 * cy.createTerm('Category').then(term => {
 *   cy.log(term.term_id);
 * });
 *
 * @example
 * cy.createTerm('Product name', 'product')
 *
 * @example
 * cy.createTerm('Child', 'category', {
 *   parent: 'Parent',
 *   slug: 'child-slug',
 *   description: 'Custom description'
 * })
 */
export const createTerm = (
	name = 'Test category',
	taxonomy = 'category',
	options = {}
) => {
	const { slug = '', parent = -1, description = '', beforeSave } = options;

	cy.visit(
		`${Cypress.env('testURL')}/wp-admin/edit-tags.php?taxonomy=${taxonomy}`
	);

	cy.intercept(
		'POST',
		`${Cypress.env('testURL')}/wp-admin/admin-ajax.php`,
		(req) => {
			if (
				typeof req.body === 'string' &&
				req.body.includes('action=add-tag')
			) {
				req.alias = 'ajaxAddTag';
			}
		}
	);

	cy.get('#tag-name').click().type(`${name}`);

	if (slug) {
		cy.get('#tag-slug').click().type(`${slug}`);
	}

	if (description) {
		cy.get('#tag-description').click().type(`${description}`);
	}

	if (parent !== -1) {
		cy.get('body').then(($body) => {
			if ($body.find('#parent').length !== 0) {
				cy.get('#parent').select(parent.toString());
			}
		});
	}

	if (typeof beforeSave !== 'undefined') {
		beforeSave();
	}

	cy.get('#submit').click();

	cy.wait('@ajaxAddTag').then((response) => {
		const body = Cypress.$.parseXML(response.response?.body);
		const termData = Cypress.$(body).find('response term supplemental > *');

		if (termData.length === 0) {
			cy.wrap(false);
			return;
		}

		const term = termData.toArray().reduce((map, el) => {
			const $el = Cypress.$(el);
			map[$el.prop('tagName')] = $el.text();
			return map;
		}, {});

		[
			'term_id',
			'count',
			'parent',
			'term_group',
			'term_taxonomy_id',
		].forEach((index) => {
			term[index] = parseInt(term[index], 10);
		});

		cy.wrap(term);
	});
};
