// @flow
/**
 * External dependencies
 */
import { syntaxTree } from '@codemirror/language';

export function cssSelectorCompletions(context: Object): null | Object {
	const { state, pos } = context,
		node = syntaxTree(state).resolveInner(pos, -1);

	//
	// Media Queries
	//
	if (node.name === 'AtKeyword' || node.name === 'media') {
		// Match any non-space characters before the cursor
		const beforeCursor = context.matchBefore(/[^\s]*/);

		for (let { parent } = node; parent; parent = parent.parent)
			if (parent.name === 'Block') return null;

		if ('@media'.includes(beforeCursor.text)) {
			const placeholder = '/* Your CSS here */';

			return {
				from: beforeCursor.from,
				options: [
					{
						label: '@media (max-width: 600px) {...}', // Truncated label for display
						type: 'keyword',
						apply: (view, completion, from, to) => {
							const insertText = `/* Mobile devices */\n@media only screen and (max-width: 600px) {\n  ${placeholder}\n}`;
							const insertPos =
								from + insertText.indexOf(placeholder);

							view.dispatch({
								changes: { from, to, insert: insertText },
								selection: {
									anchor: insertPos,
									head:
										from +
										insertText.indexOf(placeholder) +
										placeholder.length,
								},
							});
						},
					},
					{
						label: '@media (max-width: 900px) {...}', // Truncated label for display
						type: 'keyword',
						apply: (view, completion, from, to) => {
							const insertText = `/* Tablet devices */\n@media only screen and (max-width: 900px) {\n  ${placeholder}\n}`;
							const insertPos =
								from + insertText.indexOf(placeholder);

							view.dispatch({
								changes: { from, to, insert: insertText },
								selection: {
									anchor: insertPos,
									head:
										from +
										insertText.indexOf(placeholder) +
										placeholder.length,
								},
							});
						},
					},
					{
						label: '@media (min-width: 901px) {...}', // Truncated label for display
						type: 'keyword',
						apply: (view, completion, from, to) => {
							const insertText = `/* Desktop devices */\n@media only screen and (min-width: 901px) {\n  ${placeholder}\n}`;
							const insertPos =
								from + insertText.indexOf(placeholder);

							view.dispatch({
								changes: { from, to, insert: insertText },
								selection: {
									anchor: insertPos,
									head:
										from +
										insertText.indexOf(placeholder) +
										placeholder.length,
								},
							});
						},
					},
				],
			};
		}
	}

	//
	// Import
	//
	if (node.name === 'AtKeyword' || node.name === 'import') {
		const beforeCursor = context.matchBefore(/[^\s]*/);

		for (let { parent } = node; parent; parent = parent.parent)
			if (parent.name === 'Block') return null;

		if ('@import'.includes(beforeCursor.text)) {
			return {
				from: beforeCursor.from,
				options: [
					{
						label: '@import url(...);', // Truncated label for display
						type: 'keyword',
						apply: (view, completion, from, to) => {
							const insertText = completion.label;
							const insertPos = from + insertText.indexOf('...');

							view.dispatch({
								changes: { from, to, insert: insertText },
								selection: {
									anchor: insertPos,
									head: from + insertText.indexOf('...') + 3,
								},
							});
						},
					},
				],
			};
		}
	}

	//
	// Keyframes
	//
	if (node.name === 'AtKeyword' || node.name === 'keyframes') {
		const beforeCursor = context.matchBefore(/[^\s]*/);

		for (let { parent } = node; parent; parent = parent.parent)
			if (parent.name === 'Block') return null;

		if ('@keyframes'.includes(beforeCursor.text)) {
			return {
				from: beforeCursor.from,
				options: [
					{
						label: '@keyframes slidein ...',
						type: 'keyword',
						apply: (view, completion, from, to) => {
							const insertText = `@keyframes slidein {
  from {
    transform: translateX(0%);
  }

  to {
    transform: translateX(100%);
  }
}\n`;
							const insertPos = from + insertText.indexOf('0%');

							view.dispatch({
								changes: { from, to, insert: insertText },
								selection: {
									anchor: insertPos,
									head: from + insertText.indexOf('0%') + 2,
								},
							});
						},
					},
				],
			};
		}
	}

	//
	// Font Face
	//
	if (node.name === 'AtKeyword' || node.name === 'font-face') {
		// Match any non-space characters before the cursor
		const beforeCursor = context.matchBefore(/[^\s]*/);

		for (let { parent } = node; parent; parent = parent.parent)
			if (parent.name === 'Block') return null;

		if ('@font-face'.includes(beforeCursor.text)) {
			const placeholder = 'font-name';

			return {
				from: beforeCursor.from,
				options: [
					{
						label: '@font-face (simple)', // Truncated label for display
						type: 'keyword',
						apply: (view, completion, from, to) => {
							const insertText = `@font-face {\n  font-family: 'font-name';\n  src: url(...);\n}\n`;
							const insertPos =
								from + insertText.indexOf(placeholder);

							view.dispatch({
								changes: { from, to, insert: insertText },
								selection: {
									anchor: insertPos,
									head:
										from +
										insertText.indexOf(placeholder) +
										placeholder.length,
								},
							});
						},
					},
					{
						label: '@font-face (advanced)', // Truncated label for display
						type: 'keyword',
						apply: (view, completion, from, to) => {
							const insertText = `@font-face {\n  font-family: 'font-name';\n  src: url('.eot');\n  src: url('.eot?#iefix') format('embedded-opentype'),\n     url('.woff') format('woff'),\n     url('.ttf') format('truetype'),\n     url('.svg#font-name') format('svg');\n  font-style: normal;\n  font-weight: normal;\n}\n`;
							const insertPos =
								from + insertText.indexOf(placeholder);

							view.dispatch({
								changes: { from, to, insert: insertText },
								selection: {
									anchor: insertPos,
									head:
										from +
										insertText.indexOf(placeholder) +
										placeholder.length,
								},
							});
						},
					},
				],
			};
		}
	}

	//
	// Class Selector
	//
	if (node.name === 'ClassSelector' || node.name === 'ClassName') {
		// Match any non-space characters before the cursor
		const beforeCursor = context.matchBefore(/[^\s]*/);

		if (
			'.'.includes(beforeCursor.text) ||
			'.block'.includes(beforeCursor.text)
		) {
			return {
				from: beforeCursor.from,
				options: [
					{
						label: '.block {}', // Truncated label for display
						type: 'keyword',
						apply: (view, completion, from, to) => {
							const insertText = `.block {\n  \n}\n`;

							view.dispatch({
								changes: { from, to, insert: insertText },
								selection: {
									anchor:
										from +
										insertText.indexOf('  ') +
										'  '.length,
								},
							});
						},
					},
				],
			};
		}
	}
}
