<?php
namespace Arkhe_Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * 固定ページリストブロック
 */
$block_name = 'slider';

register_block_type_from_metadata(
	ARKHE_BLOCKS_PATH . 'src/gutenberg/blocks/' . $block_name,
	[
		'render_callback'  => '\Arkhe_Blocks\cb_slider',
	]
);
// phpcs:disable WordPress.NamingConventions.ValidVariableName.InterpolatedVariableNotSnakeCase
function cb_slider( $attrs, $content ) {
	ob_start();

	$height     = $attrs['height'];
	$options    = $attrs['options'];
	$optionData = wp_json_encode( $options, JSON_UNESCAPED_UNICODE );
	$optionData = str_replace( '"', '', $optionData );
	$optionData = str_replace( 'true', '1', $optionData );
	$optionData = str_replace( 'false', '0', $optionData );

	$style = [];
	if ( 'custom' === $height ) {
		$style['--arkb-slider-height']     = $attrs['heightPC'];
		$style['--arkb-slider-height--sp'] = $attrs['heightSP'];
	}
	$style = \Arkhe_Blocks::convert_style_props( $style );

	$props = ' data-option="' . esc_attr( $optionData ) . '" data-height="' . esc_attr( $height ) . '"';
	if ( $style ) {
		$props .= ' style="' . esc_attr( $style ) . '"';
	}

	// --swiper-navigation-size
	// var(--swiper-pagination-color,var(--swiper-theme-color))
	// --swiper-navigation-color: #fff;

	// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
	?>
	<div class="ark-block-slider"<?php echo $props; ?>>
		<div class="ark-block-slider__inner swiper-container">
			<div class="swiper-wrapper">
				<?=$content?>
			</div>
			<?php if ( 'off' !== $options['pagination'] ) : ?>
				<div class="swiper-pagination"></div>
			<?php endif; ?>
			<?php if ( $options['showNavigation'] ) : ?>
				<div class="swiper-button-prev" tabIndex="0" role="button" aria-label="Previous slide"></div>
				<div class="swiper-button-next" tabIndex="0" role="button" aria-label="Next slide"></div>
			<?php endif; ?>
		</div>
	</div>
<?php
	return ob_get_clean();
}


/*
const {
	height,
	heightPC,
	heightSP,
	isLoop,
	isAuto,
	isCenter,
	effect,
	speed,
	delay,
	spacePC,
	spaceSP,
	direction,
	slideNumPC,
	slideNumSP,
	pagination,
	isClickable,
	isDynamic,
	showNavigation,
} = attributes;

const options = {
	isLoop: isLoop ? 1 : 0,
	isAuto: isAuto ? 1 : 0,
	isCenter: isCenter ? 1 : 0,
	showNavigation: showNavigation ? 1 : 0,
	effect,
	speed,
	delay,
	spacePC,
	spaceSP,
	slideNumPC,
	slideNumSP,
	pagination,
	direction,
};
if ('bullets' === pagination) {
	options.isClickable = isClickable ? 1 : 0;
	options.isDynamic = isDynamic ? 1 : 0;
}

let optionsData = JSON.stringify(options);
optionsData = optionsData.replaceAll('"', '');

const bloclStyle = {};
if ('custom' === height) {
	bloclStyle['--arkb-slider-height'] = heightPC;
	bloclStyle['--arkb-slider-height--sp'] = heightSP;
}

// ブロックprops
const blockProps = useBlockProps.save({
	className: blockName,
	'data-height': height,
	'data-option': optionsData,
	style: bloclStyle,
	// 'data-is-example': isExample ? '1' : null,
});

// --swiper-navigation-size
// var(--swiper-pagination-color,var(--swiper-theme-color))
// --swiper-navigation-color: #fff;

return (
	<div {...blockProps}>
		<div className={`${blockName}__inner swiper-container`}>
			<div className='swiper-wrapper'>
				<InnerBlocks.Content />
			</div>
			{'off' !== pagination && <div className='swiper-pagination'></div>}
			{showNavigation && (
				<>
					<div
						className='swiper-button-prev'
						tabIndex='0'
						role='button'
						aria-label='Previous slide'
					></div>
					<div
						className='swiper-button-next'
						tabIndex='0'
						role='button'
						aria-label='Next slide'
					></div>
				</>
			)}
		</div>
	</div>
);
*/
