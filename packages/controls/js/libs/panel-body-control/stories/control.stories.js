/**
 * External dependencies
 */
import { Popover, SlotFillProvider } from '@wordpress/components';

/**
 * Blockera dependencies
 */
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';

/**
 * Internal dependencies
 */
import { PanelBodyControl, Flex } from '../../index';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';

import { default as InheritIcon } from './icons/inherit';

const { WithPopoverDataProvider, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Controls/PanelBodyControl',
	component: PanelBodyControl,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		title: 'Panel Title',
		children: <p>Body content is here...</p>,
	},
	decorators: [WithPopoverDataProvider, ...SharedDecorators],
	render: (args) => {
		return (
			<SlotFillProvider>
				<div className="playground__sidebar playground__sidebar-standalone">
					<div className={'block-editor-block-inspector'}>
						<div className="block-editor-block-inspector__tabs">
							<div
								className="components-tab-panel__tab-content"
								style={{ padding: '20px 0' }}
							>
								<PanelBodyControl {...args} />
							</div>
						</div>
					</div>
				</div>
				<Popover.Slot />
			</SlotFillProvider>
		);
	},
};

export const Icon = {
	args: {
		title: 'Panel Title',
		children: <p>Body content is here...</p>,
	},
	decorators: [WithPopoverDataProvider, ...SharedDecorators],
	render: (args) => {
		return (
			<SlotFillProvider>
				<div className="playground__sidebar playground__sidebar-standalone">
					<div className={'block-editor-block-inspector'}>
						<div className="block-editor-block-inspector__tabs">
							<div
								className="components-tab-panel__tab-content"
								style={{ padding: '20px 0' }}
							>
								<PanelBodyControl
									{...args}
									icon={<InheritIcon />}
								/>
							</div>
						</div>
					</div>
				</div>
				<Popover.Slot />
			</SlotFillProvider>
		);
	},
};

export const Changed = {
	args: {
		title: 'Panel Title',
		children: <p>Body content is here...</p>,
	},
	decorators: [WithPopoverDataProvider, ...SharedDecorators],
	render: (args) => {
		return (
			<SlotFillProvider>
				<div className="playground__sidebar playground__sidebar-standalone">
					<div className={'block-editor-block-inspector'}>
						<div className="block-editor-block-inspector__tabs">
							<div
								className="components-tab-panel__tab-content"
								style={{ padding: '20px 0' }}
							>
								<Flex direction="column" gap="50px">
									<Flex direction="column" gap="15px">
										<h2 className="story-heading">
											Not Changed
										</h2>
										<PanelBodyControl
											{...args}
											icon={<InheritIcon />}
											isChanged={false}
											isChangedOnStates={false}
										/>
									</Flex>

									<Flex direction="column" gap="15px">
										<h2 className="story-heading">
											Changed on Primary
										</h2>
										<PanelBodyControl
											{...args}
											icon={<InheritIcon />}
											isChanged={true}
										/>
									</Flex>

									<Flex direction="column" gap="15px">
										<h2 className="story-heading">
											Changed on States
										</h2>
										<PanelBodyControl
											{...args}
											icon={<InheritIcon />}
											isChanged={false}
											isChangedOnStates={true}
										/>
									</Flex>

									<Flex direction="column" gap="15px">
										<h2 className="story-heading">
											Changed on Both
										</h2>
										<PanelBodyControl
											{...args}
											icon={<InheritIcon />}
											isChanged={true}
											isChangedOnStates={true}
										/>
									</Flex>
								</Flex>
							</div>
						</div>
					</div>
				</div>
				<Popover.Slot />
			</SlotFillProvider>
		);
	},
};

export const Multiple = {
	args: {
		title: 'Multiple Panel Bodies',
		children: <p>Body content is here...</p>,
	},
	decorators: [WithPopoverDataProvider, ...SharedDecorators],
	render: (args) => {
		return (
			<SlotFillProvider>
				<div className="playground__sidebar playground__sidebar-standalone">
					<div className={'block-editor-block-inspector'}>
						<div className="block-editor-block-inspector__tabs">
							<div
								className="components-tab-panel__tab-content"
								style={{ padding: '20px 0' }}
							>
								<PanelBodyControl
									{...args}
									title="Panel 1 Title"
									icon={<InheritIcon />}
								/>

								<PanelBodyControl
									{...args}
									title="Panel 2 Title"
									icon={<InheritIcon />}
									initialOpen={false}
								/>

								<PanelBodyControl
									{...args}
									title="Panel 3 Title"
									icon={<InheritIcon />}
									initialOpen={false}
								/>

								<PanelBodyControl
									{...args}
									title="Panel 4 Title"
									icon={<InheritIcon />}
								/>
							</div>
						</div>
					</div>
				</div>
				<Popover.Slot />
			</SlotFillProvider>
		);
	},
};

export const All = {
	args: {},
	decorators: [WithPopoverDataProvider, ...SharedDecorators],
	render: () => (
		<>
			<Default.render {...Default.args} />

			<Icon.render {...Icon.args} />

			<Edited.render {...Edited.args} />

			<Multiple.render {...Multiple.args} />
		</>
	),
};
