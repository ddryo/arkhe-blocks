<?php
namespace Arkhe_Blocks\Block\Slider;

defined( 'ABSPATH' ) || exit;

register_block_type_from_metadata(
	ARKHE_BLOCKS_PATH . 'src/gutenberg/blocks/slider',
	[
		'render_callback'  => '\Arkhe_Blocks\Block\Slider\cb',
	]
);

// phpcs:disable WordPress.NamingConventions.ValidVariableName.InterpolatedVariableNotSnakeCase
function cb( $attrs, $content ) {

	// Slider使われたことを変数にセット
	\Arkhe_Blocks::$use['swiper'] = true;

	$anchor     = $attrs['anchor'] ?? '';
	$className  = $attrs['className'] ?? '';
	$align      = $attrs['align'] ?? '';
	$variation  = $attrs['variation'] ?? 'media';
	$height     = $attrs['height'];
	$slideColor = $attrs['slideColor'] ?? '#000000';
	$options    = $attrs['options'];
	$direction  = $options['direction'] ?? 'horizontal';
	$showThumb  = $options['showThumb'] ?? false;
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
	if ( $is_rich ) {
		$block_props .= ' data-height="' . esc_attr( $height ) . '"';
	}
	if ( 'full' === $align ) {
		$block_props .= ' data-inner="' . esc_attr( $attrs['innerSize'] ) . '"';
	}
	$block_props .= ' data-direction="' . esc_attr( $direction ) . '"';
	$block_props .= ' data-option="' . esc_attr( $optionData ) . '"';

	// style
	$style = [];
	if ( $is_rich && 'custom' === $height ) {
		$style['--arkb-slider-height']     = $attrs['heightPC'];
		$style['--arkb-slider-height--sp'] = $attrs['heightSP'];
	}
	if ( '#000000' !== $slideColor ) {
		$style['--swiper-theme-color'] = $slideColor;
	}
	$style = \Arkhe_Blocks::convert_style_props( $style );

	if ( $style ) {
		$block_props .= ' style="' . esc_attr( $style ) . '"';
	}

	// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
	ob_start();
	?>
	<div <?=$block_props?>>
		<div class="ark-block-slider__inner swiper-container -main">
			<div class="swiper-wrapper">
				<?=$content?>
			</div>
			<?php if ( 'scrollbar' === $options['pagination'] ) : ?>
				<div class="swiper-scrollbar"></div>
			<?php elseif ( 'off' !== $options['pagination'] ) : ?>
				<div class="swiper-pagination"></div>
			<?php endif; ?>
			<?php if ( $options['showArrow'] ) : ?>
				<div class="swiper-button-prev ark-block-slider__nav -prev" tabIndex="0" role="button" aria-label="Previous slide">
					<?php render_arrow_svg( 'left' ); ?>
				</div>
				<div class="swiper-button-next ark-block-slider__nav -next" tabIndex="0" role="button" aria-label="Next slide">
					<?php render_arrow_svg( 'right' ); ?>
				</div>
			<?php endif; ?>
		</div>
		<?php if ( $showThumb ) render_thumb_slider(); ?>
	</div>
<?php

	// スライド画像データをリセット
	\Arkhe_Blocks::$slide_images = [];

	return ob_get_clean();
}

/**
 * arrow svg
 */
function render_arrow_svg( $position ) {
	ob_start();
	if ( 'left' === $position ) :
?>
	<svg x="0px" y="0px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"  role="img" aria-hidden="true" focusable="false">
		<path d="M16.4,2.6l-0.8-0.7c-0.2-0.2-0.5-0.2-0.7,0l-8.7,9.7c-0.2,0.2-0.2,0.5,0,0.7l8.7,9.7c0.2,0.2,0.5,0.2,0.7,0l0.8-0.7 c0.2-0.2,0.2-0.5,0-0.7l-7.7-8.3c-0.2-0.2-0.2-0.5,0-0.7l7.7-8.3C16.6,3.1,16.6,2.8,16.4,2.6z"/>
	</svg>
<?php else : ?>
	<svg x="0px" y="0px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"  role="img" aria-hidden="true" focusable="false">
		<path d="M7.9,21.4l0.8,0.7c0.2,0.2,0.5,0.2,0.7,0l8.7-9.7c0.2-0.2,0.2-0.5,0-0.7L9.4,2c-0.2-0.2-0.5-0.2-0.7,0L7.9,2.6 c-0.2,0.2-0.2,0.5,0,0.7l7.7,8.3c0.2,0.2,0.2,0.5,0,0.7l-7.7,8.3C7.7,20.9,7.7,21.2,7.9,21.4z"/>
	</svg>
<?php
	endif;

	echo apply_filters( 'arkb_sloder_arrow_svg', ob_get_clean(), $position );
}


/**
 * arrow svg
 */
function render_thumb_slider() {

	echo '<div class="swiper-container -thumb"><div class="swiper-wrapper">';
	foreach ( \Arkhe_Blocks::$slide_images as $images ) :
		$pcimg     = $images['pc'];
		$pcimg_src = wp_get_attachment_image_src( $pcimg['id'], 'medium' );
		$pcimg_url = ( false !== $pcimg_src ) ? $pcimg_src[0] : $pcimg['url'];

		$spimg     = $images['sp'];
		$spimg_src = wp_get_attachment_image_src( $spimg['id'], 'medium' );
		$spimg_url = ( false !== $spimg_src ) ? $spimg_src[0] : $spimg['url'];

		echo '<div class="swiper-slide"><picture class="ark-block-slider__thumb">';
		if ( $spimg_url ) {
			echo '<source media="(max-width: 999px)" srcset="' . esc_attr( $spimg_url ) . '" />';
		}
		echo '<img class="arkb-obf-cover" src="' . esc_attr( $pcimg_url ) . '" alt=""></picture></div>';
	endforeach;
	echo '</div></div>';
}
