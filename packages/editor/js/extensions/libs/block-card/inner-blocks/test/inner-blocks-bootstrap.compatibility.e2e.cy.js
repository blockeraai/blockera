/**
 * Inner-blocks bootstrap — global styles / theme.json via `blockera_theme_json_data_theme`.
 *
 * Each scenario uses a dedicated mu-plugin under `test/global-styles/fixtures/` that patches
 * `styles.blocks.core/group.elements` (not block-level `style.elements`).
 *
 * @see packages/editor/js/extensions/libs/block-card/inner-blocks/bootstrap.js
 */
import {
	openSiteEditor,
	closeWelcomeGuide,
	getEditedGlobalStylesRecord,
	getWPDataObject,
	activateMuPlugin,
	deactivateMuPlugin,
	setInnerBlock,
	setBlockState,
} from '@blockera/dev-cypress/js/helpers';

const FIXTURE_ROOT =
	'packages/editor/js/extensions/libs/block-card/inner-blocks/test/global-styles/fixtures';

/** Map Cypress test title → mu-plugin (path + unique target filename). */
const muPluginByTestTitle = {
	'imports link colors from theme.json into blockeraInnerBlocks': {
		path: `${FIXTURE_ROOT}/link-color-simple.php`,
		target: 'blockera-test-inner-blocks-link-color-simple.php',
	},
	'imports link preset colors from theme.json': {
		path: `${FIXTURE_ROOT}/link-color-variable.php`,
		target: 'blockera-test-inner-blocks-link-color-variable.php',
	},
	'imports button text color from theme.json': {
		path: `${FIXTURE_ROOT}/button-text-color.php`,
		target: 'blockera-test-inner-blocks-button-text-color.php',
	},
	'imports button background color from theme.json': {
		path: `${FIXTURE_ROOT}/button-background-color.php`,
		target: 'blockera-test-inner-blocks-button-background-color.php',
	},
	'imports button typography core properties from theme.json': {
		path: `${FIXTURE_ROOT}/button-typography-core.php`,
		target: 'blockera-test-inner-blocks-button-typography-core.php',
	},
	'imports button typography extra properties from theme.json': {
		path: `${FIXTURE_ROOT}/button-typography-extra.php`,
		target: 'blockera-test-inner-blocks-button-typography-extra.php',
	},
	'imports partial button border facets from theme.json': {
		path: `${FIXTURE_ROOT}/button-border-partial.php`,
		target: 'blockera-test-inner-blocks-button-border-partial.php',
	},
	'imports button border radius from theme.json': {
		path: `${FIXTURE_ROOT}/button-border-radius.php`,
		target: 'blockera-test-inner-blocks-button-border-radius.php',
	},
	'imports button spacing from theme.json': {
		path: `${FIXTURE_ROOT}/button-spacing.php`,
		target: 'blockera-test-inner-blocks-button-spacing.php',
	},
	'imports button shadow from theme.json': {
		path: `${FIXTURE_ROOT}/button-shadow.php`,
		target: 'blockera-test-inner-blocks-button-shadow.php',
	},
	'imports button dimensions from theme.json': {
		path: `${FIXTURE_ROOT}/button-dimensions.php`,
		target: 'blockera-test-inner-blocks-button-dimensions.php',
	},
	'imports link text decoration and hover from theme.json': {
		path: `${FIXTURE_ROOT}/link-text-decoration.php`,
		target: 'blockera-test-inner-blocks-link-text-decoration.php',
	},
	'imports button hover typography from theme.json': {
		path: `${FIXTURE_ROOT}/button-hover-typography.php`,
		target: 'blockera-test-inner-blocks-button-hover-typography.php',
	},
	'imports button hover border from theme.json': {
		path: `${FIXTURE_ROOT}/button-hover-border.php`,
		target: 'blockera-test-inner-blocks-button-hover-border.php',
	},
	'syncs link colors from blockera to theme.json elements': {
		path: `${FIXTURE_ROOT}/link-color-simple.php`,
		target: 'blockera-test-inner-blocks-link-color-simple.php',
	},
	'syncs button text color from blockera to theme.json elements': {
		path: `${FIXTURE_ROOT}/button-text-color.php`,
		target: 'blockera-test-inner-blocks-button-text-color.php',
	},
};

const activeMuPlugins = new Map();

const getGroupGlobalStyles = (data) =>
	getEditedGlobalStylesRecord(data, 'styles', 'blocks')?.['core/group'];

const getInnerAttrs = (groupRecord, innerBlockKey) =>
	groupRecord?.blockeraInnerBlocks?.value?.[innerBlockKey]?.attributes;

/**
 * Assert on core/group global styles with Cypress retry (theme merge + bootstrap sync).
 *
 * @param {(group: object) => void} assertFn
 */
const withGroupGlobalStyles = (assertFn) => {
	cy.window({ timeout: 20000 }).should((win) => {
		const group = getGroupGlobalStyles(win.wp.data);
		assertFn(group);
	});
};

const openGroupGlobalStyles = () => {
	cy.openGlobalStylesPanel();
	closeWelcomeGuide();
	cy.getByDataTest('block-style-variations').eq(0).click();
	cy.get('button[id="/blocks/core%2Fgroup"]').click();
	cy.getByDataTest('style-default').click();
	cy.addNewTransition();
};

describe('Inner blocks bootstrap → global styles theme.json (mu-plugins)', () => {
	beforeEach(function () {
		const muPlugin = muPluginByTestTitle[this.currentTest.title];

		if (muPlugin) {
			activateMuPlugin({
				pluginPath: muPlugin.path,
				pluginName: muPlugin.target,
			});
			activeMuPlugins.set(this.currentTest.title, muPlugin);
		}

		openSiteEditor();
		openGroupGlobalStyles();
	});

	afterEach(function () {
		const muPlugin = activeMuPlugins.get(this.currentTest.title);

		if (muPlugin) {
			deactivateMuPlugin({
				pluginPath: muPlugin.path,
				pluginName: muPlugin.target,
			});
			activeMuPlugins.delete(this.currentTest.title);
		}
	});

	describe('color (special compat)', () => {
		it('imports link colors from theme.json into blockeraInnerBlocks', () => {
			withGroupGlobalStyles((group) => {
				const link = group?.elements?.link;

				expect('#ffbaba').to.equal(link?.color?.text);
				expect('#ff1d1d').to.equal(link?.[':hover']?.color?.text);
				expect({
					blockeraFontColor: '#ffbaba',
					blockeraBlockStates: {
						hover: {
							isVisible: true,
							breakpoints: {
								desktop: {
									attributes: {
										blockeraFontColor: '#ff1d1d',
									},
								},
							},
						},
					},
				}).to.deep.equal(getInnerAttrs(group, 'elements/link'));
			});
		});

		it('imports link preset colors from theme.json', () => {
			withGroupGlobalStyles((group) => {
				const link = group?.elements?.link;

				// Global styles store resolves preset refs to CSS variables.
				expect('var(--wp--preset--color--accent-3)').to.equal(
					link?.color?.text
				);
				expect('var(--wp--preset--color--accent-4)').to.equal(
					link?.[':hover']?.color?.text
				);
				expect(
					getInnerAttrs(group, 'elements/link')?.blockeraFontColor
						?.isValueAddon
				).to.equal(true);
			});
		});

		it('imports button text color from theme.json', () => {
			withGroupGlobalStyles((group) => {
				expect('#ff6868').to.equal(
					group?.elements?.button?.color?.text
				);
				expect({
					blockeraFontColor: '#ff6868',
				}).to.deep.equal(getInnerAttrs(group, 'core/button'));
			});
		});

		it('imports button background color from theme.json', () => {
			withGroupGlobalStyles((group) => {
				expect('#ffcaca').to.equal(
					group?.elements?.button?.color?.background
				);
				expect({
					blockeraBackgroundColor: '#ffcaca',
				}).to.deep.equal(getInnerAttrs(group, 'core/button'));
			});
		});

		it('syncs link colors from blockera to theme.json elements', () => {
			setInnerBlock('elements/link');
			setBlockState('Normal');
			cy.setColorControlValue('Text Color', '666666');
			setBlockState('Hover');
			cy.setColorControlValue('Text Color', '888888');

			getWPDataObject().then((data) => {
				const group = getGroupGlobalStyles(data);
				const link = group?.elements?.link;

				expect('#666666').to.equal(link?.color?.text);
				expect('#888888').to.equal(link?.[':hover']?.color?.text);
			});
		});

		it('syncs button text color from blockera to theme.json elements', () => {
			setInnerBlock('core/button');
			cy.setColorControlValue('Text Color', '445566');

			getWPDataObject().then((data) => {
				const group = getGroupGlobalStyles(data);

				expect('#445566').to.equal(
					group?.elements?.button?.color?.text
				);
			});
		});
	});

	describe('typography (registry)', () => {
		it('imports button typography core properties from theme.json', () => {
			withGroupGlobalStyles((group) => {
				const typography = group?.elements?.button?.typography;
				const inner = getInnerAttrs(group, 'core/button');

				expect('18px').to.equal(typography?.fontSize);
				expect('1.6').to.equal(typography?.lineHeight);
				expect('center').to.equal(typography?.textAlign);
				expect(inner?.blockeraFontSize).to.not.equal(undefined);
				expect(inner?.blockeraLineHeight).to.not.equal(undefined);
				expect(inner?.blockeraTextAlign).to.equal('center');
			});
		});

		it('imports button typography extra properties from theme.json', () => {
			withGroupGlobalStyles((group) => {
				const typography = group?.elements?.button?.typography;
				const inner = getInnerAttrs(group, 'core/button');

				expect('0.05em').to.equal(typography?.letterSpacing);
				expect('uppercase').to.equal(typography?.textTransform);
				expect('700').to.equal(typography?.fontWeight);
				expect(inner?.blockeraLetterSpacing).to.not.equal(undefined);
				expect(inner?.blockeraTextTransform).to.not.equal(undefined);
				expect(inner?.blockeraFontAppearance).to.not.equal(undefined);
			});
		});

		it('imports link text decoration and hover from theme.json', () => {
			withGroupGlobalStyles((group) => {
				const link = group?.elements?.link;

				expect('underline').to.equal(link?.typography?.textDecoration);
				expect('none').to.equal(
					link?.[':hover']?.typography?.textDecoration
				);
				expect(
					getInnerAttrs(group, 'elements/link')
						?.blockeraTextDecoration
				).to.not.equal(undefined);
			});
		});
	});

	describe('border (registry)', () => {
		it('imports partial button border facets from theme.json', () => {
			withGroupGlobalStyles((group) => {
				const border = group?.elements?.button?.border;
				const innerBorder = getInnerAttrs(
					group,
					'core/button'
				)?.blockeraBorder;

				expect('currentColor').to.equal(border?.color);
				expect('1px').to.equal(border?.width);
				expect(innerBorder?.type).to.equal('all');
				expect(innerBorder?.all?.width).to.equal('1px');
			});
		});

		it('imports button border radius from theme.json', () => {
			withGroupGlobalStyles((group) => {
				expect('12px').to.equal(
					group?.elements?.button?.border?.radius
				);
				expect(
					getInnerAttrs(group, 'core/button')?.blockeraBorderRadius
				).to.equal('12px');
			});
		});
	});

	describe('spacing (registry)', () => {
		it('imports button spacing from theme.json', () => {
			withGroupGlobalStyles((group) => {
				const spacing = group?.elements?.button?.spacing;
				const inner = getInnerAttrs(group, 'core/button');

				expect('8px').to.equal(spacing?.padding?.top);
				expect('16px').to.equal(spacing?.blockGap);
				expect(inner?.blockeraSpacing).to.not.equal(undefined);
				expect(inner?.blockeraGap).to.equal('16px');
			});
		});
	});

	describe('shadow (registry)', () => {
		it('imports button shadow from theme.json', () => {
			withGroupGlobalStyles((group) => {
				expect('var(--wp--preset--shadow--natural)').to.equal(
					group?.elements?.button?.shadow
				);
				expect(
					getInnerAttrs(group, 'core/button')?.blockeraBoxShadow
				).to.not.equal(undefined);
			});
		});
	});

	describe('dimensions (registry)', () => {
		it('imports button dimensions from theme.json', () => {
			withGroupGlobalStyles((group) => {
				const dimensions = group?.elements?.button?.dimensions;
				const inner = getInnerAttrs(group, 'core/button');

				expect('48px').to.equal(dimensions?.minHeight);
				expect('16/9').to.equal(dimensions?.aspectRatio);
				expect(inner?.blockeraMinHeight?.value).to.equal('48px');
				expect(inner?.blockeraRatio?.value?.val).to.not.equal(
					undefined
				);
			});
		});
	});

	describe(':hover pseudo (registry + blockeraBlockStates)', () => {
		it('imports button hover typography from theme.json', () => {
			withGroupGlobalStyles((group) => {
				expect('20px').to.equal(
					group?.elements?.button?.[':hover']?.typography?.fontSize
				);
				expect(
					getInnerAttrs(group, 'core/button')?.blockeraBlockStates
						?.hover?.breakpoints?.desktop?.attributes
						?.blockeraFontSize
				).to.not.equal(undefined);
			});
		});

		it('imports button hover border from theme.json', () => {
			withGroupGlobalStyles((group) => {
				const hoverBorder = getInnerAttrs(group, 'core/button')
					?.blockeraBlockStates?.hover?.breakpoints?.desktop
					?.attributes?.blockeraBorder;

				expect('#ff0000').to.equal(
					group?.elements?.button?.[':hover']?.border?.color
				);
				expect(hoverBorder?.all?.width).to.equal('3px');
			});
		});
	});
});
