/**
 * E2E: active-color CSS variables stay aligned between StateContainer scopes and
 * portaled popovers (states inserter, variation pickers) in global styles vs inspector.
 */
import 'cypress-real-events';

import {
	HOVER_STATE_COLOR,
	INNER_BLOCK_NORMAL_COLOR,
	STATE_COLORS_CONTAINER,
	assertContainerActiveTabColor,
	assertLastScopedStateContainerColor,
	assertLastScopedStateContainerMatchesPopover,
	assertLastStyleColumnStateContainerColor,
	assertLastStyleColumnStateContainerMatchesPopover,
	assertStatesInserterPopoverMatchesContainer,
	openGlobalStylesButtonDualSurfaces,
	openGlobalStylesParagraphBlockPanel,
	openInspectorParagraphWithLinkBlock,
	openSizeVariationContextMenuInGlobalStyles,
	openStyleVariationContextMenuInGlobalStyles,
	setBlockState,
	setInnerBlock,
	SIZE_VARIATION_SETTINGS_POPOVER,
	STYLE_VARIATION_SETTINGS_POPOVER,
	withinSizeVariationsPanel,
	withinStyleVariationsPanel,
} from './active-color-alignment.helpers';

describe('Active color alignment (StateContainer ↔ popovers)', () => {
	describe('Global Styles panel — insideBlockInspector is false', () => {
		describe('core/paragraph — block states and inner blocks', () => {
			beforeEach(() => {
				openGlobalStylesParagraphBlockPanel();
			});

			it('uses style-surface variation color on master normal state and states inserter popover', () => {
				cy.getByDataTest('style-text-subtitle').click();

				assertContainerActiveTabColor(
					STATE_COLORS_CONTAINER,
					'#1ca120'
				);
				assertStatesInserterPopoverMatchesContainer(
					STATE_COLORS_CONTAINER
				);
			});

			it('uses hover state color on master state container and states inserter popover', () => {
				cy.getByDataTest('style-text-subtitle').click();
				setBlockState('Hover');

				assertContainerActiveTabColor(
					STATE_COLORS_CONTAINER,
					HOVER_STATE_COLOR
				);
				assertStatesInserterPopoverMatchesContainer(
					'.blockera-states-picker-popover'
				);
			});

			it('uses inner-block normal color on container and states inserter popover', () => {
				cy.getByDataTest('style-text-subtitle').click();
				setInnerBlock('elements/link');

				assertContainerActiveTabColor(
					STATE_COLORS_CONTAINER,
					INNER_BLOCK_NORMAL_COLOR
				);
				assertStatesInserterPopoverMatchesContainer(
					'.blockera-states-picker-popover'
				);
			});

			it('uses hover state color while inner block is selected', () => {
				cy.getByDataTest('style-text-subtitle').click();
				setInnerBlock('elements/link');
				setBlockState('Hover');

				assertContainerActiveTabColor(
					STATE_COLORS_CONTAINER,
					HOVER_STATE_COLOR
				);
				assertStatesInserterPopoverMatchesContainer(
					'.blockera-states-picker-popover'
				);
			});
		});

		describe('core/button — style and size variation surfaces', () => {
			beforeEach(() => {
				openGlobalStylesButtonDualSurfaces();
			});

			it('style surface: variation settings popover matches state container active color', () => {
				withinStyleVariationsPanel(() => {
					openStyleVariationContextMenuInGlobalStyles('fill');

					assertLastStyleColumnStateContainerColor('#1ca120');

					assertLastStyleColumnStateContainerMatchesPopover(
						STYLE_VARIATION_SETTINGS_POPOVER
					);

					cy.realPress('Escape');
				});
			});

			it('size surface: variation settings popover matches state container active color', () => {
				cy.get('.blockera-global-styles-panel-aside').within(() => {
					assertLastScopedStateContainerColor('#7e00ff');

					openSizeVariationContextMenuInGlobalStyles(
						'e2e-size-small'
					);

					assertLastScopedStateContainerMatchesPopover(
						SIZE_VARIATION_SETTINGS_POPOVER
					);

					cy.realPress('Escape');
				});
			});

			it('size surface: hover state uses states accent on container and states inserter popover', () => {
				withinSizeVariationsPanel(() => {
					setBlockState('Hover');

					assertContainerActiveTabColor(
						STATE_COLORS_CONTAINER,
						HOVER_STATE_COLOR
					);
					assertStatesInserterPopoverMatchesContainer(
						STATE_COLORS_CONTAINER
					);
				});
			});
		});
	});

	describe('Block editor inspector — insideBlockInspector is true', () => {
		beforeEach(() => {
			openInspectorParagraphWithLinkBlock();
		});

		it('uses WordPress normal state color on master block container and states inserter popover', () => {
			assertContainerActiveTabColor(STATE_COLORS_CONTAINER, '#cc0000');
			assertStatesInserterPopoverMatchesContainer(STATE_COLORS_CONTAINER);
		});

		it('uses hover state color on master block container and states inserter popover', () => {
			setBlockState('Hover');

			assertContainerActiveTabColor(
				STATE_COLORS_CONTAINER,
				HOVER_STATE_COLOR
			);
			assertStatesInserterPopoverMatchesContainer(STATE_COLORS_CONTAINER);
		});

		it('uses inner-block normal color on container and states inserter popover', () => {
			setInnerBlock('elements/link');

			assertContainerActiveTabColor(
				STATE_COLORS_CONTAINER,
				INNER_BLOCK_NORMAL_COLOR
			);
			assertStatesInserterPopoverMatchesContainer(STATE_COLORS_CONTAINER);
		});

		it('uses hover state color while inner block is selected in the inspector', () => {
			setInnerBlock('elements/link');
			setBlockState('Hover');

			assertContainerActiveTabColor(
				STATE_COLORS_CONTAINER,
				HOVER_STATE_COLOR
			);
			assertStatesInserterPopoverMatchesContainer(STATE_COLORS_CONTAINER);
		});
	});
});
