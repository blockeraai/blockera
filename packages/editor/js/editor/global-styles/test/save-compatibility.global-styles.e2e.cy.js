/**
 * Blockera dependencies
 */
import {
	openSiteEditor,
	activateMuPlugin,
	deactivateMuPlugin,
	closeWelcomeGuide,
} from '@blockera/dev-cypress/js/helpers';

const MU_PLUGIN_PATH =
	'packages/editor/js/editor/global-styles/test/fixtures/save-compatibility.php';
const MU_PLUGIN_TARGET = 'blockera-test-global-styles-save-compatibility.php';

const getGlobalStylesId = (data) => {
	const coreSelect = data.select('core');

	if (
		typeof coreSelect.__experimentalGetCurrentGlobalStylesId === 'function'
	) {
		return coreSelect.__experimentalGetCurrentGlobalStylesId();
	}

	return coreSelect.getCurrentGlobalStylesId?.();
};

const editGlobalStyles = (styles) => {
	cy.window().then((win) => {
		const data = win.wp.data;
		const id = getGlobalStylesId(data);

		expect(id, 'global styles entity id').to.not.equal(undefined);
		expect(id, 'global styles entity id').to.not.equal(null);

		data.dispatch('core').editEntityRecord('root', 'globalStyles', id, {
			styles,
		});
	});
};

const saveWithNativeSiteEditorButton = () => {
	cy.get('.edit-site-save-hub__button, .edit-site-save-button__button', {
		timeout: 20000,
	})
		.filter(':visible')
		.first()
		.click({ force: true });

	cy.get('.editor-entities-saved-states__save-button', {
		timeout: 20000,
	})
		.filter(':visible')
		.first()
		.click({ force: true });

	cy.window().should((win) => {
		const dirtyRecords =
			win.wp.data
				.select('core')
				.__experimentalGetDirtyEntityRecords?.() || [];

		expect(
			dirtyRecords.filter(
				(record) =>
					record.kind === 'root' && record.name === 'globalStyles'
			),
			'dirty global styles records'
		).to.have.length(0);
	});
};

const getSavedGlobalStylesRecord = (win) => {
	const data = win.wp.data;
	const id = getGlobalStylesId(data);

	return data.select('core').getEntityRecord('root', 'globalStyles', id);
};

describe('Global styles save compatibility', () => {
	beforeEach(() => {
		activateMuPlugin(MU_PLUGIN_PATH, MU_PLUGIN_TARGET);
		openSiteEditor();
		cy.openGlobalStylesPanel();
		closeWelcomeGuide();
	});

	afterEach(() => {
		deactivateMuPlugin(MU_PLUGIN_PATH, MU_PLUGIN_TARGET);
	});

	it('hydrates empty styles.blocks from theme styles and saves only cleaned compatible block data', () => {
		editGlobalStyles({});

		saveWithNativeSiteEditorButton();

		cy.window().should((win) => {
			const record = getSavedGlobalStylesRecord(win);
			const styles = record?.styles;
			const paragraph = styles?.blocks?.['core/paragraph'];

			expect(styles, 'saved styles object').to.have.keys(['blocks']);
			expect(styles?.typography, 'top-level typography').to.equal(
				undefined
			);
			expect(styles?.color, 'top-level color').to.equal(undefined);
			expect(paragraph?.typography?.textIndent).to.equal('2px');
			expect(paragraph?.blockeraTextIndent?.value).to.equal('2px');
			expect(paragraph?.blockeraPropsId, 'default props id').to.equal(
				undefined
			);
			expect(paragraph?.blockeraCompatId, 'default compat id').to.equal(
				undefined
			);
		});
	});

	it('does not rerun compatibility when user styles.blocks already has data', () => {
		editGlobalStyles({
			typography: {
				textIndent: '99px',
			},
			blocks: {
				'core/paragraph': {
					typography: {
						textIndent: '7px',
					},
				},
			},
		});

		saveWithNativeSiteEditorButton();

		cy.window().should((win) => {
			const record = getSavedGlobalStylesRecord(win);
			const styles = record?.styles;
			const paragraph = styles?.blocks?.['core/paragraph'];

			expect(styles?.typography?.textIndent).to.equal('99px');
			expect(paragraph?.typography?.textIndent).to.equal('7px');
			expect(paragraph?.blockeraTextIndent).to.equal(undefined);
		});
	});
});
