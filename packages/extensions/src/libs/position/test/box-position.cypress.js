import {
	savePage,
	addBlockToPost,
	getWPDataObject,
	getSelectedBlock,
	redirectToFrontPage,
} from '../../../../../../cypress/helpers';

describe('Box Position → Functionality', () => {
	beforeEach(() => {
		addBlockToPost('core/paragraph', true, 'publisher-paragraph');

		cy.getBlock('core/paragraph').type('This is test text.', {
			delay: 0,
		});

		cy.getByDataTest('style-tab').click();

		cy.getParentContainer('Position').as('container');
	});

	it('relative position - using shortcuts in popover', () => {
		cy.get('@container').within(() => {
			cy.customSelect('Relative');
		});

		cy.getByAriaLabel('Top Position').click();
		cy.getByAriaLabel('Set 10px').click();

		cy.getByAriaLabel('Right Position').click();
		cy.getByAriaLabel('Set 60px').click();

		cy.getByAriaLabel('Bottom Position').click();
		cy.getByAriaLabel('Set 30px').click();

		cy.getByAriaLabel('Left Position').click();
		cy.getByAriaLabel('Set 80px').click();

		//Check block
		cy.getBlock('core/paragraph')
			.should('have.css', 'position', 'relative')
			.and('have.css', 'top', '10px')
			.and('have.css', 'Right', '60px')
			.and('have.css', 'Bottom', '30px')
			.and('have.css', 'Left', '80px');

		//Check store
		getWPDataObject().then((data) => {
			expect({
				type: 'relative',
				position: {
					top: '10px',
					right: '60px',
					bottom: '30px',
					left: '80px',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherPosition'));
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block').as('element-style');

		cy.get('@element-style').should('have.css', 'position', 'relative');

		cy.get('@element-style').should('have.css', 'top', '10px');

		cy.get('@element-style').should('have.css', 'right', '60px');

		cy.get('@element-style').should('have.css', 'bottom', '30px');

		cy.get('@element-style').should('have.css', 'left', '80px');
	});

	it('Absolute position - using shortcuts after control', () => {
		cy.get('@container').within(() => {
			cy.customSelect('Absolute');
		});

		//
		// Top Left Button
		//
		cy.getByAriaLabel('Fix At Top Left Corner').click();

		//Check block
		cy.getBlock('core/paragraph')
			.should('have.css', 'position', 'absolute')
			.and('have.css', 'top', '0px')
			.and('have.css', 'left', '0px');

		//Check store
		getWPDataObject().then((data) => {
			expect({
				type: 'absolute',
				position: {
					top: '0px',
					left: '0px',
					bottom: '',
					right: '',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherPosition'));
		});

		//
		// Top Right Button
		//
		cy.getByAriaLabel('Fix At Top Right Corner').click();

		//Check block
		cy.getBlock('core/paragraph')
			.should('have.css', 'position', 'absolute')
			.and('have.css', 'top', '0px')
			.and('have.css', 'right', '0px');

		//Check store
		getWPDataObject().then((data) => {
			expect({
				type: 'absolute',
				position: {
					top: '0px',
					right: '0px',
					bottom: '',
					left: '',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherPosition'));
		});

		//
		// Bottom Left Button
		//
		cy.getByAriaLabel('Fix At Bottom Left Corner').click();

		//Check block
		cy.getBlock('core/paragraph')
			.should('have.css', 'position', 'absolute')
			.and('have.css', 'bottom', '0px')
			.and('have.css', 'left', '0px');

		//Check store
		getWPDataObject().then((data) => {
			expect({
				type: 'absolute',
				position: {
					top: '',
					right: '',
					bottom: '0px',
					left: '0px',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherPosition'));
		});

		//
		// Bottom Right Button
		//
		cy.getByAriaLabel('Fix At Bottom Right Corner').click();

		//Check block
		cy.getBlock('core/paragraph')
			.should('have.css', 'position', 'absolute')
			.and('have.css', 'bottom', '0px')
			.and('have.css', 'right', '0px');

		//Check store
		getWPDataObject().then((data) => {
			expect({
				type: 'absolute',
				position: {
					top: '',
					right: '0px',
					bottom: '0px',
					left: '',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherPosition'));
		});

		//
		// Full-Width At Top Button
		//
		cy.getByAriaLabel('Position As Full-Width At Top Side').click();

		//Check block
		cy.getBlock('core/paragraph')
			.should('have.css', 'position', 'absolute')
			.and('have.css', 'top', '0px')
			.and('have.css', 'left', '0px')
			.and('have.css', 'right', '0px');

		//Check store
		getWPDataObject().then((data) => {
			expect({
				type: 'absolute',
				position: {
					top: '0px',
					right: '0px',
					bottom: '',
					left: '0px',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherPosition'));
		});

		//
		// Full-Width At Bottom Button
		//
		cy.getByAriaLabel('Position As Full-Width At Bottom Side').click();

		//Check block
		cy.getBlock('core/paragraph')
			.should('have.css', 'position', 'absolute')
			.and('have.css', 'bottom', '0px')
			.and('have.css', 'left', '0px')
			.and('have.css', 'right', '0px');

		//Check store
		getWPDataObject().then((data) => {
			expect({
				type: 'absolute',
				position: {
					top: '',
					right: '0px',
					bottom: '0px',
					left: '0px',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherPosition'));
		});

		//
		// Full-Height At Right Button
		//
		cy.getByAriaLabel('Position As Full-Height At Right Side').click();

		//Check block
		cy.getBlock('core/paragraph')
			.should('have.css', 'position', 'absolute')
			.and('have.css', 'top', '0px')
			.and('have.css', 'bottom', '0px')
			.and('have.css', 'right', '0px');

		//Check store
		getWPDataObject().then((data) => {
			expect({
				type: 'absolute',
				position: {
					top: '0px',
					right: '0px',
					bottom: '0px',
					left: '',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherPosition'));
		});

		//
		// Full-Height At Left Button
		//
		cy.getByAriaLabel('Position As Full-Height At Left Side').click();

		//Check block
		cy.getBlock('core/paragraph')
			.should('have.css', 'position', 'absolute')
			.and('have.css', 'top', '0px')
			.and('have.css', 'bottom', '0px')
			.and('have.css', 'left', '0px');

		//Check store
		getWPDataObject().then((data) => {
			expect({
				type: 'absolute',
				position: {
					top: '0px',
					right: '',
					bottom: '0px',
					left: '0px',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherPosition'));
		});

		//
		// Full-Width and Full-Height Button
		//
		cy.getByAriaLabel('Position As Full-Width and Full-Height').click();

		//Check block
		cy.getBlock('core/paragraph')
			.should('have.css', 'position', 'absolute')
			.and('have.css', 'top', '0px')
			.and('have.css', 'bottom', '0px')
			.and('have.css', 'right', '0px')
			.and('have.css', 'left', '0px');

		//Check store
		getWPDataObject().then((data) => {
			expect({
				type: 'absolute',
				position: {
					top: '0px',
					right: '0px',
					bottom: '0px',
					left: '0px',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherPosition'));
		});

		//
		// Centrally With Equal Margins (20%) From All Edges Button

		//
		cy.getByAriaLabel(
			'Position Centrally With Equal Margins (20%) From All Edges'
		).click();

		//Check store
		getWPDataObject().then((data) => {
			expect({
				type: 'absolute',
				position: {
					top: '20%',
					right: '20%',
					bottom: '20%',
					left: '20%',
				},
			}).to.be.deep.equal(getSelectedBlock(data, 'publisherPosition'));
		});

		//Check frontend
		savePage();

		redirectToFrontPage();

		cy.get('.publisher-core-block')
			.then(($el) => {
				return window.getComputedStyle($el[0]);
			})
			.as('element-style');

		cy.get('@element-style')
			.invoke('getPropertyValue', 'position')
			.should('eq', 'absolute');

		// should have left value
		cy.get('@element-style')
			.invoke('getPropertyValue', 'left')
			.then((leftValue) => {
				expect(leftValue).to.not.equal('');
				expect(leftValue).to.not.equal(null);
			});

		// should have top value
		cy.get('@element-style')
			.invoke('getPropertyValue', 'top')
			.then((topValue) => {
				expect(topValue).to.not.equal('');
				expect(topValue).to.not.equal(null);
			});

		// should have right value
		cy.get('@element-style')
			.invoke('getPropertyValue', 'right')
			.then((rightValue) => {
				expect(rightValue).to.not.equal('');
				expect(rightValue).to.not.equal(null);
			});

		// should have bottom value
		cy.get('@element-style')
			.invoke('getPropertyValue', 'bottom')
			.then((bottomValue) => {
				expect(bottomValue).to.not.equal('');
				expect(bottomValue).to.not.equal(null);
			});
	});
});
