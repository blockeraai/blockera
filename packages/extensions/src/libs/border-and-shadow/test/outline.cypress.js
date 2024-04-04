import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
} from '../../../../../../cypress/helpers';

describe('Outline → Functionality', () => {
	beforeEach(() => {
		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getBlock('core/paragraph').type('this is test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();

		cy.activateMoreSettingsItem('More Border Settings', 'Outline');

		cy.getParentContainer('Outline').as('container');
	});

	it('should update correctly, when add outline', () => {
		cy.get('@container').within(() => {
			cy.get('[aria-label="Add New Outline"]').click({
				force: true,
			});
		});

		//add data
		cy.getByDataTest('popover-body')
			.last()
			.within(() => {
				cy.getByDataTest('border-control-width').clear({ force: true });
				cy.getByDataTest('border-control-width').type(3, {
					force: true,
				});

				cy.get('[aria-haspopup="listbox"]').click({ force: true });
				cy.get('li').eq(1).trigger('click');

				cy.get('input[type="range"]').setSliderValue(10);

				cy.getByDataTest('border-control-color').click({ force: true });
			});

		cy.getByDataTest('popover-body')
			.last()
			.within(() => {
				cy.get('input[maxlength="9"]').clear();
				cy.get('input[maxlength="9"]').type('c5eef0ab');
			});

		//Check block
		cy.getBlock('core/paragraph').should(
			'have.css',
			'outline',
			'rgba(197, 238, 240, 0.67) dashed 3px'
		);

		cy.getBlock('core/paragraph').should(
			'have.css',
			'outline-offset',
			'10px'
		);

		//Check store
		getWPDataObject().then((data) => {
			expect({
				0: {
					isVisible: true,
					border: {
						width: '3px',
						color: '#c5eef0ab',
						style: 'dashed',
					},
					offset: '10px',
					order: 0,
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherOutline'));
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should(
			'have.css',
			'outline',
			'rgba(197, 238, 240, 0.67) dashed 3px'
		);

		cy.get('.publisher-core-block').should(
			'have.css',
			'outline-offset',
			'10px'
		);
	});
});
