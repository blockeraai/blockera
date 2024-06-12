/**
 * Blockera dependencies
 */
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
/**
 * Internal dependencies
 */
import { Flex, GroupControl } from '../../index';
import { default as AccordionCustomOpenIcon } from './icons/accordion-custom-open-icon';
import { default as AccordionCustomCloseIcon } from './icons/accordion-custom-close-icon';

const { WithInspectorStyles, SharedDecorators, WithPopoverDataProvider } =
	Decorators;
SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/GroupControl',
	component: GroupControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		mode: 'accordion',
		header: 'Header Text',
		children: 'Body Text',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const Accordion = {
	args: {
		...Default.args,
		mode: 'accordion',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Accordion</h2>
					<GroupControl {...args} isOpen={false} />
					<GroupControl {...args} isOpen={true} />
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Accordion<span>Active Open Border</span>
					</h2>
					<GroupControl
						{...args}
						isOpen={false}
						toggleOpenBorder={true}
					/>
					<GroupControl
						{...args}
						isOpen={true}
						toggleOpenBorder={true}
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Accordion<span>Custom Icon</span>
					</h2>
					<GroupControl
						{...args}
						isOpen={false}
						headerOpenIcon={<AccordionCustomOpenIcon />}
						headerCloseIcon={<AccordionCustomCloseIcon />}
					/>
					<GroupControl
						{...args}
						isOpen={true}
						headerOpenIcon={<AccordionCustomOpenIcon />}
						headerCloseIcon={<AccordionCustomCloseIcon />}
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Accordion<span>Extra Item Around Icon</span>
					</h2>
					<GroupControl
						{...args}
						isOpen={false}
						injectHeaderButtonsStart="👉"
						injectHeaderButtonsEnd="👈"
					/>
					<GroupControl
						{...args}
						isOpen={true}
						injectHeaderButtonsStart="👉"
						injectHeaderButtonsEnd="👈"
					/>
				</Flex>
			</Flex>
		);
	},
};

export const Popover = {
	args: {
		...Default.args,
		mode: 'popover',
	},
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
	render: (args) => {
		return (
			<Flex direction="column" gap="100px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">Popover</h2>
					<GroupControl {...args} isOpen={false} />
					<GroupControl {...args} isOpen={true} />
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Popover<span>Custom Icon</span>
					</h2>
					<GroupControl
						{...args}
						isOpen={false}
						headerOpenIcon={<AccordionCustomOpenIcon />}
						headerCloseIcon={<AccordionCustomCloseIcon />}
					/>
					<GroupControl
						{...args}
						isOpen={true}
						headerOpenIcon={<AccordionCustomOpenIcon />}
						headerCloseIcon={<AccordionCustomCloseIcon />}
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Popover<span>Extra Item Around Icon</span>
					</h2>
					<GroupControl
						{...args}
						isOpen={false}
						injectHeaderButtonsStart="👉"
						injectHeaderButtonsEnd="👈"
					/>
					<GroupControl
						{...args}
						isOpen={true}
						injectHeaderButtonsStart="👉"
						injectHeaderButtonsEnd="👈"
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Popover<span>Custom Popover Label</span>
					</h2>
					<GroupControl
						{...args}
						isOpen={false}
						popoverTitle="👋 Popover Title"
					/>
					<GroupControl
						{...args}
						isOpen={true}
						popoverTitle="👋 Popover Title"
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Popover<span>Custom Items Beside Button</span>
					</h2>
					<GroupControl
						{...args}
						isOpen={false}
						popoverTitleButtonsRight="👋"
					/>
					<GroupControl
						{...args}
						isOpen={true}
						popoverTitleButtonsRight="👋"
					/>
				</Flex>
			</Flex>
		);
	},
};

export const All = {
	decorators: [
		WithInspectorStyles,
		WithPopoverDataProvider,
		...SharedDecorators,
	],
	render: () => (
		<Flex direction="column" gap="150px">
			<Accordion.render {...Accordion.args} />
			<Popover.render {...Popover.args} />
		</Flex>
	),
};
