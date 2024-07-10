import {
	appendBlocks,
	setInnerBlock,
	setDeviceType,
	createPost,
	setBlockState,
	setParentBlock,
} from '@blockera/dev-cypress/js/helpers';

function assertBackgroundColor(expected) {
	cy.getParentContainer('BG Color').should('contain', expected);
}

describe('Should calculate current attributes correctly:', () => {
	beforeEach(() => {
		createPost();
	});

	it('For Paragraph -> Normal -> Desktop', () => {
		appendBlocks(
			'<!-- wp:paragraph {"style":{"typography":{"fontSize":"22px"}},"className":"blockera-block blockera-block-5c0ef777-bb94-42dd-9c68-2e0e1a5ecd48","blockeraBackgroundColor":"#000000","blockeraInnerBlocks":{"link":{"attributes":{"blockeraBackgroundColor":"#eeeeee"}}},"blockeraPropsId":"2131738221","blockeraCompatId":"2131738221"} -->\n' +
				'<p class="blockera-block blockera-block-5c0ef777-bb94-42dd-9c68-2e0e1a5ecd48"></p>\n' +
				'<!-- /wp:paragraph -->'
		);

		cy.getBlock('core/paragraph').click();

		cy.getParentContainer('BG Color').should('contain', '#000000');
	});

	it('For Paragraph -> Normal -> Tablet', () => {
		appendBlocks(
			'<!-- wp:paragraph {"style":{"typography":{"fontSize":"22px"}},"className":"blockera-block blockera-block-602a2f46-ce00-4e74-adb1-b45c59b6886d","blockeraBackgroundColor":"#000000","blockeraBlockStates":{"normal":{"breakpoints":{"tablet":{"attributes":{"blockeraBackgroundColor":"#eeeeee"}}},"isVisible":true}},"blockeraPropsId":"216142147583","blockeraCompatId":"216142147584"} -->\n' +
				'<p class="blockera-block blockera-block-602a2f46-ce00-4e74-adb1-b45c59b6886d" style="font-size:22px"></p>\n' +
				'<!-- /wp:paragraph -->'
		);

		cy.getBlock('core/paragraph').click();

		cy.getParentContainer('BG Color').should('contain', '#000000');

		setDeviceType('Tablet');

		cy.getParentContainer('BG Color').should('contain', '#eeeeee');
	});

	it('For Paragraph -> Normal -> Desktop -> Link -> Normal -> Desktop', () => {
		appendBlocks(
			'<!-- wp:paragraph {"style":{"typography":{"fontSize":"22px"}},"className":"blockera-block blockera-block-84d2a73b-edb9-483e-82a6-17cb82da38c4","blockeraBackgroundColor":"#000000","blockeraInnerBlocks":{"link":{"attributes":{"blockeraBackgroundColor":"#eeeeee"}}},"blockeraPropsId":"216143049173","blockeraCompatId":"216143049173"} -->\n' +
				'<p class="blockera-block blockera-block-84d2a73b-edb9-483e-82a6-17cb82da38c4" style="font-size:22px">test</p>\n' +
				'<!-- /wp:paragraph -->'
		);

		cy.getBlock('core/paragraph').click();

		cy.getParentContainer('BG Color').should('contain', '#000000');

		setInnerBlock('Link');

		cy.getParentContainer('BG Color').should('contain', '#eeeeee');
	});

	it('For Paragraph -> Normal -> Tablet -> Link -> Normal', () => {
		appendBlocks(
			'<!-- wp:paragraph {"className":"blockera-block blockera-block-e66a14eb-6ac9-4ee2-a4d6-50875c606346","blockeraBlockStates":{"normal":{"breakpoints":{"tablet":{"attributes":{"blockeraInnerBlocks":{"link":{"attributes":{"blockeraBackgroundColor":"#eeeeee"}}}}}},"isVisible":true}},"blockeraPropsId":"216152855361","blockeraCompatId":"216152855361"} -->\n' +
				'<p class="blockera-block blockera-block-e66a14eb-6ac9-4ee2-a4d6-50875c606346">test</p>\n' +
				'<!-- /wp:paragraph -->'
		);

		cy.getBlock('core/paragraph').click();
		cy.getParentContainer('BG Color').should('contain', 'None');

		setDeviceType('Tablet');

		setInnerBlock('Link');

		cy.getParentContainer('BG Color').should('contain', '#eeeeee');
	});

	it('For Paragraph -> Hover -> Desktop -> Link -> Normal -> Desktop', () => {
		appendBlocks(
			'<!-- wp:paragraph {"className":"blockera-block blockera-block-7802e72e-59b5-4052-859a-82c1fddd6c28","blockeraBlockStates":{"hover":{"breakpoints":{"desktop":{"attributes":{"blockeraInnerBlocks":{"link":{"attributes":{"blockeraBackgroundColor":"#eeeeee"}}}}}},"isVisible":true}},"blockeraPropsId":"216155741902","blockeraCompatId":"216155741902"} -->\n' +
				'<p class="blockera-block blockera-block-7802e72e-59b5-4052-859a-82c1fddd6c28"></p>\n' +
				'<!-- /wp:paragraph -->'
		);

		cy.getBlock('core/paragraph').click();
		cy.getParentContainer('BG Color').should('contain', 'None');

		setInnerBlock('Link');
		cy.getParentContainer('BG Color').should('contain', 'None');

		setParentBlock();
		cy.getParentContainer('BG Color').should('contain', 'None');

		setBlockState('Hover');
		setInnerBlock('Link');

		cy.getParentContainer('BG Color').should('contain', '#eeeeee');
	});

	it('For Paragraph -> Hover -> Tablet -> Link -> Normal -> Tablet', () => {
		appendBlocks(
			'<!-- wp:paragraph {"className":"blockera-block blockera-block-7802e72e-59b5-4052-859a-82c1fddd6c28","blockeraBlockStates":{"hover":{"breakpoints":{"tablet":{"attributes":{"blockeraInnerBlocks":{"link":{"attributes":{"blockeraBackgroundColor":"#eeeeee"}}}}}},"isVisible":true}},"blockeraPropsId":"216155741902","blockeraCompatId":"216155741902"} -->\n' +
				'<p class="blockera-block blockera-block-7802e72e-59b5-4052-859a-82c1fddd6c28"></p>\n' +
				'<!-- /wp:paragraph -->'
		);

		cy.getBlock('core/paragraph').click();
		cy.getParentContainer('BG Color').should('contain', 'None');

		setInnerBlock('Link');
		cy.getParentContainer('BG Color').should('contain', 'None');

		setParentBlock();
		setBlockState('Hover');
		cy.getParentContainer('BG Color').should('contain', 'None');

		setInnerBlock('Link');
		cy.getParentContainer('BG Color').should('contain', 'None');

		setDeviceType('Tablet');
		cy.getParentContainer('BG Color').should('contain', '#eeeeee');
	});

	it('For Paragraph -> Normal -> Desktop -> Link -> Hover -> Desktop', () => {
		appendBlocks(
			'<!-- wp:paragraph {"className":"blockera-block blockera-block-97584dbc-298d-4500-8831-3da0762c3456","blockeraInnerBlocks":{"link":{"attributes":{"blockeraBlockStates":{"hover":{"breakpoints":{"desktop":{"attributes":{"blockeraBackgroundColor":"#eeeeee"}}},"isVisible":true}}}}},"blockeraPropsId":"21617126465","blockeraCompatId":"21617126465"} -->\n' +
				'<p class="blockera-block blockera-block-97584dbc-298d-4500-8831-3da0762c3456">test</p>\n' +
				'<!-- /wp:paragraph -->'
		);

		cy.getBlock('core/paragraph').click();
		cy.getParentContainer('BG Color').should('contain', 'None');

		setInnerBlock('Link');
		cy.getParentContainer('BG Color').should('contain', 'None');

		setBlockState('Hover');
		cy.getParentContainer('BG Color').should('contain', '#eeeeee');
	});

	it('For Paragraph -> Normal -> Tablet -> Link -> Hover -> Tablet', () => {
		appendBlocks(
			'<!-- wp:paragraph {"className":"blockera-block blockera-block-05359826-41fa-43dd-880e-fcebf2a85252","blockeraBlockStates":{"normal":{"breakpoints":{"tablet":{"attributes":{"blockeraInnerBlocks":{"link":{"attributes":{"blockeraBlockStates":{"hover":{"breakpoints":{"tablet":{"attributes":{"blockeraBackgroundColor":"#eeeeee"}}}}}}}}}}}}},"blockeraPropsId":"6814023600","blockeraCompatId":"6814023600"} -->\n' +
				'<p class="blockera-block blockera-block-2762a1c8-98b1-49a8-afe2-61d176d55923">test</p>\n' +
				'<!-- /wp:paragraph -->'
		);

		cy.getBlock('core/paragraph').click();
		cy.getParentContainer('BG Color').should('contain', 'None');

		setInnerBlock('Link');
		cy.getParentContainer('BG Color').should('contain', 'None');

		setDeviceType('Tablet');
		cy.getParentContainer('BG Color').should('contain', 'None');

		setBlockState('Hover');
		cy.getParentContainer('BG Color').should('contain', '#eeeeee');
	});

	it('For Paragraph -> Hover -> Desktop -> Link -> Hover -> Desktop', () => {
		appendBlocks(
			'<!-- wp:paragraph {"className":"blockera-block blockera-block-cfc3ffa9-2b93-4f98-a66a-511559797d7f","blockeraBlockStates":{"normal":{"breakpoints":{"desktop":{"attributes":{}}},"isVisible":true,"isSelected":false},"hover":{"breakpoints":{"desktop":{"attributes":{"blockeraInnerBlocks":{"link":{"attributes":{"blockeraBlockStates":{"normal":{"breakpoints":{"desktop":{"attributes":{}}},"isVisible":true,"isSelected":false},"hover":{"breakpoints":{"desktop":{"attributes":{"blockeraBackgroundColor":"#eeeeee"}}},"isVisible":true,"isSelected":true}}}}}}}},"isVisible":true,"isSelected":true}},"blockeraPropsId":"217145427439","blockeraCompatId":"217145427439"} -->\n' +
				'<p class="blockera-block blockera-block-cfc3ffa9-2b93-4f98-a66a-511559797d7f">Test</p>\n' +
				'<!-- /wp:paragraph -->'
		);

		cy.getBlock('core/paragraph').click();
		cy.getParentContainer('BG Color').should('contain', 'None');

		setBlockState('Hover');
		cy.getParentContainer('BG Color').should('contain', 'None');

		setInnerBlock('Link');
		cy.getParentContainer('BG Color').should('contain', 'None');

		setBlockState('Hover');
		cy.getParentContainer('BG Color').should('contain', '#eeeeee');
	});

	it('For Paragraph -> Hover -> Mobile -> Link -> Hover -> Mobile', () => {
		appendBlocks(
			'<!-- wp:paragraph {"className":"blockera-block blockera-block-e3c7c4e8-bd79-41c2-ade6-cd6dabdc0186","blockeraBlockStates":{"hover":{"breakpoints":{"mobile":{"attributes":{"blockeraInnerBlocks":{"link":{"attributes":{"blockeraBlockStates":{"hover":{"breakpoints":{"mobile":{"attributes":{"blockeraBackgroundColor":"#eeeeee"}}},"isVisible":true}}}}}}}},"isVisible":true}},"blockeraPropsId":"21714588632","blockeraCompatId":"21714588632"} -->\n' +
				'<p class="blockera-block blockera-block-e3c7c4e8-bd79-41c2-ade6-cd6dabdc0186">Test</p>\n' +
				'<!-- /wp:paragraph -->'
		);

		cy.getBlock('core/paragraph').click();
		cy.getParentContainer('BG Color').should('contain', 'None');

		setBlockState('Hover');
		cy.getParentContainer('BG Color').should('contain', 'None');

		setDeviceType('Mobile Portrait');
		cy.getParentContainer('BG Color').should('contain', 'None');

		setInnerBlock('Link');
		cy.getParentContainer('BG Color').should('contain', 'None');

		setBlockState('Hover');
		cy.getParentContainer('BG Color').should('contain', '#eeeeee');

		setDeviceType('Tablet');
		cy.getParentContainer('BG Color').should('contain', 'None');
	});
});
