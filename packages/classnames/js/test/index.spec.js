import {
	getClassnames,
	componentClassNames,
	componentInnerClassNames,
	controlClassNames,
	controlInnerClassNames,
	extensionClassNames,
	extensionInnerClassNames,
	fieldsClassNames,
	fieldsInnerClassNames,
	getClassNames,
	getInnerClassNames,
} from '..';

describe('Classnames testing ...', () => {
	describe('getClassnames testing ...', () => {
		test('test custom string section!', () => {
			const generatedClassnames = getClassnames(true, 'section', 'value');

			expect(generatedClassnames).toBe('section section-value');
		});

		test('test custom string section but not append section', () => {
			const generatedClassnames = getClassnames(
				false,
				'section',
				'value'
			);

			expect(generatedClassnames).toBe('section-value');
		});

		test('section as object', () => {
			const generatedClassnames = getClassnames(
				false,
				{ section: true },
				'value'
			);

			expect(generatedClassnames).toBe('section-value');
		});

		test('section as invalid (not string or valid object)', () => {
			const generatedClassnames = getClassnames(false, false, 'value');

			expect(generatedClassnames).toBe('blockera-value');
		});

		test('not passing names', () => {
			const generatedClassnames = getClassnames(false, 'section');

			expect(generatedClassnames).toBe('section');
		});

		test('not passing names', () => {
			const generatedClassnames = getClassnames(true, 'section');

			expect(generatedClassnames).toBe('section');
		});
	});

	describe('Extensions classnames api testing ...', () => {
		test('testing when passed names as String!', () => {
			const generatedClassnames = extensionClassNames('class');

			expect(generatedClassnames).toBe(
				'blockera-extension blockera-extension-class'
			);
		});

		test('testing when passed names as multiple String!', () => {
			const generatedClassnames = extensionClassNames(
				'class another-class'
			);

			expect(generatedClassnames).toBe(
				'blockera-extension blockera-extension-class another-class'
			);
		});

		test('testing when passed names as Object!', () => {
			const generatedClassnames = extensionClassNames({
				class: true,
				'another-class': true,
				'disabled-class': false,
			});

			expect(generatedClassnames).toBe(
				'blockera-extension blockera-extension-class another-class'
			);
		});

		test('testing when passed names as Array!', () => {
			const generatedClassnames = extensionClassNames([
				'class',
				'another-class',
			]);

			expect(generatedClassnames).toBe(
				'blockera-extension blockera-extension-class another-class'
			);
		});

		test('testing inner items', () => {
			const generatedClassnames = extensionInnerClassNames('class');

			expect(generatedClassnames).toBe('blockera-extension-class');
		});

		test('testing inner items -> multiple', () => {
			const generatedClassnames = extensionInnerClassNames(
				'class another-class'
			);

			expect(generatedClassnames).toBe(
				'blockera-extension-class another-class'
			);
		});
	});

	describe('Controls classnames api testing ...', () => {
		test('testing when passed names as String!', () => {
			const generatedClassnames = controlClassNames('class');

			expect(generatedClassnames).toBe(
				'blockera-control blockera-control-class'
			);
		});

		test('testing when passed names as Object!', () => {
			const generatedClassnames = controlClassNames({
				class: true,
				'another-class': true,
				'disabled-class': false,
			});

			expect(generatedClassnames).toBe(
				'blockera-control blockera-control-class another-class'
			);
		});

		test('testing when passed names as Array!', () => {
			const generatedClassnames = controlClassNames(['class']);

			expect(generatedClassnames).toBe(
				'blockera-control blockera-control-class'
			);
		});

		test('testing Inner classes', () => {
			const generatedClassnames = controlInnerClassNames('id');

			expect(generatedClassnames).toBe('blockera-control-id');
		});

		test('testing Inner classes -> multiple', () => {
			const generatedClassnames = controlInnerClassNames(
				'class another-class'
			);

			expect(generatedClassnames).toBe(
				'blockera-control-class another-class'
			);
		});
	});

	describe('Components classnames api testing ...', () => {
		test('testing when passed names as String!', () => {
			const generatedClassnames = componentClassNames('class');

			expect(generatedClassnames).toBe(
				'blockera-component blockera-component-class'
			);
		});

		test('testing when passed names as Object!', () => {
			const generatedClassnames = componentClassNames({
				class: true,
				'another-class': true,
				'disabled-class': false,
			});

			expect(generatedClassnames).toBe(
				'blockera-component blockera-component-class another-class'
			);
		});

		test('testing when passed names as Array!', () => {
			const generatedClassnames = componentClassNames(['class']);

			expect(generatedClassnames).toBe(
				'blockera-component blockera-component-class'
			);
		});

		test('testing Inner class', () => {
			const generatedClassnames = componentInnerClassNames('class');

			expect(generatedClassnames).toBe('blockera-component-class');
		});
	});

	describe('fields classnames api testing ...', () => {
		test('testing when passed names as String!', () => {
			const generatedClassnames = fieldsClassNames('class');

			expect(generatedClassnames).toBe(
				'blockera-field blockera-field-class'
			);
		});

		test('testing when passed names as Object!', () => {
			const generatedClassnames = fieldsClassNames({
				class: true,
				'another-class': true,
				'disabled-class': false,
			});

			expect(generatedClassnames).toBe(
				'blockera-field blockera-field-class another-class'
			);
		});

		test('testing when passed names as Array!', () => {
			const generatedClassnames = fieldsClassNames(['class']);

			expect(generatedClassnames).toBe(
				'blockera-field blockera-field-class'
			);
		});

		test('testing Inner class', () => {
			const generatedClassnames = fieldsInnerClassNames('class');

			expect(generatedClassnames).toBe('blockera-field-class');
		});
	});

	describe('Root classnames api testing ...', () => {
		test('testing when passed names as String!', () => {
			const generatedClassnames = getClassNames('class');

			expect(generatedClassnames).toBe('blockera blockera-class');
		});

		test('testing when passed names as Object!', () => {
			const generatedClassnames = getClassNames({
				class: true,
				'another-class': true,
				'disabled-class': false,
			});

			expect(generatedClassnames).toBe(
				'blockera blockera-class another-class'
			);
		});

		test('testing when passed names as Array!', () => {
			const generatedClassnames = getClassNames(['class']);

			expect(generatedClassnames).toBe('blockera blockera-class');
		});

		test('testing Inner class', () => {
			const generatedClassnames = getInnerClassNames('class');

			expect(generatedClassnames).toBe('blockera-class');
		});

		test('testing Inner class -> multiple', () => {
			const generatedClassnames = getInnerClassNames(
				'class another-class'
			);

			expect(generatedClassnames).toBe('blockera-class another-class');
		});
	});
});
