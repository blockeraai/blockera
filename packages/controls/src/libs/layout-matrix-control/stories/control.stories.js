/**
 * External dependencies
 */
import { nanoid } from 'nanoid';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { default as LayoutMatrixControl } from '../index';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';
import { ControlContextProvider } from '../../../context';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);
SharedDecorators.push(WithControlDataProvider);

export default {
	title: 'Controls/LayoutMatrixControl',
	component: LayoutMatrixControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		inputFields: false,
		controlInfo: {
			alignItems: '',
			JustifyContent: '',
			direction: 'row',
			dense: '',
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const Row = {
	args: {
		value: {
			alignItems: '',
			JustifyContent: '',
			direction: 'row',
			dense: '',
		},
		label: 'Layout',
		columns: 'columns-2',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="100px">
			<Flex direction="column" gap="30px">
				<h2 className="story-heading">Row → Normal</h2>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Empty</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: '',
								justifyContent: '',
								direction: 'row',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Only Align Items</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'center',
								justifyContent: '',
								direction: 'row',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Only Justify Content</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: '',
								justifyContent: 'center',
								direction: 'row',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Top Left</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'flex-start',
								justifyContent: 'flex-start',
								direction: 'row',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Top Center</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'flex-start',
								justifyContent: 'center',
								direction: 'row',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Top Right</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'flex-start',
								justifyContent: 'flex-end',
								direction: 'row',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Center Left</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'center',
								justifyContent: 'flex-start',
								direction: 'row',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Center Center</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'center',
								justifyContent: 'center',
								direction: 'row',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Center Right</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'center',
								justifyContent: 'flex-end',
								direction: 'row',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Bottom Left</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'flex-end',
								justifyContent: 'flex-start',
								direction: 'row',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Bottom Center</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'flex-end',
								justifyContent: 'center',
								direction: 'row',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Bottom Right</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'flex-end',
								justifyContent: 'flex-end',
								direction: 'row',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>
			</Flex>

			<Flex direction="column" gap="30px">
				<h2 className="story-heading">Row → Stretch</h2>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Stretch Left</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'stretch',
								justifyContent: 'flex-start',
								direction: 'row',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Stretch Center</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'stretch',
								justifyContent: 'center',
								direction: 'row',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Stretch Right</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'stretch',
								justifyContent: 'flex-end',
								direction: 'row',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Stretch + Space Between</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'stretch',
								justifyContent: 'space-between',
								direction: 'row',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Stretch + Space Around</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'stretch',
								justifyContent: 'space-around',
								direction: 'row',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>
			</Flex>

			<Flex direction="column" gap="30px">
				<h2 className="story-heading">Row → Space Between</h2>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Left</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'flex-start',
								justifyContent: 'space-between',
								direction: 'row',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Center</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'center',
								justifyContent: 'space-between',
								direction: 'row',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Right</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'flex-end',
								justifyContent: 'space-between',
								direction: 'row',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>
			</Flex>

			<Flex direction="column" gap="30px">
				<h2 className="story-heading">Row → Space Around</h2>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Left</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'flex-start',
								justifyContent: 'space-around',
								direction: 'row',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Center</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'center',
								justifyContent: 'space-around',
								direction: 'row',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Right</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'flex-end',
								justifyContent: 'space-around',
								direction: 'row',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>
			</Flex>
		</Flex>
	),
};

export const Column = {
	args: {
		value: {
			alignItems: '',
			JustifyContent: '',
			direction: 'column',
			dense: '',
		},
		label: 'Layout',
		columns: 'columns-2',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="100px">
			<Flex direction="column" gap="30px">
				<h2 className="story-heading">Column → Normal</h2>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Empty</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: '',
								justifyContent: '',
								direction: 'column',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Only Align Items</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'center',
								justifyContent: '',
								direction: 'column',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Only Justify Content</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: '',
								justifyContent: 'center',
								direction: 'column',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Top Left</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'flex-start',
								justifyContent: 'flex-start',
								direction: 'column',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Top Center</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'flex-start',
								justifyContent: 'center',
								direction: 'column',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Top Right</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'flex-start',
								justifyContent: 'flex-end',
								direction: 'column',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Center Left</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'center',
								justifyContent: 'flex-start',
								direction: 'column',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Center Center</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'center',
								justifyContent: 'center',
								direction: 'column',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Center Right</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'center',
								justifyContent: 'flex-end',
								direction: 'column',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Bottom Left</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'flex-end',
								justifyContent: 'flex-start',
								direction: 'column',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Bottom Center</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'flex-end',
								justifyContent: 'center',
								direction: 'column',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Bottom Right</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'flex-end',
								justifyContent: 'flex-end',
								direction: 'column',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>
			</Flex>

			<Flex direction="column" gap="30px">
				<h2 className="story-heading">Column → Stretch</h2>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Stretch Left</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'stretch',
								justifyContent: 'flex-start',
								direction: 'column',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Stretch Center</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'stretch',
								justifyContent: 'center',
								direction: 'column',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Stretch Right</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'stretch',
								justifyContent: 'flex-end',
								direction: 'column',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Stretch + Space Between</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'stretch',
								justifyContent: 'space-between',
								direction: 'column',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Stretch + Space Around</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'stretch',
								justifyContent: 'space-around',
								direction: 'column',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>
			</Flex>

			<Flex direction="column" gap="30px">
				<h2 className="story-heading">Column → Space Between</h2>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Left</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'flex-start',
								justifyContent: 'space-between',
								direction: 'column',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Center</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'center',
								justifyContent: 'space-between',
								direction: 'column',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Right</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'flex-end',
								justifyContent: 'space-between',
								direction: 'column',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>
			</Flex>

			<Flex direction="column" gap="30px">
				<h2 className="story-heading">Column → Space Around</h2>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Left</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'flex-start',
								justifyContent: 'space-around',
								direction: 'column',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Center</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'center',
								justifyContent: 'space-around',
								direction: 'column',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Right</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: 'flex-end',
								justifyContent: 'space-around',
								direction: 'column',
								dense: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
						/>
					</ControlContextProvider>
				</Flex>
			</Flex>
		</Flex>
	),
};

export const DisableDirection = {
	args: {
		value: {
			alignItems: '',
			JustifyContent: '',
		},
		label: 'Layout',
		columns: 'columns-2',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="100px">
			<Flex direction="column" gap="30px">
				<h2 className="story-heading">Disable Direction</h2>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Row Direction</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: '',
								justifyContent: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
							isDirectionActive={false}
							defaultDirection="row"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Column Direction</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: '',
								justifyContent: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
							isDirectionActive={false}
							defaultDirection="column"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Direction From defaultValue
					</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: '',
								justifyContent: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
							isDirectionActive={false}
							defaultValue={{
								direction: 'column',
							}}
						/>
					</ControlContextProvider>
				</Flex>
			</Flex>
		</Flex>
	),
};

export const ActiveDense = {
	args: {
		value: {
			alignItems: '',
			JustifyContent: '',
		},
		label: 'Layout',
		columns: 'columns-2',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="100px">
			<Flex direction="column" gap="30px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Row Direction</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
							value: {
								alignItems: '',
								justifyContent: '',
							},
						}}
					>
						<ControlWithHooks
							Control={LayoutMatrixControl}
							{...args}
							isDenseActive={true}
						/>
					</ControlContextProvider>
				</Flex>
			</Flex>
		</Flex>
	),
};
