/**
 * External dependencies
 */
import { useContext } from '@wordpress/element';
import { expect } from '@storybook/jest';
import {
	fireEvent,
	userEvent,
	waitFor,
	within,
} from '@storybook/testing-library';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { LinkControl } from '../../index';

const {
	WithInspectorStyles,
	StoryDataContext,
	WithStoryContextProvider,
	SharedDecorators,
	WithPopoverDataProvider,
} = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/LinkControl',
	component: LinkControl,
	tags: ['autodocs'],
};

export const Empty = {
	args: {
		label: 'Link',
	},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
};

export const Filled = {
	args: {
		label: 'Background',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Link<span>Simple</span>
					</h2>
					<LinkControl
						{...args}
						value={{
							link: 'https://publisherwp.com/',
							target: false,
							nofollow: false,
							label: '',
							attributes: [],
						}}
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Link<span>Custom Target</span>
					</h2>
					<LinkControl
						{...args}
						value={{
							link: 'https://publisherwp.com/',
							target: true,
							nofollow: false,
							label: '',
							attributes: [],
						}}
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Link<span>Custom nofollow</span>
					</h2>
					<LinkControl
						{...args}
						value={{
							link: 'https://publisherwp.com/',
							target: false,
							nofollow: true,
							label: '',
							attributes: [],
						}}
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Link<span>Custom Label</span>
					</h2>
					<LinkControl
						{...args}
						value={{
							link: 'https://publisherwp.com/',
							target: false,
							nofollow: false,
							label: 'Custom Label',
							attributes: [],
						}}
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Link<span>Custom Attribute</span>
					</h2>
					<LinkControl
						{...args}
						value={{
							link: 'https://publisherwp.com/',
							target: false,
							nofollow: false,
							label: '',
							attributes: [
								{
									name: 'custom key',
									value: 'custom value',
								},
							],
						}}
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Link<span>Advanced Close</span>
					</h2>
					<LinkControl
						{...args}
						advancedOpen={false}
						value={{
							link: 'https://publisherwp.com/',
							target: false,
							nofollow: false,
							label: '',
							attributes: [
								{
									name: 'custom key',
									value: 'custom value',
								},
							],
						}}
					/>
				</Flex>
			</Flex>
		);
	},
};

const ControlWithHooks = (args) => {
	const { storyValue, setStoryValue } = useContext(StoryDataContext);

	return (
		<LinkControl {...args} onChange={setStoryValue} value={storyValue} />
	);
};

export const Play = {
	args: {},
	decorators: [
		WithStoryContextProvider,
		WithPopoverDataProvider,
		WithInspectorStyles,
		...SharedDecorators,
	],
	render: (args) => <ControlWithHooks {...args} />,
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		const currentValue = canvas.getByTestId('current-value');
		const input = canvas.getByRole('textbox');
		//
		await step('Story Data', async () => {
			await expect(currentValue).toBeInTheDocument();
			await expect(currentValue).toBeEmptyDOMElement();
		});

		await step('Fill Input', async () => {
			await expect(input).toBeInTheDocument();

			fireEvent.change(input, {
				target: { value: 'https://publisherwp.com/' },
			});

			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "link": "https://publisherwp.com/", "target": false, "nofollow": false, "label": "", "attributes": [] }'
					),
				{ timeout: 1000 }
			);
		});

		await step('Open Advanced', async () => {
			await userEvent.click(
				canvas.getByLabelText('Open Advanced Settings')
			);
		});

		await step('Check Target', async () => {
			await expect(
				canvas.getAllByRole('checkbox')[0]
			).toBeInTheDocument();

			await userEvent.click(canvas.getAllByRole('checkbox')[0]);

			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "link": "https://publisherwp.com/", "target": true, "nofollow": false, "label": "", "attributes": [] }'
					),
				{ timeout: 2000 }
			);
		});

		await step('Fill Label', async () => {
			await expect(canvas.getAllByRole('textbox')[1]).toBeInTheDocument();

			fireEvent.change(canvas.getAllByRole('textbox')[1], {
				target: { value: 'custom label' },
			});

			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "link": "https://publisherwp.com/", "target": true, "nofollow": false, "label": "custom label", "attributes": [] }'
					),
				{ timeout: 2000 }
			);
		});

		await step('Add Attribute', async () => {
			await expect(canvas.getByLabelText('Add New')).toBeInTheDocument();

			await userEvent.click(canvas.getByLabelText('Add New'));

			await waitFor(
				async () =>
					await expect(currentValue).toHaveTextContent(
						'{ "link": "https://publisherwp.com/", "target": true, "nofollow": false, "label": "custom label", "attributes": [ { "key": "", "value": "", "isVisible": true } ] }'
					),
				{ timeout: 2000 }
			);
		});
	},
};

export const Screenshot = {
	args: {},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
	render: () => (
		<Flex direction="column" gap="50px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Empty</h2>
				<LinkControl {...Empty.args} />
			</Flex>

			<Filled.render />
		</Flex>
	),
};
