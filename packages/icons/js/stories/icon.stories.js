/**
 * External dependencies
 */
import { nanoid } from 'nanoid';

/**
 * Blockera dependencies
 */
import { Flex, Tooltip } from '@blockera/controls';
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';

/**
 * Internal dependencies
 */
import { Icon, getIconLibraryIcons } from '../index';
import { IconLibraries } from '../icon-library';

const { WithInspectorStyles, SharedDecorators } = Decorators;

export default {
	title: 'Icons/Icon',
	component: Icon,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		library: 'wp',
		icon: 'wordpress',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const All = {
	args: {
		value: 'center center',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => (
		<Flex direction="column" gap="30px">
			{Object.keys(IconLibraries).map((library) => (
				<>
					<Flex direction="column" gap="20px" flexWrap="nowrap">
						<h2 className="story-heading">
							{library} <span>Native Size</span>
						</h2>
						<Flex direction="row" gap="20px" flexWrap="wrap">
							{Object.keys(getIconLibraryIcons(library)).map(
								(icon) => (
									<Tooltip text={icon}>
										<Icon
											library={library}
											icon={icon}
											{...args}
										/>
									</Tooltip>
								)
							)}
						</Flex>
					</Flex>

					<Flex direction="column" gap="20px" flexWrap="nowrap">
						<h2 className="story-heading">
							{library} <span>18px</span>
						</h2>
						<Flex direction="row" gap="20px" flexWrap="wrap">
							{Object.keys(getIconLibraryIcons(library)).map(
								(icon) => (
									<Tooltip text={icon}>
										<Icon
											library={library}
											icon={icon}
											iconSize="18"
											{...args}
										/>
									</Tooltip>
								)
							)}
						</Flex>
					</Flex>
				</>
			))}
		</Flex>
	),
};
