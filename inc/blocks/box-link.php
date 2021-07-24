<?php
namespace Arkhe_Blocks\Block\BoxLink;

defined( 'ABSPATH' ) || exit;

register_block_type_from_metadata(
	ARKHE_BLOCKS_PATH . 'src/gutenberg/blocks/box-link',
	[
		'render_callback'  => '\Arkhe_Blocks\Block\BoxLink\cb',
	]
);

function cb( $attrs, $content ) {
	ob_start();
	render_box( $attrs, $content );
	return ob_get_clean();
}


// 出力内容
function render_box( $attrs, $content ) {
	$media_attrs = [
		'imgId'      => $attrs['imgId'] ?? 0,
		'imgUrl'     => $attrs['imgUrl'] ?? '',
		'imgAlt'     => $attrs['imgAlt'] ?? '',
		'imgW'       => $attrs['imgW'] ?? '',
		'imgH'       => $attrs['imgH'] ?? '',
	];

	// render_figure のフックに投げる用
	$block_attrs = [
		$anchor    = $attrs['anchor'] ?? '',
		$className = $attrs['className'] ?? '',
	];

	if ( false !== stripos( $content, '<!-- figure -->' ) ) {

		$ratio      = $attrs['ratio'] ?? '';
		$fixRatio   = $attrs['fixRatio'] ?? false;
		$isContain  = $attrs['isContain'] ?? false;
		$layout     = $attrs['layout'] ?? '';
		$isVertical = 'vertical' === $layout;

		$figure_class  = 'arkb-boxLink__figure';
		$figure_class .= $fixRatio ? ' is-fixed-ratio' : '';

		$img_add_class = '';
		$isFix         = $fixRatio || ! $isVertical;
		if ( $isFix ) {
			$img_add_class = $isContain ? 'arkb-obf-contain' : 'arkb-obf-cover';
		}

		$style = [];
		if ( $ratio ) {
			if ( $isVertical ) {
				// $style['paddingTop'] = "{$ratio}%";
				$style['--ark-thumb_ratio'] = "{$ratio}%";
			} elseif ( ! $isVertical ) {
				$style['flexBasis'] = "{$ratio}%";
			}
		}

		$media_attrs['figure_class']  = $figure_class;
		$media_attrs['img_add_class'] = $img_add_class;
		$media_attrs['style']         = $style;

		$figure  = render_figure( $media_attrs, $block_attrs );
		$content = str_replace( '<!-- figure -->', $figure, $content );

	} elseif ( false !== stripos( $content, '<!-- figure is-banner -->' ) ) {
		// バナースタイルの時のfigure

		$media_attrs['figure_class']  = 'arkb-boxLink__bg';
		$media_attrs['img_add_class'] = 'arkb-obf-cover';

		$figure  = render_figure( $media_attrs, $block_attrs );
		$content = str_replace( '<!-- figure is-banner -->', $figure, $content );
	}

	// MORE svg
	if ( false !== stripos( $content, '<!-- more-svg -->' ) ) {

		$svg     = render_svg( $block_attrs );
		$content = str_replace( '<!-- more-svg -->', $svg, $content );
	}

	echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}



/**
 * figureの生成
 */
function render_figure( $media_attrs, $block_attrs ) {
	$imgId         = $media_attrs['imgId'];
	$imgUrl        = $media_attrs['imgUrl'];
	$imgAlt        = $media_attrs['imgAlt'];
	$imgW          = $media_attrs['imgW'];
	$imgH          = $media_attrs['imgH'];
	$figure_class  = $media_attrs['figure_class'];
	$img_add_class = $media_attrs['img_add_class'] ?? '';
	$style         = $media_attrs['style'] ?? [];

	$figure_props = 'class="' . esc_attr( $figure_class ) . '"';
	if ( ! empty( $style ) ) {
		$style         = \Arkhe_Blocks::convert_style_props( $style );
		$figure_props .= ' style="' . esc_attr( $style ) . '"';
	}

	$img_class = "arkb-boxLink__img wp-image-{$imgId} {$img_add_class}";
	$img_props = 'src="' . esc_url( $imgUrl ) . '" class="' . esc_attr( trim( $img_class ) ) . '" alt="' . esc_attr( $imgAlt ) . '"';

	if ( $imgW ) $img_props .= ' width="' . esc_attr( $imgW ) . '"';
	if ( $imgH ) $img_props .= ' height="' . esc_attr( $imgH ) . '"';

	$return = '<figure ' . $figure_props . '><img ' . $img_props . '></figure>';

	if ( has_filter( 'arkb_box_link_figure_html' ) ) {
		$return = apply_filters( 'arkb_box_link_figure_html', $return, $media_attrs, $block_attrs );
	}
	return $return;
}



/**
 * MORE SVG
 */
function render_svg( $block_attrs ) {
	$svg = '<svg class="arkb-boxLink__more__svg" width="16" height="16" viewBox="0 0 32 32" role="img" focusable="false" >' .
			'<path d="M30.4,15.5l-4.5-4.5l-1.1,1.1l3.4,3.4H1.6v1.6h28.8V15.5z" />' .
		'</svg>';

	if ( has_filter( 'arkb_box_link_svg' ) ) {
		$svg = apply_filters( 'arkb_box_link_svg', $svg, $block_attrs );
	}
	return $svg;
}
