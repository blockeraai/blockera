/**
 * External dependencies
 */
import 'cypress-real-events';

/**
 * Blockera dependencies
 */
import {
	getWPDataObject,
	getSelectedBlock,
	appendBlocks,
	setDeviceType,
	setBlockState,
	savePage,
	setInnerBlock,
	redirectToFrontPage,
	reSelectBlock,
	checkCurrentState,
	createPost,
	getBlockClientId,
	checkBlockCard,
	getBlockInserter,
} from '@blockera/dev-cypress/js/helpers';

/**
 * We will test block states extension on inner blocks context.
 *
 * 1- Checking state container to has correctly color style and exists wrapper.
 * 2- Checking Block card breadcrumb to show correctly states and inner block name.
 * 3- Checking add new state process.
 * 4- Checking not inherit attribute value in inner blocks from master block.
 * 5- Checking sets attributes correctly in master block in normal or pseudo states and inner block on normal and pseudo states.
 * 6- Checking value cleanup of block states in inner blocks.
 * 7- Switch between blocks and checking attributes values.
 */
describe('Block States on inner blocks E2E tests', () => {
	beforeEach(() => {
		createPost();
		cy.viewport(1440, 1025);
	});

	const initialSetting = () => {
		appendBlocks(
			`<!-- wp:paragraph {"className":"blockera-block blockera-block-10bb7854-c3bc-45cd-8202-b6b7c36c6b74","blockeraBlockStates":{"value": {}},"blockeraPropsId":"224185412280","blockeraCompatId":"224185412280"} -->
			<p class="blockera-block blockera-block-10bb7854-c3bc-45cd-8202-b6b7c36c6b74"><a href="http://localhost/wordpress/2023/12/16/5746/" data-type="post" data-id="5746" class="my-link">link</a></p>
			<!-- /wp:paragraph -->`
		);
		cy.getIframeBody().find('[data-type="core/paragraph"]').click();
	};

	describe('state-container', () => {
		it('Set the "Inner Blocks" color on the root of the container using CSS variables.', () => {
			initialSetting();
			setInnerBlock('elements/link');

			cy.cssVar(
				'--blockera-tab-panel-active-color',
				'.blockera-state-colors-container:last-child'
			).should('eq', '#cc0000');
		});

		it('Set the "third-party" state (Like: hover, active, etc) color on the root of the container using CSS variables.', () => {
			initialSetting();
			setInnerBlock('elements/link');
			setBlockState('Hover');

			cy.cssVar(
				'--blockera-tab-panel-active-color',
				'.blockera-state-colors-container:last-child'
			).should('eq', '#d47c14');
		});
	});

	describe('current-state', () => {
		it('Set the hidden style for WordPress block origin features when choose state (apart from normal state)', () => {
			initialSetting();
			setInnerBlock('elements/link');
			setBlockState('Hover');

			//In this assertion not available data attribute for this selector، Please don't be sensitive.
			cy.get('button')
				.contains('Advanced')
				.parent()
				.parent()
				.parent()
				.parent()
				.parent()
				.should('have.class', 'blockera-not-allowed');
		});

		it('Set the current state when add new block states', () => {
			initialSetting();
			setInnerBlock('elements/link');

			checkBlockCard(
				[
					{
						label: 'Selected Inner Block',
						text: 'Links',
					},
				],
				'inner-block'
			);

			setBlockState('Hover');

			checkCurrentState('hover');
			checkBlockCard(
				[
					{
						label: 'Selected Inner Block',
						text: 'Links',
					},
					{
						label: 'Hover State',
						text: 'Hover',
					},
				],
				'inner-block'
			);
		});
	});

	describe('add new state', () => {
		it('should not changed blockeraInnerBlocks attribute because add state but not changed anythings on selected state', () => {
			initialSetting();
			setInnerBlock('elements/link');

			// add hover.
			setBlockState('Hover');

			// Check store
			getWPDataObject().then((data) => {
				expect(undefined).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraInnerBlocks')[
						'elements/link'
					]
				);
			});
		});
	});

	describe('master block updates should not display in inner blocks', () => {
		it('Master → set width → Inner', () => {
			initialSetting();

			// Set width
			cy.setInputFieldValue('Width', 'Size', 50);

			// Inner
			setInnerBlock('elements/link');

			// Assert control
			cy.checkInputFieldValue('Width', 'Size', '');
		});

		it('Master → Hover→ set width → Inner', () => {
			initialSetting();
			setBlockState('Hover');

			// Set width
			cy.setInputFieldValue('Width', 'Size', 50);

			// Inner
			setInnerBlock('elements/link');

			// Assert control
			cy.checkInputFieldValue('Width', 'Size', '');
			setBlockState('Hover');
			cy.checkInputFieldValue('Width', 'Size', '');
		});
	});

	describe('Master → Normal → InnerBlock → Normal', () => {
		it('should set attribute in picked inner block at the root of attributes', () => {
			initialSetting();
			setInnerBlock('elements/link');
			//
			checkBlockCard(
				[
					{
						label: 'Selected Inner Block',
						text: 'Links',
					},
				],
				'inner-block'
			);

			cy.setColorControlValue('BG Color', 'cccccc');

			// Reselect
			reSelectBlock();
			setInnerBlock('elements/link');

			// Assert control value
			cy.getParentContainer('BG Color').should('contain', '#cccccc');

			// Assert block css : inner
			getWPDataObject().then((data) => {
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.should(
						'have.css',
						'background-color',
						'rgb(204, 204, 204)'
					);
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect({
					'elements/link': {
						attributes: {
							blockeraBackgroundColor: '#cccccc',
						},
					},
				}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraInnerBlocks')
				);
			});

			// frontend
			savePage();

			redirectToFrontPage();

			cy.get('.my-link').should(
				'have.css',
				'background-color',
				'rgb(204, 204, 204)'
			);

			// Set xl-desktop viewport
			cy.viewport(1441, 1920);

			cy.get('.my-link').should(
				'have.css',
				'background-color',
				'rgb(204, 204, 204)'
			);

			// // set Tablet viewport
			cy.viewport(768, 1024);

			cy.get('.my-link').should(
				'have.css',
				'background-color',
				'rgb(204, 204, 204)'
			);
		});

		it('should set attribute in picked inner block at the root of tablet breakpoint', () => {
			initialSetting();
			setInnerBlock('elements/link');
			setDeviceType('Tablet');
			//
			checkBlockCard(
				[
					{
						label: 'Selected Inner Block',
						text: 'Links',
					},
				],
				'inner-block'
			);

			// Set overflow
			cy.setColorControlValue('BG Color', 'cccccc');

			// Reselect
			reSelectBlock();
			setInnerBlock('elements/link');

			// Assert control value
			cy.getParentContainer('BG Color').should('contain', '#cccccc');

			// Assert block css : inner / tablet
			getWPDataObject().then((data) => {
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.should(
						'have.css',
						'background-color',
						'rgb(204, 204, 204)'
					);
			});

			// Change device to desktop
			setDeviceType('Desktop');

			// Assert control
			cy.getParentContainer('BG Color').should('contain', 'None');

			// Assert block css : inner /desktop
			getWPDataObject().then((data) => {
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.should(
						'not.have.css',
						'background-color',
						'rgb(204, 204, 204)'
					);
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect({}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraInnerBlocks')
				);

				expect({
					blockeraInnerBlocks: {
						'elements/link': {
							attributes: { blockeraBackgroundColor: '#cccccc' },
						},
					},
				}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes
				);
			});

			// frontend
			savePage();

			redirectToFrontPage();

			// Assert in default viewport
			cy.get('.my-link').should(
				'not.have.css',
				'background-color',
				'rgb(204, 204, 204)'
			);

			// set tablet viewport
			cy.viewport(768, 1024);
			cy.get('.my-link').should(
				'have.css',
				'background-color',
				'rgb(204, 204, 204)'
			);

			// set mobile viewport
			cy.viewport(320, 480);
			cy.get('.my-link').should(
				'have.css',
				'background-color',
				'rgb(204, 204, 204)'
			);
		});
	});

	describe('Master → Normal → InnerBlock → Hover', () => {
		it('should set attribute in picked inner block at the hover state base breakpoint', () => {
			initialSetting();
			setInnerBlock('elements/link');
			setBlockState('Hover');
			//
			checkBlockCard(
				[
					{
						label: 'Selected Inner Block',
						text: 'Links',
					},
					{
						label: 'Hover State',
						text: 'Hover',
					},
				],
				'inner-block'
			);

			cy.setColorControlValue('BG Color', 'cccccc');

			// Reselect
			reSelectBlock();
			setInnerBlock('elements/link');

			// Assert control value
			cy.getParentContainer('BG Color').should('contain', '#cccccc');
			checkCurrentState('hover');

			// Assert block css : inner / hover
			getWPDataObject().then((data) => {
				// Because we expect block element should have css style to show activated hover state.
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.should(
						'have.css',
						'background-color',
						'rgb(204, 204, 204)'
					);

				// Real hover
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.realHover();
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.should(
						'have.css',
						'background-color',
						'rgb(204, 204, 204)'
					);
			});

			// Change state to normal
			setBlockState('Normal');

			// Assert control value
			cy.getParentContainer('BG Color').should('contain', 'None');

			// Assert block css : inner / normal
			getWPDataObject().then((data) => {
				// Real hover
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.realHover();
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.should(
						'have.css',
						'background-color',
						'rgb(204, 204, 204)'
					);
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect({ blockeraBackgroundColor: '#cccccc' }).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraInnerBlocks')[
						'elements/link'
					].attributes.blockeraBlockStates.hover.breakpoints.desktop
						.attributes
				);
			});

			// frontend
			savePage();

			redirectToFrontPage();

			cy.get('.my-link').realHover();
			cy.get('.my-link').should(
				'have.css',
				'background-color',
				'rgb(204, 204, 204)'
			);

			// set tablet viewport
			cy.viewport(768, 1024);

			cy.get('.my-link').realHover();
			cy.get('.my-link').should(
				'have.css',
				'background-color',
				'rgb(204, 204, 204)'
			);
		});

		it('should set attribute in picked inner block at the hover state tablet breakpoint', () => {
			initialSetting();
			setInnerBlock('elements/link');
			setBlockState('Hover');
			setDeviceType('Tablet');
			//
			checkBlockCard(
				[
					{
						label: 'Selected Inner Block',
						text: 'Links',
					},
					{
						label: 'Hover State',
						text: 'Hover',
					},
				],
				'inner-block'
			);

			cy.setColorControlValue('BG Color', 'cccccc');

			// Reselect
			setBlockState('Normal');
			reSelectBlock();
			setInnerBlock('elements/link');
			setBlockState('Hover');

			// Assert control value
			cy.getParentContainer('BG Color').should('contain', '#cccccc');
			checkCurrentState('hover');

			// Assert block css : inner / hover / tablet
			getWPDataObject().then((data) => {
				// Because we expect block element should have css style to show activated hover state.
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.should(
						'have.css',
						'background-color',
						'rgb(204, 204, 204)'
					);

				// Real hover
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.realHover();
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.should(
						'have.css',
						'background-color',
						'rgb(204, 204, 204)'
					);
			});

			// Change device to desktop
			setDeviceType('Desktop');
			setBlockState('Normal');
			reSelectBlock();
			setInnerBlock('elements/link');

			// Assert block css : inner / hover / desktop
			getWPDataObject().then((data) => {
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.should(
						'not.have.css',
						'background-color',
						'rgb(204, 204, 204)'
					);

				// Real hover
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.realHover();
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.should(
						'not.have.css',
						'background-color',
						'rgb(204, 204, 204)'
					);
			});

			// Assert control value
			cy.getParentContainer('BG Color').should('contain', 'None');

			// Change state to normal
			setBlockState('Normal');

			// Assert block css : inner / normal / desktop
			getWPDataObject().then((data) => {
				// Real hover
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.realHover();
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.should(
						'not.have.css',
						'background-color',
						'rgb(204, 204, 204)'
					);
			});

			// Change device to tablet
			setDeviceType('Tablet');

			// Assert block css : inner / normal / tablet
			getWPDataObject().then((data) => {
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.should(
						'not.have.css',
						'background-color',
						'rgb(204, 204, 204)'
					);

				// Real hover
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.realHover();
				cy.getIframeBody()
					.find(`#block-${getBlockClientId(data)} a`)
					.should(
						'have.css',
						'background-color',
						'rgb(204, 204, 204)'
					);
			});

			// Assert store data
			getWPDataObject().then((data) => {
				expect({ blockeraBackgroundColor: '#cccccc' }).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraBlockStates').normal
						.breakpoints.tablet.attributes.blockeraInnerBlocks[
						'elements/link'
					].attributes.blockeraBlockStates.hover.breakpoints.tablet
						.attributes
				);

				expect(undefined).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraInnerBlocks')[
						'elements/link'
					]
				);
			});

			// frontend
			savePage();

			redirectToFrontPage();

			cy.get('.my-link').should(
				'not.have.css',
				'background-color',
				'rgb(204, 204, 204)'
			);

			cy.get('.my-link').realHover();
			cy.get('.my-link').should(
				'not.have.css',
				'background-color',
				'rgb(204, 204, 204)'
			);

			// set tablet viewport
			cy.viewport(768, 1024);
			cy.get('.my-link').should(
				'not.have.css',
				'background-color',
				'rgb(204, 204, 204)'
			);
			cy.get('.my-link').realHover();
			cy.get('.my-link').should(
				'have.css',
				'background-color',
				'rgb(204, 204, 204)'
			);

			// set mobile viewport
			cy.viewport(320, 480);
			cy.get('.my-link').should(
				'not.have.css',
				'background-color',
				'rgb(204, 204, 204)'
			);
			cy.get('.my-link').realHover();
			cy.get('.my-link').should(
				'have.css',
				'background-color',
				'rgb(204, 204, 204)'
			);
		});
	});

	describe('ValueCleanup', () => {
		it('should not have extra breakpoints and attributes in saved data', () => {
			initialSetting();
			setInnerBlock('elements/link');
			setBlockState('Hover');
			cy.setColorControlValue('BG Color', 'cccccc');

			// Assert store
			getWPDataObject().then((data) => {
				expect(1).to.be.equal(
					Object.keys(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/link'
						].attributes
					).length
				);

				expect('#cccccc').to.be.equal(
					getSelectedBlock(data, 'blockeraInnerBlocks')[
						'elements/link'
					].attributes.blockeraBlockStates.hover.breakpoints.desktop
						.attributes.blockeraBackgroundColor
				);

				expect({
					hover: {
						breakpoints: {
							desktop: {
								attributes: {
									blockeraBackgroundColor: '#cccccc',
								},
							},
						},
						isVisible: true,
					},
				}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraInnerBlocks')[
						'elements/link'
					].attributes.blockeraBlockStates
				);
			});
		});
	});

	describe('switch block and reload', () => {
		context('add block → go to inner → switch state to hover', () => {
			beforeEach(() => {
				initialSetting();
				setInnerBlock('elements/link');
				setBlockState('Hover');
			});

			context('switch block + select first block', () => {
				beforeEach(() => {
					// unfocus block
					cy.getIframeBody().find('[aria-label="Add title"]').click();
					// add new block
					getBlockInserter().click();

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
					setInnerBlock('elements/link');

					checkCurrentState('hover');
				});

				it('should current state be normal, when reload', () => {
					cy.reload();

					cy.getIframeBody()
						.find('[data-type="core/paragraph"]')
						.eq(0)
						.click();

					setInnerBlock('elements/link');

					getWPDataObject().then((data) => {
						expect(undefined).to.be.deep.equal(
							getSelectedBlock(data, 'blockeraInnerBlocks')[
								'elements/link'
							]
						);
					});
				});
			});
		});
	});
});
