/**
 * WordPress dependencies
 */
import '@wordpress/format-library';
import { useEffect, useState } from '@wordpress/element';
import {
	BlockList,
	BlockTools,
	WritingFlow,
	ObserveTyping,
	BlockInspector,
	BlockEditorProvider,
	BlockEditorKeyboardShortcuts,
} from '@wordpress/block-editor';
import { ShortcutProvider } from '@wordpress/keyboard-shortcuts';
import { Popover, SlotFillProvider } from '@wordpress/components';

/**
 * Internal dependencies
 */
import styles from '../../../../../.storybook/playground-styles/style.lazy.scss';

export default function Playground({ blocks: _blocks }) {
	// const { blocks: _blocks, styles } = useContext(PlaygroundContext);
	const [blocks, updateBlocks] = useState(_blocks);

	// Ensures that the CSS intended for the playground (especially the style resets)
	// are only loaded for the playground and don't leak into other stories.
	useEffect(() => {
		styles.use();

		return styles.unuse;
	});

	return (
		<div className="playground" data-testid="publisher-playground">
			<ShortcutProvider>
				<SlotFillProvider>
					<BlockEditorProvider
						value={blocks}
						onInput={updateBlocks}
						onChange={updateBlocks}
					>
						<div className="playground__sidebar">
							<BlockInspector />
						</div>
						<div className="playground__content">
							<BlockTools>
								<div className="editor-styles-wrapper">
									<BlockEditorKeyboardShortcuts.Register />
									<WritingFlow
										className="editor-styles-wrapper"
										style={{
											flex: '1',
											...{ paddingBottom: '40vh' },
										}}
										tabIndex={-1}
									>
										<ObserveTyping>
											<BlockList
												__experimentalLayout={{
													type: 'default', // At the root level of the site editor, no alignments should be allowed.
													alignments: [],
												}}
												renderAppender={false}
											/>
										</ObserveTyping>
									</WritingFlow>
								</div>
							</BlockTools>
						</div>
						<Popover.Slot />
					</BlockEditorProvider>
				</SlotFillProvider>
			</ShortcutProvider>
		</div>
	);
}
