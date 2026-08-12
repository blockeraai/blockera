/**
 * Internal dependencies
 */
import {
	clickCoreExitPatternButton,
	isBlockWithinEditedContentOnlySection,
	isContentOnlySectionContainerBlock,
	isContentOnlyTemplatePartSectionBlock,
	isCoreExitPatternEditModeVisible,
	isPatternSectionBlock,
	shouldDeferBlockInspectorCardPortal,
} from '../../../packages/global-packages/packages/editor/js/extensions/libs/block-card/helpers/pattern-edit-section';

const mockStopEditingContentOnlySection = jest.fn(() => true);
const mockGetCurrentPostType = jest.fn(() => 'post');

jest.mock(
	'../../../packages/global-packages/packages/editor/js/utils/block-editor-private-apis',
	() => ({
		stopEditingContentOnlySection: (...args) =>
			mockStopEditingContentOnlySection(...args),
	})
);

jest.mock('@wordpress/blocks', () => ({
	isReusableBlock: (block) => block?.name === 'core/block',
}));

jest.mock('@wordpress/data', () => ({
	select: jest.fn(() => ({
		getCurrentPostType: (...args) => mockGetCurrentPostType(...args),
	})),
}));

jest.mock('@wordpress/editor', () => ({
	store: 'core/editor',
}));

describe('pattern-edit-section coverage gaps', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockGetCurrentPostType.mockReturnValue('post');
		document.body.innerHTML = '';
	});

	describe('isContentOnlyTemplatePartSectionBlock', () => {
		it('returns true only for content-only template parts', () => {
			expect(
				isContentOnlyTemplatePartSectionBlock({
					name: 'core/template-part',
					attributes: { templateLock: 'contentOnly' },
				})
			).toBe(true);
		});

		it('returns false for unlocked template parts and missing blocks', () => {
			expect(
				isContentOnlyTemplatePartSectionBlock({
					name: 'core/template-part',
					attributes: {},
				})
			).toBe(false);
			expect(isContentOnlyTemplatePartSectionBlock(null)).toBe(false);
			expect(
				isContentOnlyTemplatePartSectionBlock({
					name: 'core/group',
					attributes: { templateLock: 'contentOnly' },
				})
			).toBe(false);
		});
	});

	describe('isContentOnlySectionContainerBlock', () => {
		it('treats synced patterns and content-only template parts as containers', () => {
			expect(
				isContentOnlySectionContainerBlock({ name: 'core/block' })
			).toBe(true);
			expect(
				isContentOnlySectionContainerBlock({
					name: 'core/template-part',
					attributes: { templateLock: 'contentOnly' },
				})
			).toBe(true);
		});

		it('returns false for ordinary blocks', () => {
			expect(
				isContentOnlySectionContainerBlock({
					name: 'core/paragraph',
					attributes: {},
				})
			).toBe(false);
		});
	});

	describe('isBlockWithinEditedContentOnlySection', () => {
		it('returns false when client id or edited section is missing', () => {
			expect(
				isBlockWithinEditedContentOnlySection('', 'section', jest.fn())
			).toBe(false);
			expect(
				isBlockWithinEditedContentOnlySection('child', '', jest.fn())
			).toBe(false);
		});
	});

	describe('shouldDeferBlockInspectorCardPortal', () => {
		it('defers when the selected client id is empty', () => {
			expect(
				shouldDeferBlockInspectorCardPortal('', {
					getBlock: jest.fn(),
					getBlockParents: jest.fn(),
				})
			).toBe(true);
		});

		it('does not defer while editing a template part document', () => {
			mockGetCurrentPostType.mockReturnValue('wp_template_part');

			expect(
				shouldDeferBlockInspectorCardPortal('child', {
					getBlock: () => ({ name: 'core/block' }),
					getBlockParents: () => ['pattern'],
					getEditedContentOnlySection: () => null,
				})
			).toBe(false);
		});

		it('defers for a selected content-only template part outside edit mode', () => {
			expect(
				shouldDeferBlockInspectorCardPortal('part', {
					getBlock: () => ({
						name: 'core/template-part',
						attributes: { templateLock: 'contentOnly' },
					}),
					getBlockParents: () => [],
					getEditedContentOnlySection: () => null,
				})
			).toBe(true);
		});
	});

	describe('core exit pattern controls', () => {
		it('detects and clicks the inspector exit button', () => {
			const button = document.createElement('button');
			button.className =
				'block-editor-block-inspector-edit-contents__button';
			button.textContent = 'Exit section';
			button.click = jest.fn();
			document.body.appendChild(button);

			expect(isCoreExitPatternEditModeVisible((text) => text)).toBe(true);
			expect(clickCoreExitPatternButton((text) => text)).toBe(true);
			expect(button.click).toHaveBeenCalledTimes(1);
		});

		it('returns false when the exit control is absent', () => {
			expect(isCoreExitPatternEditModeVisible((text) => text)).toBe(
				false
			);
			expect(clickCoreExitPatternButton((text) => text)).toBe(false);
		});
	});

	describe('isPatternSectionBlock', () => {
		it('returns false for a missing block', () => {
			expect(isPatternSectionBlock(null)).toBe(false);
			expect(isPatternSectionBlock(undefined)).toBe(false);
		});
	});
});
