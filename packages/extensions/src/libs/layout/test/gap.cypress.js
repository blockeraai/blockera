import {
	savePage,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
	addBlockToPost,
	createPost,
} from '../../../../../../cypress/helpers';

describe('Gap → Functionality', () => {
	beforeEach(() => {
		createPost();

		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getBlock('core/paragraph').type('This is test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();

		cy.getParentContainer('Display').within(() => {
			cy.getByAriaLabel('Flex').click();
		});
	});

	it('should update gap correctly, when add data', () => {
		cy.getParentContainer('Gap').within(() => {
			cy.get('input').type(10);
		});

		cy.getBlock('core/paragraph').should('have.css', 'gap', '10px');

		getWPDataObject().then((data) => {
			expect({
				lock: true,
				gap: '10px',
				rows: '',
				columns: '',
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherGap'));
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').should('have.css', 'gap', '10px');
	});

	it('should update row-gap & column-gap correctly, when add data', () => {
		cy.getParentContainer('Gap').within(() => {
			cy.get('input').type(8);
			cy.getByAriaLabel('Custom Row & Column Gap').click();
		});

		getWPDataObject().then((data) => {
			expect({
				lock: false,
				gap: '8px',
				rows: '8px',
				columns: '8px',
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherGap'));
		});

		cy.getParentContainer('Gap').within(() => {
			cy.getParentContainer('Rows').within(() => {
				cy.get('input').clear();
				cy.get('input').type(10, { force: true });
			});

			cy.getParentContainer('Columns').within(() => {
				cy.get('input').clear();
				cy.get('input').type(15, { force: true });
			});
		});

		cy.getBlock('core/paragraph')
			.should('have.css', 'column-gap', '15px')
			.and('have.css', 'row-gap', '10px');

		getWPDataObject().then((data) => {
			expect({
				lock: false,
				gap: '8px',
				rows: '10px',
				columns: '15px',
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherGap'));
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block')
			.should('have.css', 'column-gap', '15px')
			.and('have.css', 'row-gap', '10px');
	});
});
