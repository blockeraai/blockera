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
	addBlockToPost,
} from '@blockera/dev-cypress/js/helpers';

describe('useInnerBlocksInfo custom hook testing ...', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		// Aliases ...
		cy.getParentContainer('Text Color').within(() => {
			cy.getByDataCy('color-label').as('color-label');
		});
	});

	it('should render link inner block with correctly values in paragraph/normal/link/normal', () => {
		// Set "Link" Inner Block as current block.
		setInnerBlock('Link');

		// Set value
		cy.setColorControlValue('Text Color', 'aaa');

		// Expected text-color control value of paragraph/normal/link/normal.
		cy.get('@color-label').should('include.text', 'aaa');

		reSelectBlock();

		// Set "Link" Inner Block as current block.
		setInnerBlock('Link');

		// Assert control
		cy.get('@color-label').should('include.text', 'aaa');
	});

	it('should render link inner block with correctly values when navigate between all states of self and parent block', () => {
		{
			// Sets values on Link inner block for laptop device ...

			// ====================== paragraph/(normal and hover)/link/(normal and hover) ====================== //

			// Set "Link" Inner Block as current block.
			setInnerBlock('Link');
			// Set value.
			cy.setColorControlValue('Text Color', 'aaa');
			// set "Hover" state on paragraph.
			addBlockState('hover');
			// Set value.
			cy.setColorControlValue('Text Color', 'bbb');

			// ========== //
			setBlockState('Normal');
			reSelectBlock();
			// ========== //

			// set "Hover" state on paragraph.
			addBlockState('hover');
			// Set "Link" Inner Block as current block.
			setInnerBlock('Link');
			// Set value.
			cy.setColorControlValue('Text Color', 'ccc');
			// set "Hover" state on paragraph.
			setBlockState('Hover');
			// Set value.
			cy.setColorControlValue('Text Color', 'ddd');
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
			setInnerBlock('Link');
			// Expected text-color control value of paragraph/normal/link/normal.
			cy.get('@color-label').should('include.text', 'aaa');
			// Set "Hover" state.
			setBlockState('Hover');
			// Expected text-color control value of paragraph/normal/link/hover.
			cy.get('@color-label').should('include.text', 'bbb');

			// ========== //
			setBlockState('Normal');
			reSelectBlock();
			// ========== //

			// Set "Hover" state.
			setBlockState('Hover');
			// Set "Link" Inner Block as current block.
			setInnerBlock('Link');
			// Expected text-color control value of paragraph/hover/link/normal.
			cy.get('@color-label').should('include.text', 'ccc');
			// Set "Hover" state.
			setBlockState('Hover');
			// Expected text-color control value of paragraph/hover/link/hover.
			cy.get('@color-label').should('include.text', 'ddd');
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
			setInnerBlock('Link');
			// Expected text-color control value of paragraph/normal/link/normal.
			cy.get('@color-label').should('include.text', 'aaa');
			// Set value.
			cy.setColorControlValue('Text Color', 'eee');
			// set "Hover" state on paragraph.
			setBlockState('Hover');
			// Expected text-color control value of paragraph/normal/link/hover.
			cy.get('@color-label').should('include.text', 'eee');
			// Set value.
			cy.setColorControlValue('Text Color', 'fff');

			// ========== //
			setBlockState('Normal');
			reSelectBlock();
			// ========== //

			// set "Hover" state on paragraph.
			setBlockState('Hover');
			// Set "Link" Inner Block as current block.
			setInnerBlock('Link');
			// Expected text-color control value of paragraph/hover/link/normal.
			cy.get('@color-label').should('include.text', 'aaa');
			// Set value.
			cy.setColorControlValue('Text Color', '000');
			// set "Hover" state on paragraph.
			setBlockState('Hover');
			// Expected text-color control value of paragraph/hover/link/hover.
			cy.get('@color-label').should('include.text', '000');
			// Set value.
			cy.setColorControlValue('Text Color', '111');
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
			setInnerBlock('Link');
			// Expected text-color control value of paragraph/normal/link/normal.
			cy.get('@color-label').should('include.text', 'eee');
			// Set "Hover" state.
			setBlockState('Hover');
			// Expected text-color control value of paragraph/normal/link/hover.
			cy.get('@color-label').should('include.text', 'fff');

			// ========== //
			setBlockState('Normal');
			reSelectBlock();
			// ========== //

			// Set "Hover" state.
			setBlockState('Hover');
			// Set "Link" Inner Block as current block.
			setInnerBlock('Link');
			// Expected text-color control value of paragraph/hover/link/normal.
			cy.get('@color-label').should('include.text', '000');
			// Set "Hover" state.
			setBlockState('Hover');
			// Expected text-color control value of paragraph/hover/link/hover.
			cy.get('@color-label').should('include.text', '111');
		}
	});
});
