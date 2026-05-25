/**
 * Internal dependencies
 */
import { backgroundToWPCompatibility } from '../compatibility/background-image';

describe('backgroundToWPCompatibility', () => {
	test('none type clears WP layered background attributes', () => {
		const result = backgroundToWPCompatibility({
			newValue: {
				'none-0': {
					type: 'none',
					isVisible: true,
				},
			},
			insideBlockInspector: true,
		});

		expect(result).toEqual({
			style: {
				background: {
					backgroundImage: undefined,
					backgroundSize: undefined,
					backgroundPosition: undefined,
					backgroundRepeat: undefined,
				},
				color: {
					gradient: undefined,
				},
			},
			gradient: undefined,
		});
	});
});
