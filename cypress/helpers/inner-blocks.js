import { openSettingsPanel } from './editor';

export function openInnerBlocksExtension() {
	openSettingsPanel('Inner Blocks');
}

export function setParentBlock() {
	cy.get(
		'.publisher-extension.publisher-extension-block-card .publisher-extension-block-card__title .publisher-extension-block-card__title__block'
	).click();
}

export function setInnerBlock(blockType, suffix = ' Customize') {
	openInnerBlocksExtension();

	cy.get('.publisher-extension.publisher-extension-inner-blocks').within(
		() => {
			cy.get(`[aria-label="${blockType}${suffix}"]`).click();
		}
	);
}
