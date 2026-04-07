/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import {
	Flex,
	Modal,
	Button,
	InputControl,
	NoticeControl,
	ControlContextProvider,
} from '@blockera/controls';
import { Icon } from '@blockera/icons';
import { kebabCase } from '@blockera/utils';
import { componentInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { isSlugValid } from './utils';

export interface AddVariableModalProps {
	/** Modal header title (e.g. "Add Font Size") */
	headerTitle: string;
	/** Description shown above the form */
	description?: string;
	/** Default name when modal opens */
	defaultName: string;
	/** Default slug when modal opens */
	defaultSlug: string;
	/** Existing slugs for uniqueness validation */
	existingSlugs: string[];
	/** Called when user saves with (name, slug) */
	onSave: (name: string, slug: string) => void;
	/** Called when modal closes */
	onClose: () => void;
	/** Custom message when slug is duplicate (optional) */
	duplicateSlugMessage?: string;
	/** Control name prefix for context (e.g. "add-font-size") */
	controlNamePrefix?: string;
}

export function AddVariableModal({
	onSave,
	onClose,
	headerTitle,
	description,
	defaultName,
	defaultSlug,
	existingSlugs,
	duplicateSlugMessage,
	controlNamePrefix = 'add-variable',
}: AddVariableModalProps) {
	const [name, setName] = useState(defaultName);
	const [slug, setSlug] = useState(defaultSlug);

	useEffect(() => {
		setName(defaultName);
		setSlug(defaultSlug);
	}, [defaultName, defaultSlug]);

	const handleNameChange = (newValue: string) => {
		setName(newValue);
		setSlug(kebabCase(newValue.toLowerCase().trim()) || defaultSlug);
	};

	const normalizedSlug = kebabCase(slug.toLowerCase().trim());
	const slugIsValid = isSlugValid(normalizedSlug, existingSlugs, defaultSlug);
	let slugError = null;
	if (normalizedSlug && !slugIsValid) {
		slugError = existingSlugs.includes(normalizedSlug)
			? duplicateSlugMessage ||
				__('This ID is already used by another preset.', 'blockera')
			: __(
					'Invalid ID format. Use only a–z, 0–9, and hyphens.',
					'blockera'
				);
	}

	const canSave = name.trim() && slugIsValid;

	const handleSave = () => {
		if (!canSave) {
			return;
		}

		onSave(name.trim(), normalizedSlug);
		onClose();
	};

	return (
		<Modal
			className={componentInnerClassNames('add-variable-modal')}
			headerIcon={<Icon icon="plus" iconSize="34" />}
			headerTitle={headerTitle}
			isDismissible={true}
			onRequestClose={onClose}
		>
			<Flex direction="column" gap={40}>
				<Flex direction="column" gap={25}>
					{description && (
						<p style={{ margin: '0', color: '#707070' }}>
							{description}
						</p>
					)}

					<Flex direction="column" gap={20}>
						<ControlContextProvider
							value={{
								name: `${controlNamePrefix}-name`,
								value: name,
							}}
						>
							<InputControl
								label={__('Name', 'blockera')}
								onChange={handleNameChange}
								columns="1fr 3fr"
							/>
						</ControlContextProvider>

						<ControlContextProvider
							value={{
								name: `${controlNamePrefix}-id`,
								value: normalizedSlug || slug,
							}}
						>
							<InputControl
								label={__('ID', 'blockera')}
								controlAddonTypes={[]}
								columns="1fr 3fr"
								style={{ position: 'relative' }}
								disabled
							>
								<p
									style={{
										margin: '5px 0 0',
										color: '#707070',
										fontStyle: 'italic',
										fontSize: '13px',
									}}
								>
									{__(
										'Auto-generated from name. Use a–z, 0–9, and hyphens only.',
										'blockera'
									)}
								</p>
							</InputControl>
						</ControlContextProvider>
					</Flex>
				</Flex>

				{slugError && (
					<NoticeControl type="error">{slugError}</NoticeControl>
				)}

				<Flex justifyContent="space-between">
					<Button
						variant="primary"
						disabled={!canSave}
						onClick={handleSave}
					>
						{__('Save', 'blockera')}
					</Button>

					<Button variant="tertiary" onClick={onClose}>
						{__('Cancel', 'blockera')}
					</Button>
				</Flex>
			</Flex>
		</Modal>
	);
}
