/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

function openBlockeraStyleTab() {
	cy.get('[role="tab"][aria-label="Styles"]').click();
}

describe('Min Height → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('core/cover Block', () => {
		it('Simple Value', () => {
			appendBlocks(
				`<!-- wp:cover {"url":"https://placehold.co/600x400","id":60,"dimRatio":50,"minHeight":300,"minHeightUnit":"px","layout":{"type":"constrained"}} -->
<div class="wp-block-cover" style="min-height:300px"><img class="wp-block-cover__image-background wp-image-60" alt="" src="https://placehold.co/600x400" data-object-fit="cover"/><span aria-hidden="true" class="wp-block-cover__background has-background-dim"></span><div class="wp-block-cover__inner-container"><!-- wp:paragraph {"align":"center","placeholder":"Write title…","fontSize":"large"} -->
<p class="has-text-align-center has-large-font-size">Cover Text</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:cover -->`
			);

			cy.getBlock('core/paragraph').first().click();

			cy.getByAriaLabel(
				'Select parent block: Cover',
				'Select Cover'
			).click();

			openBlockeraStyleTab();

			cy.activateMoreSettingsItem('More Size Settings', 'Min Height');

			cy.getParentContainer('Min Height').as('container');

			cy.addNewTransition();

			getWPDataObject().then((data) => {
				expect('300px').to.be.equal(
					getSelectedBlock(data, 'blockeraMinHeight')
				);
			});

			cy.get('@container').within(() => {
				cy.get('input').as('containerInput');
				cy.get('@containerInput').type('1', { force: true });
			});

			getWPDataObject().then((data) => {
				expect(3001).to.be.equal(getSelectedBlock(data, 'minHeight'));
				expect('px').to.be.equal(
					getSelectedBlock(data, 'minHeightUnit')
				);
			});

			cy.get('@container').within(() => {
				cy.get('input').clear({ force: true });
			});

			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'minHeight')
				);
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'minHeightUnit')
				);
			});
		});

		it('Use WP not supported value', () => {
			appendBlocks(
				`<!-- wp:cover {"url":"https://placehold.co/600x400","id":60,"dimRatio":50,"layout":{"type":"constrained"}} -->
<div class="wp-block-cover"><img class="wp-block-cover__image-background wp-image-60" alt="" src="https://placehold.co/600x400" data-object-fit="cover"/><span aria-hidden="true" class="wp-block-cover__background has-background-dim"></span><div class="wp-block-cover__inner-container"><!-- wp:paragraph {"align":"center","placeholder":"Write title…","fontSize":"large"} -->
<p class="has-text-align-center has-large-font-size">Cover Text</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:cover -->`
			);

			cy.getBlock('core/paragraph').first().click();

			cy.getByAriaLabel(
				'Select parent block: Cover',
				'Select Cover'
			).click();

			openBlockeraStyleTab();

			cy.activateMoreSettingsItem('More Size Settings', 'Min Height');

			cy.get('[aria-label="Min Height"]')
				.closest('[data-cy="base-control"]')
				.as('container');

			cy.get('@container').within(() => {
				cy.get('input').as('containerInput');
				cy.get('@containerInput').type('300', { force: true });
				cy.get('select').select('px');
			});

			getWPDataObject().then((data) => {
				expect('300px').to.be.equal(
					getSelectedBlock(data, 'blockeraMinHeight')
				);

				expect(300).to.be.equal(getSelectedBlock(data, 'minHeight'));

				expect('px').to.be.equal(
					getSelectedBlock(data, 'minHeightUnit')
				);
			});

			cy.get('@container').within(() => {
				cy.get('input').as('containerInput');
				cy.get('@containerInput').clear();
				cy.get('@containerInput').type('200', { force: true });
				cy.get('select').select('%');
			});

			getWPDataObject().then((data) => {
				expect(200).to.be.equal(getSelectedBlock(data, 'minHeight'));

				expect('%').to.be.equal(
					getSelectedBlock(data, 'minHeightUnit')
				);
			});

			cy.get('@container').within(() => {
				cy.get('input').clear({ force: true });
			});

			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'minHeight')
				);
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'minHeightUnit')
				);
			});
		});
	});

	describe('core/group Block', () => {
		it('Simple Value', () => {
			appendBlocks(`<!-- wp:group {"style":{"dimensions":{"minHeight":"300px"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="min-height:300px"><!-- wp:paragraph -->
<p>Paragraph 1</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`);

			cy.getBlock('core/paragraph').first().click();

			cy.getByAriaLabel('Select Group').click();

			openBlockeraStyleTab();

			cy.getParentContainer('Min Height').as('container');

			cy.addNewTransition();

			getWPDataObject().then((data) => {
				expect('300px').to.be.equal(
					getSelectedBlock(data, 'blockeraMinHeight')
				);
			});

			cy.get('@container').within(() => {
				cy.get('input').as('containerInput');
				cy.get('@containerInput').type('1', { force: true });
			});

			getWPDataObject().then((data) => {
				expect('3001px').to.be.equal(
					getSelectedBlock(data, 'style')?.dimensions?.minHeight
				);
			});

			cy.get('@container').within(() => {
				cy.get('input').clear({ force: true });
			});

			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.dimensions?.minHeight
				);
			});
		});
	});
});
