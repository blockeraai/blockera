/**
 * WordPress dependencies
 */
import '@wordpress/format-library';
import { useMergeRefs } from '@wordpress/compose';
import { useEffect, useRef, useState } from '@wordpress/element';
import {
	BlockList,
	BlockTools,
	WritingFlow,
	ObserveTyping,
	BlockInspector,
	BlockEditorProvider,
	BlockEditorKeyboardShortcuts,
	__unstableUseTypewriter as useTypewriter,
	__unstableUseTypingObserver as useTypingObserver,
	__unstableUseClipboardHandler as useClipboardHandler,
	__unstableUseBlockSelectionClearer as useBlockSelectionClearer,
} from '@wordpress/block-editor';
import { ShortcutProvider } from '@wordpress/keyboard-shortcuts';
import { Popover, SlotFillProvider } from '@wordpress/components';

export default function Playground({ blocks: _blocks, styles }) {
	const [blocks, updateBlocks] = useState(_blocks);

	// Ensures that the CSS intended for the playground (especially the style resets)
	// are only loaded for the playground and don't leak into other stories.
	useEffect(() => {
		styles.use();

		return styles.unuse;
	});

	const ref = useRef();
	const contentRef = useMergeRefs([
		ref,
		useClipboardHandler(),
		useTypewriter(),
		useTypingObserver(),
		useBlockSelectionClearer(),
	]);

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
							<BlockTools __unstableContentRef={ref}>
								<div className="editor-styles-wrapper">
									<BlockEditorKeyboardShortcuts.Register />
									<WritingFlow
										ref={contentRef}
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
