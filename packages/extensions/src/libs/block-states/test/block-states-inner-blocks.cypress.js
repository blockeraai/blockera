/**
 * Internal dependencies
 */
import {
	getWPDataObject,
	getSelectedBlock,
	appendBlocks,
	setDeviceType,
	addBlockState,
	setBlockState,
	savePage,
	setInnerBlock,
	redirectToFrontPage,
	reSelectBlock,
	checkCurrentState,
} from '../../../../../../cypress/helpers';
import 'cypress-real-events';

describe('Inner Blocks E2E Test', () => {
	beforeEach(() => {
		cy.viewport(1440, 1025);
	});

	const initialSetting = () => {
		appendBlocks(
			`<!-- wp:paragraph {"className":"publisher-core-block publisher-core-block-10bb7854-c3bc-45cd-8202-b6b7c36c6b74","publisherBlockStates":{"normal":{"breakpoints":{"laptop":{"attributes":{}}},"isVisible":true,"isSelected":true}},"publisherPropsId":"224185412280","publisherCompatId":"224185412280"} -->
			<p class="publisher-core-block publisher-core-block-10bb7854-c3bc-45cd-8202-b6b7c36c6b74"><a href="http://localhost/wordpress/2023/12/16/5746/" data-type="post" data-id="5746" class="my-link">link</a></p>
			<!-- /wp:paragraph -->`
		);
		cy.getIframeBody().find('[data-type="core/paragraph"]').click();
	};

	describe('state-container', () => {
		it('Set the "Inner Blocks" color on the root of the container using CSS variables.', () => {
			initialSetting();
			setInnerBlock('Link');

			cy.cssVar(
				'--publisher-tab-panel-active-color',
				'[aria-label="Publisher Block State Container"]:first-child'
			).should('eq', '#cc0000');
		});

		it('Set the "third-party" state (Like: hover, active, etc) color on the root of the container using CSS variables.', () => {
			initialSetting();
			setInnerBlock('Link');
			addBlockState('hover');

			cy.cssVar(
				'--publisher-tab-panel-active-color',
				'[aria-label="Publisher Block State Container"]:first-child'
			).should('eq', '#D47C14');
		});

		it('should block state container title be correct', () => {
			initialSetting();
			setInnerBlock('Link');

			cy.getByAriaLabel('Publisher Block State Container')
				.first()
				.within(() => {
					cy.contains('Inner Block States').should('exist');
				});
		});
	});

	describe('current-state', () => {
		it('Set the hidden style for WordPress block origin features when choose state (apart from normal state)', () => {
			initialSetting();
			setInnerBlock('Link');
			cy.getByAriaLabel('Add New State').click();

			//In this assertion not available data attribute for this selector، Please don't be sensitive.
			cy.get('button')
				.contains('Advanced')
				.parent()
				.parent()
				.parent()
				.parent()
				.parent()
				.should('have.class', 'publisher-not-allowed');
		});

		it('Set the current state when add new block states', () => {
			initialSetting();
			setInnerBlock('Link');

			cy.getByAriaLabel('Add New State').click();

			checkCurrentState('hover');

			cy.getByAriaLabel('Add New State').click();

			checkCurrentState('active');

			cy.getByAriaLabel('Add New State').click();

			checkCurrentState('focus');
		});
	});

	describe('add new state', () => {
		it('should not display normal when delete hover state ', () => {
			initialSetting();
			setInnerBlock('Link');

			// do not render normal when adding new state
			cy.contains('Normal').should('not.exist');

			cy.getByAriaLabel('Add New State').click();
			// render normal when adding new state
			cy.contains('Hover').should('exist');

			//
			cy.getByAriaLabel('Delete hover').click({ force: true });

			//
			cy.contains('Normal').should('not.exist');
			cy.contains('Hover').should('not.exist');
		});

		it('should add correct item, when once delete', () => {
			initialSetting();
			setInnerBlock('Link');

			cy.multiClick('[aria-label="Add New State"]', 5);

			// remove active
			cy.getByAriaLabel('Delete active').click({ force: true });

			// add new state
			cy.getByAriaLabel('Add New State').click();
			checkCurrentState('active');

			// add new state
			cy.getByAriaLabel('Add New State').click();
			checkCurrentState('after');
		});

		it('should create correct id for repeater item when update states', () => {
			initialSetting();
			setInnerBlock('Link');

			// add
			addBlockState('hover');

			// Check store
			getWPDataObject().then((data) => {
				expect(['normal', 'hover']).to.be.deep.equal(
					Object.keys(
						getSelectedBlock(data, 'publisherInnerBlocks').link
							.attributes.publisherBlockStates
					)
				);
			});

			// update
			cy.getByDataTest('popover-body').within(() => {
				cy.get('select').select('focus');
			});

			// Check store
			getWPDataObject().then((data) => {
				expect(['normal', 'focus']).to.be.deep.equal(
					Object.keys(
						getSelectedBlock(data, 'publisherInnerBlocks').link
							.attributes.publisherBlockStates
					)
				);
			});
		});
	});

	describe('Master -> Normal -> InnerBlock -> Normal', () => {
		it('should set attr in innerBlocks root when default breakPoint', () => {
			initialSetting();
			setInnerBlock('Link');
			// Set overflow
			cy.getByAriaLabel('Hidden Overflow').click();

			// Reselect
			reSelectBlock();
			setInnerBlock('Link');

			// Assert control value
			cy.getByAriaLabel('Hidden Overflow').should(
				'have.attr',
				'aria-pressed',
				'true'
			);

			//TODO
			// Assert block css

			// Assert store data
			getWPDataObject().then((data) => {
				expect({
					link: {
						attributes: {
							publisherOverflow: 'hidden',
						},
					},
				}).to.be.deep.equal(
					getSelectedBlock(data, 'publisherInnerBlocks')
				);
			});

			// frontend
			savePage();

			redirectToFrontPage();

			// TODO :
			//cy.get('.my-link').should('have.css', 'overflow', 'hidden');

			// Set desktop viewport
			cy.viewport(1441, 1920);

			//cy.get('.my-link').should('have.css', 'overflow', 'hidden');

			// // set Tablet viewport
			cy.viewport(768, 1024);

			//cy.get('.my-link').should('have.css', 'overflow', 'hidden');
		});

		it.skip('should set attribute correctly when breakpoint : Tablet', () => {
			initialSetting();
			setInnerBlock('Link');
			setDeviceType('Tablet');
			// Set overflow
			cy.getByAriaLabel('Hidden Overflow').click();

			// Reselect
			reSelectBlock();
			setInnerBlock('Link');

			// Assert control value
			cy.getByAriaLabel('Hidden Overflow').should(
				'have.attr',
				'aria-pressed',
				'true'
			);

			// Assert block css
			// TODO:

			// Change device to laptop
			setDeviceType('Laptop');

			// Assert control
			cy.getByAriaLabel('Hidden Overflow').should(
				'not.have.attr',
				'aria-checked',
				'true'
			);

			// Assert block css
			//TODO

			// Assert store data
			//TODO

			// frontend
			savePage();

			redirectToFrontPage();

			// Assert in default viewport
			cy.get('.my-link').should('not.have.css', 'overflow', 'hidden');

			// Set desktop viewport
			cy.viewport(1441, 1920);

			cy.get('.my-link').should('not.have.css', 'overflow', 'hidden');

			// set tablet viewport
			cy.viewport(768, 1024);

			cy.get('.my-link').should('have.css', 'overflow', 'hidden');

			// TODO:
			// // set mobile viewport
			// cy.viewport(320, 480);

			//cy.get('.my-link').should('have.css', 'overflow', 'hidden');
		});
	});

	describe('Master -> Normal -> InnerBlock -> Hover', () => {
		it('should set attribute correctly when : default breakPoint', () => {
			initialSetting();
			setInnerBlock('Link');
			addBlockState('hover');

			// Set overflow
			cy.getByAriaLabel('Hidden Overflow').click();

			// Reselect
			reSelectBlock();
			setInnerBlock('Link');

			// Assert control value
			cy.getByAriaLabel('Hidden Overflow').should(
				'have.attr',
				'aria-pressed',
				'true'
			);
			checkCurrentState('hover');

			// Assert block css
			//TODO:

			// Change state to normal
			setBlockState('Normal');

			// Assert control value
			cy.getByAriaLabel('Hidden Overflow').should(
				'have.attr',
				'aria-pressed',
				'false'
			);
			// Assert block css
			//TODO

			// Assert store data
			getWPDataObject().then((data) => {
				expect({ publisherOverflow: 'hidden' }).to.be.deep.equal(
					getSelectedBlock(data, 'publisherInnerBlocks').link
						.attributes.publisherBlockStates.hover.breakpoints
						.laptop.attributes
				);
			});

			// frontend
			savePage();

			redirectToFrontPage();

			cy.get('.my-link').realHover();
			cy.get('.my-link').should('have.css', 'overflow', 'hidden');

			// //TODO:
			// // Set desktop viewport
			//cy.viewport(1441, 1920);

			//cy.get('.my-link').realHover();
			//cy.get('.my-link').should('have.css', 'overflow', 'hidden');

			// // TODO:
			// // set tablet viewport
			//cy.viewport(768, 1024);

			//cy.get('.my-link').realHover();
			//cy.get('.my-link').should('have.css', 'overflow', 'hidden');
		});

		it('should set attribute correctly when : Tablet', () => {
			initialSetting();
			setInnerBlock('Link');
			addBlockState('hover');
			setDeviceType('Tablet');

			// Set overflow
			cy.getByAriaLabel('Hidden Overflow').click();

			// Reselect
			reSelectBlock();
			setInnerBlock('Link');

			//TODO:
			// Assert control value
			// cy.getByAriaLabel('Hidden Overflow').should(
			// 	'have.attr',
			// 	'aria-pressed',
			// 	'true'
			// );
			checkCurrentState('hover');

			// Assert block css
			//TODO

			// Change device to laptop
			setDeviceType('Laptop');
			// Assert block css
			//TODO

			// Assert control value
			cy.getByAriaLabel('Hidden Overflow').should(
				'have.attr',
				'aria-pressed',
				'false'
			);

			// Assert store data
			getWPDataObject().then((data) => {
				expect({ publisherOverflow: 'hidden' }).to.be.deep.equal(
					getSelectedBlock(data, 'publisherInnerBlocks').link
						.attributes.publisherBlockStates.hover.breakpoints
						.tablet.attributes
				);

				expect({}).to.be.deep.equal(
					getSelectedBlock(data, 'publisherInnerBlocks').link
						.attributes.publisherBlockStates.hover.breakpoints
						.laptop.attributes
				);
			});

			// frontend
			savePage();

			redirectToFrontPage();

			cy.get('.my-link').realHover();
			cy.get('.my-link').should('not.have.css', 'overflow', 'hidden');

			// Set desktop viewport
			cy.viewport(1441, 1920);

			cy.get('.my-link').realHover();
			cy.get('.my-link').should('not.have.css', 'overflow', 'hidden');

			// set tablet viewport
			cy.viewport(768, 1024);

			cy.get('.my-link').realHover();
			cy.get('.my-link').should('have.css', 'overflow', 'hidden');

			// TODO:
			// set mobile viewport
			// cy.viewport(320, 480);

			// cy.get('.my-link').realHover();
			//cy.get('.my-link').should('have.css', 'overflow', 'hidden');
		});
	});

	// describe('multiple', () => {});
	// describe('multiple repeater', () => {});

	// describe('Master -> Pseudo State(hover) -> InnerBlock', () => {
	// 	it('Normal -> default breakpoint', () => {});
	// 	it('Normal -> mobile breakpoint', () => {});
	// 	it('Active -> default breakpoint', () => {});
	// 	it('Active -> mobile breakpoint', () => {});
	// 	describe('multiple', () => {});
	// 	describe('multiple repeater', () => {});
	// });

	describe('ValueCleanup', () => {
		it('should not have extra breakpoints and attributes in saved data', () => {
			initialSetting();
			setInnerBlock('Link');
			addBlockState('hover');
			cy.getByAriaLabel('Input Width').type(100, { force: true });

			// Assert store
			getWPDataObject().then((data) => {
				expect(1).to.be.equal(
					Object.keys(
						getSelectedBlock(data, 'publisherInnerBlocks').link
							.attributes
					).length
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'publisherInnerBlocks').link
						.attributes.publisherBlockStates.hover.breakpoints
						.tablet
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'publisherInnerBlocks').link
						.attributes.publisherBlockStates.hover.breakpoints
						.laptop.attributes.publisherHeight
				);

				expect({
					normal: {
						breakpoints: {
							laptop: { attributes: {} },
						},
						isVisible: true,
					},
					hover: {
						breakpoints: {
							laptop: { attributes: { publisherWidth: '100px' } },
						},
						isVisible: true,
					},
				}).to.be.deep.equal(
					getSelectedBlock(data, 'publisherInnerBlocks').link
						.attributes.publisherBlockStates
				);
			});
		});
	});

	describe('switch block and reload', () => {
		context('add block -> go to inner -> switch state to hover', () => {
			beforeEach(() => {
				initialSetting();
				setInnerBlock('Link');
				addBlockState('hover');
			});

			context('switch block + select first block', () => {
				beforeEach(() => {
					// unfocus block
					cy.getIframeBody().find('[aria-label="Add title"]').click();
					// add new block
					cy.getIframeBody().find('[aria-label="Add block"]').click();

					cy.get('.block-editor-inserter__panel-content').within(
						() => {
							cy.contains('Paragraph').click();
						}
					);

					//
					cy.getIframeBody()
						.find('[data-type="core/paragraph"]')
						.eq(0)
						.click();

					//
					savePage();
				});

				it('should current state be hover', () => {
					setInnerBlock('Link');

					checkCurrentState('hover');
				});

				it('should current state be normal, when reload', () => {
					cy.reload();

					cy.getIframeBody()
						.find('[data-type="core/paragraph"]')
						.eq(0)
						.click();

					setInnerBlock('Link');

					checkCurrentState('normal');
				});
			});
		});
	});
});
