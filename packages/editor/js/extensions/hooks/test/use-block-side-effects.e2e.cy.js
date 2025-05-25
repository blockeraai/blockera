import { appendBlocks } from '@blockera/dev-cypress/js/helpers/editor';
import { createPost } from '@blockera/dev-cypress/js/helpers/site-navigation';
import { addBlockState } from '@blockera/dev-cypress/js/helpers/block-states';

describe('useBlockSideEffects Testing ...', () => {
	beforeEach(() => {
		createPost();
	});

	it('should be able to hide WordPress block original tabs on styles tab on normal', () => {
		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.get('[aria-label="Settings"]').eq(1).click({ force: true });
		cy.getByDataTest('style-tab').click();

		cy.get('[role="tabpanel"] .block-editor-block-inspector__tabs').should(
			'have.css',
			'display',
			'none'
		);
	});

	it('should be able display original settings tab panel inside blockera settings tab on normal', () => {
		appendBlocks(
			'<!-- wp:social-links {"className":"is-style-default"} -->\n' +
				'<ul class="wp-block-social-links is-style-default"><!-- wp:social-link {"service":"wordpress"} /--></ul>\n' +
				'<!-- /wp:social-links -->'
		);

		cy.getBlock('core/social-links').click();
		cy.getByDataTest('settings-tab').click({ force: true });

		cy.get('[aria-labelledby*="-settings"]')
			.eq(1)
			.should('have.not.css', 'display', 'none');
	});

	it('should be disable original settings tab panel inside blockera settings tab on un normal', () => {
		appendBlocks(
			'<!-- wp:social-links {"className":"is-style-default"} -->\n' +
				'<ul class="wp-block-social-links is-style-default"><!-- wp:social-link {"service":"wordpress"} /--></ul>\n' +
				'<!-- /wp:social-links -->'
		);

		cy.getBlock('core/social-links').click();

		addBlockState('hover');

		cy.getByDataTest('settings-tab').click({ force: true });

		cy.getByDataTest('blockera-availability').should(
			'have.css',
			'cursor',
			'not-allowed'
		);
	});

	it('should be disable original settings outside any tabs inside blockera settings tab on un normal', () => {
		appendBlocks(
			'<!-- wp:social-links {"className":"is-style-default"} -->\n' +
				'<ul class="wp-block-social-links is-style-default"><!-- wp:social-link {"service":"wordpress"} /--></ul>\n' +
				'<!-- /wp:social-links -->'
		);

		cy.getBlock('core/social-link').click();

		addBlockState('hover');

		cy.getByDataTest('settings-tab').click({ force: true });

		cy.getByDataTest('blockera-availability').should(
			'have.css',
			'cursor',
			'not-allowed'
		);
	});
});
