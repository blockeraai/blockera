/**
 * Blockera dependencies
 */
import {
	createPost,
	addBlockState,
	setInnerBlock,
	setBlockState,
	setDeviceType,
	reSelectBlock,
} from '@blockera/dev-cypress/js/helpers';

describe('useInnerBlocksInfo custom hook testing ...', () => {
	beforeEach(() => {
		createPost();

		cy.getBlock('default').type('This is test paragraph', { delay: 0 });
		cy.getByDataTest('style-tab').click();

		cy.getParentContainer('Text Color').within(() => {
			cy.getByDataCy('color-label').as('color-label');
		});
	});

	it('should render link inner block with correctly values in paragraph/normal/link/normal', () => {
		// Set "Link" Inner Block as current block.
		setInnerBlock('elements/link');

		// Set value
		cy.setColorControlValue('Text Color', 'aaaaaa');

		// Expected text-color control value of paragraph/normal/link/normal.
		cy.get('@color-label').should('include.text', 'aaaaaa');

		reSelectBlock();

		// Set "Link" Inner Block as current block.
		setInnerBlock('elements/link');

		// Assert control
		cy.get('@color-label').should('include.text', 'aaaaaa');
	});

	it('should render link inner block with correctly values when navigate between all states of self and parent block', () => {
		{
			// Sets values on Link inner block for laptop device ...

			// ====================== paragraph/(normal and hover)/link/(normal and hover) ====================== //

			// Set "Link" Inner Block as current block.
			setInnerBlock('elements/link');
			// Set value.
			cy.setColorControlValue('Text Color', 'aaa');
			// set "Hover" state on paragraph.
			addBlockState('hover');
			// Set value.
			cy.setColorControlValue('Text Color', 'bbbbbb');

			// ========== //
			setBlockState('Normal');
			reSelectBlock();
			// ========== //

			// set "Hover" state on paragraph.
			addBlockState('hover');
			// Set "Link" Inner Block as current block.
			setInnerBlock('elements/link');
			// Set value.
			cy.setColorControlValue('Text Color', 'cccccc');
			// set "Hover" state on paragraph.
			setBlockState('Hover');
			// Set value.
			cy.setColorControlValue('Text Color', 'dddddd');
		}

		// ========== //
		setBlockState('Normal');
		reSelectBlock();
		setBlockState('Normal');
		// ========== //

		{
			// Asserts ...

			// ====================== paragraph/(normal and hover)/link/(normal and hover) ====================== //

			// Set "Link" Inner Block as current block.
			setInnerBlock('elements/link');
			// Expected text-color control value of paragraph/normal/link/normal.
			cy.get('@color-label').should('include.text', 'aaaaaa');
			// Set "Hover" state.
			setBlockState('Hover');
			// Expected text-color control value of paragraph/normal/link/hover.
			cy.get('@color-label').should('include.text', 'bbbbbb');

			// ========== //
			setBlockState('Normal');
			reSelectBlock();
			// ========== //

			// Set "Hover" state.
			setBlockState('Hover');
			// Set "Link" Inner Block as current block.
			setInnerBlock('elements/link');
			// Expected text-color control value of paragraph/hover/link/normal.
			cy.get('@color-label').should('include.text', 'cccccc');
			// Set "Hover" state.
			setBlockState('Hover');
			// Expected text-color control value of paragraph/hover/link/hover.
			cy.get('@color-label').should('include.text', 'dddddd');
		}

		// ========== //
		setBlockState('Normal');
		reSelectBlock();
		setBlockState('Normal');
		// ========== //

		{
			// Sets values on Link inner block for tablet ...
			setDeviceType('Tablet');

			// ====================== paragraph/(normal and hover)/link/(normal and hover) ====================== //

			// Set "Link" Inner Block as current block.
			setInnerBlock('elements/link');
			// Expected text-color control value of paragraph/normal/link/normal.
			cy.get('@color-label').should('include.text', 'aaaaaa');
			// Set value.
			cy.setColorControlValue('Text Color', 'eeeeee');
			// set "Hover" state on paragraph.
			setBlockState('Hover');
			// Expected text-color control value of paragraph/normal/link/hover.
			cy.get('@color-label').should('include.text', 'eeeeee');
			// Set value.
			cy.setColorControlValue('Text Color', 'ffffff');

			// ========== //
			setBlockState('Normal');
			reSelectBlock();
			// ========== //

			// set "Hover" state on paragraph.
			setBlockState('Hover');
			// Set "Link" Inner Block as current block.
			setInnerBlock('elements/link');
			// Expected text-color control value of paragraph/hover/link/normal.
			cy.get('@color-label').should('include.text', 'cccccc');
			// Set value.
			cy.setColorControlValue('Text Color', '000000');
			// set "Hover" state on paragraph.
			setBlockState('Hover');
			// Expected text-color control value of paragraph/hover/link/hover.
			cy.get('@color-label').should('include.text', '000000');
			// Set value.
			cy.setColorControlValue('Text Color', '111111');
		}

		// ========== //
		setBlockState('Normal');
		reSelectBlock();
		setBlockState('Normal');
		// ========== //

		{
			// Asserts ...

			// ====================== paragraph/(normal and hover)/link/(normal and hover) ====================== //

			// Set "Link" Inner Block as current block.
			setInnerBlock('elements/link');
			// Expected text-color control value of paragraph/normal/link/normal.
			cy.get('@color-label').should('include.text', 'eeeeee');
			// Set "Hover" state.
			setBlockState('Hover');
			// Expected text-color control value of paragraph/normal/link/hover.
			cy.get('@color-label').should('include.text', 'ffffff');

			// ========== //
			setBlockState('Normal');
			reSelectBlock();
			// ========== //

			// Set "Hover" state.
			setBlockState('Hover');
			// Set "Link" Inner Block as current block.
			setInnerBlock('elements/link');
			// Expected text-color control value of paragraph/hover/link/normal.
			cy.get('@color-label').should('include.text', '000000');
			// Set "Hover" state.
			setBlockState('Hover');
			// Expected text-color control value of paragraph/hover/link/hover.
			cy.get('@color-label').should('include.text', '111111');
		}
	});
});
