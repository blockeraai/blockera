import { CssInputControl } from '../css-input';
import {
	decorators,
	inspectDecorator,
} from '../../../../../.storybook/preview';

export default {
	title: 'Controls/Css Input Control',
	component: CssInputControl,
};

export const BoxShadowUintType = {
	args: {
		unitType: 'box-shadow',
	},
	decorators: [inspectDecorator, ...decorators],
};
