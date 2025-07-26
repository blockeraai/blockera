/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	setParentBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Calendar Block', () => {
	beforeEach(() => {
		// Create a post with a past date to make sure the calendar is showing navigation buttons
		cy.wpCli(
			"wp post create --post_type=post --post_title='An old sample post' --post_status=publish --post_date='2024-12-01 12:00:00'"
		);

		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(`<!-- wp:calendar /-->`);

		// Select target block
		cy.getBlock('core/calendar').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems([
			'normal',
			'hover',
			'elements/caption',
			'elements/thead-cells',
			'elements/tbody-cells',
			'elements/navigation-item',
		]);

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/calendar').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/calendar').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. elements/caption
		//
		setInnerBlock('elements/caption');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/calendar')
			.first()
			.within(() => {
				cy.get('caption')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 1.2. elements/thead
		//
		setParentBlock();
		setInnerBlock('elements/thead');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		cy.setColorControlValue('BG Color', 'ff1010');

		cy.getBlock('core/calendar')
			.first()
			.within(() => {
				cy.get('thead')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 16, 16)');
			});

		//
		// 1.3. elements/thead-cells
		//
		setParentBlock();
		setInnerBlock('elements/thead-cells');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		cy.setColorControlValue('BG Color', 'ff2020');

		cy.getBlock('core/calendar')
			.first()
			.within(() => {
				cy.get('thead th')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 32, 32)');
			});

		//
		// 1.4. elements/tbody
		//
		setParentBlock();
		setInnerBlock('elements/tbody');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		cy.setColorControlValue('BG Color', 'ff3030');

		cy.getBlock('core/calendar')
			.first()
			.within(() => {
				cy.get('tbody')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 48, 48)');
			});

		//
		// 1.5. elements/tbody-cells
		//
		setParentBlock();
		setInnerBlock('elements/tbody-cells');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		cy.setColorControlValue('BG Color', 'ff4040');

		cy.getBlock('core/calendar')
			.first()
			.within(() => {
				cy.get('tbody td')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 64, 64)');
			});

		//
		// 1.6. elements/tbody-empty-cells
		//
		setParentBlock();
		setInnerBlock('elements/tbody-empty-cells');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		cy.setColorControlValue('Text Color', 'ff5050');

		cy.getBlock('core/calendar')
			.first()
			.within(() => {
				cy.get('tbody td.pad')
					.first()
					.should('have.css', 'color', 'rgb(255, 80, 80)');
			});

		//
		// 1.7. elements/navigation-item
		//
		setParentBlock();
		setInnerBlock('elements/navigation-item');

		cy.checkBlockCardItems(['normal', 'hover', 'focus', 'active'], true);

		cy.setColorControlValue('BG Color', 'ff6060');

		cy.getBlock('core/calendar')
			.first()
			.within(() => {
				cy.get('.wp-calendar-nav a')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 96, 96)');
			});

		//
		// 2. Assert front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-calendar').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-calendar').within(() => {
			// elements/caption
			cy.get('caption')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// elements/thead
			cy.get('thead')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 16, 16)');

			// elements/thead-cells
			cy.get('thead th')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 32, 32)');

			// elements/tbody
			cy.get('tbody')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 48, 48)');

			// elements/tbody-cells
			cy.get('tbody td')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 64, 64)');

			// elements/tbody-empty-cells
			cy.get('tbody td.pad')
				.first()
				.should('have.css', 'color', 'rgb(255, 80, 80)');

			// elements/navigation-item
			cy.get('.wp-calendar-nav a')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 96, 96)');
		});
	});
});
