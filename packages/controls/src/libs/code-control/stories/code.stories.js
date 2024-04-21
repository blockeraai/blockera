/**
 * External dependencies
 */
import { nanoid } from 'nanoid';

/**
 * Blockera dependencies
 */
import { default as Decorators } from '@blockera/storybook/decorators';
import { Flex } from '@blockera/components';

/**
 * Internal dependencies
 */
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { ControlContextProvider } from '../../../index';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';
import CodeControl from '../index';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/CodeControl',
	component: CodeControl,
	tags: ['autodocs'],
};

export const All = {
	args: {
		value: '',
		css: `@import url(...);

.block {
  content: ' ';
  position: absolute;
}

@font-face {
  font-family: 'font-name';
  src: url('.eot');
  src: url('.eot?#iefix') format('embedded-opentype'),
     url('.woff') format('woff'),
     url('.ttf') format('truetype'),
     url('.svg#font-name') format('svg');
  font-style: normal;
  font-weight: normal;
}

/* Mobile devices */
@media only screen and (max-width: 600px) {
  /* Your CSS here */
}

.blockera-control.blockera-control-checkbox {
  margin: 0 !important;
  font-size: 12px;
  display: flex;
  align-items: center;

}

.components-checkbox-control__input[type="checkbox"] {
  border-color: var(--blockera-controls-border-color);
}

.components-checkbox-control__input[type="checkbox"] {
  border-color: var(--blockera-controls-border-color);
}

`,
	},
	decorators: [
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
	render: (args) => {
		return (
			<Flex direction="column" gap="30px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">JavaScript</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: args.value,
						}}
					>
						<ControlWithHooks
							Control={CodeControl}
							{...args}
							lang="javascript"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						CSS<span>Empty</span>
					</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: args.value,
						}}
					>
						<ControlWithHooks
							Control={CodeControl}
							{...args}
							lang="css"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						CSS<span>Filled</span>
					</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: args.css,
						}}
					>
						<ControlWithHooks
							Control={CodeControl}
							{...args}
							lang="css"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						CSS<span>Read Only</span>
					</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: args.css,
						}}
					>
						<ControlWithHooks
							Control={CodeControl}
							{...args}
							lang="css"
							readOnly={true}
							editable={false}
						/>
					</ControlContextProvider>
				</Flex>
			</Flex>
		);
	},
};
