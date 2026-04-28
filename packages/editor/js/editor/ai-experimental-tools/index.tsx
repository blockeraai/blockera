/**
 * WordPress dependencies
 */
import { useCallback, useMemo, useState } from '@wordpress/element';
import {
	Fill,
	PanelBody,
	TextareaControl,
	Button as WPButton,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { dispatch, select } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

/**
 * Blockera dependencies
 */
import { Button, Modal, NoticeControl, Tabs } from '@blockera/controls';
import { experimental } from '@blockera/env';

/**
 * Internal dependencies
 */
import IconAI from './icons/ai.svg';

type JsonLike =
	| null
	| boolean
	| number
	| string
	| JsonLike[]
	| { [key: string]: JsonLike };

type JsonBlockInput = {
	name?: string;
	blockName?: string;
	attributes?: Record<string, unknown>;
	attrs?: Record<string, unknown>;
	innerBlocks?: JsonBlockInput[];
	blocks?: JsonBlockInput[];
};

const TAB_IMPORT_JSON = 'import-json';

function isObject(value: unknown): value is Record<string, unknown> {
	return !!value && typeof value === 'object' && !Array.isArray(value);
}

function normalizeToBlockInputs(value: unknown): JsonBlockInput[] {
	if (Array.isArray(value)) {
		return value as JsonBlockInput[];
	}
	if (isObject(value)) {
		// Support { blocks: [...] } wrapper.
		if (Array.isArray((value as any).blocks)) {
			return (value as any).blocks as JsonBlockInput[];
		}
		// Support single block object.
		return [value as JsonBlockInput];
	}
	return [];
}

function createWpBlockFromJson(input: JsonBlockInput): any {
	const name = (input.name || input.blockName || '') as string;
	if (!name) {
		throw new Error('Missing block name (expected "name" or "blockName").');
	}

	const attributes = (input.attributes || input.attrs || {}) as Record<
		string,
		unknown
	>;

	const innerInputs = Array.isArray(input.innerBlocks)
		? input.innerBlocks
		: [];
	const innerBlocks = innerInputs.map((child) =>
		createWpBlockFromJson(child)
	);

	return createBlock(name, attributes, innerBlocks);
}

export default function AIExperimentalTools(): JSX.Element {
	const isEnabled = experimental().get('ai.experimentalTools');

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [error, setError] = useState<string>('');
	const [tab, setTab] = useState<string>(TAB_IMPORT_JSON);

	// Import JSON tab state
	const [value, setValue] = useState<string>('');
	const [isImporting, setIsImporting] = useState<boolean>(false);

	const placeholder = useMemo(
		() =>
			JSON.stringify(
				{
					name: 'core/image',
					attributes: {
						id: 40,
						sizeSlug: 'full',
						linkDestination: 'none',
						url: 'https://example.com/image.jpg',
						alt: '',
						caption: '<em>Caption</em> text',
					},
					innerBlocks: [],
				},
				null,
				2
			),
		[]
	);

	const onImport = useCallback(() => {
		setIsImporting(true);
		setError('');

		try {
			const parsed = JSON.parse(value) as JsonLike;
			const inputs = normalizeToBlockInputs(parsed);
			if (!inputs.length) {
				throw new Error(
					'JSON must be a block object or an array of blocks.'
				);
			}

			const blocks = inputs.map((b) => createWpBlockFromJson(b));

			const blockEditorSelect = select('core/block-editor') as any;
			const existingBlocks = blockEditorSelect?.getBlocks?.() ?? [];
			const index = Array.isArray(existingBlocks)
				? existingBlocks.length
				: 0;

			(dispatch('core/block-editor') as any).insertBlocks(blocks, index);

			setValue('');
			setIsOpen(false);
		} catch (e: any) {
			setError(e?.message ? String(e.message) : 'Failed to import JSON.');
		} finally {
			setIsImporting(false);
		}
	}, [value]);

	// Experimental gate: AI -> Experimental Tools.
	if (!isEnabled) {
		return <></>;
	}

	return (
		<>
			<Fill name="blockera/slots/editor-header-toolbar">
				<WPButton
					onClick={() => {
						setError('');
						setIsOpen(true);
					}}
					icon={<IconAI />}
					label={__('Blockera AI Experimental Tools', 'blockera')}
					className="blockera-ai-experimental-tools-button"
					size="compact"
				/>
			</Fill>

			{isOpen ? (
				<Modal
					headerIcon={<IconAI />}
					headerTitle={__(
						'Blockera AI Experimental Tools',
						'blockera'
					)}
					onRequestClose={() => setIsOpen(false)}
				>
					<Tabs
						className="blockera-ai-experimental-tools-tabs"
						design="modern"
						activeTab={tab}
						setCurrentTab={setTab}
						tabs={[
							{
								name: TAB_IMPORT_JSON,
								title: __('Import JSON → Blocks', 'blockera'),
							},
						]}
						getPanel={(selectedTab) => {
							if (selectedTab?.name !== TAB_IMPORT_JSON) {
								return null;
							}

							return (
								<PanelBody>
									{error ? (
										<NoticeControl
											type="error"
											isDismissible
											onDismiss={() => setError('')}
										>
											{error}
										</NoticeControl>
									) : null}
									<TextareaControl
										label={__('Blocks JSON', 'blockera')}
										help={__(
											'Paste a block object or an array of blocks. Supported keys: "name"/"blockName", "attributes"/"attrs", "innerBlocks".',
											'blockera'
										)}
										value={value}
										onChange={(next) => setValue(next)}
										rows={12}
										placeholder={placeholder}
									/>
									<Button
										variant="primary"
										onClick={onImport}
										isBusy={isImporting}
										disabled={isImporting || !value.trim()}
									>
										{__('Import and append', 'blockera')}
									</Button>
								</PanelBody>
							);
						}}
					/>
				</Modal>
			) : null}
		</>
	);
}
