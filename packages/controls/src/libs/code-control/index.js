// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { css, cssCompletionSource } from '@codemirror/lang-css';
import { autocompletion } from '@codemirror/autocomplete';

/**
 * Publisher dependencies
 */
import {
	controlClassNames,
	controlInnerClassNames,
} from '@publisher/classnames';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import { useControlContext } from '../../context';
import { cssPropertyCompletions } from './completions/css-properties';
import { cssSelectorCompletions } from './completions/css-selectors';
import type { CodeControlProps, CodeControlOptionsTypes } from './types';
import { espressoLightTheme } from './themes/espresso-theme';

export const CodeControlOptions: CodeControlOptionsTypes = {
	lineNumbers: true,
	highlightActiveLineGutter: true,
	highlightSpecialChars: true,
	history: true,
	foldGutter: false,
	drawSelection: true,
	dropCursor: true,
	allowMultipleSelections: false,
	indentOnInput: true,
	syntaxHighlighting: true,
	bracketMatching: true,
	closeBrackets: true,
	autocompletion: true,
	rectangularSelection: false,
	crosshairCursor: false,
	highlightActiveLine: true,
	highlightSelectionMatches: true,
	closeBracketsKeymap: true,
	defaultKeymap: true,
	searchKeymap: false,
	historyKeymap: true,
	foldKeymap: true,
	completionKeymap: true,
	lintKeymap: true,
};

const CodeControl = ({
	lang = 'css',
	height = '',
	minHeight = '300px',
	maxHeight = '500px',
	width,
	minWidth,
	maxWidth,
	placeholder = '',
	theme = 'light',
	basicSetup = {},
	editable = true,
	readOnly = false,
	indentWithTab = true,
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
							{__(
								'Use ".block" to target the block.',
								'publisher-core'
							)}
						</p>
						<p>
							{__(
								'By typing the smart autocomplete will help you to write style code easily.',
								'publisher-core'
							)}
						</p>
					</>
				);
			}

			if (!placeholder) {
				placeholder = `.block {\n  /* Your CSS here */\n}\n`;
			}

			break;
	}

	return (
		<BaseControl columns={columns} controlName={field} {...labelProps}>
			<div className={controlClassNames('code', className)}>
				<CodeMirror
					value={value}
					height={height}
					minHeight={minHeight}
					maxHeight={maxHeight}
					width={width}
					minWidth={minWidth}
					maxWidth={maxWidth}
					placeholder={placeholder}
					theme={theme}
					basicSetup={{
						...CodeControlOptions,
						...basicSetup,
					}}
					editable={editable}
					readOnly={readOnly}
					indentWithTab={indentWithTab}
					extensions={
						lang === 'css'
							? [
									css(),
									autocompletion({
										override: [
											cssSelectorCompletions,
											cssPropertyCompletions,
											cssCompletionSource,
										],
									}),
									espressoLightTheme,
							  ]
							: [javascript({ jsx: false }), espressoLightTheme]
					}
					onChange={setValue}
				/>

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
