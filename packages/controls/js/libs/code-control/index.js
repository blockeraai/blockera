// @flow

/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useState, useRef } from '@wordpress/element';
import { Editor } from '@monaco-editor/react';

/**
 * Blockera dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@blockera/classnames';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import { DynamicHtmlFormatter } from '../';
import { useControlContext } from '../../context';
import type { CodeControlProps } from './types';

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
														insertText: '.block',
														documentation: __(
															'Target the current block',
															'blockera'
														),
														detail: __(
															'Blockera Block Selector',
															'blockera'
														),
													},
												],
											};
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
