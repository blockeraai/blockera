import {
	appendBlocks,
	createPost,
	assertBlockData,
	getSelectedBlock,
	openMoreFeaturesControl,
} from '@blockera/dev-cypress/js/helpers';

const MORE_TYPOGRAPHY_LABEL = 'More typography settings';

const moreTypographyButton = () =>
	cy.get(
		`.blockera-component-more-features > button[aria-label="${MORE_TYPOGRAPHY_LABEL}"]`
	);

const openMoreTypography = () => {
	openMoreFeaturesControl(MORE_TYPOGRAPHY_LABEL);
	cy.get('.blockera-component-more-features').should('have.class', 'is-open');
};

const closeMoreTypography = () => {
	moreTypographyButton().click();
	cy.get('.blockera-component-more-features').should(
		'not.have.class',
		'is-open'
	);
};

const editLetterSpacing = (value) => {
	cy.getParentContainer('Letters').within(() => {
		cy.get('input').clear({ force: true });
		cy.get('input').type(String(value), { force: true });
	});
};

const resetLetterSpacing = () => {
	cy.getParentContainer('Letters').within(() => {
		cy.get('.blockera-control-reset-icon').click({ force: true });
	});
};

const assertLettersPromotedOutside = () => {
	cy.get('.blockera-component-more-features').should(
		'not.have.class',
		'is-open'
	);
	cy.getParentContainer('Letters').scrollIntoView().should('exist');
};

const assertLettersInsideOpenMoreTypography = () => {
	cy.get('.blockera-component-more-features').should('have.class', 'is-open');
	cy.get('.blockera-component-more-features.is-open')
		.find('[aria-label="Letters"]')
		.scrollIntoView()
		.should('exist');
};

const assertLettersHiddenUntilMoreTypographyOpens = () => {
	cy.get('.blockera-component-more-features').should(
		'not.have.class',
		'is-open'
	);
	cy.get('[aria-label="Letters"]').should('not.exist');

	openMoreTypography();
	cy.getParentContainer('Letters').should('exist');
};

describe('Typography MoreFeatures → promote edited features', () => {
	describe('session edits from default', () => {
		beforeEach(() => {
			createPost();

			cy.getBlock('default').type('This is test paragraph', {
				delay: 0,
			});
			cy.getByAriaControls('styles-view').click();
		});

		it('does not promote while MoreFeatures is still open', () => {
			openMoreTypography();

			editLetterSpacing(5);

			assertLettersInsideOpenMoreTypography();
		});

		it('shows the change indicator while editing inside MoreFeatures', () => {
			openMoreTypography();

			editLetterSpacing(5);

			cy.get('.blockera-component-more-features.is-open').should(
				'have.class',
				'is-changed'
			);
		});

		it('promotes an edited feature after MoreFeatures closes', () => {
			openMoreTypography();

			editLetterSpacing(5);

			closeMoreTypography();

			assertLettersPromotedOutside();
		});

		it('persists the edited value after promotion', () => {
			openMoreTypography();

			editLetterSpacing(5);

			closeMoreTypography();

			assertBlockData((data) => {
				expect('5px').to.equal(
					getSelectedBlock(data, 'blockeraLetterSpacing')
				);
			});
		});

		it('promotes a non-spacing feature after MoreFeatures closes', () => {
			openMoreTypography();

			cy.getByAriaLabel('Uppercase').click();

			closeMoreTypography();

			cy.get('.blockera-component-more-features').should(
				'not.have.class',
				'is-open'
			);

			assertBlockData((data) => {
				expect('uppercase').to.equal(
					getSelectedBlock(data, 'blockeraTextTransform')
				);
			});

			cy.getByAriaLabel('Uppercase').should('exist');
		});
	});

	describe('saved non-default values', () => {
		beforeEach(() => {
			createPost();

			appendBlocks(
				'<!-- wp:paragraph {"style":{"typography":{"letterSpacing":"2px"}}} -->\n' +
					'<p style="letter-spacing:2px">Test paragraph</p>\n' +
					'<!-- /wp:paragraph -->'
			);

			cy.getBlock('core/paragraph').click();
			cy.getByAriaControls('styles-view').click();
		});

		it('promotes saved letter spacing on block select', () => {
			cy.get('.blockera-component-more-features').should(
				'not.have.class',
				'is-open'
			);
			cy.getParentContainer('Letters').scrollIntoView().should('exist');

			cy.getBlock('core/paragraph').should(
				'have.css',
				'letter-spacing',
				'2px'
			);

			assertBlockData((data) => {
				const selected = data
					.select('core/block-editor')
					.getSelectedBlock();

				expect('2px').to.equal(
					selected.attributes.style?.typography?.letterSpacing
				);
			});
		});
	});

	describe('spacing group promotion', () => {
		beforeEach(() => {
			createPost();

			cy.getBlock('default').type('This is test paragraph', {
				delay: 0,
			});
			cy.getByAriaControls('styles-view').click();
		});

		it('promotes the whole spacing group when word spacing is edited', () => {
			openMoreTypography();

			cy.getParentContainer('Words').within(() => {
				cy.get('input').clear({ force: true });
				cy.get('input').type('3', { force: true });
			});

			closeMoreTypography();

			cy.getParentContainer('Words').scrollIntoView().should('exist');
			cy.getParentContainer('Letters').scrollIntoView().should('exist');
		});
	});

	describe('block switch with multiple blocks', () => {
		beforeEach(() => {
			createPost();

			appendBlocks(
				'<!-- wp:paragraph -->\n<p>First paragraph</p>\n<!-- /wp:paragraph -->\n\n<!-- wp:paragraph -->\n<p>Second paragraph</p>\n<!-- /wp:paragraph -->'
			);

			cy.getBlock('core/paragraph').first().click();
			cy.getByAriaControls('styles-view').click();
		});

		it('demotes a reset feature after switching blocks', () => {
			openMoreTypography();

			editLetterSpacing(5);

			closeMoreTypography();

			resetLetterSpacing();

			assertLettersPromotedOutside();

			cy.getBlock('core/paragraph').eq(1).click();
			cy.getBlock('core/paragraph').eq(0).click();

			assertLettersHiddenUntilMoreTypographyOpens();
		});
	});
});
