import { computedCssDeclarations } from '../utils';
import { select } from '@wordpress/data';

// Mock the @wordpress/data select function
jest.mock('@wordpress/data', () => ({
	select: jest.fn(),
}));

describe('computedCssDeclarations', () => {
	// Setup common test data
	const baseBlockProps = {
		state: 'before',
		clientId: '4e30af98-ebb2-4ea7-ad6b-1e1038ed8e44',
		blockName: 'core/list-item',
		currentBlock: 'master',
		attributes: {
			blockeraBlockStates: {
				before: {
					content: 'Master Before',
					isVisible: true,
				},
			},
		},
	};

	const baseSelector =
		'.wp-block-list > li#block-4e30af98-ebb2-4ea7-ad6b-1e1038ed8e44:before';

	beforeEach(() => {
		// Reset all mocks before each test
		jest.clearAllMocks();

		// Setup default mocks for both stores
		select.mockImplementation((store) => {
			if (store === 'blockera/editor') {
				return {
					getState: () => ({
						settings: { hasContent: true },
					}),
					getInnerState: () => null,
				};
			}
			if (store === 'blockera/extensions') {
				return {
					getExtensionCurrentBlock: () => 'master',
					getActiveInnerState: () => null,
					getActiveMasterState: () => null,
					getExtensionBlockName: () => 'core/list-item',
				};
			}
			return {};
		});
	});

	test('should handle static font color style definition', () => {
		const styleDefinitions = {
			blockeraFontColor: [
				{
					type: 'static',
					properties: {
						color: '#f50505',
					},
				},
			],
		};

		const result = computedCssDeclarations(
			styleDefinitions,
			baseBlockProps,
			baseSelector
		);

		expect(result).toEqual(['color: #f50505 !important;\n\n']);
	});

	test('should handle style definition with important flag', () => {
		const styleDefinitions = {
			blockeraSpacing: [
				{
					type: 'static',
					options: {
						important: true,
					},
					properties: {
						margin: '10px',
					},
				},
			],
		};

		const result = computedCssDeclarations(
			styleDefinitions,
			baseBlockProps,
			baseSelector
		);

		expect(result).toEqual(['margin: 10px !important;\n\n']);
	});

	test('should handle multiple style definitions', () => {
		const styleDefinitions = {
			blockeraFontColor: [
				{
					type: 'static',
					properties: {
						color: '#f50505',
					},
				},
			],
			blockeraSpacing: [
				{
					type: 'static',
					properties: {
						margin: '10px',
					},
				},
			],
		};

		const result = computedCssDeclarations(
			styleDefinitions,
			baseBlockProps,
			baseSelector
		);

		expect(result).toEqual([
			'color: #f50505 !important;\n\n',
			'margin: 10px !important;\n\n',
		]);
	});

	test('should handle state without content', () => {
		select.mockImplementation((store) => {
			if (store === 'blockera/editor') {
				return {
					getState: () => ({
						settings: { hasContent: false },
					}),
					getInnerState: () => null,
				};
			}
			if (store === 'blockera/extensions') {
				return {
					getExtensionCurrentBlock: () => 'master',
					getActiveInnerState: () => null,
					getActiveMasterState: () => null,
					getExtensionBlockName: () => 'core/list-item',
				};
			}
			return {};
		});

		const styleDefinitions = {
			blockeraFontColor: [
				{
					type: 'static',
					properties: {
						color: '#f50505',
					},
				},
			],
		};

		const result = computedCssDeclarations(
			styleDefinitions,
			baseBlockProps,
			baseSelector
		);

		expect(result).toEqual(['color: #f50505 !important;\n\n']);
	});

	test('should handle empty style definitions', () => {
		const styleDefinitions = {};

		const result = computedCssDeclarations(
			styleDefinitions,
			baseBlockProps,
			baseSelector
		);

		expect(result).toEqual([]);
	});

	test('should handle null or undefined style definitions', () => {
		const result = computedCssDeclarations(
			null,
			baseBlockProps,
			baseSelector
		);
		expect(result).toEqual([]);

		const result2 = computedCssDeclarations(
			undefined,
			baseBlockProps,
			baseSelector
		);
		expect(result2).toEqual([]);
	});
});
