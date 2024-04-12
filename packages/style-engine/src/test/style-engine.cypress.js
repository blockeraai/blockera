import {
	appendBlocks,
	getBlockClientId,
	getWPDataObject,
	setBlockState,
	setBlockType,
	// setDeviceType,
} from '../../../../cypress/helpers';

//// Switch to normal state.
// 		cy.get('[data-id="normal"]').click();

describe('Style Engine Testing ...', () => {
	beforeEach(() => {
		appendBlocks(
			'<!-- wp:paragraph -->\n' +
				'<p>Test <a href="#">Link</a></p>\n' +
				'<!-- /wp:paragraph -->'
		);

		// Select target block
		cy.get('[data-type="core/paragraph"]').click();
	});

	describe('Testing Normal State', () => {
		it('should generate css for root attributes of master and inners block', () => {
			// 1- Set width for master block.
			cy.setInputFieldValue('Width', 'Size', 100);

			// 2- Assert master block css.
			getWPDataObject().then((data) => {
				cy.get(`#block-${getBlockClientId(data)}`).should(
					'have.css',
					'width',
					'100px'
				);
			});

			// ********************* After Passed Master Block Assertions ************************ //

			// 3- Go to customize link inner block panel.
			setBlockType('Link');

			// 4- Set width for link inner block.
			cy.setInputFieldValue('Width', 'Size', 50);

			// 5- Set display block for link inner block.
			cy.getParentContainer('Display', 'base-control').within(() => {
				cy.getByAriaLabel('Block').click();
			});

			// 6- Assert link inner block css.
			getWPDataObject().then((data) => {
				cy.get(`#block-${getBlockClientId(data)} a`).should(
					'have.css',
					'width',
					'50px'
				);
			});

			// ********************* After Passed Link Inner Block Assertions ************************ //

			// 7- Reassert master block css.
			getWPDataObject().then((data) => {
				cy.get(`#block-${getBlockClientId(data)}`).should(
					'have.css',
					'width',
					'100px'
				);
			});

			// 8- Switch to Master block.
			cy.getByAriaLabel('Selected Block').click();

			// 9- Reassert master block css.
			getWPDataObject().then((data) => {
				cy.get(`#block-${getBlockClientId(data)}`).should(
					'have.css',
					'width',
					'100px'
				);
			});
		});
	});

	describe('Testing Hover State. Tips of describe: other pseudo-classes like [hover,active,visited,before,after]', () => {
		beforeEach(() => {
			// Set hover state.
			cy.getByAriaLabel('Add New State').click();
		});

		it.only('should generate css for hover pseudo-class of master block', () => {
			// ********************* Manipulating attributes of master block in hover state ************************ //

			// 1- Set width for master block.
			cy.setInputFieldValue('Width', 'Size', 100);

			// 2- Assert master block css.
			getWPDataObject().then((data) => {
				// Before occurred real hover event.
				// Because we expect block element should have css style to show activated hover state.
				cy.get(`#block-${getBlockClientId(data)}`).should(
					'have.css',
					'width',
					'100px'
				);

				// Real hover
				cy.get(`#block-${getBlockClientId(data)}`).realHover();
				cy.get(`#block-${getBlockClientId(data)}:hover`).should(
					'have.css',
					'width',
					'100px'
				);
			});

			// ********************* Switch to normal state and check css ************************ //

			// 3- Set master block state to normal.
			setBlockState('Normal');

			// To No Hover
			cy.get('h1').realClick();
			cy.get('[data-type="core/paragraph"]').click();

			// 4- Assert master block css.
			getWPDataObject().then((data) => {
				// Block element should have not css style when activated state is normal.
				cy.get(`#block-${getBlockClientId(data)}`).should(
					'not.have.css',
					'width',
					'100px'
				);
			});

			// ********************* Manipulating root attributes of inner block inside parent hover state ************************ //

			// 5- Set master block state to hover.
			setBlockState('Hover');

			// 6- Go to customize link inner block panel.
			setBlockType('Link');

			// 7- Set width for link inner block.
			cy.setInputFieldValue('Width', 'Size', 50);

			// 8- Set display block for link inner block.
			cy.getParentContainer('Display', 'base-control').within(() => {
				cy.getByAriaLabel('Block').click();
			});

			// 9- Assert link inner block css.
			getWPDataObject().then((data) => {
				// Real hover
				cy.get(`#block-${getBlockClientId(data)}`).realHover();
				cy.get(`#block-${getBlockClientId(data)}:hover a`).should(
					'have.css',
					'width',
					'50px'
				);
			});

			// ********************* Manipulating pseudo-state attributes of inner block inside parent hover state ************************ //

			// 10- Set hover state to link inner block.
			cy.getByAriaLabel('Add New State').click();

			// 11- Set width for link inner block.
			cy.setInputFieldValue('Width', 'Size', 2);

			// 12- Set display block for link inner block.
			cy.getParentContainer('Display', 'base-control').within(() => {
				cy.getByAriaLabel('Block').click();
			});

			// 13- Assert link inner block css.
			getWPDataObject().then((data) => {
				// Before occurred real hover event.
				// Because we expect block link element should have css style to show activated parent hover state.
				cy.get(`#block-${getBlockClientId(data)} a`).should(
					'have.css',
					'width',
					'502px'
				);

				// Real hover
				cy.get(`#block-${getBlockClientId(data)} a`).realHover();
				cy.get(`#block-${getBlockClientId(data)}:hover a:hover`).should(
					'have.css',
					'width',
					'502px'
				);
			});
		});
	});
});
