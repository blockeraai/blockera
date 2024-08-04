/**
 * External dependencies
 */
import { nanoid } from 'nanoid';

/**
 * Blockera dependencies
 */
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';

/**
 * Internal dependencies
 */
import { Flex, NoticeControl } from '../../index';
import { ControlContextProvider } from '../../../context';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import ControlWithHooks from '../../../../../../.storybook/components/control-with-hooks';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/NoticeControl',
	component: NoticeControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => {
		return (
			<Flex direction="column" gap="20px">
				<h2 className="story-heading">Notice</h2>

				<ControlContextProvider
					value={{
						name: nanoid(),
					}}
				>
					<ControlWithHooks
						Control={NoticeControl}
						children="Warning"
					/>
				</ControlContextProvider>
			</Flex>
		);
	},
};

export const States = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => {
		return (
			<Flex direction="column" gap="50px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Notice Control</h2>
					<ControlContextProvider
						value={{
							name: nanoid(),
						}}
					>
						<ControlWithHooks
							Control={NoticeControl}
							type="information"
							label="Information"
							children="Information"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						value={{
							name: nanoid(),
						}}
					>
						<ControlWithHooks
							Control={NoticeControl}
							type="success"
							children="Success"
							label="Success"
						/>
					</ControlContextProvider>
				</Flex>
				<Flex direction="column" gap="15px">
					<ControlContextProvider
						value={{
							name: nanoid(),
						}}
					>
						<ControlWithHooks
							Control={NoticeControl}
							type="error"
							children="Error"
							label="Error"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						value={{
							name: nanoid(),
						}}
					>
						<ControlWithHooks
							Control={NoticeControl}
							type="warning"
							children="Warning"
							label="Warning"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						value={{
							name: nanoid(),
						}}
					>
						<ControlWithHooks
							Control={NoticeControl}
							type="information"
							children="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
							label="Multi-line text"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						value={{
							name: nanoid(),
						}}
					>
						<ControlWithHooks
							Control={NoticeControl}
							type="warning"
							isDismissible={true}
							children="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
							label="Multi-line text & Dismissible"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						value={{
							name: nanoid(),
						}}
					>
						<ControlWithHooks
							Control={NoticeControl}
							type="success"
							children="Dismissible"
							isDismissible={true}
							label="Dismissible"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						value={{
							name: nanoid(),
						}}
					>
						<ControlWithHooks
							Control={NoticeControl}
							isDismissible={true}
							type="error"
							children="alert on dismiss"
							onDismiss={() => {
								// eslint-disable-next-line no-alert
								alert('Dismiss notice !!');
							}}
							label="Action on dismiss"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						value={{
							name: nanoid(),
						}}
					>
						<ControlWithHooks
							Control={NoticeControl}
							type="success"
							children="Success"
							showIcon={false}
							label="No Icon"
						/>
					</ControlContextProvider>
				</Flex>

				<Flex direction="column" gap="15px">
					<ControlContextProvider
						value={{
							name: nanoid(),
						}}
					>
						<ControlWithHooks
							Control={NoticeControl}
							type="error"
							children={
								<div>
									<span>Error</span>
									<p>Lorem ipsum dolor sit amet.</p>
								</div>
							}
							label="JSX Children"
						/>
					</ControlContextProvider>
				</Flex>
			</Flex>
		);
	},
};

export const All = {
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<States.render {...States.args} />
		</Flex>
	),
};
