/**
 * Publisher dependencies
 */
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { PanelBodyControl } from '../../index';
import { WithPlaygroundStyles } from '../../../../../.storybook/preview';
import { Popover, SlotFillProvider } from '@wordpress/components';

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

export const Screenshot = {
	args: {},
	decorators: [WithPopoverDataProvider, ...SharedDecorators],
	render: () => (
		<>
			<Default.render {...Default.args} />

			<Icon.render {...Icon.args} />

			<Multiple.render {...Multiple.args} />
		</>
	),
};
