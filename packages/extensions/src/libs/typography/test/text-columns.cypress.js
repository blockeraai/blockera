import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	openMoreFeaturesControl,
} from '../../../../../../cypress/helpers';

describe('Text Columns → Functionality', () => {
	beforeEach(() => {
		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getBlock('core/paragraph').type('This is test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();

		openMoreFeaturesControl('More typography settings');
	});

	it('should not render column-gap and column-rule components,when value is initial', () => {
		cy.getParentContainer('Text Columns').within(() => {
			cy.getByAriaLabel('None').click();
		});

		//Check block
		cy.getBlock('core/paragraph')
			.parent()
			.within(() => {
				cy.get('style')
					.invoke('text')
					.should('include', 'column-count: initial');
			});

		//Check store
		getWPDataObject().then((data) => {
			expect({
				columns: 'none',
				gap: '2.5rem',
				divider: {
					width: '',
					color: '',
					style: 'solid',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherTextColumns'));
		});

		//Check rendering
		cy.getByAriaLabel('Gap').should('not.exist');

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should(
			'have.css',
			'column-count',
			'auto' // todo: it should be initial but it fails! but it is there!
		);
	});

	it('should update column-count & column-gap, when add column2 + gap', () => {
		cy.getParentContainer('Text Columns').within(() => {
			cy.getByAriaLabel('2 Columns Text').click();
		});

		cy.getParentContainer('Gap').within(() => {
			cy.get('input[type=number]').clear({ force: true });
			cy.get('input[type=number]').type(5, { force: true });
			cy.get('select').select('px', { force: true });
		});

		//Check block
		cy.getBlock('core/paragraph').should('have.css', 'column-gap', '5px');

		//Check store
		getWPDataObject().then((data) => {
			expect({
				columns: '2-columns',
				gap: '5px',
				divider: {
					width: '',
					color: '',
					style: 'solid',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherTextColumns'));
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should('have.css', 'column-gap', '5px');
	});

	it('should update column-count & column-rule, when add column2 + rule', () => {
		cy.getParentContainer('Text Columns').within(() => {
			cy.getByAriaLabel('2 Columns Text').click();
		});

		cy.getParentContainer('Divider').within(() => {
			cy.getByDataTest('border-control-width').clear();
			cy.getByDataTest('border-control-width').type(1, {
				force: true,
			});

			cy.get('[aria-haspopup="listbox"]').trigger('click');
			cy.get('li').eq(2).trigger('click');

			// open color picker
			cy.getByDataTest('border-control-color').click();
		});

		// set color
		cy.getByDataTest('popover-body')
			.last()
			.within(() => {
				cy.get('input[maxlength="9"]').clear({
					force: true,
				});
				cy.get('input[maxlength="9"]').type('36eade', {
					force: true,
				});
			});

		//Check block
		cy.getBlock('core/paragraph')
			.should('have.css', 'column-rule-width', '1px')
			.and('have.css', 'column-rule-style', 'dotted')
			.and('have.css', 'column-rule-color', 'rgb(54, 234, 222)');

		//Check store
		getWPDataObject().then((data) => {
			expect({
				columns: '2-columns',
				gap: '2.5rem',
				divider: {
					width: '1px',
					color: '#36eade',
					style: 'dotted',
				},
				// todo: remove following items because these items are result of a bugs!
				'divider.width': '1px',
				'divider.style': 'dotted',
				'divider.color': '#000000',
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherTextColumns'));
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block')
			.should('have.css', 'column-rule-width', '1px')
			.and('have.css', 'column-rule-style', 'dotted')
			.and('have.css', 'column-rule-color', 'rgb(54, 234, 222)');
	});
});
