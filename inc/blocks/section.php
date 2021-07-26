<?php
namespace Arkhe_Blocks\Block\Section;

defined( 'ABSPATH' ) || exit;

register_block_type_from_metadata(
	ARKHE_BLOCKS_PATH . 'src/gutenberg/blocks/section',
	[
		'render_callback'  => '\Arkhe_Blocks\Block\Section\cb',
	]
);

function cb( $attrs, $content ) {

	// 最新: section v3
	if ( false !== strpos( $content, '<!-- media -->' ) ) {
		return render_section( $attrs, $content );
	} elseif ( false !== strpos( $content, 'class="ark-block-section__body' ) ) {
		return $content;
	}

	// 後方互換
	require_once __DIR__ . '/section/migrate.php';
	require_once __DIR__ . '/section/deprecated.php';
	require_once __DIR__ . '/section/helper.php';

	// 初期 -> section v2
	if ( false !== strpos( $content, 'class="ark-block-section__inner' ) ) {
		$content = migrate_content( $content );
	}

	// section v2
	ob_start();
	render_section_old( $attrs, $content );
	return ob_get_clean();
}


function render_section( $attrs, $content ) {
	$media = render_media( $attrs );
	return str_replace( '<!-- media -->', $media, $content );
}


function render_media( $attrs ) {
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

	if ( ! $mediaUrl ) return '';

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
		$media_html = '<video class="ark-block-section__video arkb-obf-cover"' . $video_props . '>';
		if ( $mediaUrlSP ) {
			$sp_props                        = 'src="' . esc_attr( $mediaUrlSP ) . '"';
			if ( $mediaWidthSP ) $sp_props  .= ' width="' . esc_attr( $mediaWidthSP ) . '"';
			if ( $mediaHeightSP ) $sp_props .= ' height="' . esc_attr( $mediaHeightSP ) . '"';

			$media_html .= '<source media="(max-width: 999px)" ' . $sp_props . ' />';
		}
		$media_html .= '<source src="' . esc_attr( $mediaUrl ) . '" class="ark-block-section__source" /></video>';

	} elseif ( 'image' === $mediaType && 'video' !== $mediaTypeSP ) {

		// pictureタグの属性
		$picture_props                = '';
		if ( $style ) $picture_props .= ' style="' . esc_attr( $style ) . '"';

		// imgタグのクラス
		$img_class = 'ark-block-section__img arkb-obf-cover';
		// if ( $mediaId ) $img_class .= " wp-image-{$mediaId}"; // 必要？

		// imgタグの属性
		$img_props                      = ' alt=""';
		if ( $mediaWidth ) $img_props  .= ' width="' . esc_attr( $mediaWidth ) . '"';
		if ( $mediaHeight ) $img_props .= ' height="' . esc_attr( $mediaHeight ) . '"';

		// 出力内容
		$media_html = '<picture class="ark-block-section__picture"' . $picture_props . '>';
		if ( $mediaUrlSP ) {
			$sp_props                        = 'srcset="' . esc_attr( $mediaUrlSP ) . '"';
			if ( $mediaWidthSP ) $sp_props  .= ' width="' . esc_attr( $mediaWidthSP ) . '"';
			if ( $mediaHeightSP ) $sp_props .= ' height="' . esc_attr( $mediaHeightSP ) . '"';

			$media_html .= '<source media="(max-width: 999px)" ' . $sp_props . ' />';
		}
		$media_html .= '<img src="' . esc_attr( $mediaUrl ) . '" class="' . esc_attr( $img_class ) . '"' . $img_props . '></picture>';
	}

	$media_html = apply_filters( 'arkb_section_media_html', $media_html, $attrs );
	if ( $media_html ) {
		return '<div class="ark-block-section__media arkb-absLayer">' . $media_html . '</div>';
	}
}
