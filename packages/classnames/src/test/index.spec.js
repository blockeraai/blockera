import {
	componentClassNames,
	controlClassNames,
	extensionClassNames,
	getClassNames,
} from '..';

describe('Classnames testing ...', () => {
	describe('Extensions classnames api testing ...', () => {
		test('testing when passed names as String!', () => {
			const generatedClassnames = extensionClassNames('id');

			expect(generatedClassnames).toBe(
				'publisher-extension publisher-extension-id'
			);
		});

		test('testing when passed names as multiple String!', () => {
			const generatedClassnames = extensionClassNames('id another-id');

			expect(generatedClassnames).toBe(
				'publisher-extension publisher-extension-id publisher-extension-another-id'
			);
		});

		test('testing when passed names as Object!', () => {
			const generatedClassnames = extensionClassNames({
				id: true,
			});

			expect(generatedClassnames).toBe(
				'publisher-extension publisher-extension-id'
			);
		});

		test('testing when passed names as Array!', () => {
			const generatedClassnames = extensionClassNames(['id', 'test']);

			expect(generatedClassnames).toBe(
				'publisher-extension publisher-extension-id publisher-extension-test'
			);
		});
	});

	describe('Controls classnames api testing ...', () => {
		test('testing when passed names as String!', () => {
			const generatedClassnames = controlClassNames('id');

			expect(generatedClassnames).toBe(
				'publisher-control publisher-control-id'
			);
		});

		test('testing when passed names as Object!', () => {
			const generatedClassnames = controlClassNames({
				id: true,
			});

			expect(generatedClassnames).toBe(
				'publisher-control publisher-control-id'
			);
		});

		test('testing when passed names as Array!', () => {
			const generatedClassnames = controlClassNames(['id']);

			expect(generatedClassnames).toBe(
				'publisher-control publisher-control-id'
			);
		});
	});

	describe('Components classnames api testing ...', () => {
		test('testing when passed names as String!', () => {
			const generatedClassnames = componentClassNames('id');

			expect(generatedClassnames).toBe(
				'publisher-component publisher-component-id'
			);
		});

		test('testing when passed names as Object!', () => {
			const generatedClassnames = componentClassNames({
				id: true,
			});

			expect(generatedClassnames).toBe(
				'publisher-component publisher-component-id'
			);
		});

		test('testing when passed names as Array!', () => {
			const generatedClassnames = componentClassNames(['id']);

			expect(generatedClassnames).toBe(
				'publisher-component publisher-component-id'
			);
		});
	});

	describe('Root classnames api testing ...', () => {
		test('testing when passed names as String!', () => {
			const generatedClassnames = getClassNames('className');

			expect(generatedClassnames).toBe(
				'publisher-core publisher-core-className'
			);
		});

		test('testing when passed names as Object!', () => {
			const generatedClassnames = getClassNames({
				className: true,
			});

			expect(generatedClassnames).toBe(
				'publisher-core publisher-core-className'
			);
		});

		test('testing when passed names as Array!', () => {
			const generatedClassnames = getClassNames(['className']);

			expect(generatedClassnames).toBe(
				'publisher-core publisher-core-className'
			);
		});
	});
});
