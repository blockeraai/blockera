// @flow

/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useState, useRef } from '@wordpress/element';
import { Editor } from '@monaco-editor/react';
import memoize from 'fast-memoize';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';
import {
	getColors,
	getFontSizes,
	getSpacings,
	getWidthSizes,
	getLinearGradients,
	getRadialGradients,
	generateVariableString,
} from '@blockera/data';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import { DynamicHtmlFormatter } from '../';
import { useControlContext } from '../../context';
import type { CodeControlProps } from './types';

/**
 * Get variable suggestions.
 *
 * It's memoized to improve performance.
 *
 * @return {Array}
 */
const getVariableSuggestions = memoize(() => {
	const rawSuggestions = [];

	// Add color variables
	getColors().forEach((color) => {
		rawSuggestions.push({
			label: {
				label: `--color-${color.id}`,
				description: color.value,
			},
			kind: 'color',
			insertText: `var(${generateVariableString({
				id: color.id,
				reference: color.reference,
				type: 'color',
			})}, ${color.value})`,
			documentation: {
				value: color.name,
				isTrusted: true,
				supportHtml: true,
				colorInfo: {
					value: color.value,
				},
			},
			detail: color.value,
			sortText: `--color-${color.id}`,
		});
	});

	// Add font size variables
	getFontSizes().forEach((fontSize) => {
		rawSuggestions.push({
			label: {
				label: `--font-size-${fontSize.id}`,
				description: fontSize.value,
			},
			kind: 'unit',
			insertText: `var(${generateVariableString({
				id: fontSize.id,
				reference: fontSize.reference,
				type: 'font-size',
			})}, ${fontSize.value})`,
			documentation: {
				value: `${fontSize.name}\n\nPreview: <div style="font-size: ${fontSize.value}">Aa</div>`,
				isTrusted: true,
				supportHtml: true,
				colorInfo: {
					value: fontSize.value,
				},
			},
			detail: __('Font Size Variable', 'blockera'),
			sortText: `--font-size-${fontSize.id}`,
		});
	});

	// Add spacing variables
	getSpacings().forEach((spacing) => {
		rawSuggestions.push({
			label: {
				label: `--spacing-${spacing.id}`,
				description: spacing.value,
			},
			kind: 'unit',
			insertText: `var(${generateVariableString({
				id: spacing.id,
				reference: spacing.reference,
				type: 'spacing',
			})}, ${spacing.value})`,
			documentation: {
				value: `${spacing.name}\n\nPreview: <div style="display: flex; align-items: center; gap: 8px;"><div style="width: ${spacing.value}; height: 20px; background: #e0e0e0;"></div><span>${spacing.value}</span></div>`,
				isTrusted: true,
				supportHtml: true,
				colorInfo: {
					value: spacing.value,
				},
			},
			detail: __('Spacing Variable', 'blockera'),
			sortText: `--spacing-${spacing.id}`,
		});
	});

	// Add width size variables
	getWidthSizes().forEach((widthSize) => {
		rawSuggestions.push({
			label: {
				label: `--width-size-${widthSize.id}`,
				description: widthSize.value,
			},
			kind: 'unit',
			insertText: `var(${generateVariableString({
				id: widthSize.id,
				reference: widthSize.reference,
				type: 'width-size',
			})}, ${widthSize.value})`,
			documentation: {
				value: `${widthSize.name}\n\nPreview: <div style="display: flex; align-items: center; gap: 8px;"><div style="width: ${widthSize.value}; height: 20px; background: #e0e0e0;"></div><span>${widthSize.value}</span></div>`,
				isTrusted: true,
				supportHtml: true,
				colorInfo: {
					value: widthSize.value,
				},
			},
			detail: __('Width Size Variable', 'blockera'),
			sortText: `--width-size-${widthSize.id}`,
		});
	});

	// Add gradient variables
	getLinearGradients().forEach((gradient) => {
		rawSuggestions.push({
			label: {
				label: `--linear-gradient-${gradient.id}`,
				description: gradient.value,
			},
			kind: 'color',
			insertText: `var(${generateVariableString({
				id: gradient.id,
				reference: gradient.reference,
				type: 'linear-gradient',
			})}, ${gradient.value})`,
			documentation: {
				value: `${gradient.name}\n\nPreview: <div style="width: 100px; height: 50px; background: ${gradient.value};"></div>`,
				isTrusted: true,
				supportHtml: true,
				colorInfo: {
					value: gradient.value,
				},
			},
			detail: __('Linear Gradient Variable', 'blockera'),
			sortText: `--linear-gradient-${gradient.id}`,
		});
	});

	getRadialGradients().forEach((gradient) => {
		rawSuggestions.push({
			label: {
				label: `--radial-gradient-${gradient.id}`,
				description: gradient.value,
			},
			kind: 'color',
			insertText: `var(${generateVariableString({
				id: gradient.id,
				reference: gradient.reference,
				type: 'radial-gradient',
			})}, ${gradient.value})`,
			documentation: {
				value: `${gradient.name}\n\nPreview: <div style="width: 100px; height: 50px; background: ${gradient.value};"></div>`,
				isTrusted: true,
				supportHtml: true,
				colorInfo: {
					value: gradient.value,
				},
			},
			detail: __('Radial Gradient Variable', 'blockera'),
			sortText: `--radial-gradient-${gradient.id}`,
		});
	});

	return rawSuggestions;
});

const CodeControl = ({
	lang = 'css',
	width = '',
	height = '',
	placeholder = '',
	editable = true,
	description = '',
	//
	id,
	label = '',
	labelPopoverTitle,
	labelDescription,
	repeaterItem,
	singularId,
	columns = 'columns-1',
	defaultValue = '',
	onChange,
	field = 'code',
	//
	className,
}: CodeControlProps): MixedElement => {
	const {
		value,
		setValue,
		attribute,
		blockName,
		resetToDefault,
		getControlPath,
	} = useControlContext({
		id,
		onChange,
		defaultValue,
	});

	const [showPlaceholder, setShowPlaceholder] = useState(false);
	const editorRef = useRef(null);
	const timeoutRef = useRef(null);

	const labelProps = {
		value,
		singularId,
		attribute,
		blockName,
		label,
		labelPopoverTitle,
		labelDescription,
		repeaterItem,
		defaultValue,
		resetToDefault,
		mode: 'advanced',
		path: getControlPath(attribute, id),
	};

	switch (lang) {
		case 'css':
			if (!description) {
				description = (
					<>
						<p>
							<DynamicHtmlFormatter
								text={sprintf(
									/* translators: $1%s is a CSS selector, $2%s is ID. */
									__(
										'Use %1$s to target current block.',
										'blockera'
									),
									'{.block}'
								)}
								replacements={{
									'.block': <code>.block</code>,
								}}
							/>
						</p>
					</>
				);
			}

			if (!placeholder) {
				placeholder = (
					<>
						.block {'{'}
						<br />
						&nbsp;&nbsp;&nbsp;{'/* Your CSS here */'}
						<br />
						{'}'}
					</>
				);
			}

			break;
	}

	return (
		<BaseControl columns={columns} controlName={field} {...labelProps}>
			<div className={controlClassNames('code', className)}>
				<Editor
					width={width || 250}
					height={height || 200}
					defaultLanguage={lang}
					defaultValue={value}
					onChange={(newValue) => {
						setShowPlaceholder(newValue === '');

						if (timeoutRef.current) {
							clearTimeout(timeoutRef.current);
						}

						timeoutRef.current = setTimeout(() => {
							setValue(newValue);
						}, 500);
					}}
					theme={'blockera'}
					options={{
						glyphMargin: false,
						folding: false,
						showFoldingControls: false,
						minimap: { enabled: false },
						fontSize: '13px',
						lineNumbersMinChars: 2,
						readOnly: !editable,
						allowEditorOverflow: false,
					}}
					beforeMount={(monaco: any) => {
						if (monaco?.blockeraInitialised === undefined) {
							monaco.editor.defineTheme('blockera', {
								base: 'vs',
								inherit: true,
								rules: [],
								colors: {
									'editor.foreground': '#111111',
									'editor.background': '#f6f6f6',
									'editor.selectionBackground': '#c2e8ff',
									'editor.lineHighlightBackground':
										'#c2e8ff75',
									'editorLineNumber.foreground': '#7d7d7d75',
								},
							});

							// Configure CSS linting
							monaco.languages.css.cssDefaults.setOptions({
								validate: true,
								lint: {
									emptyRules: 'ignore',
									unknownProperties: 'warning',
									unknownAtRules: 'warning',
									duplicateProperties: 'warning',
									emptyProperties: 'warning',
									zeroUnits: 'warning',
									importStatements: 'warning',
									boxModel: 'warning',
									universalSelector: 'warning',
									unqualifiedAttributes: 'warning',
									important: 'warning',
									float: 'warning',
									idSelector: 'warning',
								},
							});

							// Add custom completion provider for CSS
							monaco.languages.registerCompletionItemProvider(
								'css',
								{
									provideCompletionItems: (
										model,
										position
									) => {
										const textUntilPosition =
											model.getValueInRange({
												startLineNumber:
													position.lineNumber,
												startColumn: 1,
												endLineNumber:
													position.lineNumber,
												endColumn: position.column,
											});

										// Check if user is typing a selector
										if (
											textUntilPosition
												.trim()
												.endsWith('.')
										) {
											return {
												suggestions: [
													{
														label: '.block',
														kind: monaco.languages
															.CompletionItemKind
															.Class,
														insertText:
															'.block {\n\t$0\n}',
														insertTextRules:
															monaco.languages
																.CompletionItemInsertTextRule
																.InsertAsSnippet,
														documentation: __(
															'Target the current block',
															'blockera'
														),
														detail: __(
															'Current Block',
															'blockera'
														),
														sortText: '.block',
														range: {
															startLineNumber:
																position.lineNumber,
															startColumn:
																position.column -
																1,
															endLineNumber:
																position.lineNumber,
															endColumn:
																position.column,
														},
													},
													{
														label: '.block:hover',
														kind: monaco.languages
															.CompletionItemKind
															.Class,
														insertText:
															'.block:hover {\n\t$0\n}',
														insertTextRules:
															monaco.languages
																.CompletionItemInsertTextRule
																.InsertAsSnippet,
														documentation: __(
															'Target the current block on hover',
															'blockera'
														),
														detail: __(
															'Current Block on Hover',
															'blockera'
														),
														sortText:
															'.block:hover',
														range: {
															startLineNumber:
																position.lineNumber,
															startColumn:
																position.column -
																1,
															endLineNumber:
																position.lineNumber,
															endColumn:
																position.column,
														},
													},
												],
											};
										}

										// Check if user is typing a CSS variable
										const text = model.getValueInRange({
											startLineNumber:
												position.lineNumber,
											startColumn: Math.max(
												1,
												position.column - 10
											),
											endLineNumber: position.lineNumber,
											endColumn: position.column,
										});

										// Check for -- at the end
										const isDoubleDash =
											text.endsWith('--');

										if (isDoubleDash) {
											const rawSuggestions =
												getVariableSuggestions();
											const suggestions =
												rawSuggestions.map(
													(suggestion) => ({
														...suggestion,
														kind:
															suggestion.kind ===
															'color'
																? monaco
																		.languages
																		.CompletionItemKind
																		.Color
																: monaco
																		.languages
																		.CompletionItemKind
																		.Unit,
														range: {
															startLineNumber:
																position.lineNumber,
															startColumn:
																position.column -
																2,
															endLineNumber:
																position.lineNumber,
															endColumn:
																position.column,
														},
													})
												);

											return { suggestions };
										}

										return { suggestions: [] };
									},
								}
							);

							setShowPlaceholder(value === '');
							monaco.blockeraInitialised = true;
						}
					}}
					onMount={(editor: any) => {
						editorRef.current = editor;

						if (value !== editor.getValue()) {
							editor.setValue(value);
						}

						// Set cursor position between curly braces for CSS
						if (lang === 'css' && value === '.block {\n    \n}\n') {
							const position = editor.getPosition();
							if (position) {
								editor.setPosition({
									lineNumber: 2,
									column: 4,
								});
							}
						}
					}}
				/>

				{showPlaceholder && (
					<div
						className={controlInnerClassNames(
							'code-control__placeholder'
						)}
					>
						{placeholder}
					</div>
				)}

				{description && (
					<div
						className={controlInnerClassNames(
							'code-control__description'
						)}
					>
						{description}
					</div>
				)}
			</div>
		</BaseControl>
	);
};

export default CodeControl;
