/**
 * Blockera dependencies
 */
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import Flex from '../../flex';
import { default as Tabs } from '../';
import { WithPlaygroundStyles } from '../../../../../../.storybook/decorators/with-playground-styles';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Components/Tabs',
	component: Tabs,
	tags: ['autodocs'],
};

export const OneTabs = {
	args: {
		tabs: [
			{
				name: 'general',
				title: 'General',
				className: 'general-tab',
				icon: <Icon icon="gear" iconSize="20" />,
			},
		],
		getPanel: (tab) => tab.title,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const TwoTabs = {
	args: {
		tabs: [
			{
				name: 'general',
				title: 'General',
				className: 'general-tab',
				icon: <Icon icon="gear" iconSize="20" />,
			},
			{
				name: 'style',
				title: 'Style',
				className: 'style-tab',
				icon: <Icon library="wp" icon="styles" iconSize="20" />,
			},
		],
		getPanel: (tab) => tab.title,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const ThreeTabs = {
	args: {
		tabs: [
			{
				name: 'general',
				title: 'General',
				className: 'general-tab',
				icon: <Icon icon="gear" iconSize="20" />,
			},
			{
				name: 'style',
				title: 'Style',
				className: 'style-tab',
				icon: <Icon library="wp" icon="styles" iconSize="20" />,
			},
			{
				name: 'interaction',
				title: 'Interaction',
				className: 'interaction-tab',
				icon: <Icon icon="animations" iconSize="20" />,
			},
		],
		getPanel: (tab) => tab.title,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const FourTabs = {
	args: {
		tabs: [
			{
				name: 'general',
				title: 'General',
				className: 'general-tab',
				icon: <Icon icon="gear" iconSize="20" />,
			},
			{
				name: 'style',
				title: 'Style',
				className: 'style-tab',
				icon: <Icon library="wp" icon="styles" iconSize="20" />,
			},
			{
				name: 'interaction',
				title: 'Interaction',
				className: 'interaction-tab',
				icon: <Icon icon="animations" iconSize="20" />,
			},
			{
				name: 'advanced',
				title: 'Advanced',
				className: 'advance-tab',
				icon: <Icon library="ui" icon="gear-small" />,
			},
		],
		getPanel: (tab) => tab.title,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

const tabs = [
	{
		name: 'general',
		title: 'General',
		className: 'general-tab',
		icon: <Icon library="wp" icon="styles" iconSize="20" />,
	},
	{
		name: 'style',
		title: 'Style',
		className: 'style-tab',
		icon: <Icon library="wp" icon="styles" iconSize="20" />,
	},
];

export const WithComplexPanel = {
	args: {
		tabs,
		getPanel: (tab) => {
			const deActiveTab = tabs.filter(
				(_tab) => tab.name !== _tab.name
			)[0];

			return (
				<>
					<h1 data-test={`${tab.name}-tab`}>
						<strong>{tab.title}</strong>
					</h1>
					<button
						onClick={() => {
							document
								.querySelector(
									`button[data-test="${deActiveTab.name}-tab"]`
								)
								.click();
						}}
					>
						Back
					</button>
				</>
			);
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const WithoutTabIcon = {
	args: {
		tabs: [
			{
				name: 'general',
				title: 'General',
				className: 'general-tab',
			},
			{
				name: 'style',
				title: 'Style',
				className: 'style-tab',
			},
		],
		getPanel: (tab) => {
			return (
				<>
					<h1 data-test={`${tab.name}-tab`}>
						<strong>{tab.title}</strong>
					</h1>
				</>
			);
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const WithoutTabTitle = {
	args: {
		tabs: [
			{
				name: 'general',
				className: 'general-tab',
				icon: <Icon icon="gear" iconSize="20" />,
			},
			{
				name: 'style',
				className: 'style-tab',
				icon: <Icon library="wp" icon="styles" iconSize="20" />,
			},
		],
		getPanel: (tab) => {
			return (
				<>
					<h1 data-test={`${tab.name}-tab`}>
						<strong>{tab.title}</strong>
					</h1>
				</>
			);
		},
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const ModernDesignTabs = {
	args: {
		tabs: [
			{
				name: 'general',
				title: 'General',
				className: 'general-tab',
				icon: <Icon icon="gear" iconSize="20" />,
			},
			{
				name: 'style',
				title: 'Style',
				className: 'style-tab',
				icon: <Icon library="wp" icon="styles" iconSize="20" />,
			},
			{
				name: 'interaction',
				title: 'Interaction',
				className: 'interaction-tab',
				icon: <Icon icon="animations" iconSize="20" />,
			},
		],
		design: 'modern',
		getPanel: (tab) => tab.title,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const All = {
	render: () => {
		const style = {
			marginBottom: '30px',
		};

		return (
			<>
				<Flex direction="column" gap="15px" style={style}>
					<h2 className="story-heading">
						Tabs<span>With #1 Item</span>
					</h2>
					<Tabs {...OneTabs.args} />
				</Flex>
				<Flex direction="column" gap="15px" style={style}>
					<h2 className="story-heading">
						Tabs<span>With #2 Item</span>
					</h2>
					<Tabs {...TwoTabs.args} />
				</Flex>
				<Flex direction="column" gap="15px" style={style}>
					<h2 className="story-heading">
						Tabs<span>With #3 Item</span>
					</h2>
					<Tabs {...ThreeTabs.args} />
				</Flex>
				<Flex direction="column" gap="15px" style={style}>
					<h2 className="story-heading">
						Tabs<span>With #4 Item</span>
					</h2>
					<Tabs {...FourTabs.args} />
				</Flex>
				<Flex direction="column" gap="15px" style={style}>
					<h2 className="story-heading">
						Tabs<span>With Complex Panels</span>
					</h2>
					<Tabs {...WithComplexPanel.args} />
				</Flex>
				<Flex direction="column" gap="15px" style={style}>
					<h2 className="story-heading">
						Tabs<span>Without Icon</span>
					</h2>
					<Tabs {...WithoutTabIcon.args} />
				</Flex>
				<Flex direction="column" gap="15px" style={style}>
					<h2 className="story-heading">
						Tabs<span>Without Title</span>
					</h2>
					<Tabs {...WithoutTabTitle.args} />
				</Flex>

				<Flex direction="column" gap="15px" style={style}>
					<h2 className="story-heading">
						Tabs<span>Modern Design</span>
					</h2>
					<Tabs {...ModernDesignTabs.args} />
				</Flex>
			</>
		);
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};
