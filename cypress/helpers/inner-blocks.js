import { openSettingsPanel } from './editor';

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
