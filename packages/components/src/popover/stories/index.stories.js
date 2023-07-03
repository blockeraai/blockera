/**
 * External dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Publisher dependencies
 */
import { default as Decorators } from '@publisher/storybook/decorators';

/**
 * Internal dependencies
 */
import { WithPlaygroundStyles } from '../../../../../.storybook/decorators/with-playground-styles';
import Flex from '../../flex';
import Popover from '../index';

const { WithInspectorStyles, SharedDecorators } = Decorators;

SharedDecorators.push(WithPlaygroundStyles);

export default {
	title: 'Components/Popover',
	component: Popover,
	tags: ['autodocs'],
};

export const Default = {
	args: {
		title: 'Popover Title',
		children: 'Popover Body',
		resize: false,
		flip: false,
		shift: false,
		offset: 10,
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
	render: (args) => {
		return (
			<Flex direction="column" gap="15px">
				<h2 className="story-heading">
					Popover<span>Default</span>
				</h2>
				<p
					style={{
						backgroundColor: '#eee',
						padding: '20px',
						marginBottom: '100px',
					}}
				>
					Popover Anchor
				</p>
				<Popover {...args} placement="left" />
			</Flex>
		);
	},
};

export const Placements = {
	args: {
		...Default.args,
	},
	render: (args) => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [topStartAnchor, setTopStartAnchor] = useState();
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [topAnchor, setTopAnchor] = useState();
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [topEndAnchor, setTopEndAnchor] = useState();

		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [rightStartAnchor, setRightStartAnchor] = useState();
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [rightAnchor, setRightAnchor] = useState();
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [rightEndAnchor, setRightEndAnchor] = useState();

		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [bottomStartAnchor, setBottomStartAnchor] = useState();
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [bottomAnchor, setBottomAnchor] = useState();
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [bottomEndAnchor, setBottomEndAnchor] = useState();

		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [leftStartAnchor, setLeftStartAnchor] = useState();
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [leftAnchor, setLeftAnchor] = useState();
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [leftEndAnchor, setLeftEndAnchor] = useState();

		return (
			<Flex direction="column" gap="100px">
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Popover<span>top-start</span>
					</h2>
					<p
						ref={setTopStartAnchor}
						style={{
							backgroundColor: '#eee',
							padding: '20px',
							marginTop: '100px',
						}}
					>
						Popover Anchor
					</p>
					<Popover
						{...args}
						anchor={topStartAnchor}
						placement="top-start"
					/>
				</Flex>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Popover<span>top</span>
					</h2>
					<p
						ref={setTopAnchor}
						style={{
							backgroundColor: '#eee',
							padding: '20px',
							marginTop: '100px',
						}}
					>
						Popover Anchor
					</p>
					<Popover {...args} anchor={topAnchor} placement="top" />
				</Flex>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Popover<span>top-end</span>
					</h2>
					<p
						ref={setTopEndAnchor}
						style={{
							backgroundColor: '#eee',
							padding: '20px',
							marginTop: '100px',
						}}
					>
						Popover Anchor
					</p>
					<Popover
						{...args}
						anchor={topEndAnchor}
						placement="top-end"
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Popover<span>right-start</span>
					</h2>
					<p
						ref={setRightStartAnchor}
						style={{
							backgroundColor: '#eee',
							padding: '20px',
							marginBottom: '100px',
						}}
					>
						Popover Anchor
					</p>
					<Popover
						{...args}
						anchor={rightStartAnchor}
						placement="right-start"
					/>
				</Flex>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Popover<span>right</span>
					</h2>
					<p
						ref={setRightAnchor}
						style={{
							backgroundColor: '#eee',
							padding: '20px',
							marginBottom: '100px',
						}}
					>
						Popover Anchor
					</p>
					<Popover {...args} anchor={rightAnchor} placement="right" />
				</Flex>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Popover<span>right-end</span>
					</h2>
					<p
						ref={setRightEndAnchor}
						style={{
							backgroundColor: '#eee',
							padding: '20px',
							marginBottom: '100px',
						}}
					>
						Popover Anchor
					</p>
					<Popover
						{...args}
						anchor={rightEndAnchor}
						placement="right-end"
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Popover<span>bottom-start</span>
					</h2>
					<p
						ref={setBottomStartAnchor}
						style={{
							backgroundColor: '#eee',
							padding: '20px',
							marginBottom: '100px',
						}}
					>
						Popover Anchor
					</p>
					<Popover
						{...args}
						anchor={bottomStartAnchor}
						placement="bottom-start"
					/>
				</Flex>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Popover<span>bottom</span>
					</h2>
					<p
						ref={setBottomAnchor}
						style={{
							backgroundColor: '#eee',
							padding: '20px',
							marginBottom: '100px',
						}}
					>
						Popover Anchor
					</p>
					<Popover
						{...args}
						anchor={bottomAnchor}
						placement="bottom"
					/>
				</Flex>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Popover<span>bottom-end</span>
					</h2>
					<p
						ref={setBottomEndAnchor}
						style={{
							backgroundColor: '#eee',
							padding: '20px',
							marginBottom: '100px',
						}}
					>
						Popover Anchor
					</p>
					<Popover
						{...args}
						anchor={bottomEndAnchor}
						placement="bottom-end"
					/>
				</Flex>

				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Popover<span>left-start</span>
					</h2>
					<p
						ref={setLeftStartAnchor}
						style={{
							backgroundColor: '#eee',
							padding: '20px',
							marginBottom: '100px',
						}}
					>
						Popover Anchor
					</p>
					<Popover
						{...args}
						anchor={leftStartAnchor}
						placement="left-start"
					/>
				</Flex>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Popover<span>left</span>
					</h2>
					<p
						ref={setLeftAnchor}
						style={{
							backgroundColor: '#eee',
							padding: '20px',
							marginBottom: '100px',
						}}
					>
						Popover Anchor
					</p>
					<Popover {...args} anchor={leftAnchor} placement="left" />
				</Flex>
				<Flex direction="column" gap="15px">
					<h2 className="story-heading">
						Popover<span>left-end</span>
					</h2>
					<p
						ref={setLeftEndAnchor}
						style={{
							backgroundColor: '#eee',
							padding: '20px',
							marginBottom: '100px',
						}}
					>
						Popover Anchor
					</p>
					<Popover
						{...args}
						anchor={leftEndAnchor}
						placement="left-end"
					/>
				</Flex>
			</Flex>
		);
	},
	decorators: [WithInspectorStyles, ...SharedDecorators],
};

export const Screenshot = {
	render: () => (
		<Flex direction="column" gap="50px">
			<Default.render {...Default.args} />

			<Placements.render {...Placements.args} />
		</Flex>
	),
	decorators: [WithInspectorStyles, ...SharedDecorators],
};
