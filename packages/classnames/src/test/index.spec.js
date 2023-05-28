import {
	componentClassNames,
	componentInnerClassNames,
	controlClassNames,
	controlInnerClassNames,
	extensionClassNames,
	extensionInnerClassNames,
	getClassNames,
	getInnerClassNames,
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

		test('testing inner items', () => {
			const generatedClassnames = extensionInnerClassNames('id');

			expect(generatedClassnames).toBe('publisher-extension-id');
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

		test('testing Inner classes', () => {
			const generatedClassnames = controlInnerClassNames('id');

			expect(generatedClassnames).toBe('publisher-control-id');
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

		test('testing Inner class', () => {
			const generatedClassnames = componentInnerClassNames('id');

			expect(generatedClassnames).toBe('publisher-component-id');
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

		test('testing Inner class', () => {
			const generatedClassnames = getInnerClassNames('className');

			expect(generatedClassnames).toBe('publisher-core-className');
		});
	});
});
