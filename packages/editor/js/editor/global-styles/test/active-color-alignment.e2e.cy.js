/**
 * E2E: active-color CSS variables stay aligned between StateContainer scopes and
 * portaled popovers (states inserter, variation pickers) in global styles vs inspector.
 */
import 'cypress-real-events';

import {
	GLOBAL_STYLES_SIZE_SURFACE_VAR,
	GLOBAL_STYLES_STYLE_SURFACE_VAR,
	HOVER_STATE_COLOR,
	INNER_BLOCK_NORMAL_COLOR,
	INSPECTOR_MASTER_NORMAL_COLOR,
	STATE_COLORS_CONTAINER,
	assertContainerActiveTabColor,
	assertLastScopedStateContainerColor,
	assertLastScopedStateContainerMatchesPopover,
	assertStatesInserterPopoverMatchesContainer,
	openGlobalStylesButtonDualSurfaces,
	openGlobalStylesParagraphBlockPanel,
	openInspectorParagraphWithLinkBlock,
	setBlockState,
	setInnerBlock,
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
				assertContainerActiveTabColor(
					STATE_COLORS_CONTAINER,
					GLOBAL_STYLES_STYLE_SURFACE_VAR
				);
				assertStatesInserterPopoverMatchesContainer(
					STATE_COLORS_CONTAINER
				);
			});

			it('uses hover state color on master state container and states inserter popover', () => {
				setBlockState('Hover');

				assertContainerActiveTabColor(
					STATE_COLORS_CONTAINER,
					HOVER_STATE_COLOR
				);
				assertStatesInserterPopoverMatchesContainer(
					STATE_COLORS_CONTAINER
				);
			});

			it('uses inner-block normal color on container and states inserter popover', () => {
				setInnerBlock('elements/link');

				assertContainerActiveTabColor(
					STATE_COLORS_CONTAINER,
					INNER_BLOCK_NORMAL_COLOR
				);
				assertStatesInserterPopoverMatchesContainer(
					STATE_COLORS_CONTAINER
				);
			});

			it('uses hover state color while inner block is selected', () => {
				setInnerBlock('elements/link');
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

		describe('core/button — style and size variation surfaces', () => {
			beforeEach(() => {
				openGlobalStylesButtonDualSurfaces();
			});

			it('style surface: variation picker popover matches state container active color', () => {
				withinStyleVariationsPanel(() => {
					assertLastScopedStateContainerColor(
						GLOBAL_STYLES_STYLE_SURFACE_VAR
					);

					cy.get('[data-test="style-variations-button"]')
						.not('.is-variation-ui-size')
						.first()
						.click({ force: true });

					assertLastScopedStateContainerMatchesPopover(
						'.blockera-component-popover.variations-picker-popover.is-variation-ui-style'
					);

					cy.realPress('Escape');
				});
			});

			it('size surface: variation picker popover matches state container active color', () => {
				withinSizeVariationsPanel(() => {
					assertLastScopedStateContainerColor(
						GLOBAL_STYLES_SIZE_SURFACE_VAR
					);

					cy.get(
						'[data-test="style-variations-button"].is-variation-ui-size'
					)
						.first()
						.click({ force: true });

					assertLastScopedStateContainerMatchesPopover(
						'.blockera-component-popover.variations-picker-popover.is-variation-ui-size'
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
			assertContainerActiveTabColor(
				STATE_COLORS_CONTAINER,
				INSPECTOR_MASTER_NORMAL_COLOR
			);
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
