import {
	savePage,
	openSiteEditor,
	getWPDataObject,
	closeWelcomeGuide,
	getSelectedBlockStyle,
	getEditedGlobalStylesRecord,
} from '@blockera/dev-cypress/js/helpers';

describe('Style Variations Inside Global Styles Panel → Functionality', () => {
	const before = () => {
		cy.openGlobalStylesPanel();

		closeWelcomeGuide();

		cy.getByDataTest('block-style-variations').eq(1).click();

		cy.get(`button[id="/blocks/core%2Fgroup"]`).click();
	};

	beforeEach(() => {
		openSiteEditor();

		before();
	});

	it('should be able to duplicate specific style variation', () => {
		cy.getByDataTest('open-default-contextmenu').click();
		cy.get('.blockera-component-popover-body button')
			.contains('Duplicate')
			.click();
		cy.getByDataTest('style-default-copy').should('be.visible');
		cy.getByDataTest('open-default-copy-contextmenu').click();
		cy.get('.blockera-component-popover-body button')
			.contains('Duplicate')
			.click();
		cy.getByDataTest('style-default-copy-1').should('be.visible');
		cy.getByDataTest('open-section-1-contextmenu').click();
		cy.get('.blockera-component-popover-body button')
			.contains('Duplicate')
			.click();
		cy.getByDataTest('style-section-1-copy').should('be.visible');

		savePage();
		cy.reload();

		before();
		cy.getByDataTest('open-default-contextmenu').click();
		cy.getByDataTest('style-default-copy').should('be.visible');
		cy.getByDataTest('style-default-copy-1').should('be.visible');
		cy.getByDataTest('style-section-1-copy').should('be.visible');
	});

	it('should be able to clear customizations from specific style variation', () => {
		cy.getByDataTest('style-section-1').click();

		cy.setScreenshotViewport('desktop');

		cy.compareSnapshot({
			name: 'core-group-global-styles-clear-customizations-action',
			threshold: 0.02,
		}).then(
			() => {},
			(error) => {
				failures.push({
					name: 'clear-customizations',
					error: error.message,
				});
			}
		);

		// add alias to the feature container
		cy.getParentContainer('BG Color').as('bgColorContainer');
		// act: clicking on color button
		cy.get('@bgColorContainer').within(() => {
			cy.openValueAddon();
		});
		// select variable
		cy.selectValueAddonItem('accent-4');
		//assert data
		getWPDataObject().then((data) => {
			expect({
				settings: {
					name: 'Accent 4',
					id: 'accent-4',
					value: '#686868',
					reference: {
						type: 'theme',
						theme: 'Twenty Twenty-Five',
					},
					type: 'color',
					var: '--wp--preset--color--accent-4',
				},
				name: 'Accent 4',
				isValueAddon: true,
				valueType: 'variable',
			}).to.be.deep.equal(
				getSelectedBlockStyle(data, 'core/group', 'section-1')
					?.blockeraBackgroundColor?.value
			);
		});

		savePage();
		cy.reload();

		before();
		cy.getByDataTest('style-section-1').click();
		cy.getByDataTest('open-section-1-contextmenu').eq(1).click();
		cy.get('.blockera-component-popover-body button')
			.contains('Clear all customizations')
			.click();
		//assert blockera data
		getWPDataObject().then((data) => {
			expect(undefined).to.be.deep.equal(
				getSelectedBlockStyle(data, 'core/group', 'section-1')
					?.blockeraBackgroundColor?.value
			);
		});
		//assert WordPress data
		getWPDataObject().then((data) => {
			expect({}).to.be.deep.equal(
				getEditedGlobalStylesRecord(data, 'styles')
			);
		});

		savePage();
		cy.reload();

		before();
		cy.getByDataTest('style-section-1').click();
		//assert blockera data
		getWPDataObject().then((data) => {
			expect(undefined).to.be.deep.equal(
				getSelectedBlockStyle(data, 'core/group', 'section-1')
					?.blockeraBackgroundColor?.value
			);
		});
		//assert WordPress data
		getWPDataObject().then((data) => {
			expect({}).to.be.deep.equal(
				getEditedGlobalStylesRecord(data, 'styles')
			);
		});
	});

	it('should be able to rename specific style variation', () => {
		cy.getByDataTest('style-section-1').click();

		cy.setScreenshotViewport('desktop');

		cy.compareSnapshot({
			name: 'core-group-global-styles-rename-action',
			threshold: 0.02,
		}).then(
			() => {},
			(error) => {
				failures.push({
					name: 'rename',
					error: error.message,
				});
			}
		);

		cy.getByDataTest('open-section-1-contextmenu').eq(1).click();
		cy.get('.blockera-component-popover-body button')
			.contains('Rename')
			.click();
		cy.get('.components-modal__content').within(() => {
			cy.getParentContainer('Name').within(() => {
				cy.get('input').clear();
				cy.get('input').type('New Name');
			});
			cy.getByDataTest('save-rename-button').click();
		});
		cy.getByDataTest('style-section-1').contains('New Name');

		savePage();
		cy.reload();

		before();
		cy.getByDataTest('style-section-1').click();
		cy.getByDataTest('style-section-1').contains('New Name');
	});

	it('should be able to rename with new ID specific style variation', () => {
		cy.getByDataTest('style-section-1').click();

		cy.setScreenshotViewport('desktop');

		cy.compareSnapshot({
			name: 'core-group-global-styles-rename-slug-action',
			threshold: 0.02,
		}).then(
			() => {},
			(error) => {
				failures.push({
					name: 'rename-slug',
					error: error.message,
				});
			}
		);

		cy.getByDataTest('open-section-1-contextmenu').eq(1).click();
		cy.get('.blockera-component-popover-body button')
			.contains('Rename')
			.click();
		cy.get('.components-modal__content').within(() => {
			cy.getParentContainer('Name').within(() => {
				cy.get('input').clear();
				cy.get('input').type('New Name');
			});
			cy.getParentContainer('ID').within(() => {
				cy.get('input').clear();
				cy.get('input').type('new id');
			});
			cy.get('input[type="checkbox"]').check();
			cy.getByDataTest('save-rename-button').click();
		});
		cy.getByDataTest('style-new-id').contains('New Name');

		savePage();
		cy.reload();

		before();
		cy.getByDataTest('style-new-id').contains('New Name');
	});

	it('should be able to Active/Inactive specific style variation', () => {
		cy.getByDataTest('open-new-id-contextmenu').eq(0).click();

		cy.setScreenshotViewport('desktop');

		cy.compareSnapshot({
			name: 'core-group-global-styles-active-inactive-action',
			threshold: 0.02,
		}).then(
			() => {},
			(error) => {
				failures.push({
					name: 'active-inactive',
					error: error.message,
				});
			}
		);

		cy.get('.blockera-component-grid')
			.contains('Active Style')
			.within(() => {
				cy.get('input').click();
			});
		cy.getByDataTest('style-new-id').should('not.have.class', 'is-enabled');
		cy.getByDataTest('style-new-id').click();
		getWPDataObject().then((data) => {
			expect(undefined).to.be.deep.equal(
				data.select('blockera/editor').getSelectedBlockStyleVariation()
			);
		});
		cy.openSettingsPanel();
		cy.getBlock('core/group').eq(0).click();
		cy.getByDataTest('style-variations-button').should('exist');
		cy.getByDataTest('style-variations-button').click();
		cy.get('.blockera-component-popover.variations-picker-popover')
			.last()
			.within(() => {
				cy.getByDataTest('style-new-id').should(
					'not.have.class',
					'is-enabled'
				);
				getWPDataObject().then((data) => {
					expect(undefined).to.be.deep.equal(
						data
							.select('blockera/editor')
							.getSelectedBlockStyleVariation()
					);
				});
			});

		savePage();
		cy.reload();

		before();
		cy.getByDataTest('style-new-id').click();
		getWPDataObject().then((data) => {
			expect(undefined).to.be.deep.equal(
				data.select('blockera/editor').getSelectedBlockStyleVariation()
			);
		});
		cy.openSettingsPanel();
		cy.getBlock('core/group').eq(0).click();
		cy.getByDataTest('style-variations-button').should('exist');
		cy.getByDataTest('style-variations-button').click();
		cy.get('.blockera-component-popover.variations-picker-popover')
			.last()
			.within(() => {
				cy.getByDataTest('style-new-id').should(
					'not.have.class',
					'is-enabled'
				);
				getWPDataObject().then((data) => {
					expect(undefined).to.be.deep.equal(
						data
							.select('blockera/editor')
							.getSelectedBlockStyleVariation()
					);
				});

				cy.getByDataTest('open-new-id-contextmenu').eq(0).click();
			});

		cy.getByDataTest('style-variations-button').click();
		cy.get('.blockera-component-grid')
			.contains('Active Style')
			.within(() => {
				cy.get('input').click();
			});
	});

	it('should be able to delete specific style variation', () => {
		cy.getByDataTest('open-new-id-contextmenu').eq(0).click();

		cy.setScreenshotViewport('desktop');

		cy.compareSnapshot({
			name: 'core-group-global-styles-delete-action',
			threshold: 0.02,
		}).then(
			() => {},
			(error) => {
				failures.push({
					name: 'delete',
					error: error.message,
				});
			}
		);

		cy.get('.blockera-component-popover-body button')
			.contains('Delete')
			.click();
		cy.get('.components-modal__content').within(() => {
			cy.get('input[type="checkbox"]').check();
			cy.getByDataTest('delete-button').click();
		});
		cy.getByDataTest('style-new-id').should('not.exist');
		getWPDataObject().then((data) => {
			expect(4).to.be.deep.equal(
				data.select('core/blocks').getBlockStyles('core/group')
					?.length || 0
			);
		});
		cy.openSettingsPanel();
		cy.getBlock('core/group').eq(0).click();
		cy.getByDataTest('style-variations-button').should('exist');
		cy.getByDataTest('style-variations-button').click();
		cy.get('.blockera-component-popover.variations-picker-popover')
			.last()
			.within(() => {
				cy.getByDataTest('style-new-id').should('not.exist');
			});

		savePage();
		cy.reload();

		before();
		cy.getByDataTest('style-new-id').should('not.exist');
		getWPDataObject().then((data) => {
			expect(3).to.be.deep.equal(
				data.select('core/blocks').getBlockStyles('core/group')
					?.length || 0
			);
		});
		cy.openSettingsPanel();
		cy.getBlock('core/group').eq(0).click();
		cy.getByDataTest('style-variations-button').should('exist');
		cy.getByDataTest('style-variations-button').click();
		cy.get('.blockera-component-popover.variations-picker-popover')
			.last()
			.within(() => {
				cy.getByDataTest('style-new-id').should('not.exist');
			});
	});

	after(() => {
		// After all snapshots, check if any failed and throw combined error
		cy.then(() => {
			if (failures.length > 0) {
				const errorMessage = failures
					.map((f, i) => `\n${i + 1}. ${f.name}:\n   ${f.error}`)
					.join('\n');
				throw new Error(
					`${failures.length} screenshot(s) failed:${errorMessage}`
				);
			}
		});
	});
});
