import { getNormalizedSelector } from '../get-compatible-block-css-selector';

// Mock extensions/components/utils to avoid loading editor/header-ui chain
// (which pulls in @wordpress/rich-text and causes combineReducers issues).
jest.mock('../../extensions/components/utils', () => ({
	isInnerBlock: (block) => block !== 'master',
	isNormalState: (state) => state === 'normal',
}));

// Mock getState for getNormalizedSelector's internal use
jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn().mockImplementation((store) => {
			if (store === 'blockera/editor') {
				return {
					getState: jest.fn().mockImplementation(() => ({
						settings: { hasContent: false },
					})),
					getInnerState: jest.fn().mockImplementation(() => ({
						settings: { hasContent: false },
					})),
				};
			}
			return {};
		}),
	};
});

describe('getNormalizedSelector', () => {
	const rootSelector = '.my-root';
	const suffixClass = '.modified';
	const customizedPseudoClasses = [
		'parent-class',
		'custom-class',
		'parent-hover',
	];

	const getInnerState = jest.fn();
	const getMasterState = jest.fn();

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('should return the correct selector when state is normal', () => {
		const state = 'normal';
		getInnerState.mockReturnValue('normal');
		getMasterState.mockReturnValue('normal');

		const result = getNormalizedSelector('.my-element', {
			state,
			suffixClass,
			rootSelector,
			getInnerState,
			getMasterState,
			customizedPseudoClasses,
		});

		expect(result).toBe('.my-element.modified');
	});

	test('should handle non-normal state with master state not normal and fromInnerBlock=true', () => {
		const state = 'hover';
		const masterState = 'active';
		getInnerState.mockReturnValue('hover');
		getMasterState.mockReturnValue('active');

		const result = getNormalizedSelector('.my-element', {
			state,
			suffixClass,
			masterState,
			rootSelector,
			getInnerState,
			getMasterState,
			fromInnerBlock: true,
			customizedPseudoClasses,
		});

		expect(result).toBe(
			'.my-root:active .my-element.modified:hover, .my-root .my-element.modified'
		);
	});

	test('should handle customized pseudo-classes', () => {
		const state = 'custom-class';
		getInnerState.mockReturnValue('normal');
		getMasterState.mockReturnValue('normal');

		const result = getNormalizedSelector('.my-element', {
			state,
			suffixClass,
			rootSelector,
			getInnerState,
			getMasterState,
			customizedPseudoClasses,
		});

		// Should return the original selector without modifications
		expect(result).toBe('.my-element');
	});

	test('should handle multiple selectors', () => {
		const state = 'hover';
		getInnerState.mockReturnValue('normal');
		getMasterState.mockReturnValue('normal');

		const result = getNormalizedSelector('.my-element, .another-element', {
			state,
			suffixClass,
			rootSelector,
			getInnerState,
			getMasterState,
			customizedPseudoClasses,
		});

		expect(result).toBe(
			'.my-element.modified:hover, .another-element.modified:hover'
		);
	});

	test('should handle when inner state matches state', () => {
		const state = 'hover';
		getInnerState.mockReturnValue('hover');
		getMasterState.mockReturnValue('normal');

		const result = getNormalizedSelector('.my-element', {
			state,
			suffixClass,
			rootSelector,
			getInnerState,
			getMasterState,
			fromInnerBlock: true,
			masterState: 'normal',
			customizedPseudoClasses,
		});

		expect(result).toBe(
			'.my-root .my-element.modified:hover, .my-root .my-element.modified'
		);
	});

	test('should return unmodified selector when state is a customized pseudo-class', () => {
		const state = 'parent-hover';
		getInnerState.mockReturnValue('normal');
		getMasterState.mockReturnValue('normal');

		const result = getNormalizedSelector('.my-element', {
			state,
			suffixClass,
			rootSelector,
			getInnerState,
			getMasterState,
			customizedPseudoClasses,
		});

		expect(result).toBe('.my-element');
	});

	test('should handle empty selector gracefully', () => {
		const state = 'hover';
		getInnerState.mockReturnValue('hover');
		getMasterState.mockReturnValue('normal');

		const result = getNormalizedSelector('', {
			state,
			suffixClass,
			rootSelector,
			getInnerState,
			getMasterState,
			customizedPseudoClasses,
		});

		expect(result).toBe('');
	});

	test('should handle selector with :where() containing single selector', () => {
		const state = 'normal';
		getInnerState.mockReturnValue('normal');
		getMasterState.mockReturnValue('normal');

		const result = getNormalizedSelector('.my-element:where(.test-1)', {
			state,
			suffixClass,
			rootSelector,
			getInnerState,
			getMasterState,
			customizedPseudoClasses,
		});

		expect(result).toBe('.my-element:where(.test-1).modified');
	});

	test('should handle selector with :where() containing multiple selectors', () => {
		const state = 'normal';
		getInnerState.mockReturnValue('normal');
		getMasterState.mockReturnValue('normal');

		const result = getNormalizedSelector(
			'.my-element:where(.test-1,.test-2)',
			{
				state,
				suffixClass,
				rootSelector,
				getInnerState,
				getMasterState,
				customizedPseudoClasses,
			}
		);

		expect(result).toBe('.my-element:where(.test-1,.test-2).modified');
	});

	test('should handle selector with :is() containing single selector', () => {
		const state = 'normal';
		getInnerState.mockReturnValue('normal');
		getMasterState.mockReturnValue('normal');

		const result = getNormalizedSelector('.my-element:is(.test-1)', {
			state,
			suffixClass,
			rootSelector,
			getInnerState,
			getMasterState,
			customizedPseudoClasses,
		});

		expect(result).toBe('.my-element:is(.test-1).modified');
	});

	test('should handle selector with :is() containing multiple selectors', () => {
		const state = 'normal';
		getInnerState.mockReturnValue('normal');
		getMasterState.mockReturnValue('normal');

		const result = getNormalizedSelector(
			'.my-element:is(.test-1,.test-2,.test-3)',
			{
				state,
				suffixClass,
				rootSelector,
				getInnerState,
				getMasterState,
				customizedPseudoClasses,
			}
		);

		expect(result).toBe('.my-element:is(.test-1,.test-2,.test-3).modified');
	});

	test('should handle multiple selectors with :where() and :is()', () => {
		const state = 'normal';
		getInnerState.mockReturnValue('normal');
		getMasterState.mockReturnValue('normal');

		const result = getNormalizedSelector(
			'.my-element:where(.test-1), .another-element:is(.test-2)',
			{
				state,
				suffixClass,
				rootSelector,
				getInnerState,
				getMasterState,
				customizedPseudoClasses,
			}
		);

		expect(result).toBe(
			'.my-element:where(.test-1).modified, .another-element:is(.test-2).modified'
		);
	});

	test('should handle selector with :where() containing nested selectors', () => {
		const state = 'normal';
		getInnerState.mockReturnValue('normal');
		getMasterState.mockReturnValue('normal');

		const result = getNormalizedSelector(
			'.my-element:where(.test-1 > .child, .test-2:hover)',
			{
				state,
				suffixClass,
				rootSelector,
				getInnerState,
				getMasterState,
				customizedPseudoClasses,
			}
		);

		expect(result).toBe(
			'.my-element:where(.test-1 > .child, .test-2:hover).modified'
		);
	});

	test('should handle selector with :is() containing complex selectors', () => {
		const state = 'normal';
		getInnerState.mockReturnValue('normal');
		getMasterState.mockReturnValue('normal');

		const result = getNormalizedSelector(
			'.my-element:is(.test-1, .test-2::before, .test-3:hover)',
			{
				state,
				suffixClass,
				rootSelector,
				getInnerState,
				getMasterState,
				customizedPseudoClasses,
			}
		);

		expect(result).toBe(
			'.my-element:is(.test-1, .test-2::before, .test-3:hover).modified'
		);
	});

	test('should handle selector with :where() in hover state', () => {
		const state = 'hover';
		getInnerState.mockReturnValue('normal');
		getMasterState.mockReturnValue('normal');

		const result = getNormalizedSelector(
			'.my-element:where(.test-1,.test-2)',
			{
				state,
				suffixClass,
				rootSelector,
				getInnerState,
				getMasterState,
				customizedPseudoClasses,
			}
		);

		expect(result).toBe(
			'.my-element:where(.test-1,.test-2).modified:hover'
		);
	});

	test('should handle selector with :is() in hover state', () => {
		const state = 'hover';
		getInnerState.mockReturnValue('normal');
		getMasterState.mockReturnValue('normal');

		const result = getNormalizedSelector(
			'.my-element:is(.test-1,.test-2)',
			{
				state,
				suffixClass,
				rootSelector,
				getInnerState,
				getMasterState,
				customizedPseudoClasses,
			}
		);

		expect(result).toBe('.my-element:is(.test-1,.test-2).modified:hover');
	});

	test('should handle multiple selectors with :where() and :is() in hover state', () => {
		const state = 'hover';
		getInnerState.mockReturnValue('normal');
		getMasterState.mockReturnValue('normal');

		const result = getNormalizedSelector(
			'.my-element:where(.test-1), .another-element:is(.test-2,.test-3)',
			{
				state,
				suffixClass,
				rootSelector,
				getInnerState,
				getMasterState,
				customizedPseudoClasses,
			}
		);

		expect(result).toBe(
			'.my-element:where(.test-1).modified:hover, .another-element:is(.test-2,.test-3).modified:hover'
		);
	});

	test('should handle mix of regular selector, :where(), and :is()', () => {
		const state = 'normal';
		getInnerState.mockReturnValue('normal');
		getMasterState.mockReturnValue('normal');

		const result = getNormalizedSelector(
			'.my-element, .test-1:where(.test-2,.test-3), .test-4:is(.test-5)',
			{
				state,
				suffixClass,
				rootSelector,
				getInnerState,
				getMasterState,
				customizedPseudoClasses,
			}
		);

		expect(result).toBe(
			'.my-element.modified, .test-1:where(.test-2,.test-3).modified, .test-4:is(.test-5).modified'
		);
	});

	test('should handle selector with attribute selector [data-id="test"]', () => {
		const state = 'normal';
		getInnerState.mockReturnValue('normal');
		getMasterState.mockReturnValue('normal');

		const result = getNormalizedSelector('.test[data-id="test"]', {
			state,
			suffixClass,
			rootSelector,
			getInnerState,
			getMasterState,
			customizedPseudoClasses,
		});

		expect(result).toBe('.test[data-id="test"].modified');
	});

	test('should handle selector with attribute selector [type="button"]', () => {
		const state = 'normal';
		getInnerState.mockReturnValue('normal');
		getMasterState.mockReturnValue('normal');

		const result = getNormalizedSelector('button[type="button"]', {
			state,
			suffixClass,
			rootSelector,
			getInnerState,
			getMasterState,
			customizedPseudoClasses,
		});

		expect(result).toBe('button[type="button"].modified');
	});

	test('should handle selector with attribute selector and :where()', () => {
		const state = 'normal';
		getInnerState.mockReturnValue('normal');
		getMasterState.mockReturnValue('normal');

		const result = getNormalizedSelector(
			'.test[data-id="test"]:where(.test-1,.test-2)',
			{
				state,
				suffixClass,
				rootSelector,
				getInnerState,
				getMasterState,
				customizedPseudoClasses,
			}
		);

		expect(result).toBe(
			'.test[data-id="test"]:where(.test-1,.test-2).modified'
		);
	});

	test('should handle selector with attribute selector and :is()', () => {
		const state = 'normal';
		getInnerState.mockReturnValue('normal');
		getMasterState.mockReturnValue('normal');

		const result = getNormalizedSelector(
			'.test[data-id="test"]:is(.test-1,.test-2)',
			{
				state,
				suffixClass,
				rootSelector,
				getInnerState,
				getMasterState,
				customizedPseudoClasses,
			}
		);

		expect(result).toBe(
			'.test[data-id="test"]:is(.test-1,.test-2).modified'
		);
	});

	test('should handle :where() containing attribute selectors', () => {
		const state = 'normal';
		getInnerState.mockReturnValue('normal');
		getMasterState.mockReturnValue('normal');

		const result = getNormalizedSelector(
			'.my-element:where(.test[data-id="test"], .another[type="button"])',
			{
				state,
				suffixClass,
				rootSelector,
				getInnerState,
				getMasterState,
				customizedPseudoClasses,
			}
		);

		expect(result).toBe(
			'.my-element:where(.test[data-id="test"], .another[type="button"]).modified'
		);
	});

	test('should handle :is() containing attribute selectors', () => {
		const state = 'normal';
		getInnerState.mockReturnValue('normal');
		getMasterState.mockReturnValue('normal');

		const result = getNormalizedSelector(
			'.my-element:is(.test[data-id="test"], .another[type="button"])',
			{
				state,
				suffixClass,
				rootSelector,
				getInnerState,
				getMasterState,
				customizedPseudoClasses,
			}
		);

		expect(result).toBe(
			'.my-element:is(.test[data-id="test"], .another[type="button"]).modified'
		);
	});

	test('should handle multiple selectors with attribute selectors', () => {
		const state = 'normal';
		getInnerState.mockReturnValue('normal');
		getMasterState.mockReturnValue('normal');

		const result = getNormalizedSelector(
			'.test[data-id="test"], .another[type="button"]',
			{
				state,
				suffixClass,
				rootSelector,
				getInnerState,
				getMasterState,
				customizedPseudoClasses,
			}
		);

		expect(result).toBe(
			'.test[data-id="test"].modified, .another[type="button"].modified'
		);
	});

	test('should handle selector with attribute selector in hover state', () => {
		const state = 'hover';
		getInnerState.mockReturnValue('normal');
		getMasterState.mockReturnValue('normal');

		const result = getNormalizedSelector('.test[data-id="test"]', {
			state,
			suffixClass,
			rootSelector,
			getInnerState,
			getMasterState,
			customizedPseudoClasses,
		});

		expect(result).toBe('.test[data-id="test"].modified:hover');
	});
});

describe("getNormalizedSelector - supports selectors starting with '&'", () => {
	const mockGetInnerState = jest.fn(() => 'normal');
	const mockGetMasterState = jest.fn(() => 'normal');

	const defaultOptions = {
		state: 'normal',
		suffixClass: '.modified',
		rootSelector: '.root',
		getInnerState: mockGetInnerState,
		getMasterState: mockGetMasterState,
		fromInnerBlock: false,
		customizedPseudoClasses: [
			'parent-class',
			'custom-class',
			'parent-hover',
		],
	};

	beforeEach(() => {
		mockGetInnerState.mockClear();
		mockGetMasterState.mockClear();
	});

	test('should replace "&" with rootSelector for "&::marker"', () => {
		const result = getNormalizedSelector('&::marker', defaultOptions);
		expect(result).toBe('.root::marker.modified');
	});

	test('should replace "&" with rootSelector for "&.test"', () => {
		const result = getNormalizedSelector('&.test', defaultOptions);
		expect(result).toBe('.root.test.modified');
	});

	test('should handle normal state without "&" prefix', () => {
		const result = getNormalizedSelector('.my-element', defaultOptions);
		expect(result).toBe('.my-element.modified');
	});

	test('should handle multiple selectors with "&" prefix', () => {
		const result = getNormalizedSelector(
			'&.test, &::before',
			defaultOptions
		);
		expect(result).toBe('.root.test.modified, .root::before.modified');
	});

	test('should not alter pseudo-classes from customizedPseudoClasses', () => {
		const options = {
			...defaultOptions,
			state: 'hover',
		};

		const result = getNormalizedSelector('&.test', options);
		expect(result).toBe('.root.test.modified:hover');
	});

	test('should handle empty selector gracefully', () => {
		const result = getNormalizedSelector('', defaultOptions);
		expect(result).toBe(''); // Handles empty string.
	});

	test('should handle multiple selectors with a mix of normal and & selectors', () => {
		const result = getNormalizedSelector(
			'.my-element, &.test',
			defaultOptions
		);
		expect(result).toBe('.my-element.modified, .root.test.modified');
	});

	test('should replace "&" with rootSelector for &:where() with single selector', () => {
		const result = getNormalizedSelector(
			'&:where(.test-1)',
			defaultOptions
		);
		expect(result).toBe('.root:where(.test-1).modified');
	});

	test('should replace "&" with rootSelector for &:where() with multiple selectors', () => {
		const result = getNormalizedSelector(
			'&:where(.test-1,.test-2)',
			defaultOptions
		);
		expect(result).toBe('.root:where(.test-1,.test-2).modified');
	});

	test('should replace "&" with rootSelector for &:is() with single selector', () => {
		const result = getNormalizedSelector('&:is(.test-1)', defaultOptions);
		expect(result).toBe('.root:is(.test-1).modified');
	});

	test('should replace "&" with rootSelector for &:is() with multiple selectors', () => {
		const result = getNormalizedSelector(
			'&:is(.test-1,.test-2,.test-3)',
			defaultOptions
		);
		expect(result).toBe('.root:is(.test-1,.test-2,.test-3).modified');
	});

	test('should replace "&" with rootSelector for &:where() with nested selectors', () => {
		const result = getNormalizedSelector(
			'&:where(.test-1 > .child, .test-2:hover)',
			defaultOptions
		);
		expect(result).toBe(
			'.root:where(.test-1 > .child, .test-2:hover).modified'
		);
	});

	test('should replace "&" with rootSelector for &:is() with complex selectors', () => {
		const result = getNormalizedSelector(
			'&:is(.test-1, .test-2::before, .test-3:hover)',
			defaultOptions
		);
		expect(result).toBe(
			'.root:is(.test-1, .test-2::before, .test-3:hover).modified'
		);
	});

	test('should handle multiple selectors with &:where() and &:is()', () => {
		const result = getNormalizedSelector(
			'&:where(.test-1), &:is(.test-2)',
			defaultOptions
		);
		expect(result).toBe(
			'.root:where(.test-1).modified, .root:is(.test-2).modified'
		);
	});

	test('should handle multiple selectors with &:where() containing multiple selectors', () => {
		const result = getNormalizedSelector(
			'&:where(.test-1,.test-2), &:where(.test-3,.test-4)',
			defaultOptions
		);
		expect(result).toBe(
			'.root:where(.test-1,.test-2).modified, .root:where(.test-3,.test-4).modified'
		);
	});

	test('should handle multiple selectors with &:is() containing multiple selectors', () => {
		const result = getNormalizedSelector(
			'&:is(.test-1,.test-2), &:is(.test-3,.test-4,.test-5)',
			defaultOptions
		);
		expect(result).toBe(
			'.root:is(.test-1,.test-2).modified, .root:is(.test-3,.test-4,.test-5).modified'
		);
	});

	test('should handle mix of regular selector, &:where(), and &:is()', () => {
		const result = getNormalizedSelector(
			'&.test, &:where(.test-1,.test-2), &:is(.test-3)',
			defaultOptions
		);
		expect(result).toBe(
			'.root.test.modified, .root:where(.test-1,.test-2).modified, .root:is(.test-3).modified'
		);
	});

	test('should handle multiple selectors with &:where() and &:is() with complex nested selectors', () => {
		const result = getNormalizedSelector(
			'&:where(.test-1 > .child, .test-2:hover), &:is(.test-3, .test-4::before)',
			defaultOptions
		);
		expect(result).toBe(
			'.root:where(.test-1 > .child, .test-2:hover).modified, .root:is(.test-3, .test-4::before).modified'
		);
	});

	test('should handle three selectors with &:where(), &:is(), and regular selector', () => {
		const result = getNormalizedSelector(
			'&:where(.test-1), &:is(.test-2), &.test-3',
			defaultOptions
		);
		expect(result).toBe(
			'.root:where(.test-1).modified, .root:is(.test-2).modified, .root.test-3.modified'
		);
	});

	test('should replace "&" with rootSelector for &[data-id="test"]', () => {
		const result = getNormalizedSelector(
			'&[data-id="test"]',
			defaultOptions
		);
		expect(result).toBe('.root[data-id="test"].modified');
	});

	test('should replace "&" with rootSelector for &.test[data-id="test"]', () => {
		const result = getNormalizedSelector(
			'&.test[data-id="test"]',
			defaultOptions
		);
		expect(result).toBe('.root.test[data-id="test"].modified');
	});

	test('should replace "&" with rootSelector for &[data-id="test"]:where(.test-1)', () => {
		const result = getNormalizedSelector(
			'&[data-id="test"]:where(.test-1)',
			defaultOptions
		);
		expect(result).toBe('.root[data-id="test"]:where(.test-1).modified');
	});

	test('should replace "&" with rootSelector for &[data-id="test"]:is(.test-1)', () => {
		const result = getNormalizedSelector(
			'&[data-id="test"]:is(.test-1)',
			defaultOptions
		);
		expect(result).toBe('.root[data-id="test"]:is(.test-1).modified');
	});

	test('should replace "&" with rootSelector for &:where(.test[data-id="test"])', () => {
		const result = getNormalizedSelector(
			'&:where(.test[data-id="test"], .another[type="button"])',
			defaultOptions
		);
		expect(result).toBe(
			'.root:where(.test[data-id="test"], .another[type="button"]).modified'
		);
	});

	test('should replace "&" with rootSelector for &:is(.test[data-id="test"])', () => {
		const result = getNormalizedSelector(
			'&:is(.test[data-id="test"], .another[type="button"])',
			defaultOptions
		);
		expect(result).toBe(
			'.root:is(.test[data-id="test"], .another[type="button"]).modified'
		);
	});

	test('should handle multiple selectors with & and attribute selectors', () => {
		const result = getNormalizedSelector(
			'&[data-id="test"], &[type="button"]',
			defaultOptions
		);
		expect(result).toBe(
			'.root[data-id="test"].modified, .root[type="button"].modified'
		);
	});

	test('should handle & with attribute selector in hover state', () => {
		const options = {
			...defaultOptions,
			state: 'hover',
		};

		const result = getNormalizedSelector('&[data-id="test"]', options);
		expect(result).toBe('.root[data-id="test"].modified:hover');
	});
});

describe("getNormalizedSelector - supports selectors starting with '&&'", () => {
	const mockGetInnerState = jest.fn(() => 'normal');
	const mockGetMasterState = jest.fn(() => 'normal');

	const defaultOptions = {
		state: 'normal',
		suffixClass: '.modified',
		rootSelector: '.complex-root .with-child',
		getInnerState: mockGetInnerState,
		getMasterState: mockGetMasterState,
		fromInnerBlock: false,
		customizedPseudoClasses: [
			'parent-class',
			'custom-class',
			'parent-hover',
		],
	};

	beforeEach(() => {
		mockGetInnerState.mockClear();
		mockGetMasterState.mockClear();
	});

	test('should replace "&&" with first part of rootSelector', () => {
		const result = getNormalizedSelector('&& .item', defaultOptions);
		expect(result).toBe('.complex-root .item.modified');
	});

	test('should replace "&&" with first part of rootSelector for &&.test', () => {
		const result = getNormalizedSelector('&&.test', defaultOptions);
		expect(result).toBe('.complex-root.test.modified');
	});

	test('should handle pseudo-elements with && prefix', () => {
		const result = getNormalizedSelector('&&::marker', defaultOptions);
		expect(result).toBe('.complex-root::marker.modified');
	});

	test('should handle multiple selectors with && prefix', () => {
		const result = getNormalizedSelector(
			'&&.test, &&::before',
			defaultOptions
		);
		expect(result).toBe(
			'.complex-root.test.modified, .complex-root::before.modified'
		);
	});

	test('should apply pseudo-classes correctly with && selector', () => {
		const options = {
			...defaultOptions,
			state: 'hover',
		};

		const result = getNormalizedSelector('&& .item', options);
		expect(result).toBe('.complex-root .item.modified:hover');
	});

	test('should handle mixed selectors with & and && prefixes', () => {
		const result = getNormalizedSelector(
			'&.item, && .child',
			defaultOptions
		);
		expect(result).toBe(
			'.complex-root .with-child.item.modified, .complex-root .child.modified'
		);
	});

	test('should handle multi-part complex selectors with && prefix', () => {
		const result = getNormalizedSelector(
			'&& > .direct-child, && + .sibling',
			defaultOptions
		);
		expect(result).toBe(
			'.complex-root > .direct-child.modified, .complex-root + .sibling.modified'
		);
	});

	test('should replace "&&" with first part of rootSelector for &&:where() with single selector', () => {
		const result = getNormalizedSelector(
			'&&:where(.test-1)',
			defaultOptions
		);
		expect(result).toBe('.complex-root:where(.test-1).modified');
	});

	test('should replace "&&" with first part of rootSelector for &&:where() with multiple selectors', () => {
		const result = getNormalizedSelector(
			'&&:where(.test-1,.test-2)',
			defaultOptions
		);
		expect(result).toBe('.complex-root:where(.test-1,.test-2).modified');
	});

	test('should replace "&&" with first part of rootSelector for &&:is() with single selector', () => {
		const result = getNormalizedSelector('&&:is(.test-1)', defaultOptions);
		expect(result).toBe('.complex-root:is(.test-1).modified');
	});

	test('should replace "&&" with first part of rootSelector for &&:is() with multiple selectors', () => {
		const result = getNormalizedSelector(
			'&&:is(.test-1,.test-2,.test-3)',
			defaultOptions
		);
		expect(result).toBe(
			'.complex-root:is(.test-1,.test-2,.test-3).modified'
		);
	});

	test('should replace "&&" with first part of rootSelector for &&:where() with nested selectors', () => {
		const result = getNormalizedSelector(
			'&&:where(.test-1 > .child, .test-2:hover)',
			defaultOptions
		);
		expect(result).toBe(
			'.complex-root:where(.test-1 > .child, .test-2:hover).modified'
		);
	});

	test('should replace "&&" with first part of rootSelector for &&:is() with complex selectors', () => {
		const result = getNormalizedSelector(
			'&&:is(.test-1, .test-2::before, .test-3:hover)',
			defaultOptions
		);
		expect(result).toBe(
			'.complex-root:is(.test-1, .test-2::before, .test-3:hover).modified'
		);
	});

	test('should handle multiple selectors with &&:where() and &&:is()', () => {
		const result = getNormalizedSelector(
			'&&:where(.test-1), &&:is(.test-2)',
			defaultOptions
		);
		expect(result).toBe(
			'.complex-root:where(.test-1).modified, .complex-root:is(.test-2).modified'
		);
	});

	test('should handle multiple selectors with &&:where() containing multiple selectors', () => {
		const result = getNormalizedSelector(
			'&&:where(.test-1,.test-2), &&:where(.test-3,.test-4)',
			defaultOptions
		);
		expect(result).toBe(
			'.complex-root:where(.test-1,.test-2).modified, .complex-root:where(.test-3,.test-4).modified'
		);
	});

	test('should handle multiple selectors with &&:is() containing multiple selectors', () => {
		const result = getNormalizedSelector(
			'&&:is(.test-1,.test-2), &&:is(.test-3,.test-4,.test-5)',
			defaultOptions
		);
		expect(result).toBe(
			'.complex-root:is(.test-1,.test-2).modified, .complex-root:is(.test-3,.test-4,.test-5).modified'
		);
	});

	test('should handle mix of regular selector, &&:where(), and &&:is()', () => {
		const result = getNormalizedSelector(
			'&&.test, &&:where(.test-1,.test-2), &&:is(.test-3)',
			defaultOptions
		);
		expect(result).toBe(
			'.complex-root.test.modified, .complex-root:where(.test-1,.test-2).modified, .complex-root:is(.test-3).modified'
		);
	});

	test('should handle multiple selectors with &&:where() and &&:is() with complex nested selectors', () => {
		const result = getNormalizedSelector(
			'&&:where(.test-1 > .child, .test-2:hover), &&:is(.test-3, .test-4::before)',
			defaultOptions
		);
		expect(result).toBe(
			'.complex-root:where(.test-1 > .child, .test-2:hover).modified, .complex-root:is(.test-3, .test-4::before).modified'
		);
	});

	test('should handle three selectors with &&:where(), &&:is(), and regular selector', () => {
		const result = getNormalizedSelector(
			'&&:where(.test-1), &&:is(.test-2), &&.test-3',
			defaultOptions
		);
		expect(result).toBe(
			'.complex-root:where(.test-1).modified, .complex-root:is(.test-2).modified, .complex-root.test-3.modified'
		);
	});

	test('should handle mix of & and && selectors with :where() and :is()', () => {
		const result = getNormalizedSelector(
			'&:where(.test-1), &&:is(.test-2), &.test-3',
			defaultOptions
		);
		expect(result).toBe(
			'.complex-root .with-child:where(.test-1).modified, .complex-root:is(.test-2).modified, .complex-root .with-child.test-3.modified'
		);
	});

	test('should replace "&&" with first part of rootSelector for &&[data-id="test"]', () => {
		const result = getNormalizedSelector(
			'&&[data-id="test"]',
			defaultOptions
		);
		expect(result).toBe('.complex-root[data-id="test"].modified');
	});

	test('should replace "&&" with first part of rootSelector for &&.test[data-id="test"]', () => {
		const result = getNormalizedSelector(
			'&&.test[data-id="test"]',
			defaultOptions
		);
		expect(result).toBe('.complex-root.test[data-id="test"].modified');
	});

	test('should replace "&&" with first part of rootSelector for &&[data-id="test"]:where(.test-1)', () => {
		const result = getNormalizedSelector(
			'&&[data-id="test"]:where(.test-1)',
			defaultOptions
		);
		expect(result).toBe(
			'.complex-root[data-id="test"]:where(.test-1).modified'
		);
	});

	test('should replace "&&" with first part of rootSelector for &&[data-id="test"]:is(.test-1)', () => {
		const result = getNormalizedSelector(
			'&&[data-id="test"]:is(.test-1)',
			defaultOptions
		);
		expect(result).toBe(
			'.complex-root[data-id="test"]:is(.test-1).modified'
		);
	});

	test('should replace "&&" with first part of rootSelector for &&:where(.test[data-id="test"])', () => {
		const result = getNormalizedSelector(
			'&&:where(.test[data-id="test"], .another[type="button"])',
			defaultOptions
		);
		expect(result).toBe(
			'.complex-root:where(.test[data-id="test"], .another[type="button"]).modified'
		);
	});

	test('should replace "&&" with first part of rootSelector for &&:is(.test[data-id="test"])', () => {
		const result = getNormalizedSelector(
			'&&:is(.test[data-id="test"], .another[type="button"])',
			defaultOptions
		);
		expect(result).toBe(
			'.complex-root:is(.test[data-id="test"], .another[type="button"]).modified'
		);
	});

	test('should handle multiple selectors with && and attribute selectors', () => {
		const result = getNormalizedSelector(
			'&&[data-id="test"], &&[type="button"]',
			defaultOptions
		);
		expect(result).toBe(
			'.complex-root[data-id="test"].modified, .complex-root[type="button"].modified'
		);
	});

	test('should handle && with attribute selector in hover state', () => {
		const options = {
			...defaultOptions,
			state: 'hover',
		};

		const result = getNormalizedSelector('&&[data-id="test"]', options);
		expect(result).toBe('.complex-root[data-id="test"].modified:hover');
	});
});
