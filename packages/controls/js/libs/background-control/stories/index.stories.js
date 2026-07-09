/**
 * External dependencies
 */
import { nanoid } from 'nanoid';

/**
 * Blockera dependencies
 */
import { default as Decorators } from '@blockera/dev-storybook/js/decorators';
import {
	EditorAdvancedLabelControl,
	EditorFeatureWrapper,
} from '@blockera/editor';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../../repeater-control/store';
import {
	Flex,
	BackgroundControl,
	BaseControlContext,
	ControlContextProvider,
} from '../../../index';
import { WithPlaygroundStyles } from '../../../../../../.storybook/preview';
import { WithControlDataProvider } from '../../../../../../.storybook/decorators/with-control-data-provider';

const { WithInspectorStyles, SharedDecorators, WithPopoverDataProvider } =
	Decorators;

SharedDecorators.push(WithPlaygroundStyles);
SharedDecorators.push(WithControlDataProvider);
SharedDecorators.push(WithPopoverDataProvider);

export default {
	title: 'Controls/BackgroundControl',
	component: BackgroundControl,
	tags: ['autodocs'],
};

export const Empty = {
	args: {
		label: 'Background',
		controlInfo: {
			name: nanoid(),
			value: [],
		},
		storeName: STORE_NAME,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const Filled = {
	args: {
		label: 'Background',
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="50px">
				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '550px' }}
				>
					<h2 className="story-heading">
						Background<span>Image</span>
					</h2>
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									type: 'image',
									image: 'https://betterstudio.com/wp-content/uploads/2022/09/blockera-theme.svg',
									isVisible: true,
								},
								{
									type: 'image',
									isVisible: true,
								},
								{
									type: 'image',
									image: 'https://betterstudio.com/wp-content/uploads/2022/09/blockera-theme.svg',
									isVisible: true,
									isOpen: true,
								},
							],
						}}
					>
						<BackgroundControl {...args} label="Background" />
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '350px' }}
				>
					<h2 className="story-heading">
						Background<span>Linear Gradient</span>
					</h2>
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									type: 'linear-gradient',
									'linear-gradient':
										'linear-gradient(90deg,rgb(25,0,255) 10%,rgb(230,134,0) 90%)',
									isVisible: true,
								},
								{
									type: 'linear-gradient',
									'linear-gradient':
										'linear-gradient(90deg,rgb(30,183,0) 7%,rgb(0,205,205) 90%)',
									isVisible: true,
									isOpen: true,
								},
							],
						}}
					>
						<BackgroundControl {...args} label="Background" />
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '450px' }}
				>
					<h2 className="story-heading">
						Background<span>Radial Gradient</span>
					</h2>
					<ControlContextProvider
						storeName={STORE_NAME}
						value={{
							name: nanoid(),
							value: [
								{
									type: 'radial-gradient',
									'radial-gradient':
										'radial-gradient(rgb(250,0,247) 0%,rgb(255,213,0) 64%)',
									isVisible: true,
								},
								{
									type: 'radial-gradient',
									'radial-gradient':
										'radial-gradient(rgb(74,0,250) 0%,rgb(145,0,230) 100%)',
									isVisible: true,
									isOpen: true,
								},
							],
						}}
					>
						<BackgroundControl {...args} label="Background" />
					</ControlContextProvider>
				</Flex>

				<Flex
					direction="column"
					gap="15px"
					style={{ marginBottom: '550px' }}
				>
					<h2 className="story-heading">
						Background<span>Mesh Gradient</span>
					</h2>
					<BaseControlContext.Provider
						value={{
							components: {
								FeatureWrapper: EditorFeatureWrapper,
								AdvancedLabelControl:
									EditorAdvancedLabelControl,
							},
						}}
					>
						<ControlContextProvider
							storeName={STORE_NAME}
							value={{
								name: nanoid(),
								value: [
									{
										type: 'mesh-gradient',
										'mesh-gradient':
											'radial-gradient(at 0% 0%, var(--c0) 0px, transparent 47%),radial-gradient(at 85% 28%, var(--c1) 0px, transparent 45%),radial-gradient(at 95% 37%, var(--c2) 0px, transparent 66%),radial-gradient(at 97% 79%, var(--c3) 0px, transparent 59%)',
										'mesh-gradient-colors': {
											'--c0': {
												color: '#af4dff',
												order: 0,
											},
											'--c1': {
												color: '#ff51f6',
												order: 1,
											},
											'--c2': {
												color: '#3590ff',
												order: 2,
											},
											'--c3': {
												color: '#f7ff65',
												order: 3,
											},
										},
										isVisible: true,
									},
									{
										type: 'mesh-gradient',
										'mesh-gradient':
											'radial-gradient(at 0% 0%, var(--c0) 0px, transparent 63%),radial-gradient(at 53% 44%, var(--c1) 0px, transparent 58%),radial-gradient(at 14% 76%, var(--c2) 0px, transparent 66%),radial-gradient(at 90% 51%, var(--c3) 0px, transparent 68%),radial-gradient(at 44% 62%, var(--c4) 0px, transparent 49%),radial-gradient(at 3% 4%, var(--c5) 0px, transparent 53%)',
										'mesh-gradient-colors': {
											'--c0': {
												color: '#4d61ff',
												order: 0,
											},
											'--c1': {
												color: '#9451ff',
												order: 1,
											},
											'--c2': {
												color: '#35ffe7',
												order: 2,
											},
											'--c3': {
												color: '#ffa065',
												order: 3,
											},
											'--c4': {
												color: '#6c37ff',
												order: 4,
											},
											'--c5': {
												color: '#73b9ff',
												order: 5,
											},
										},
										isVisible: true,
										isOpen: true,
									},
								],
							}}
						>
							<BackgroundControl {...args} label="Background" />
						</ControlContextProvider>
					</BaseControlContext.Provider>
				</Flex>
			</Flex>
		);
	},
};

export const All = {
	args: {},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: () => (
		<Flex direction="column" gap="50px">
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">Empty</h2>
				<ControlContextProvider
					storeName={STORE_NAME}
					value={{
						name: nanoid(),
						value: [],
					}}
				>
					<BackgroundControl {...Empty.args} />
				</ControlContextProvider>
			</Flex>

			<Filled.render {...Filled.args} />
		</Flex>
	),
};
