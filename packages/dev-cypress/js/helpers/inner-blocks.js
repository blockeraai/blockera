import { getSelectedBlock, openSettingsPanel } from './editor';

export function openInnerBlocksExtension() {
	openSettingsPanel('Inner Blocks');
}

export function setParentBlock() {
	cy.get('.blockera-extension-block-card__close').click();
}

export function setInnerBlock(blockType) {
	cy.wrap(openInnerBlocksExtension())
		.wait(100)
		.get('body')
		.then(($body) => {
			if (
				$body.find(
					`.blockera-extension.blockera-extension-inner-blocks div[data-id="${blockType}"]`
				).length > 0
			) {
				cy.get(
					'.blockera-extension.blockera-extension-inner-blocks'
				).within(() => {
					cy.getByDataId(blockType).click();
				});
			} else {
				openInserterInnerBlock();

				cy.get(
					'.blockera-component-popover.blockera-inner-blocks-picker'
				)
					.last()
					.within(() => {
						cy.getByAriaLabel(blockType).click({ force: true });
					});
			}
		});
}

export function openInserterInnerBlock(disabled = '') {
	if (disabled) {
		cy.get('button')
			.contains('Add Inner Block')
			.should('have.attr', 'disabled');
	} else {
		cy.get('button').contains('Add Inner Block').click({ force: true });
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
