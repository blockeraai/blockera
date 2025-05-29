/**
 * External dependencies
 */
const fs = require('fs');
const path = require('path');

/**
 * Internal dependencies
 */
const Processor = require('../processor');
const secretKeysProcessor = require('../processors/secret-keys-processor');
const appendSecretKeysValidation = require('../variables/secret-keys-variable');

// Mock dependencies
jest.mock('fs');
jest.mock('../processors/secret-keys-processor');
jest.mock('../variables/secret-keys-variable');

describe('Processor', () => {
	let processor;
	const mockFilePath = '/mock/file/path';

	beforeEach(() => {
		// Clear all mocks before each test
		jest.clearAllMocks();
		processor = new Processor(mockFilePath);
	});

	describe('constructor', () => {
		it('should initialize with the provided file path', () => {
			expect(processor.currentFile).toBe(mockFilePath);
			expect(processor.rules).toBeInstanceOf(Array);
			expect(processor.rules.length).toBe(7);
		});
	});

	describe('applyRandomRefactor', () => {
		it('should throw error if no file is specified', () => {
			processor.currentFile = null;
			expect(() => processor.applyRandomRefactor()).toThrow(
				'No file specified for processing'
			);
		});

		it('should throw error if no rules are found', () => {
			processor.rules = [];
			expect(() => processor.applyRandomRefactor()).toThrow(
				'No rules found'
			);
		});

		it('should process secret key rules correctly', () => {
			// Mock the secretKeysProcessor to return a test string
			secretKeysProcessor.mockReturnValue('mockSecretKeyCode');

			processor.applyRandomRefactor();

			// Verify secretKeysProcessor was called for each secret-key rule
			const secretKeyRules = processor.rules.filter(
				(rule) => rule.validationType === 'secret-key'
			);
			expect(secretKeysProcessor).toHaveBeenCalledTimes(
				secretKeyRules.length
			);

			// Verify appendSecretKeysValidation was called
			expect(appendSecretKeysValidation).toHaveBeenCalledTimes(1);
			expect(appendSecretKeysValidation).toHaveBeenCalledWith(
				processor,
				expect.any(String)
			);
		});

		it('should return processor instance for chaining', () => {
			const result = processor.applyRandomRefactor();
			expect(result).toBe(processor);
		});
	});

	describe('readFile', () => {
		it('should read file content correctly', () => {
			const mockContent = 'test content';
			fs.readFileSync.mockReturnValue(mockContent);

			const result = processor.readFile(mockFilePath);

			expect(result).toBe(mockContent);
			expect(fs.readFileSync).toHaveBeenCalledWith(mockFilePath, 'utf8');
		});

		it('should throw error if file reading fails', () => {
			fs.readFileSync.mockImplementation(() => {
				throw new Error('File read error');
			});

			expect(() => processor.readFile(mockFilePath)).toThrow(
				'File read error'
			);
		});
	});

	describe('writeFile', () => {
		it('should write content to file correctly', () => {
			const mockContent = 'test content';
			processor.writeFile(mockFilePath, mockContent);

			expect(fs.writeFileSync).toHaveBeenCalledWith(
				mockFilePath,
				mockContent
			);
		});

		it('should throw error if file writing fails', () => {
			fs.writeFileSync.mockImplementation(() => {
				throw new Error('File write error');
			});

			expect(() => processor.writeFile(mockFilePath, 'content')).toThrow(
				'File write error'
			);
		});
	});

	describe('rules validation', () => {
		it('should have valid rule structure', () => {
			processor.rules.forEach((rule) => {
				expect(rule).toHaveProperty('name');
				expect(rule).toHaveProperty('validationType');
				expect(rule).toHaveProperty('conditions');
				expect(Array.isArray(rule.conditions)).toBeTruthy();
			});
		});

		it('should have required rules', () => {
			const requiredRules = ['subscriberId', 'clientId', 'clientSecret'];
			const ruleNames = processor.rules.map((rule) => rule.name);

			requiredRules.forEach((ruleName) => {
				expect(ruleNames).toContain(ruleName);
			});
		});
	});
});
