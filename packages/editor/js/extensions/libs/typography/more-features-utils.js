// @flow

/** Minimum advanced feature slots before collapsing into MoreFeatures. */
export const MIN_MORE_FEATURES_SLOT_COUNT = 3;

type CountTypographyMoreSlotsArgs = {
	isShowTextShadow: boolean,
	isShowTextTransform: boolean,
	isShowTextDecoration: boolean,
	isShowDirection: boolean,
	isShowTextOrientation: boolean,
	isSpacingVisible: boolean,
	isShowTextColumns: boolean,
	isShowTextStroke: boolean,
	isShowTextWrap: boolean,
	isShowWordBreak: boolean,
};

/**
 * Counts typography advanced features that would appear in MoreFeatures.
 * Letter/word/text-indent spacing sub-features count as a single slot.
 */
export function countTypographyMoreFeatureSlots({
	isShowTextShadow,
	isShowTextTransform,
	isShowTextDecoration,
	isShowDirection,
	isShowTextOrientation,
	isSpacingVisible,
	isShowTextColumns,
	isShowTextStroke,
	isShowTextWrap,
	isShowWordBreak,
}: CountTypographyMoreSlotsArgs): number {
	let count = 0;

	if (isShowTextShadow) {
		count++;
	}
	if (isShowTextTransform) {
		count++;
	}
	if (isShowTextDecoration) {
		count++;
	}
	if (isShowDirection) {
		count++;
	}
	if (isShowTextOrientation) {
		count++;
	}
	if (isSpacingVisible) {
		count++;
	}
	if (isShowTextColumns) {
		count++;
	}
	if (isShowTextStroke) {
		count++;
	}
	if (isShowTextWrap) {
		count++;
	}
	if (isShowWordBreak) {
		count++;
	}

	return count;
}

export function shouldUseTypographyMoreFeatures(slotCount: number): boolean {
	return slotCount >= MIN_MORE_FEATURES_SLOT_COUNT;
}
