/**
 * Internal dependencies
 */
import {
	findPatternSectionClientId,
	isBlockWithinEditedContentOnlySection,
	isPatternSectionBlock,
	shouldDeferBlockInspectorCardPortal,
	stopPatternContentOnlyEdit,
} from '../pattern-edit-section';

const mockStopEditingContentOnlySection = jest.fn(() => true);

jest.mock('../../../../../utils/block-editor-private-apis', () => ({
	stopEditingContentOnlySection: (...args) =>
		mockStopEditingContentOnlySection(...args),
}));

jest.mock('@wordpress/blocks', () => ({
	isReusableBlock: (block) => block?.name === 'core/block',
}));

jest.mock('@wordpress/data', () => ({
	select: jest.fn(() => ({
		getCurrentPostType: jest.fn(() => 'post'),
	})),
}));

jest.mock('@wordpress/editor', () => ({
	store: 'core/editor',
}));

describe('pattern-edit-section helpers', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockStopEditingContentOnlySection.mockReturnValue(true);
	});

	describe('isPatternSectionBlock', () => {
		it('returns true for reusable / synced pattern blocks', () => {
			expect(isPatternSectionBlock({ name: 'core/block' })).toBe(true);
		});

		it('returns true for contentOnly templateLock', () => {
			expect(
				isPatternSectionBlock({
					name: 'core/group',
					attributes: { templateLock: 'contentOnly' },
				})
			).toBe(true);
		});

		it('returns true when metadata.patternName is set', () => {
			expect(
				isPatternSectionBlock({
					name: 'core/group',
					attributes: { metadata: { patternName: 'my-pattern' } },
				})
			).toBe(true);
		});

		it('returns false for ordinary blocks', () => {
			expect(
				isPatternSectionBlock({
					name: 'core/paragraph',
					attributes: {},
				})
			).toBe(false);
		});
	});

	describe('findPatternSectionClientId', () => {
		it('returns nearest pattern ancestor client id', () => {
			const getBlockParents = jest.fn(() => ['root', 'pattern', 'group']);
			const getBlock = jest.fn((clientId) => {
				if (clientId === 'pattern') {
					return { name: 'core/block' };
				}

				return { name: 'core/group', attributes: {} };
			});

			expect(
				findPatternSectionClientId('child', getBlock, getBlockParents)
			).toBe('pattern');
		});

		it('returns null when no pattern ancestor exists', () => {
			const getBlockParents = jest.fn(() => ['root', 'group']);
			const getBlock = jest.fn(() => ({
				name: 'core/group',
				attributes: {},
			}));

			expect(
				findPatternSectionClientId('child', getBlock, getBlockParents)
			).toBeNull();
		});
	});

	describe('isBlockWithinEditedContentOnlySection', () => {
		it('returns true when client id matches edited section', () => {
			expect(
				isBlockWithinEditedContentOnlySection(
					'section',
					'section',
					jest.fn()
				)
			).toBe(true);
		});

		it('returns true when section is among parents', () => {
			const getBlockParents = jest.fn(() => ['section', 'group']);

			expect(
				isBlockWithinEditedContentOnlySection(
					'child',
					'section',
					getBlockParents
				)
			).toBe(true);
		});
	});

	describe('shouldDeferBlockInspectorCardPortal', () => {
		const getBlock = jest.fn((clientId) => {
			if (clientId === 'pattern') {
				return { name: 'core/block' };
			}

			return { name: 'core/paragraph', attributes: {} };
		});
		const getBlockParents = jest.fn(() => ['pattern']);

		it('does not defer while editing inside the content-only section', () => {
			const defer = shouldDeferBlockInspectorCardPortal('child', {
				getBlock,
				getBlockParents,
				getEditedContentOnlySection: () => 'pattern',
			});

			expect(defer).toBe(false);
		});

		it('defers when a pattern ancestor exists and edit mode is inactive', () => {
			const defer = shouldDeferBlockInspectorCardPortal('child', {
				getBlock,
				getBlockParents,
				getEditedContentOnlySection: () => null,
			});

			expect(defer).toBe(true);
		});

		it('does not defer for ordinary blocks outside patterns', () => {
			const defer = shouldDeferBlockInspectorCardPortal('plain', {
				getBlock: () => ({ name: 'core/paragraph', attributes: {} }),
				getBlockParents: () => [],
				getEditedContentOnlySection: () => null,
			});

			expect(defer).toBe(false);
		});
	});

	describe('stopPatternContentOnlyEdit', () => {
		it('uses private stopEditingContentOnlySection when available', () => {
			expect(stopPatternContentOnlyEdit((text) => text)).toBe(true);
			expect(mockStopEditingContentOnlySection).toHaveBeenCalledTimes(1);
		});

		it('falls back to DOM exit button when private action is unavailable', () => {
			mockStopEditingContentOnlySection.mockReturnValue(false);

			const button = document.createElement('button');
			button.className =
				'block-editor-block-inspector-edit-contents__button';
			button.textContent = 'Exit pattern';
			button.click = jest.fn();
			document.body.appendChild(button);

			expect(stopPatternContentOnlyEdit((text) => text)).toBe(true);
			expect(button.click).toHaveBeenCalledTimes(1);

			document.body.removeChild(button);
		});
	});
});
