<?php
namespace Arkhe_Blocks\Block\Slider;

defined( 'ABSPATH' ) || exit;

/**
 * 固定ページリストブロック
 */
$block_name = 'slider';

register_block_type_from_metadata(
	ARKHE_BLOCKS_PATH . 'src/gutenberg/blocks/' . $block_name,
	[
		'render_callback'  => '\Arkhe_Blocks\Block\Slider\cb',
	]
);
// phpcs:disable WordPress.NamingConventions.ValidVariableName.InterpolatedVariableNotSnakeCase
function cb( $attrs, $content ) {

	// Slider使われたことを変数にセット
	\Arkhe_Blocks::$use_swiper = true;

	ob_start();

	$anchor     = $attrs['anchor'] ?? '';
	$className  = $attrs['className'] ?? '';
	$align      = $attrs['align'] ?? '';
	$variation  = $attrs['variation'] ?? 'media';
	$height     = $attrs['height'];
	$options    = $attrs['options'];
	$optionData = wp_json_encode( $options, JSON_UNESCAPED_UNICODE );
	$optionData = str_replace( '"', '', $optionData );
	$optionData = str_replace( 'true', '1', $optionData );
	$optionData = str_replace( 'false', '0', $optionData );
	$is_rich    = 'rich' === $variation;

	// class名
	$block_class = 'ark-block-slider -' . $variation;
	if ( $align ) {
		$block_class .= ' align' . $align;
	}
	if ( $className ) {
		$block_class .= ' ' . $className;
	}

	// 属性
	$block_props = 'class="' . esc_attr( $block_class ) . '"';
	if ( $anchor ) {
		$block_props .= ' id="' . esc_attr( $anchor ) . '"';
	}
	$block_props .= ' data-option="' . esc_attr( $optionData ) . '"';
	if ( $is_rich ) {
		$block_props .= ' data-height="' . esc_attr( $height ) . '"';
	}
	if ( 'full' === $align ) {
		$block_props .= ' data-inner="' . esc_attr( $attrs['innerSize'] ) . '"';
	}

	// style
	$style = [];
	if ( $is_rich && 'custom' === $height ) {
		$style['--arkb-slider-height']     = $attrs['heightPC'];
		$style['--arkb-slider-height--sp'] = $attrs['heightSP'];
	}
	$style = \Arkhe_Blocks::convert_style_props( $style );

	if ( $style ) {
		$block_props .= ' style="' . esc_attr( $style ) . '"';
	}

	// --swiper-navigation-size
	// var(--swiper-pagination-color,var(--swiper-theme-color))
	// --swiper-navigation-color: #fff;

	// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped

	?>
	<div <?=$block_props?>>
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
