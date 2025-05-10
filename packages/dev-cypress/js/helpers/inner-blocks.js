import { getSelectedBlock } from './editor';
import { openInserter } from './block-states';

export function setParentBlock() {
	cy.get('.blockera-extension-block-card__close').click();
}

export function setInnerBlock(blockType) {
	cy.get('body').then(($body) => {
		if (
			$body.find(`.blockera-control-repeater div[data-id="${blockType}"]`)
				.length > 0
		) {
			cy.getByDataId(blockType).within(() => {
				cy.get('span:nth-child(2)').click({ force: true });
			});
		} else {
			openInserter();

			cy.get('.blockera-component-popover')
				.last()
				.within(() => {
					cy.getByAriaLabel(blockType).click({ force: true });
				});
		}
	});
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
