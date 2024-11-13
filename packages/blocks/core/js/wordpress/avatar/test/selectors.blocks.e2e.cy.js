/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Avatar Block → Selectors test', () => {
	beforeEach(() => {
		createPost();
	});

	it('Check Attributes CSS selectors customization to work in editor and front-end', () => {
		appendBlocks(`<!-- wp:avatar {"size":70} /-->
		`);

		// Select target block
		cy.getBlock('core/avatar').click();

		//
		// Width
		//
		cy.getParentContainer('Width').within(() => {
			cy.get('input').clear({ force: true });
			cy.get('input').type(100, { force: true });
		});

		cy.wait(500);

		cy.getBlock('core/avatar')
			.first()
			.within(() => {
				cy.get('img').should('have.css', 'width', '100px');
			});

		//
		// Min Width
		//
		cy.activateMoreSettingsItem('More Size Settings', 'Min Width');
		cy.getParentContainer('Min').within(() => {
			cy.get('input').type(80);
		});
		cy.getBlock('core/avatar')
			.first()
			.within(() => {
				cy.get('img').should('have.css', 'min-width', '80px');
			});

		//
		// Max Width
		//
		cy.activateMoreSettingsItem('More Size Settings', 'Max Width');
		cy.getParentContainer('Max').within(() => {
			cy.get('input').type(120);
		});
		cy.getBlock('core/avatar')
			.first()
			.within(() => {
				cy.get('img').should('have.css', 'max-width', '120px');
			});

		//
		// Height
		//
		cy.getParentContainer('Height').within(() => {
			cy.get('select').select('px');
			cy.get('input').clear({ force: true });
			cy.get('input').type(100, { force: true });
		});
		cy.getBlock('core/avatar')
			.first()
			.within(() => {
				cy.get('img').should('have.css', 'height', '100px');
			});

		//
		// Min Height
		//
		cy.activateMoreSettingsItem('More Size Settings', 'Min Height');
		cy.getParentContainer('Min')
			.eq(1)
			.within(() => {
				cy.get('input').type(80);
			});
		cy.getBlock('core/avatar')
			.first()
			.within(() => {
				cy.get('img').should('have.css', 'min-height', '80px');
			});

		//
		// Max Height
		//
		cy.activateMoreSettingsItem('More Size Settings', 'Max Height');
		cy.getParentContainer('Max')
			.eq(1)
			.within(() => {
				cy.get('input').type(120);
			});
		cy.getBlock('core/avatar')
			.first()
			.within(() => {
				cy.get('img').should('have.css', 'max-height', '120px');
			});

		//
		// Border
		//
		cy.getParentContainer('Border Line').as('borderContainer');
		cy.get('@borderContainer').within(() => {
			cy.getByDataTest('border-control-width').clear();
			cy.getByDataTest('border-control-width').type(5, {
				force: true,
			});

			cy.getByDataTest('border-control-color').click();
		});

		cy.getByDataTest('popover-body')
			.first()
			.within(() => {
				cy.get('input[maxlength="9"]').clear({ force: true });
				cy.get('input[maxlength="9"]').type('37e6d4 ');
			});

		cy.get('@borderContainer').within(() => {
			cy.get('[aria-haspopup="listbox"]').click();
			cy.get('div').eq(1).click();
		});
		cy.getBlock('core/avatar')
			.first()
			.within(() => {
				cy.get('img').should(
					'have.css',
					'border',
					'5px dashed rgb(55, 230, 212)'
				);
			});

		//
		// Border Radius
		//
		cy.getParentContainer('Radius').within(() => {
			cy.get('input[type="number"]').clear({ force: true });
			cy.get('input[type="number"]').type(25, { force: true });
		});
		cy.getBlock('core/avatar')
			.first()
			.within(() => {
				cy.get('img').should('have.css', 'border-radius', '25px');
			});

		//
		// Assert front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block').within(() => {
			cy.get('img')
				.first()
				.should('have.css', 'width', '100px')
				.should('have.css', 'min-width', '80px')
				.should('have.css', 'max-width', '120px')
				.should('have.css', 'height', '100px')
				.should('have.css', 'min-height', '80px')
				.should('have.css', 'max-height', '120px')
				.should('have.css', 'border', '5px dashed rgb(55, 230, 212)')
				.should('have.css', 'border-radius', '25px');
		});
	});
});
