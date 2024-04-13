import {
	appendBlocks,
	setInnerBlock,
	setDeviceType,
} from '../../../../../../cypress/helpers';

function assertFontSize(expected) {
	// Alias
	cy.get('h2').contains('Typography').parent().parent().as('typo');

	// Assertion for master block attributes.
	cy.get('@typo').within(() => {
		cy.get('[aria-label="Font Size"]')
			.parent()
			.next()
			.within(() => {
				cy.get('input').should('have.value', expected);
			});
	});
}

describe('Should calculate current attributes correctly:', () => {
	it('For Paragraph -> Normal -> Laptop', () => {
		appendBlocks(
			'<!-- wp:paragraph {"style":{"typography":{"fontSize":"22px"}},"className":"publisher-core-block publisher-core-block-5c0ef777-bb94-42dd-9c68-2e0e1a5ecd48","publisherFontSize":"22px","publisherBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":true}},"publisherInnerBlocks":{"link":{"attributes":{"publisherFontSize":"27px"}}},"publisherPropsId":"2131738221","publisherCompatId":"2131738221"} -->\n' +
				'<p class="publisher-core-block publisher-core-block-5c0ef777-bb94-42dd-9c68-2e0e1a5ecd48"></p>\n' +
				'<!-- /wp:paragraph -->'
		);

		// Select target block
		cy.get('[data-type="core/paragraph"]').click();

		assertFontSize(22);
	});
	it('For Paragraph -> Normal -> Tablet', () => {
		appendBlocks(
			'<!-- wp:paragraph {"style":{"typography":{"fontSize":"22px"}},"className":"publisher-core-block publisher-core-block-602a2f46-ce00-4e74-adb1-b45c59b6886d","publisherFontSize":"22px","publisherBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}},"tablet":{"attributes":{"publisherFontSize":"27px"}}},"isVisible":true,"isSelected":true}},"publisherPropsId":"216142147583","publisherCompatId":"216142147584"} -->\n' +
				'<p class="publisher-core-block publisher-core-block-602a2f46-ce00-4e74-adb1-b45c59b6886d" style="font-size:22px"></p>\n' +
				'<!-- /wp:paragraph -->'
		);

		// Select target block
		cy.get('[data-type="core/paragraph"]').click();

		setDeviceType('Tablet');

		assertFontSize(27);
	});

	it('For Paragraph -> Normal -> Laptop -> Link -> Normal -> Laptop', () => {
		appendBlocks(
			'<!-- wp:paragraph {"style":{"typography":{"fontSize":"22px"}},"className":"publisher-core-block publisher-core-block-84d2a73b-edb9-483e-82a6-17cb82da38c4","publisherFontSize":"22px","publisherBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":true}},"publisherInnerBlocks":{"link":{"attributes":{"publisherFontSize":"27px"}}},"publisherPropsId":"216143049173","publisherCompatId":"216143049173"} -->\n' +
				'<p class="publisher-core-block publisher-core-block-84d2a73b-edb9-483e-82a6-17cb82da38c4" style="font-size:22px">test</p>\n' +
				'<!-- /wp:paragraph -->'
		);

		// Select target block
		cy.get('[data-type="core/paragraph"]').click();

		// paragraph -> normal
		assertFontSize(22);

		// paragraph -> link -> normal -> laptop
		setInnerBlock('Link');

		assertFontSize(27);
	});
	it('For Paragraph -> Normal -> Tablet -> Link -> Normal -> Laptop', () => {
		appendBlocks(
			'<!-- wp:paragraph {"className":"publisher-core-block publisher-core-block-e66a14eb-6ac9-4ee2-a4d6-50875c606346","publisherBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}},"tablet":{"attributes":{"publisherInnerBlocks":{"link":{"attributes":{"publisherFontSize":"27px"}}}}}},"isVisible":true,"isSelected":true}},"publisherPropsId":"216152855361","publisherCompatId":"216152855361"} -->\n' +
				'<p class="publisher-core-block publisher-core-block-e66a14eb-6ac9-4ee2-a4d6-50875c606346"></p>\n' +
				'<!-- /wp:paragraph -->'
		);

		// Select target block
		cy.get('[data-type="core/paragraph"]').click();

		setDeviceType('Tablet');

		// paragraph -> link -> normal -> laptop
		setInnerBlock('Link');

		assertFontSize(27);
	});
	it('For Paragraph -> Hover -> Laptop -> Link -> Normal -> Laptop', () => {
		appendBlocks(
			'<!-- wp:paragraph {"className":"publisher-core-block publisher-core-block-7802e72e-59b5-4052-859a-82c1fddd6c28","publisherBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":false},"hover":{"breakpoints":{"laptop":{"attributes":{"publisherInnerBlocks":{"link":{"attributes":{"publisherBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":true}},"publisherFontSize":"27px"}}}}}},"isVisible":true,"isSelected":true}},"publisherPropsId":"216155741902","publisherCompatId":"216155741902"} -->\n' +
				'<p class="publisher-core-block publisher-core-block-7802e72e-59b5-4052-859a-82c1fddd6c28"></p>\n' +
				'<!-- /wp:paragraph -->'
		);

		// Select target block
		cy.get('[data-type="core/paragraph"]').click();

		// paragraph -> link -> normal -> laptop
		setInnerBlock('Link');

		assertFontSize(27);
	});
	it('For Paragraph -> Hover -> Tablet -> Link -> Normal -> Laptop', () => {
		appendBlocks(
			'<!-- wp:paragraph {"className":"publisher-core-block publisher-core-block-7802e72e-59b5-4052-859a-82c1fddd6c28","publisherBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":false},"hover":{"breakpoints":{"laptop":{"attributes":{"publisherInnerBlocks":{"link":{"attributes":{"publisherBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":true}},"publisherFontSize":"27px"}}}}}},"isVisible":true,"isSelected":true}},"publisherPropsId":"216155741902","publisherCompatId":"216155741902"} -->\n' +
				'<p class="publisher-core-block publisher-core-block-7802e72e-59b5-4052-859a-82c1fddd6c28"></p>\n' +
				'<!-- /wp:paragraph -->'
		);

		// Select target block
		cy.get('[data-type="core/paragraph"]').click();

		// paragraph -> link -> normal -> laptop
		setInnerBlock('Link');

		assertFontSize(27);
	});

	it('For Paragraph -> Normal -> Laptop -> Link -> Hover -> Laptop', () => {
		appendBlocks(
			'<!-- wp:paragraph {"className":"publisher-core-block publisher-core-block-97584dbc-298d-4500-8831-3da0762c3456","publisherBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":true}},"publisherInnerBlocks":{"link":{"attributes":{"publisherBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":false},"hover":{"breakpoints":{"laptop":{"attributes":{"publisherFontSize":"27px"}}},"isVisible":true,"isSelected":true}}}}},"publisherPropsId":"21617126465","publisherCompatId":"21617126465"} -->\n' +
				'<p class="publisher-core-block publisher-core-block-97584dbc-298d-4500-8831-3da0762c3456">test</p>\n' +
				'<!-- /wp:paragraph -->'
		);

		// Select target block
		cy.get('[data-type="core/paragraph"]').click();

		// paragraph -> link -> normal -> laptop
		setInnerBlock('Link');

		assertFontSize(27);
	});
	it('For Paragraph -> Normal -> Laptop -> Link -> Hover -> Tablet', () => {
		appendBlocks(
			'<!-- wp:paragraph {"className":"publisher-core-block publisher-core-block-2762a1c8-98b1-49a8-afe2-61d176d55923","publisherBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":true}},"publisherInnerBlocks":{"link":{"attributes":{"publisherBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":false},"hover":{"breakpoints":{"laptop":{"attributes":{}},"tablet":{"attributes":{"publisherFontSize":"27px"}}},"isVisible":true,"isSelected":true}}}}},"publisherPropsId":"217143657689","publisherCompatId":"217143657689"} -->\n' +
				'<p class="publisher-core-block publisher-core-block-2762a1c8-98b1-49a8-afe2-61d176d55923">test</p>\n' +
				'<!-- /wp:paragraph -->'
		);

		// Select target block
		cy.get('[data-type="core/paragraph"]').click();

		setDeviceType('Tablet');

		// paragraph -> link -> normal -> laptop
		setInnerBlock('Link');

		assertFontSize(27);
	});

	it('For Paragraph -> Hover -> Laptop -> Link -> Hover -> Laptop', () => {
		appendBlocks(
			'<!-- wp:paragraph {"className":"publisher-core-block publisher-core-block-cfc3ffa9-2b93-4f98-a66a-511559797d7f","publisherBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":false},"hover":{"breakpoints":{"laptop":{"attributes":{"publisherInnerBlocks":{"link":{"attributes":{"publisherBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":false},"hover":{"breakpoints":{"laptop":{"attributes":{"publisherFontSize":"27px"}}},"isVisible":true,"isSelected":true}}}}}}}},"isVisible":true,"isSelected":true}},"publisherPropsId":"217145427439","publisherCompatId":"217145427439"} -->\n' +
				'<p class="publisher-core-block publisher-core-block-cfc3ffa9-2b93-4f98-a66a-511559797d7f">Test</p>\n' +
				'<!-- /wp:paragraph -->'
		);

		// Select target block
		cy.get('[data-type="core/paragraph"]').click();

		setInnerBlock('Link');

		assertFontSize(27);
	});
	it('For Paragraph -> Hover -> Mobile -> Link -> Hover -> Mobile', () => {
		appendBlocks(
			'<!-- wp:paragraph {"className":"publisher-core-block publisher-core-block-e3c7c4e8-bd79-41c2-ade6-cd6dabdc0186","publisherBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":false},"hover":{"breakpoints":{"laptop":{"attributes":{}},"mobile":{"attributes":{"publisherInnerBlocks":{"link":{"attributes":{"publisherBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":false},"hover":{"breakpoints":{"laptop":{"attributes":{}},"mobile":{"attributes":{"publisherFontSize":"27px"}}},"isVisible":true,"isSelected":true}}}}}}}},"isVisible":true,"isSelected":true}},"publisherPropsId":"21714588632","publisherCompatId":"21714588632"} -->\n' +
				'<p class="publisher-core-block publisher-core-block-e3c7c4e8-bd79-41c2-ade6-cd6dabdc0186">Test</p>\n' +
				'<!-- /wp:paragraph -->'
		);

		// Select target block
		cy.get('[data-type="core/paragraph"]').click();

		setDeviceType('Mobile');
		setInnerBlock('Link');

		assertFontSize(27);
	});
});
