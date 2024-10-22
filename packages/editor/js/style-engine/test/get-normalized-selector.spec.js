import { getNormalizedSelector } from '../get-compatible-block-css-selector';

describe('getNormalizedSelector', () => {
	const rootSelector = '.my-root';
	const suffixClass = '--modified';
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

		expect(result).toBe('.my-element--modified');
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
			'.my-root:active .my-element--modified:hover, .my-root .my-element--modified'
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
			'.my-element--modified:hover, .another-element--modified:hover'
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
			'.my-root .my-element--modified:hover, .my-root .my-element--modified'
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
});

describe("getNormalizedSelector - supports selectors starting with '&'", () => {
	const mockGetInnerState = jest.fn((): TStates => 'normal');
	const mockGetMasterState = jest.fn((): TStates => 'normal');

	const defaultOptions = {
		state: 'normal',
		suffixClass: '--modified',
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
		expect(result).toBe('.root::marker--modified');
	});

	test('should replace "&" with rootSelector for "&.test"', () => {
		const result = getNormalizedSelector('&.test', defaultOptions);
		expect(result).toBe('.root.test--modified');
	});

	test('should handle normal state without "&" prefix', () => {
		const result = getNormalizedSelector('.my-element', defaultOptions);
		expect(result).toBe('.my-element--modified');
	});

	test('should handle multiple selectors with "&" prefix', () => {
		const result = getNormalizedSelector(
			'&.test, &::before',
			defaultOptions
		);
		expect(result).toBe('.root.test--modified, .root::before--modified');
	});

	test('should not alter pseudo-classes from customizedPseudoClasses', () => {
		const options = {
			...defaultOptions,
			state: 'hover',
		};

		const result = getNormalizedSelector('&.test', options);
		expect(result).toBe('.root.test--modified:hover');
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
		expect(result).toBe('.my-element--modified, .root.test--modified');
	});
});
