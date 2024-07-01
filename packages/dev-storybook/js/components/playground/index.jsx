/**
 * External dependencies
 */
import '@wordpress/format-library';
import { useState } from '@wordpress/element';
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

export function Playground({ blocks: _blocks }) {
	const [blocks, updateBlocks] = useState(_blocks);

	return (
		<div className="playground" data-testid="blockera-playground">
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
