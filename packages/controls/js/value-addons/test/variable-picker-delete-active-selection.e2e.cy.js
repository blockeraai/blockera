/**
 * Blockera dependencies
 */
import {
	createPost,
	openSiteEditor,
	saveSiteEditorDirtyEntities,
} from '@blockera/dev-cypress/js/helpers';
import {
	CUSTOM_PRESET_ROW_META,
	expectBlockAttrIsScalarValueAddon,
	expectBlockAttrStillBoundToVariable,
	injectCustomPresetRow,
	skipWhenCustomPresetAddUnavailable,
} from '@blockera/dev-cypress/js/helpers/missing-variable';
import { deleteVariableFromVariablePicker } from '@blockera/dev-cypress/js/helpers/variable-picker';

describe('Variable picker — delete active variable', () => {
	const slug = 'e-2-e-picker-delete-fs';
	const presetName = 'E2E Picker Delete FS';

	beforeEach(function () {
		skipWhenCustomPresetAddUnavailable.call(this);
	});

	it('clears the feature binding when deleting the selected variable inside the picker', () => {
		openSiteEditor();
		injectCustomPresetRow('font-size', {
			slug,
			name: presetName,
			size: '18px',
			...CUSTOM_PRESET_ROW_META,
		});
		saveSiteEditorDirtyEntities();

		createPost();
		cy.getBlock('default').type('Delete active variable from picker.', {
			delay: 0,
		});
		cy.getByAriaControls('styles-view').click();

		cy.getParentContainer('Font Size').as('container');
		cy.get('@container').within(() => {
			cy.openValueAddon();
		});

		cy.selectValueAddonItem(slug);

		cy.get('@container').within(() => {
			cy.get('[data-test="value-addon-normal"]').should('exist');
		});
		expectBlockAttrStillBoundToVariable('blockeraFontSize', slug);

		cy.get('@container').within(() => {
			cy.openValueAddon();
		});

		deleteVariableFromVariablePicker(slug);

		cy.get('@container').within(() => {
			cy.get('[data-test="value-addon-deleted"]').should('not.exist');
			cy.get('[data-test="value-addon-normal"]').should('not.exist');
		});

		expectBlockAttrIsScalarValueAddon('blockeraFontSize');
	});

	it('keeps the feature binding when deleting a different variable in the picker', () => {
		const otherSlug = 'e-2-e-picker-delete-other-fs';

		openSiteEditor();
		injectCustomPresetRow('font-size', {
			slug,
			name: presetName,
			size: '18px',
			...CUSTOM_PRESET_ROW_META,
		});
		injectCustomPresetRow('font-size', {
			slug: otherSlug,
			name: 'E2E Picker Delete Other FS',
			size: '20px',
			...CUSTOM_PRESET_ROW_META,
		});
		saveSiteEditorDirtyEntities();

		createPost();
		cy.getBlock('default').type('Delete non-active variable from picker.', {
			delay: 0,
		});
		cy.getByAriaControls('styles-view').click();

		cy.getParentContainer('Font Size').as('container');
		cy.get('@container').within(() => {
			cy.openValueAddon();
		});

		cy.selectValueAddonItem(slug);

		cy.get('@container').within(() => {
			cy.openValueAddon();
		});

		deleteVariableFromVariablePicker(otherSlug);

		cy.get('@container').within(() => {
			cy.get('[data-test="value-addon-normal"]').should('exist');
			cy.get('[data-test="value-addon-deleted"]').should('not.exist');
		});

		expectBlockAttrStillBoundToVariable('blockeraFontSize', slug);
	});
});
