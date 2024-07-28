import {
	split,
	splitSeparateNumbers,
	noCase,
	camelCase,
	pascalCase,
	snakeCase,
	kebabCase,
	dotCase,
	trainCase,
	pathCase,
	capitalCase,
	constantCase,
	sentenceCase,
	pascalSnakeCase,
} from '../';

describe('String Conversion Functions', () => {
	describe('split', () => {
		it('should split camelCase string into words', () => {
			expect(split('camelCaseString')).toEqual([
				'camel',
				'Case',
				'String',
			]);
		});

		it('should split PascalCase string into words', () => {
			expect(split('PascalCaseString')).toEqual([
				'Pascal',
				'Case',
				'String',
			]);
		});

		it('should handle empty string', () => {
			expect(split('')).toEqual([]);
		});

		it('should handle strings with numbers', () => {
			expect(split('word123Word')).toEqual(['word123', 'Word']);
		});

		it('should handle strings with special characters', () => {
			expect(split('word-123_word')).toEqual(['word', '123', 'word']);
		});
	});

	describe('splitSeparateNumbers', () => {
		it('should split string and separate numbers', () => {
			expect(splitSeparateNumbers('Word123Word')).toEqual([
				'Word',
				'123',
				'Word',
			]);
		});

		it('should handle strings without numbers', () => {
			expect(splitSeparateNumbers('WordWord')).toEqual(['Word', 'Word']);
		});
	});

	describe('noCase', () => {
		it('should convert string to lowercase with spaces', () => {
			expect(noCase('FooBar')).toBe('foo bar');
		});

		it('should handle empty string', () => {
			expect(noCase('')).toBe('');
		});

		it('should handle options', () => {
			expect(noCase('FooBar', { delimiter: '_' })).toBe('foo_bar');
		});
	});

	describe('camelCase', () => {
		it('should convert string to camel case', () => {
			expect(camelCase('foo bar')).toBe('fooBar');
		});

		it('should handle empty string', () => {
			expect(camelCase('')).toBe('');
		});

		it('should handle options', () => {
			expect(camelCase('foo-bar', { delimiter: ' ' })).toBe('foo Bar');
		});
	});

	describe('pascalCase', () => {
		it('should convert string to pascal case', () => {
			expect(pascalCase('foo bar')).toBe('FooBar');
		});

		it('should handle empty string', () => {
			expect(pascalCase('')).toBe('');
		});
	});

	describe('snakeCase', () => {
		it('should convert string to snake case', () => {
			expect(snakeCase('foo bar')).toBe('foo_bar');
		});

		it('should handle empty string', () => {
			expect(snakeCase('')).toBe('');
		});
	});

	describe('kebabCase', () => {
		it('should convert string to kebab case', () => {
			expect(kebabCase('foo bar')).toBe('foo-bar');
		});

		it('should handle empty string', () => {
			expect(kebabCase('')).toBe('');
		});
	});

	describe('dotCase', () => {
		it('should convert string to dot case', () => {
			expect(dotCase('foo bar')).toBe('foo.bar');
		});

		it('should handle empty string', () => {
			expect(dotCase('')).toBe('');
		});
	});

	describe('trainCase', () => {
		it('should convert string to train case', () => {
			expect(trainCase('foo bar')).toBe('Foo-Bar');
		});

		it('should handle empty string', () => {
			expect(trainCase('')).toBe('');
		});
	});

	describe('pathCase', () => {
		it('should convert string to path case', () => {
			expect(pathCase('foo bar')).toBe('foo/bar');
		});

		it('should handle empty string', () => {
			expect(pathCase('')).toBe('');
		});
	});

	describe('capitalCase', () => {
		it('should convert string to capital case', () => {
			expect(capitalCase('foo bar')).toBe('Foo Bar');
		});

		it('should handle empty string', () => {
			expect(capitalCase('')).toBe('');
		});
	});

	describe('constantCase', () => {
		it('should convert string to constant case', () => {
			expect(constantCase('foo bar')).toBe('FOO_BAR');
		});

		it('should handle empty string', () => {
			expect(constantCase('')).toBe('');
		});
	});

	describe('sentenceCase', () => {
		it('should convert string to sentence case', () => {
			expect(sentenceCase('foo bar')).toBe('Foo bar');
		});

		it('should handle empty string', () => {
			expect(sentenceCase('')).toBe('');
		});
	});

	describe('pascalSnakeCase', () => {
		it('should convert string to pascal snake case', () => {
			expect(pascalSnakeCase('foo bar')).toBe('Foo_Bar');
		});

		it('should handle empty string', () => {
			expect(pascalSnakeCase('')).toBe('');
		});
	});
});
