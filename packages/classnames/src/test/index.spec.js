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
			const generatedClassnames = extensionClassNames('class');

			expect(generatedClassnames).toBe(
				'publisher-extension publisher-extension-class'
			);
		});

		test('testing when passed names as multiple String!', () => {
			const generatedClassnames = extensionClassNames(
				'class another-class'
			);

			expect(generatedClassnames).toBe(
				'publisher-extension publisher-extension-class another-class'
			);
		});

		test('testing when passed names as Object!', () => {
			const generatedClassnames = extensionClassNames({
				class: true,
				'another-class': true,
				'disabled-class': false,
			});

			expect(generatedClassnames).toBe(
				'publisher-extension publisher-extension-class another-class'
			);
		});

		test('testing when passed names as Array!', () => {
			const generatedClassnames = extensionClassNames([
				'class',
				'another-class',
			]);

			expect(generatedClassnames).toBe(
				'publisher-extension publisher-extension-class another-class'
			);
		});

		test('testing inner items', () => {
			const generatedClassnames = extensionInnerClassNames('class');

			expect(generatedClassnames).toBe('publisher-extension-class');
		});

		test('testing inner items -> multiple', () => {
			const generatedClassnames = extensionInnerClassNames(
				'class another-class'
			);

			expect(generatedClassnames).toBe(
				'publisher-extension-class another-class'
			);
		});
	});

	describe('Controls classnames api testing ...', () => {
		test('testing when passed names as String!', () => {
			const generatedClassnames = controlClassNames('class');

			expect(generatedClassnames).toBe(
				'publisher-control publisher-control-class'
			);
		});

		test('testing when passed names as Object!', () => {
			const generatedClassnames = controlClassNames({
				class: true,
				'another-class': true,
				'disabled-class': false,
			});

			expect(generatedClassnames).toBe(
				'publisher-control publisher-control-class another-class'
			);
		});

		test('testing when passed names as Array!', () => {
			const generatedClassnames = controlClassNames(['class']);

			expect(generatedClassnames).toBe(
				'publisher-control publisher-control-class'
			);
		});

		test('testing Inner classes', () => {
			const generatedClassnames = controlInnerClassNames('id');

			expect(generatedClassnames).toBe('publisher-control-id');
		});

		test('testing Inner classes -> multiple', () => {
			const generatedClassnames = controlInnerClassNames(
				'class another-class'
			);

			expect(generatedClassnames).toBe(
				'publisher-control-class another-class'
			);
		});
	});

	describe('Components classnames api testing ...', () => {
		test('testing when passed names as String!', () => {
			const generatedClassnames = componentClassNames('class');

			expect(generatedClassnames).toBe(
				'publisher-component publisher-component-class'
			);
		});

		test('testing when passed names as Object!', () => {
			const generatedClassnames = componentClassNames({
				class: true,
				'another-class': true,
				'disabled-class': false,
			});

			expect(generatedClassnames).toBe(
				'publisher-component publisher-component-class another-class'
			);
		});

		test('testing when passed names as Array!', () => {
			const generatedClassnames = componentClassNames(['class']);

			expect(generatedClassnames).toBe(
				'publisher-component publisher-component-class'
			);
		});

		test('testing Inner class', () => {
			const generatedClassnames = componentInnerClassNames('class');

			expect(generatedClassnames).toBe('publisher-component-class');
		});
	});

	describe('Root classnames api testing ...', () => {
		test('testing when passed names as String!', () => {
			const generatedClassnames = getClassNames('class');

			expect(generatedClassnames).toBe(
				'publisher-core publisher-core-class'
			);
		});

		test('testing when passed names as Object!', () => {
			const generatedClassnames = getClassNames({
				class: true,
				'another-class': true,
				'disabled-class': false,
			});

			expect(generatedClassnames).toBe(
				'publisher-core publisher-core-class another-class'
			);
		});

		test('testing when passed names as Array!', () => {
			const generatedClassnames = getClassNames(['class']);

			expect(generatedClassnames).toBe(
				'publisher-core publisher-core-class'
			);
		});

		test('testing Inner class', () => {
			const generatedClassnames = getInnerClassNames('class');

			expect(generatedClassnames).toBe('publisher-core-class');
		});

		test('testing Inner class -> multiple', () => {
			const generatedClassnames = getInnerClassNames(
				'class another-class'
			);

			expect(generatedClassnames).toBe(
				'publisher-core-class another-class'
			);
		});
	});
});
