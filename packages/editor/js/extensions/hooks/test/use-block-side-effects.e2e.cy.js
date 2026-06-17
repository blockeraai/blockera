import { appendBlocks } from '@blockera/dev-cypress/js/helpers/editor';
import { createPost } from '@blockera/dev-cypress/js/helpers/site-navigation';
import { setBlockState } from '@blockera/dev-cypress/js/helpers/block-states';

const SOCIAL_LINKS_BLOCK =
	'<!-- wp:social-links {"className":"is-style-default"} -->\n' +
	'<ul class="wp-block-social-links is-style-default"><!-- wp:social-link {"service":"wordpress"} /--></ul>\n' +
	'<!-- /wp:social-links -->';

describe('useBlockSideEffects Testing ...', () => {
	beforeEach(() => {
		cy.viewport(1440, 1025);
		createPost();
	});

	it('should be able display original settings tab panel inside blockera settings tab on normal', () => {
		appendBlocks(SOCIAL_LINKS_BLOCK);
		cy.getBlock('core/social-link').click();
		cy.getBlock('core/social-links').click();
		cy.getByAriaControls('settings-view').click({ force: true });

		cy.get('[aria-labelledby*="-settings"]').should(
			'have.not.css',
			'display',
			'none'
		);
	});

	it('should be disable original settings tab panel inside blockera settings tab on un normal', () => {
		appendBlocks(SOCIAL_LINKS_BLOCK);
		cy.getBlock('core/social-link').click();
		cy.getBlock('core/social-links').click();

		setBlockState('Hover');

		cy.getByAriaControls('settings-view').click({ force: true });

		cy.getByDataTest('blockera-availability').should(
			'have.css',
			'cursor',
			'not-allowed'
		);
	});

	it('should be disable original settings outside any tabs inside blockera settings tab on un normal', () => {
		appendBlocks(SOCIAL_LINKS_BLOCK);
		cy.getBlock('core/social-link').first().click();
		cy.getBlock('core/social-links').click();
		cy.getBlock('core/social-link').first().click();

		setBlockState('Hover');

		cy.getByAriaControls('settings-view').click({ force: true });

		cy.getByDataTest('blockera-availability').should(
			'have.css',
			'cursor',
			'not-allowed'
		);
	});
});
