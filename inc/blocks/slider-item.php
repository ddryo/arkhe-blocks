<?php
namespace Arkhe_Blocks\Block\Slider_Item;

defined( 'ABSPATH' ) || exit;

register_block_type_from_metadata(
	ARKHE_BLOCKS_PATH . 'src/gutenberg/blocks/slider-item',
	[
		'render_callback'  => '\Arkhe_Blocks\Block\Slider_Item\cb',
	]
);

// phpcs:disable WordPress.NamingConventions.ValidVariableName.InterpolatedVariableNotSnakeCase
function cb( $attrs, $content ) {

	ob_start();

	if ( 'media' === $attrs['variation'] ) {
		render_media_slider( $attrs );
	} else {
		render_rich_slider( $attrs, $content );
	}
	return ob_get_clean();
	// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
}


/**
 * リッチスライダー
 */
function render_rich_slider( $attrs, $content ) {

	$filter          = $attrs['filter'];
	$padPC           = $attrs['paddingPC'];
	$padSP           = $attrs['paddingSP'];
	$contentPosition = $attrs['contentPosition'];

	// style
	$block_style = [
		'--arkb-slide-padding'               => "{$padPC['top']} {$padPC['right']} {$padPC['bottom']} {$padPC['left']}",
		'--arkb-slide-padding--sp'           => "{$padSP['top']} {$padSP['right']} {$padSP['bottom']} {$padSP['left']}",
	];
	$block_style = \Arkhe_Blocks::convert_style_props( $block_style );

	// colorLayer 属性
	$color_layer_style = [
		'background' => $attrs['bgGradient'] ?: $attrs['bgColor'],
		'opacity'    => $attrs['opacity'] * 0.01, // round()
	];
	$color_layer_style = \Arkhe_Blocks::convert_style_props( $color_layer_style );

	// textLayer 属性
	$text_layer_props = 'data-content="' . esc_attr( str_replace( ' ', '-', $contentPosition ) ) . '"';

	$text_layer_style = [
		'color' => $attrs['textColor'],
	];
	$text_layer_style = \Arkhe_Blocks::convert_style_props( $text_layer_style );

	if ( $text_layer_style ) {
		$text_layer_props .= ' style="' . esc_attr( $text_layer_style ) . '"';
	}

	// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
	?>
	<div class="ark-block-slider__slide swiper-slide" style="<?=esc_attr( $block_style )?>">
		<?php render_slide_media_layer( $attrs ); ?>
		<div class="ark-block-slider__color arkb-absLayer" style="<?=esc_attr( $color_layer_style )?>"></div>
		<?php if ( 'off' !== $filter ) : ?>
			<div class="c-filterLayer -filter-<?=esc_attr( $filter )?> arkb-absLayer"></div>
		<?php endif; ?>
		<div class="ark-block-slider__body"<?=$text_layer_props?>>
			<div class="ark-block-slider__bodyInner ark-keep-mt--s">
				<?=$content?>
			</div>
		</div>
	</div>
	<?php
	// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
}

/**
 * メディアスライダー
 */
function render_media_slider( $attrs ) {
	// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
	?>
	<div class="ark-block-slider__slide swiper-slide">
		<?php render_slide_media_layer( $attrs ); ?>
	</div>
	<?php
	// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
}


function render_slide_media_layer( $attrs ) {

	// mediaデータ
	$media         = $attrs['media'];
	$mediaSP       = $attrs['mediaSP'];
	$mediaId       = $media['id'];
	$mediaUrl      = $media['url'];
	$mediaType     = $media['type'];
	$mediaWidth    = $media['width'] ?? 0;
	$mediaHeight   = $media['height'] ?? 0;
	$mediaIdSP     = $mediaSP['id'];
	$mediaUrlSP    = $mediaSP['url'];
	$mediaTypeSP   = $mediaSP['type'];
	$mediaWidthSP  = $mediaSP['width'] ?? 0;
	$mediaHeightSP = $mediaSP['height'] ?? 0;

	if ( ! $mediaUrl ) {
		return '';
	}
	if ( is_array( \Arkhe_Blocks::$slide_images ) ) {
		\Arkhe_Blocks::$slide_images[] = [
			'pc' => [
				'id'  => $mediaId,
				'url' => $mediaUrl,
			],
			'sp' => [
				'id'  => $mediaIdSP,
				'url' => $mediaUrlSP,
			],
		];
	}

	$style = [];
	if ( isset( $attrs['focalPoint'] ) ) {
		$x = $attrs['focalPoint']['x'] * 100;
		$y = $attrs['focalPoint']['y'] * 100;

		$style['--arkb-object-position'] = "{$x}% {$y}%";
	}
	if ( isset( $attrs['focalPointSP'] ) ) {
		$x = $attrs['focalPointSP']['x'] * 100;
		$y = $attrs['focalPointSP']['y'] * 100;

		$style['--arkb-object-position--sp'] = "{$x}% {$y}%";
	}
	$style = \Arkhe_Blocks::convert_style_props( $style );

	$media_html = '';
	if ( 'video' === $mediaType && 'image' !== $mediaTypeSP ) {

		// videoタグの属性
		$video_props                      = ' autoPlay loop playsinline muted';
		if ( $mediaWidth ) $video_props  .= ' width="' . esc_attr( $mediaWidth ) . '"';
		if ( $mediaHeight ) $video_props .= ' height="' . esc_attr( $mediaHeight ) . '"';
		if ( $style ) $video_props       .= ' style="' . esc_attr( $style ) . '"';

		// 出力内容
		$media_html = '<video class="ark-block-slider__video arkb-obf-cover"' . $video_props . '>';
		if ( $mediaUrlSP ) {
			$sp_props                        = 'src="' . esc_attr( $mediaUrlSP ) . '"';
			if ( $mediaWidthSP ) $sp_props  .= ' width="' . esc_attr( $mediaWidthSP ) . '"';
			if ( $mediaHeightSP ) $sp_props .= ' height="' . esc_attr( $mediaHeightSP ) . '"';

			$media_html .= '<source media="(max-width: 999px)" ' . $sp_props . ' />';
		}
		$media_html .= '<source src="' . esc_attr( $mediaUrl ) . '" class="ark-block-slider__source" /></video>';

	} elseif ( 'image' === $mediaType && 'video' !== $mediaTypeSP ) {

		// pictureタグの属性
		$picture_props                = '';
		if ( $style ) $picture_props .= ' style="' . esc_attr( $style ) . '"';

		// imgタグのクラス
		$img_class = 'ark-block-slider__img arkb-obf-cover';
		// if ( $media['id'] ) $img_class .= " wp-image-{$media['id']}"; // 必要？

		// imgタグの属性
		$img_props                      = ' alt="' . esc_attr( $attrs['alt'] ) . '"';
		if ( $mediaWidth ) $img_props  .= ' width="' . esc_attr( $mediaWidth ) . '"';
		if ( $mediaHeight ) $img_props .= ' height="' . esc_attr( $mediaHeight ) . '"';

		// 出力内容
		$media_html = '<picture class="ark-block-slider__picture"' . $picture_props . '>';
		if ( $mediaUrlSP ) {
			$sp_props                        = 'srcset="' . esc_attr( $mediaUrlSP ) . '"';
			if ( $mediaWidthSP ) $sp_props  .= ' width="' . esc_attr( $mediaWidthSP ) . '"';
			if ( $mediaHeightSP ) $sp_props .= ' height="' . esc_attr( $mediaHeightSP ) . '"';

			$media_html .= '<source media="(max-width: 999px)" ' . $sp_props . ' />';
		}
		$media_html .= '<img src="' . esc_attr( $mediaUrl ) . '" class="' . esc_attr( $img_class ) . '"' . $img_props . '></picture>';
	}

	$layer_class = 'ark-block-slider__media';
	if ( 'rich' === $attrs['variation'] ) {
		$layer_class .= ' arkb-absLayer';
	}

	$media_html = apply_filters( 'arkb_slide_media_html', $media_html, $attrs );
	if ( $media_html ) {
		echo '<div class="' . esc_attr( $layer_class ) . '">' . $media_html . '</div>'; // phpcs:ignore
	}
}
