import { prepValueForHeader, getArialLabelSuffix } from '../utils';

describe('Util functions', () => {
	describe('prepValueForHeader', () => {
		test('empty', () => {
			expect(prepValueForHeader('')).toStrictEqual('');
		});

		test('boolean', () => {
			expect(prepValueForHeader(false)).toStrictEqual(
				<span className="unit-value unit-value-css">CSS</span>
			);
		});

		test('px value', () => {
			expect(prepValueForHeader('1px')).toStrictEqual(
				<span className="unit-value">1px</span>
			);
		});

		test('em value', () => {
			expect(prepValueForHeader('1em')).toStrictEqual(
				<span className="unit-value">1em</span>
			);
		});

		test('rem value', () => {
			expect(prepValueForHeader('1rem')).toStrictEqual(
				<span className="unit-value">1rem</span>
			);
		});

		test('func value', () => {
			expect(prepValueForHeader('1remfunc')).toStrictEqual(
				<span className="unit-value unit-value-css">CSS</span>
			);
		});

		test('wrong func value', () => {
			expect(prepValueForHeader('func')).toStrictEqual(
				<span className="unit-value unit-value-css">CSS</span>
			);
		});

		test('special value', () => {
			expect(prepValueForHeader('initial')).toStrictEqual(
				<span className="unit-value unit-value-special">initial</span>
			);
		});

		test('deg value', () => {
			expect(prepValueForHeader('12deg')).toStrictEqual(
				<span className="unit-value">12°</span>
			);
		});

		test('rad value', () => {
			expect(prepValueForHeader('12rad')).toStrictEqual(
				<span className="unit-value">12°</span>
			);
		});

		test('grad value', () => {
			expect(prepValueForHeader('12grad')).toStrictEqual(
				<span className="unit-value">12°</span>
			);
		});
	});

	describe('getArialLabelSuffix', () => {
		test('empty', () => {
			expect(getArialLabelSuffix('')).toStrictEqual('');
		});

		test('string with space in start and end', () => {
			expect(getArialLabelSuffix('  test   ')).toStrictEqual('test');
		});

		test('string with space in start and end after removing not allowed chars', () => {
			expect(getArialLabelSuffix('--  test   --')).toStrictEqual('test');
		});

		test('not allowed strings between other words', () => {
			expect(getArialLabelSuffix('this-is-test')).toStrictEqual(
				'this is test'
			);
		});
	});
});
