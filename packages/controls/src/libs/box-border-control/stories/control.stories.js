/**
 * External dependencies
 */
import { fireEvent, waitFor, within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { nanoid } from 'nanoid';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { BoxBorderControl } from '../../index';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { ControlContextProvider } from '../../../context';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';

const { WithInspectorStyles, WithStoryContextProvider, SharedDecorators } =
	Decorators;
SharedDecorators.push( WithPlaygroundStyles );

export default {
	title: 'Controls/BoxBorderControl',
	component: BoxBorderControl,
	tags: [ 'autodocs' ],
};

export const Default = {
	args: {
		label: 'Border Line',
		value: {
			type: 'all',
			all: {
				width: '2px',
				style: 'solid',
				color: '#0947eb',
			},
		},
	},
	decorators: [ WithInspectorStyles, ...SharedDecorators ],
	render: ( args ) => (
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">
				Box Border<span>Empty</span>
			</h2>

			<ControlContextProvider
				value={ {
					name: nanoid(),
					value: args.value,
				} }
			>
				<ControlWithHooks Control={ BoxBorderControl } { ...args } />
			</ControlContextProvider>
		</Flex>
	),
};

export const AllBorders = {
	args: {
		label: 'Border Line',
		value: {
			type: 'all',
			all: {
				width: '2px',
				style: 'solid',
				color: '#0947eb',
			},
		},
	},
	decorators: [ WithInspectorStyles, ...SharedDecorators ],
	render: ( args ) => (
		<Flex direction="column" gap="20px">
			<h2 className="story-heading">All Borders</h2>
			<ControlContextProvider
				value={ {
					name: nanoid(),
					value: args.value,
				} }
			>
				<ControlWithHooks
					Control={ BoxBorderControl }
					{ ...args }
					label="All"
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={ {
					name: nanoid(),
					value: {},
				} }
			>
				<ControlWithHooks
					Control={ BoxBorderControl }
					{ ...args }
					label="Empty"
				/>
			</ControlContextProvider>
		</Flex>
	),
};

export const CustomBorders = {
	args: {
		label: 'Border Line',
		value: {
			type: 'all',
			all: {
				width: '2px',
				style: 'solid',
				color: '#0947eb',
			},
		},
	},
	decorators: [ WithInspectorStyles, ...SharedDecorators ],
	render: ( args ) => (
		<Flex direction="column" gap="15px">
			<h2 className="story-heading">Custom Borders</h2>

			<ControlContextProvider
				value={ {
					name: nanoid(),
					value: {
						type: 'custom',
						all: {
							width: '2px',
							style: 'solid',
							color: '#0947eb',
						},
						left: {
							width: '2px',
							style: 'solid',
							color: '#0947eb',
						},
						right: {
							width: '2px',
							style: 'solid',
							color: '#0947eb',
						},
						top: {
							width: '2px',
							style: 'solid',
							color: '#0947eb',
						},
						bottom: {
							width: '2px',
							style: 'solid',
							color: '#0947eb',
						},
					},
				} }
			>
				<ControlWithHooks
					Control={ BoxBorderControl }
					{ ...args }
					label="All Same"
				/>
			</ControlContextProvider>

			<ControlContextProvider
				value={ {
					name: nanoid(),
					value: {
						type: 'custom',
						all: {
							width: '1px',
							style: 'solid',
							color: '#0947eb',
						},
						left: {
							width: '10px',
							style: 'double',
							color: '#5100df',
						},
						right: {
							width: '2px',
							style: 'dashed',
							color: '#009d74',
						},
						top: {
							width: '1px',
							style: 'solid',
							color: '#0947eb',
						},
						bottom: {
							width: '7px',
							style: 'dotted',
							color: '#a92d00',
						},
					},
				} }
			>
				<ControlWithHooks
					Control={ BoxBorderControl }
					{ ...args }
					label="Customized"
				/>
			</ControlContextProvider>
		</Flex>
	),
};

export const PlayAll = {
	args: {
		label: 'Border Line',
		controlInfo: {
			name: nanoid(),
			value: {
				type: 'all',
				all: {
					width: '2px',
					style: 'solid',
					color: '#0947eb',
				},
			},
		},
	},
	decorators: [
		WithStoryContextProvider,
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
	render: ( args ) => (
		<ControlWithHooks Control={ BoxBorderControl } { ...args } />
	),
	play: async ( { canvasElement, step } ) => {
		const canvas = within( canvasElement );

		const currentValue = canvas.getByTestId( 'current-value' );
		const numberInput = canvas.getByRole( 'spinbutton', {
			type: 'number',
		} );

		await step( 'Story data is available', async () => {
			await expect( currentValue ).toBeInTheDocument();
		} );

		await step( 'Input control test', async () => {
			await expect( numberInput ).toBeInTheDocument();

			await expect( numberInput ).toHaveValue( 2 );
			await waitFor(
				async () =>
					await expect( currentValue ).toHaveTextContent(
						'{ "type": "all", "all": { "width": "2px", "style": "solid", "color": "#0947eb" } }'
					),
				{ timeout: 1000 }
			);

			fireEvent.change( numberInput, { target: { value: 20 } } );
			await expect( numberInput ).toHaveValue( 20 );
			await waitFor(
				async () =>
					await expect( currentValue ).toHaveTextContent(
						'{ "type": "all", "all": { "width": "20px", "style": "solid", "color": "#0947eb" } }'
					),
				{ timeout: 1000 }
			);
		} );
	},
};
PlayAll.storyName = 'Play → All Corners';

export const PlayCorner = {
	args: {
		label: 'Border Line',
		controlInfo: {
			name: nanoid(),
			value: {
				type: 'custom',
				all: {
					width: '2px',
					style: 'solid',
					color: '#0947eb',
				},
				top: {
					width: '2px',
					style: 'solid',
					color: '#0947eb',
				},
				right: {
					width: '2px',
					style: 'solid',
					color: '#0947eb',
				},
				bottom: {
					width: '2px',
					style: 'solid',
					color: '#0947eb',
				},
				left: {
					width: '2px',
					style: 'solid',
					color: '#0947eb',
				},
			},
		},
	},
	decorators: [
		WithStoryContextProvider,
		WithInspectorStyles,
		WithControlDataProvider,
		...SharedDecorators,
	],
	render: ( args ) => (
		<ControlWithHooks Control={ BoxBorderControl } { ...args } />
	),
	play: async ( { canvasElement, step } ) => {
		const canvas = within( canvasElement );

		const currentValue = canvas.getByTestId( 'current-value' );
		const numberInput = canvas.getAllByRole( 'spinbutton', {
			type: 'number',
		} );

		await step( 'Story data is available', async () => {
			await expect( currentValue ).toBeInTheDocument();
		} );

		await step( 'Input control test', async () => {
			await expect( numberInput[ 1 ] ).toBeInTheDocument();

			await expect( numberInput[ 1 ] ).toHaveValue( 2 );
			await waitFor(
				async () =>
					await expect( currentValue ).toHaveTextContent(
						'{ "type": "custom", "all": { "width": "2px", "style": "solid", "color": "#0947eb" }, "top": { "width": "2px", "style": "solid", "color": "#0947eb" }, "right": { "width": "2px", "style": "solid", "color": "#0947eb" }, "bottom": { "width": "2px", "style": "solid", "color": "#0947eb" }, "left": { "width": "2px", "style": "solid", "color": "#0947eb" } }'
					),
				{ timeout: 1000 }
			);

			fireEvent.change( numberInput[ 1 ], { target: { value: 20 } } );
			await expect( numberInput[ 1 ] ).toHaveValue( 20 );
			await waitFor(
				async () =>
					await expect( currentValue ).toHaveTextContent(
						'{ "type": "custom", "all": { "width": "2px", "style": "solid", "color": "#0947eb" }, "left": { "width": "2px", "style": "solid", "color": "#0947eb" }, "right": { "width": "20px", "style": "solid", "color": "#0947eb" }, "top": { "width": "2px", "style": "solid", "color": "#0947eb" }, "bottom": { "width": "2px", "style": "solid", "color": "#0947eb" } }'
					),
				{ timeout: 1000 }
			);
		} );
	},
};
PlayCorner.storyName = 'Play → Custom Corners';

export const All = {
	decorators: [ WithInspectorStyles, ...SharedDecorators ],
	render: () => (
		<Flex direction="column" gap="50px">
			<Default.render { ...Default.args } />

			<AllBorders.render { ...AllBorders.args } />

			<CustomBorders.render { ...CustomBorders.args } />
		</Flex>
	),
};
