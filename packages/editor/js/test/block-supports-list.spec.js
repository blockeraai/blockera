/**
 * External dependencies
 */
import Ajv from 'ajv';

/**
 * Internal dependencies
 */
import schema from '../schemas/block.supports.schema.json';
import background from '../schemas/block-supports/background-block-supports-list.json';
import border from '../schemas/block-supports/border-block-supports-list.json';
import boxShadow from '../schemas/block-supports/box-shadow-block-supports-list.json';
import divider from '../schemas/block-supports/divider-block-supports-list.json';
import effects from '../schemas/block-supports/effects-block-supports-list.json';
import layout from '../schemas/block-supports/layout-block-supports-list.json';
import mouse from '../schemas/block-supports/mouse-block-supports-list.json';
import outline from '../schemas/block-supports/outline-block-supports-list.json';
import position from '../schemas/block-supports/position-block-supports-list.json';
import size from '../schemas/block-supports/size-block-supports-list.json';
import spacing from '../schemas/block-supports/spacing-block-supports-list.json';
import textShadow from '../schemas/block-supports/text-shadow-block-supports-list.json';
import typography from '../schemas/block-supports/typography-block-supports-list.json';

const ajv = new Ajv({ allowUnionTypes: true });

[
	'background',
	'border',
	'boxShadow',
	'divider',
	'effects',
	'layout',
	'mouse',
	'outline',
	'position',
	'size',
	'spacing',
	'textShadow',
	'typography',
].forEach((support) => {
	switch (support) {
		case 'background':
			var supports = background;
			break;

		case 'border':
			var supports = border;
			break;

		case 'boxShadow':
			var supports = boxShadow;
			break;
		case 'divider':
			var supports = divider;
			break;
		case 'effects':
			var supports = effects;
			break;
		case 'layout':
			var supports = layout;
			break;
		case 'mouse':
			var supports = mouse;
			break;
		case 'outline':
			var supports = outline;
			break;
		case 'position':
			var supports = position;
			break;
		case 'size':
			var supports = size;
			break;
		case 'spacing':
			var supports = spacing;
			break;
		case 'textShadow':
			var supports = textShadow;
			break;
		case 'typography':
			var supports = typography;
			break;
	}
	describe(`Validate blockera ${support} supports of Block Supports JSON`, () => {
		test('Validate file with schema', () => {
			const validate = ajv.compile(schema);
			const valid = validate(supports);

			// show log for debug
			if (!valid) console.log(validate.errors);

			expect(true).toBe(valid);
		});
	});
});
