import { getSelectedBlock, openSettingsPanel } from './editor';

export function openInnerBlocksExtension() {
	openSettingsPanel('Inner Blocks');
}

export function setParentBlock() {
	cy.get(
		'.blockera-extension.blockera-extension-block-card .blockera-extension-block-card__title .blockera-extension-block-card__title__block'
	).click();
}

export function setInnerBlock(blockType, suffix = ' Customize') {
	openInnerBlocksExtension();

	cy.get('.blockera-extension.blockera-extension-inner-blocks').within(() => {
		cy.get(`[aria-label="${blockType}${suffix}"]`).click();
	});
}

export function openInserterInnerBlock(disabled = '') {
	if (disabled) {
		cy.get('button')
			.contains('Add Inner Block')
			.should('have.attr', 'disabled');
	} else {
		cy.get('button').contains('Add Inner Block').click();
	}
}

export function getAllowedBlocks() {
	return cy
		.window()
		.its('wp.data')
		.then((data) => {
			return data
				.select('core/block-editor')
				.getAllowedBlocks(getSelectedBlock(data).clientId);
		});
}

export function getBlockTypeInnerBlocksStore(data) {
	return data
		.select('blockera/extensions')
		.getBlockInners(getSelectedBlock(data).clientId);
}

export function search(term) {
	cy.getByDataId('search bar').type(term, { delay: 0 });
}
