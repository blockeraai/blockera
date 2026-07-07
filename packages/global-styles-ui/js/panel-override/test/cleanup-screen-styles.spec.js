/**
 * @jest-environment jsdom
 */

import {
	BLOCKERA_CLEANUP_SCREEN_STYLES_CLASS,
	BLOCKERA_FONT_SIZE_PRESET_INSPECTOR_ACTIVE_CLASS,
	disablePresetInspectorCleanup,
	enablePresetInspectorCleanup,
	markPresetInspectorActive,
} from '../cleanup-screen-styles';

describe('cleanup-screen-styles', () => {
	beforeEach(() => {
		document.body.className = '';
		document.body.innerHTML = '';
	});

	it('enablePresetInspectorCleanup adds body cleanup class from click event', () => {
		document.body.innerHTML = `
			<div class="navigator-screen">
				<div class="blockera-block-inspector-controls-wrapper">
					<button type="button">Open</button>
				</div>
			</div>
		`;

		const button = document.querySelector('button');

		enablePresetInspectorCleanup(
			BLOCKERA_FONT_SIZE_PRESET_INSPECTOR_ACTIVE_CLASS,
			{ target: button }
		);

		expect(
			document.body.classList.contains(
				BLOCKERA_CLEANUP_SCREEN_STYLES_CLASS
			)
		).toBe(true);
		expect(
			document
				.querySelector('.navigator-screen')
				?.classList.contains(
					BLOCKERA_FONT_SIZE_PRESET_INSPECTOR_ACTIVE_CLASS
				)
		).toBe(true);
	});

	it('markPresetInspectorActive marks the direct parent of matched content', () => {
		document.body.innerHTML = `
			<div class="mount-target">
				<div class="blockera-shadows-panel">Shadows</div>
			</div>
		`;

		markPresetInspectorActive(
			'blockera-shadows-preset-inspector-active',
			undefined,
			'.blockera-shadows-panel'
		);

		expect(
			document
				.querySelector('.mount-target')
				?.classList.contains('blockera-shadows-preset-inspector-active')
		).toBe(true);
	});

	it('disablePresetInspectorCleanup removes body and inspector classes', () => {
		document.body.classList.add(BLOCKERA_CLEANUP_SCREEN_STYLES_CLASS);
		document.body.innerHTML = `
			<div class="${BLOCKERA_FONT_SIZE_PRESET_INSPECTOR_ACTIVE_CLASS}"></div>
		`;

		disablePresetInspectorCleanup(
			BLOCKERA_FONT_SIZE_PRESET_INSPECTOR_ACTIVE_CLASS
		);

		expect(
			document.body.classList.contains(
				BLOCKERA_CLEANUP_SCREEN_STYLES_CLASS
			)
		).toBe(false);
		expect(
			document.querySelector(
				`.${BLOCKERA_FONT_SIZE_PRESET_INSPECTOR_ACTIVE_CLASS}`
			)
		).toBeNull();
	});
});
