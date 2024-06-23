import {
	appendBlocks,
	setInnerBlock,
	setDeviceType,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

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
	beforeEach(() => {
		createPost();
	});

	it('For Paragraph -> Normal -> Laptop', () => {
		appendBlocks(
			'<!-- wp:paragraph {"style":{"typography":{"fontSize":"22px"}},"className":"blockera-block blockera-block-5c0ef777-bb94-42dd-9c68-2e0e1a5ecd48","blockeraFontSize":"22px","blockeraBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":true}},"blockeraInnerBlocks":{"link":{"attributes":{"blockeraFontSize":"27px"}}},"blockeraPropsId":"2131738221","blockeraCompatId":"2131738221"} -->\n' +
				'<p class="blockera-block blockera-block-5c0ef777-bb94-42dd-9c68-2e0e1a5ecd48"></p>\n' +
				'<!-- /wp:paragraph -->'
		);

		// Select target block
		cy.get('[data-type="core/paragraph"]').click();

		assertFontSize(22);
	});

	it('For Paragraph -> Normal -> Tablet', () => {
		appendBlocks(
			'<!-- wp:paragraph {"style":{"typography":{"fontSize":"22px"}},"className":"blockera-block blockera-block-602a2f46-ce00-4e74-adb1-b45c59b6886d","blockeraFontSize":"22px","blockeraBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}},"tablet":{"attributes":{"blockeraFontSize":"27px"}}},"isVisible":true,"isSelected":true}},"blockeraPropsId":"216142147583","blockeraCompatId":"216142147584"} -->\n' +
				'<p class="blockera-block blockera-block-602a2f46-ce00-4e74-adb1-b45c59b6886d" style="font-size:22px"></p>\n' +
				'<!-- /wp:paragraph -->'
		);

		// Select target block
		cy.get('[data-type="core/paragraph"]').click();

		setDeviceType('Tablet');

		assertFontSize(27);
	});

	it('For Paragraph -> Normal -> Laptop -> Link -> Normal -> Laptop', () => {
		appendBlocks(
			'<!-- wp:paragraph {"style":{"typography":{"fontSize":"22px"}},"className":"blockera-block blockera-block-84d2a73b-edb9-483e-82a6-17cb82da38c4","blockeraFontSize":"22px","blockeraBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":true}},"blockeraInnerBlocks":{"link":{"attributes":{"blockeraFontSize":"27px"}}},"blockeraPropsId":"216143049173","blockeraCompatId":"216143049173"} -->\n' +
				'<p class="blockera-block blockera-block-84d2a73b-edb9-483e-82a6-17cb82da38c4" style="font-size:22px">test</p>\n' +
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
			'<!-- wp:paragraph {"className":"blockera-block blockera-block-e66a14eb-6ac9-4ee2-a4d6-50875c606346","blockeraBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}},"tablet":{"attributes":{"blockeraInnerBlocks":{"link":{"attributes":{"blockeraFontSize":"27px"}}}}}},"isVisible":true,"isSelected":true}},"blockeraPropsId":"216152855361","blockeraCompatId":"216152855361"} -->\n' +
				'<p class="blockera-block blockera-block-e66a14eb-6ac9-4ee2-a4d6-50875c606346"></p>\n' +
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
			'<!-- wp:paragraph {"className":"blockera-block blockera-block-7802e72e-59b5-4052-859a-82c1fddd6c28","blockeraBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":false},"hover":{"breakpoints":{"laptop":{"attributes":{"blockeraInnerBlocks":{"link":{"attributes":{"blockeraBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":true}},"blockeraFontSize":"27px"}}}}}},"isVisible":true,"isSelected":true}},"blockeraPropsId":"216155741902","blockeraCompatId":"216155741902"} -->\n' +
				'<p class="blockera-block blockera-block-7802e72e-59b5-4052-859a-82c1fddd6c28"></p>\n' +
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
			'<!-- wp:paragraph {"className":"blockera-block blockera-block-7802e72e-59b5-4052-859a-82c1fddd6c28","blockeraBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":false},"hover":{"breakpoints":{"laptop":{"attributes":{"blockeraInnerBlocks":{"link":{"attributes":{"blockeraBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":true}},"blockeraFontSize":"27px"}}}}}},"isVisible":true,"isSelected":true}},"blockeraPropsId":"216155741902","blockeraCompatId":"216155741902"} -->\n' +
				'<p class="blockera-block blockera-block-7802e72e-59b5-4052-859a-82c1fddd6c28"></p>\n' +
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
			'<!-- wp:paragraph {"className":"blockera-block blockera-block-97584dbc-298d-4500-8831-3da0762c3456","blockeraBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":true}},"blockeraInnerBlocks":{"link":{"attributes":{"blockeraBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":false},"hover":{"breakpoints":{"laptop":{"attributes":{"blockeraFontSize":"27px"}}},"isVisible":true,"isSelected":true}}}}},"blockeraPropsId":"21617126465","blockeraCompatId":"21617126465"} -->\n' +
				'<p class="blockera-block blockera-block-97584dbc-298d-4500-8831-3da0762c3456">test</p>\n' +
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
			'<!-- wp:paragraph {"className":"blockera-block blockera-block-2762a1c8-98b1-49a8-afe2-61d176d55923","blockeraBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":true}},"blockeraInnerBlocks":{"link":{"attributes":{"blockeraBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":false},"hover":{"breakpoints":{"laptop":{"attributes":{}},"tablet":{"attributes":{"blockeraFontSize":"27px"}}},"isVisible":true,"isSelected":true}}}}},"blockeraPropsId":"217143657689","blockeraCompatId":"217143657689"} -->\n' +
				'<p class="blockera-block blockera-block-2762a1c8-98b1-49a8-afe2-61d176d55923">test</p>\n' +
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
			'<!-- wp:paragraph {"className":"blockera-block blockera-block-cfc3ffa9-2b93-4f98-a66a-511559797d7f","blockeraBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":false},"hover":{"breakpoints":{"laptop":{"attributes":{"blockeraInnerBlocks":{"link":{"attributes":{"blockeraBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":false},"hover":{"breakpoints":{"laptop":{"attributes":{"blockeraFontSize":"27px"}}},"isVisible":true,"isSelected":true}}}}}}}},"isVisible":true,"isSelected":true}},"blockeraPropsId":"217145427439","blockeraCompatId":"217145427439"} -->\n' +
				'<p class="blockera-block blockera-block-cfc3ffa9-2b93-4f98-a66a-511559797d7f">Test</p>\n' +
				'<!-- /wp:paragraph -->'
		);

		// Select target block
		cy.get('[data-type="core/paragraph"]').click();

		setInnerBlock('Link');

		assertFontSize(27);
	});

	it('For Paragraph -> Hover -> Mobile -> Link -> Hover -> Mobile', () => {
		appendBlocks(
			'<!-- wp:paragraph {"className":"blockera-block blockera-block-e3c7c4e8-bd79-41c2-ade6-cd6dabdc0186","blockeraBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":false},"hover":{"breakpoints":{"laptop":{"attributes":{}},"mobile":{"attributes":{"blockeraInnerBlocks":{"link":{"attributes":{"blockeraBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":false},"hover":{"breakpoints":{"laptop":{"attributes":{}},"mobile":{"attributes":{"blockeraFontSize":"27px"}}},"isVisible":true,"isSelected":true}}}}}}}},"isVisible":true,"isSelected":true}},"blockeraPropsId":"21714588632","blockeraCompatId":"21714588632"} -->\n' +
				'<p class="blockera-block blockera-block-e3c7c4e8-bd79-41c2-ade6-cd6dabdc0186">Test</p>\n' +
				'<!-- /wp:paragraph -->'
		);

		// Select target block
		cy.get('[data-type="core/paragraph"]').click();

		setDeviceType('Mobile');
		setInnerBlock('Link');

		assertFontSize(27);
	});
});
