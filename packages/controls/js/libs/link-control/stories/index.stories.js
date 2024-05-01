/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/components';
import { default as Decorators } from '@blockera/storybook/decorators';

/**
 * Internal dependencies
 */
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { LinkControl } from '../../index';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';

const { WithInspectorStyles, SharedDecorators, WithPopoverDataProvider } =
	Decorators;

SharedDecorators.push(WithPlaygroundStyles);
SharedDecorators.push(WithControlDataProvider);

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
							link: 'https://blockeraai.com/',
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
							link: 'https://blockeraai.com/',
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
							link: 'https://blockeraai.com/',
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
							link: 'https://blockeraai.com/',
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
							link: 'https://blockeraai.com/',
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
							link: 'https://blockeraai.com/',
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

export const All = {
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
