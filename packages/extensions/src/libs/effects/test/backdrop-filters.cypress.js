import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	createPost,
} from '../../../../../../cypress/helpers';

describe('Backdrop Filters → Functionality', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'blockera-paragraph');

		cy.getBlock('core/paragraph').type('this is test text.', { delay: 0 });

		cy.getByDataTest('style-tab').click();

		cy.getParentContainer('Backdrop Filters').as('filters');
	});

	it('Should update filter correctly, when add one drop-shadow', () => {
		cy.get('@filters').within(() => {
			cy.getByAriaLabel('Add New Backdrop Filter').click();
		});

		cy.get('.components-popover').within(() => {
			cy.getParentContainer('Type').within(() => {
				cy.get('select').select('drop-shadow');
			});

			cy.getByDataTest('filter-drop-shadow-x-input').clear();
			cy.getByDataTest('filter-drop-shadow-x-input').type(50);

			cy.getByDataTest('filter-drop-shadow-y-input').clear();
			cy.getByDataTest('filter-drop-shadow-y-input').type(30);

			cy.getByDataTest('filter-drop-shadow-blur-input').clear();
			cy.getByDataTest('filter-drop-shadow-blur-input').type(40);

			cy.getByDataTest('filter-drop-shadow-color').click();
		});

		cy.get('.components-popover')
			.last()
			.within(() => {
				cy.get('input[maxlength="9"]').clear();
				cy.get('input[maxlength="9"]').type('cccccc');
			});

		// Check block
		cy.getBlock('core/paragraph')
			.parent()
			.within(() => {
				cy.get('style')
					.invoke('text')
					.should(
						'include',
						'backdrop-filter: drop-shadow(50px 30px 40px #cccccc);'
					);
			});

		// Check store
		getWPDataObject().then((data) => {
			expect({
				'drop-shadow-0': {
					isVisible: true,
					type: 'drop-shadow',
					'drop-shadow-x': '50px',
					'drop-shadow-y': '30px',
					'drop-shadow-blur': '40px',
					'drop-shadow-color': '#cccccc',
					order: 0,
				},
			}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraBackdropFilter')
			);
		});

		// Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-core-inline-css-inline-css')
			.invoke('text')
			.should(
				'include',
				'backdrop-filter: drop-shadow(50px 30px 40px #cccccc);'
			);
	});

	it('Should update filter correctly, when add multiple filter', () => {
		cy.get('@filters').within(() => {
			cy.getByAriaLabel('Add New Backdrop Filter').click();
		});

		cy.get('.components-popover').within(() => {
			cy.getParentContainer('Type').within(() => {
				cy.get('select').select('brightness');
			});

			cy.getByDataTest('filter-brightness-input').clear();
			cy.getByDataTest('filter-brightness-input').type(100);
		});

		cy.get('@filters').within(() => {
			cy.getByAriaLabel('Add New Backdrop Filter').click();
		});

		cy.getByDataTest('popover-body').within(() => {
			cy.getParentContainer('Type', 'base-control').within(() => {
				cy.get('select').select('invert');
			});

			cy.getByDataTest('filter-invert-input').clear();
			cy.getByDataTest('filter-invert-input').type(50);
		});

		// Check block
		cy.getBlock('core/paragraph')
			.parent()
			.within(() => {
				cy.get('style')
					.invoke('text')
					.should(
						'include',
						'backdrop-filter: brightness(100%) invert(50%);'
					);
			});

		// Check store
		getWPDataObject().then((data) => {
			expect({
				'brightness-0': {
					isVisible: true,
					type: 'brightness',
					brightness: '100%',
					order: 0,
				},
				'invert-0': {
					isVisible: true,
					type: 'invert',
					invert: '50%',
					order: 1,
				},
			}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraBackdropFilter')
			);
		});

		// Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('style#blockera-core-inline-css-inline-css')
			.invoke('text')
			.should(
				'include',
				'backdrop-filter: brightness(100%) invert(50%);'
			);
	});
});

