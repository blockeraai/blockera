<?php
/**
 * Temporary mu-plugin for calendar block testing.
 * This file is automatically loaded by WordPress on every request.
 * Allows the original render function to run, then replaces the output with static HTML.
 *
 * Visual snapshots paste the fixture through the editor, which remints `blockeraId`.
 * The static table keeps deterministic dates, but the unique `blockera-block-{id}`
 * class is copied from the live render so generated CSS still matches.
 *
 * @phpstan-ignore-next-line
 */

/**
 * Unique Blockera class from saved attrs or live markup (`blockera-block-{id}`).
 *
 * @param string $block_content Rendered calendar HTML before this filter.
 * @param array  $block         Parsed block.
 * @return string Class token, e.g. `blockera-block-1`.
 */
function blockera_calendar_unique_blockera_class( $block_content, $block ) {
	$attrs = isset( $block['attrs'] ) && is_array( $block['attrs'] ) ? $block['attrs'] : array();
	$class_name = isset( $attrs['className'] ) ? (string) $attrs['className'] : '';

	// Style engine unique selector comes from className, then blockeraId.
	if ( preg_match( '/\b(blockera-block-[\w-]+)\b/', $class_name, $match ) ) {
		return $match[1];
	}

	if ( ! empty( $attrs['blockeraId'] ) && is_string( $attrs['blockeraId'] ) ) {
		return 'blockera-block-' . $attrs['blockeraId'];
	}

	if ( is_string( $block_content ) && preg_match( '/\b(blockera-block-[\w-]+)\b/', $block_content, $match ) ) {
		return $match[1];
	}

	return 'blockera-block-1';
}

/**
 * Get the static HTML output embedded in this file.
 *
 * @return string Static HTML output.
 */
function blockera_get_calendar_static_output() {
	return <<<'HTML'
<div class="blockera-block blockera-block-1 wp-block-calendar be-transpiled">
	<table id="wp-calendar" class="wp-calendar-table has-background">
		<caption>November 2025</caption>
		<thead>
			<tr>
				<th scope="col" aria-label="Monday">M</th>
				<th scope="col" aria-label="Tuesday">T</th>
				<th scope="col" aria-label="Wednesday">W</th>
				<th scope="col" aria-label="Thursday">T</th>
				<th scope="col" aria-label="Friday">F</th>
				<th scope="col" aria-label="Saturday">S</th>
				<th scope="col" aria-label="Sunday">S</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td colspan="5" class="pad">&nbsp;</td>
				<td>1</td>
				<td>2</td>
			</tr>
			<tr>
				<td>3</td>
				<td>4</td>
				<td>5</td>
				<td>6</td>
				<td>7</td>
				<td><a href="https://site-blockera.test/?m=20251108"
						aria-label="Posts published on November 8, 2025">8</a></td>
				<td><a href="https://site-blockera.test/?m=20251109"
						aria-label="Posts published on November 9, 2025">9</a></td>
			</tr>
			<tr>
				<td><a href="https://site-blockera.test/?m=20251110"
						aria-label="Posts published on November 10, 2025">10</a></td>
				<td><a href="https://site-blockera.test/?m=20251111"
						aria-label="Posts published on November 11, 2025">11</a></td>
				<td><a href="https://site-blockera.test/?m=20251112"
						aria-label="Posts published on November 12, 2025">12</a></td>
				<td>13</td>
				<td><a href="https://site-blockera.test/?m=20251114"
						aria-label="Posts published on November 14, 2025">14</a></td>
				<td>15</td>
				<td><a href="https://site-blockera.test/?m=20251116"
						aria-label="Posts published on November 16, 2025">16</a></td>
			</tr>
			<tr>
				<td><a href="https://site-blockera.test/?m=20251117"
						aria-label="Posts published on November 17, 2025">17</a></td>
				<td><a href="https://site-blockera.test/?m=20251118"
						aria-label="Posts published on November 18, 2025">18</a></td>
				<td><a href="https://site-blockera.test/?m=20251119"
						aria-label="Posts published on November 19, 2025">19</a></td>
				<td><a href="https://site-blockera.test/?m=20251120"
						aria-label="Posts published on November 20, 2025">20</a></td>
				<td>21</td>
				<td>22</td>
				<td><a href="https://site-blockera.test/?m=20251123"
						aria-label="Posts published on November 23, 2025">23</a></td>
			</tr>
			<tr>
				<td>24</td>
				<td><a href="https://site-blockera.test/?m=20251125"
						aria-label="Posts published on November 25, 2025">25</a></td>
				<td><a href="https://site-blockera.test/?m=20251126"
						aria-label="Posts published on November 26, 2025">26</a></td>
				<td id="today"><a href="https://site-blockera.test/?m=20251127"
						aria-label="Posts published on November 27, 2025">27</a></td>
				<td>28</td>
				<td>29</td>
				<td>30</td>
			</tr>
		</tbody>
	</table>
	<nav aria-label="Previous and next months" class="wp-calendar-nav">
		<span class="wp-calendar-nav-prev"><a href="https://site-blockera.test/?m=202510">« Oct</a></span>
		<span class="pad">&nbsp;</span>
		<span class="wp-calendar-nav-next">&nbsp;</span>
	</nav>
</div>
HTML;
}

/**
 * Filter the rendered block output to replace calendar block with static HTML.
 * This runs after the original render function has executed.
 *
 * @param string   $block_content The rendered block content.
 * @param array    $block         The parsed block data.
 * @param WP_Block $instance      The block instance.
 * @return string Modified block content.
 */
function blockera_replace_calendar_block_output( $block_content, $block, $instance ) {
	if ( ! isset( $block['blockName'] ) || 'core/calendar' !== $block['blockName'] ) {
		return $block_content;
	}

	$html   = blockera_get_calendar_static_output();
	$unique = blockera_calendar_unique_blockera_class( $block_content, $block );

	if ( 'blockera-block-1' !== $unique ) {
		$html = preg_replace( '/\bblockera-block-1\b/', $unique, $html, 1 );
	}

	return $html;
}

// Hook into render_block filter to replace output after original render runs
add_filter( 'render_block', 'blockera_replace_calendar_block_output', 100, 3 );
