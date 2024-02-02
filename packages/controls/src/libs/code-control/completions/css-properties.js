// @flow
/**
 * External dependencies
 */
import { syntaxTree } from '@codemirror/language';

export const cssPropertySmartCompletion = {
	'align-items': 'start|end|flex-start|flex-end|center|baseline|stretch',
	'align-content':
		'start|end|flex-start|flex-end|center|space-between|space-around|stretch|space-evenly',
	animation: 'name duration timing-function delay iteration-count',
	'animation-direction': 'normal|reverse|alternate|alternate-reverse',
	'animation-duration': '1s',
	'animation-fill-mode': 'both|forwards|backwards',
	'animation-iteration-count': 'infinite',
	'animation-name': 'name',
	'animation-play-state': 'running|paused',
	'animation-timing-function': 'linear|ease|ease-in|ease-out|ease-in-out',
	appearance: 'none',
	'align-self': 'start|end|auto|flex-start|flex-end|center|baseline|stretch',
	border: '1px solid #eee',
	'border-right': '1px solid #eee',
	'border-bottom': '1px solid #eee',
	'border-left': '1px solid #eee',
	'border-top': '1px solid #eee',
	'border-color': '#eee',
	'border-style': 'solid|dashed|double|none',
	'border-width': '1px|initial',
	top: '10px|initial',
	right: '10px|initial',
	bottom: '10px|initial',
	left: '10px|initial',
	'border-radius': '5px|initial',
	'backface-visibility': 'hidden|visible',
	background: '#eee',
	'background-color': '#eee',
	'background-attachment': 'fixed|scroll',
	'background-clip': 'padding-box|border-box|content-box|no-clip',
	'background-image': 'url(...)|linear-gradient(...)',
	'background-origin': 'padding-box|border-box|content-box',
	'background-position': '50% 50%',
	'background-position-x': '50%',
	'background-position-y': '50%',
	'background-repeat': 'no-repeat|repeat-x|repeat-y|space|round',
	'background-size': 'contain|cover',
	'box-shadow': '10px 10px 5px #eee',
	'box-sizing': 'border-box|content-box',
	color: '#000',
	clear: 'both|left|right|none',
	content:
		"''|normal|open-quote|no-open-quote|close-quote|no-close-quote|attr()|counter()|counters()",
	'counter-increment': 'counter-name|none',
	columns: '2|initial|auto',
	'column-count': '2|initial|auto',
	'column-fill': 'balance|balance-all|auto',
	'column-gap': '2rem',
	'column-rule': 'dotted 1px #000',
	'column-rule-color': '#000',
	'column-rule-style': 'solid|dotted',
	'column-rule-width': '1px',
	'column-span': 'none|all',
	'column-width': '100px|auto',
	'counter-reset': 'counter-name|reversed(counter-name)',
	'clip-path': 'url(...)|none',
	'caption-side': 'top|bottom',
	cursor: 'pointer|auto|default|crosshair|hand|help|move|pointer|text',
	display:
		'none|block|flex|inline-flex|inline|inline-block|grid|inline-grid|subgrid|list-item|table|inline-table|table-caption|table-column|table-column-group|table-header-group|table-footer-group|table-row|table-row-group|table-cell',
	'empty-cells': 'show|hide',
	font: "'font-name' , sans-serif",
	'font-family': "'font-name'|serif|sans-serif|cursive|fantasy|monospace",
	float: 'left|right|none',
	'font-style': 'italic|normal|oblique',
	'font-smoothing': 'antialiased|subpixel-antialiased|none',
	'font-stretch':
		'normal|ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded',
	'font-weight': 'normal|bold|bolder|lighter',
	'line-height': '1.2',
	'letter-spacing': '1px|normal',
	'text-align': 'left|center|right|justify',
	'font-size': '16px',
	'text-decoration': 'none|underline|overline|line-through',
	'text-overflow': 'ellipsis|clip',
	'text-shadow': '2px 2px 2px #000',
	'text-transform': 'uppercase|lowercase|capitalize|none',
	'text-wrap': 'none|normal|unrestricted|suppress',
	'white-space': 'nowrap|pre|pre-wrap|pre-line|normal',
	'writing-mode': 'lr-tb|lr-tb|lr-bt|rl-tb|rl-bt|tb-rl|tb-lr|bt-lr|bt-rl',
	'word-break': 'keep-all|break-all|normal',
	'word-wrap': 'none|unrestricted|suppress|break-word|normal',
	'user-select': 'none|all|text',
	flex: '1',
	'flex-basis': 'fill|max-content|min-content|fit-content|content',
	'flex-direction': 'row|column|row-reverse|column-reverse',
	'flex-flow': 'row|column|row-reverse|column-reverse',
	'flex-grow': '1',
	'flex-shrink': '1',
	'flex-wrap': 'nowrap|wrap|wrap-reverse',
	'vertical-align':
		'top|super|text-top|middle|baseline|bottom|text-bottom|sub',
	'grid-template-columns': '2fr 1fr|repeat(...)|minmax(...)',
	'grid-template-rows': '2fr 1fr|repeat(...)|minmax(...)',
	'grid-gap': '10px',
	'grid-column-gap': '10px',
	'grid-row-gap': '10px',
	'grid-auto-columns': 'auto|minmax(...)',
	'grid-auto-rows': 'auto|minmax(...)',
	'grid-auto-flow': 'row|column|dense|inherit|initial|unset',
	'grid-column': '1| 1 / 3',
	'grid-row': '1| 1 / 3',
	height: '100px|100vh|100%',
	'max-height': '100px|100vh|100%',
	'min-height': '100px|100vh|100%',
	width: '100px|100vh|100%',
	'max-width': '100px|100vh|100%',
	'min-width': '100px|100vh|100%',
	'justify-content':
		'start|end|stretch|flex-start|flex-end|center|space-between|space-around|space-evenly',
	'justify-items': 'start|end|center|stretch',
	'justify-self': 'start|end|center|stretch',
	'list-style': 'none|disc|circle|square|decimal',
	'list-style-type': 'none|disc|circle|square|decimal',
	'list-style-position': 'inside|outside',
	margin: '10px|initial',
	'margin-top': '10px|initial',
	'margin-right': '10px|initial',
	'margin-bottom': '10px|initial',
	'margin-left': '10px|initial',
	padding: '10px|initial',
	'padding-top': '10px|initial',
	'padding-right': '10px|initial',
	'padding-bottom': '10px|initial',
	'padding-left': '10px|initial',
	outline: '2px solid #eee',
	'outline-offset': '5px',
	'outline-style':
		'none|dotted|dashed|solid|double|groove|ridge|inset|outset',
	opacity: '100%|50%|0',
	order: '0|99|initial',
	overflow: 'hidden|visible|hidden|scroll|auto',
	'overflow-x': 'hidden|visible|hidden|scroll|auto',
	'overflow-y': 'hidden|visible|hidden|scroll|auto',
	position: 'relative|absolute|relative|fixed|static',
	transform: 'translate(10px, 10px)|scale(1.2)|rotate(45deg)',
	'transform-origin': 'center|top left|top right|bottom left|bottom right',
	transition: 'all 0.5s ease',
	'transition-delay': '100ms|initial',
	'transition-duration': '500ms|initial',
	'transition-property': 'all|initial|color|opacity',
	visibility: 'hidden|visible|collapse',
	'z-index': '1|100|auto',
	zoom: '1|0.5',
};

export function cssPropertyCompletions(context: Object): null | Object {
	// Match any non-space characters before the cursor
	const beforeCursor = context.matchBefore(/[^\s]*/);

	if (!beforeCursor) return null;

	const { state, pos } = context;
	const node = syntaxTree(state).resolveInner(pos, -1);

	const isDash =
		node.type.isError &&
		node.from === node.to - 1 &&
		state.doc.sliceString(node.from, node.to) === '-';

	// it's a css property
	if (
		node.name === 'PropertyName' ||
		((isDash || node.name === 'TagName') &&
			/^(Block|Styles)$/.test(node.resolve(node.to).name))
	) {
		const suggestions = [];

		Object.keys(cssPropertySmartCompletion).forEach(function (key) {
			let property: string = key;
			let value = cssPropertySmartCompletion[key];

			// if it includes ${} it means the value is in another object item
			if (value.includes('${')) {
				const match = value.match(/\$\{(.*)\}/);

				if (match === null || !match[1]) return;

				property = match[1];
				value = cssPropertySmartCompletion[property];
			}

			if (
				beforeCursor.text.startsWith(key) ||
				key.startsWith(beforeCursor.text)
			) {
				// value is an array
				// then it should suggest all items
				if (value.includes('|')) {
					const items = value.split('|');

					function pushSuggestion(item: string, boost: number = 98) {
						suggestions.push({
							label: `${property}: ${item};`,
							type: 'snippet',
							boost,
							apply: (
								view: Object,
								completion: Object,
								from: number,
								to: number
							) => {
								const insertText = completion.label;

								const insertPos =
									from + insertText.indexOf(item);

								view.dispatch({
									changes: {
										from,
										to,
										insert: insertText,
									},
									selection: {
										anchor: insertPos,
										head: insertPos + item.length,
									},
								});
							},
						});
					}

					// if the value is the same as the key
					// then suggest all items separately
					if (beforeCursor.text === key) {
						items.forEach((item, index) => {
							// first item on top
							pushSuggestion(item, index === 0 ? 95 : 90);
						});
					} else {
						items.forEach((item) => {
							if (property.includes('-')) {
								pushSuggestion(item, 90);
							} else {
								pushSuggestion(item, 99);
							}
						});
					}
				} else {
					suggestions.push({
						label: `${property}: ${value};`,
						type: 'snippet',
						boost: property.includes('-') ? 90 : 99,
						apply: (
							view: Object,
							completion: Object,
							from: number,
							to: number
						) => {
							const insertText = completion.label;

							if (!insertText.includes(': ')) {
								return;
							}

							const item = insertText.split(': ')[1];

							const insertPos = from + insertText.indexOf(item);

							view.dispatch({
								changes: {
									from,
									to,
									insert: insertText,
								},
							});

							// value includes space for example "1px solid #eee"
							// and should select first item, "1px"
							if (
								insertText.indexOf(
									' ',
									insertText.indexOf(': ') + 2
								)
							) {
								const head =
									from +
									insertText.indexOf(
										' ',
										insertText.indexOf(': ') + 2
									);

								view.dispatch({
									selection: {
										anchor: insertPos,
										head,
									},
								});
							} else {
								view.dispatch({
									selection: {
										anchor: insertPos,
										head: insertPos + item.length,
									},
								});
							}
						},
					});
				}
			}
		});

		if (suggestions.length > 0) {
			return {
				from: beforeCursor.from,
				options: suggestions,
			};
		}
	}

	return null;
}
