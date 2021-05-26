<?php
namespace Arkhe_Blocks\Block\Section;

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/section/migrate.php';
require_once __DIR__ . '/section/helper.php';

register_block_type_from_metadata(
	ARKHE_BLOCKS_PATH . 'src/gutenberg/blocks/section',
	[
		'render_callback'  => '\Arkhe_Blocks\Block\Section\cb',
	]
);

function cb( $attrs, $content ) {
	if ( false !== strpos( $content, 'class="ark-block-section__inner' ) ) {
		$content = migrate_content( $content );
	}
	ob_start();
	render_section( $attrs, $content );
	return ob_get_clean();
}


// 出力内容
function render_section( $attrs, $content ) {
	$anchor          = $attrs['anchor'] ?? '';
	$className       = $attrs['className'] ?? '';
	$align           = $attrs['align'] ?? '';
	$filter          = $attrs['filter'];
	$mediaUrl        = $attrs['media']['url'] ?? '';
	$height          = $attrs['height'] ?? 'content';
	$contentPosition = $attrs['contentPosition'] ?? 'center left';
	$contentPosition = str_replace( ' ', '-', $contentPosition );

	// svgデータ
	$svgDataTop    = get_svg_data( $attrs['svgTop'] );
	$svgDataBottom = get_svg_data( $attrs['svgBottom'] );

	// class名
	$block_class = 'ark-block-section';
	if ( $mediaUrl ) {
		$block_class .= ' has-bg-img';
	}
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

	// data-height
	$block_props .= ' data-height="' . esc_attr( $height ) . '"';
	if ( 'full' === $align && $attrs['innerSize'] ) {
		$block_props .= ' data-inner="' . esc_attr( $attrs['innerSize'] ) . '"';
	}

	// Block style
	$block_style = get_block_style( $attrs );
	if ( $svgDataTop['height'] ) {
		$block_style['--arkb-svg-height--top'] = $svgDataTop['height'] . 'vw';
	}
	if ( $svgDataBottom['height'] ) {
		$block_style['--arkb-svg-height--bottom'] = $svgDataBottom['height'] . 'vw';
	}
	$block_style = \Arkhe_Blocks::convert_style_props( $block_style );

	if ( $block_style ) {
		$block_props .= ' style="' . esc_attr( $block_style ) . '"';
	}

	// colorLayer 属性
	$color_layer_style = [
		'background' => $attrs['bgGradient'] ?? $attrs['bgColor'] ?? '#f7f7f7',
		'opacity'    => $attrs['opacity'] * 0.01, // round()
	];
	$color_layer_style = \Arkhe_Blocks::convert_style_props( $color_layer_style );

	// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
	?>
	<div <?=$block_props?>>
		<?php render_media( $attrs ); ?>
		<div class="ark-block-section__color arkb-absLayer" style="<?=esc_attr( $color_layer_style )?>"></div>
		<?php if ( 'off' !== $filter ) : ?>
			<div class="c-filterLayer -filter-<?=esc_attr( $filter )?> arkb-absLayer"></div>
		<?php endif; ?>
		<div class="ark-block-section__body" data-content="<?=esc_attr( $contentPosition )?>">
			<div class="ark-block-section__bodyInner ark-keep-mt">
				<?=$content?>
			</div>
		</div>
		<?php render_svg( 'top', $svgDataTop ); ?>
		<?php render_svg( 'bottom', $svgDataBottom ); ?>
	</div>
	<?php
	// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
}


function render_media( $attrs ) {
	if ( $attrs['isRepeat'] ) return '';

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
		echo '<div class="ark-block-section__media arkb-absLayer">' . $media_html . '</div>'; // phpcs:ignore
	}
}


function render_svg( $position, $svgData ) {
	if ( 0 === $svgData['height']) return;

	$type      = $svgData['type'];
	$isReverse = $svgData['isReverse'];
	$color     = $svgData['color'];

	$style = [];
	if ( $color ) {
		$style['fill'] = $color;
	}
	$style = \Arkhe_Blocks::convert_style_props( $style );

	$path = '';
	if ( 'line' === $type ) {
		$path = $isReverse ? '<polygon points="0,0 100,0 100,100" />' : '<polygon points="0,0 0,100 100,0" />';
	} elseif ( 'circle' === $type ) {
		$path = $isReverse ? '<path d="M0,0c20.1,133.4,79.9,133.3,100,0H0z" />' : '<g><path d="M0,100V0h50C30,0,10,33.3,0,100z" /><path d="M50,0h50v100C90,33.3,70,0,50,0z" /></g>';
	} elseif ( 'wave' === $type ) {
		$path = $isReverse ? '<path d="M0,50.3c0.1,0.1,0.1,0.4,0.2,0.6C6.3,75,12.6,100,25,100s18.7-25,24.8-49C56,26.5,62.4,1.3,75,1.3c12.5,0,18.9,24.9,25,49V0 L25,0L0,0L0,50.3z" />' : '<path d="M100,0H75H0v50.3c6.1-24.2,12.5-49,25-49c12.6,0,19,25.3,25.2,49.7c6.1,24,12.4,49,24.8,49s18.7-25,24.8-49.2 c0.1-0.1,0.1-0.4,0.2-0.6V0z" />';
	} elseif ( 'zigzag' === $type ) {
		$path = $isReverse ? '<path d="M0,50.3L25,100c0,0,50-100.3,50-98.8l25,49V0H25H0V50.3z" />' : '<path d="M100,50.3L75,100c0,0-50-100.3-50-98.8l-25,49V0h75h25V50.3z" />';
	}

	$path = apply_filters( 'arkb_section_svg_path', $path, $type, $isReverse );
	?>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"
			class="ark-block-section__svg -<?=esc_attr( $position )?>"
			aria-hidden="true" focusable="false" style="<?=esc_attr( $style )?>">
			<?php echo $path; // phpcs:ignore ?>
		</svg>
	<?php
}
