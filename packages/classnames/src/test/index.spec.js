import {
	componentClassNames,
	controlClassNames,
	extensionClassNames,
	getClassNames,
} from '..';

describe('Classnames testing ...', () => {
	describe('Extensions classnames api testing ...', () => {
		test('testing when passed names as String!', () => {
			const generatedClassnames = extensionClassNames(
				'publisher-core extension extension-id'
			);

			expect(generatedClassnames).toBe(
				'publisher-core extension extension-id'
			);
		});

		test('testing when passed names as Object!', () => {
			const generatedClassnames = extensionClassNames({
				extension: true,
				'publisher-core': true,
				'extension-id': true,
			});

			expect(generatedClassnames).toBe(
				'publisher-core extension extension-id'
			);
		});

		test('testing when passed names as Array!', () => {
			const generatedClassnames = extensionClassNames([
				'publisher-core',
				'extension',
				'extension-id',
			]);

			expect(generatedClassnames).toBe(
				'publisher-core extension extension-id'
			);
		});
	});

	describe('Controls classnames api testing ...', () => {
		test('testing when passed names as String!', () => {
			const generatedClassnames = controlClassNames(
				'publisher-core control control-id'
			);

			expect(generatedClassnames).toBe(
				'publisher-core control control-id'
			);
		});

		test('testing when passed names as Object!', () => {
			const generatedClassnames = controlClassNames({
				control: true,
				'publisher-core': true,
				'control-id': true,
			});

			expect(generatedClassnames).toBe(
				'publisher-core control control-id'
			);
		});

		test('testing when passed names as Array!', () => {
			const generatedClassnames = controlClassNames([
				'publisher-core',
				'control',
				'control-id',
			]);

			expect(generatedClassnames).toBe(
				'publisher-core control control-id'
			);
		});
	});

	describe('Components classnames api testing ...', () => {
		test('testing when passed names as String!', () => {
			const generatedClassnames = componentClassNames(
				'publisher-core component component-id'
			);

			expect(generatedClassnames).toBe(
				'publisher-core component component-id'
			);
		});

		test('testing when passed names as Object!', () => {
			const generatedClassnames = componentClassNames({
				component: true,
				'publisher-core': true,
				'component-id': true,
			});

			expect(generatedClassnames).toBe(
				'publisher-core component component-id'
			);
		});

		test('testing when passed names as Array!', () => {
			const generatedClassnames = componentClassNames([
				'publisher-core',
				'component',
				'component-id',
			]);

			expect(generatedClassnames).toBe(
				'publisher-core component component-id'
			);
		});
	});

	describe('Root classnames api testing ...', () => {
		test('testing when passed names as String!', () => {
			const generatedClassnames = getClassNames(
				'publisher-core className'
			);

			expect(generatedClassnames).toBe('publisher-core className');
		});

		test('testing when passed names as Object!', () => {
			const generatedClassnames = getClassNames({
				className: true,
				'publisher-core': true,
			});

			expect(generatedClassnames).toBe('publisher-core className');
		});

		test('testing when passed names as Array!', () => {
			const generatedClassnames = getClassNames([
				'publisher-core',
				'className',
			]);

			expect(generatedClassnames).toBe('publisher-core className');
		});
	});
});
