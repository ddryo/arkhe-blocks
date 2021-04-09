<?php
namespace Arkhe_Blocks\Blocks\Section;

use My\Full\Classname as Another;

defined( 'ABSPATH' ) || exit;

// phpcs:disable WordPress.NamingConventions.ValidVariableName.InterpolatedVariableNotSnakeCase

/**
 * 固定ページリストブロック
 */
$block_name = 'section';

register_block_type_from_metadata(
	ARKHE_BLOCKS_PATH . 'src/gutenberg/blocks/' . $block_name,
	[
		'render_callback'  => '\Arkhe_Blocks\Blocks\Section\cb',
	]
);


// 古いバージョンからの変換
function migrate( $attrs ) {
	$height   = 'content';
	$heightPC = '400px';
	$heightSP = '50vh';

	$old_heightUnitPC    = $attrs['heightUnitPC'] ?? '';
	$old_heightUnitSP    = $attrs['heightUnitSP'] ?? '';
	$old_contentPosition = $attrs['contentPosition'] ?? '';

	// 高さの設定
	if ( $old_heightUnitPC || $$old_heightUnitSP ) {
		$height   = 'custom';
		$heightPC = $attrs['heightPC'] . $old_heightUnitPC;
		$heightSP = $attrs['heightSP'] . $old_heightUnitSP;
	}

	// 上書き or 追加
	$attrs['height']          = $height;
	$attrs['heightPC']        = $heightPC;
	$attrs['heightSP']        = $heightSP;
	$attrs['contentPosition'] = $old_contentPosition ?: 'center left';
	$attrs['padPC']           = [
		'top'    => $padPC,
		'left'   => '2rem',
		'right'  => '2rem',
		'bottom' => $padPC,
	];
	$attrs['padSP']           = [
		'top'    => $padSP,
		'left'   => '4vw',
		'right'  => '4vw',
		'bottom' => $padSP,
	];

	// 削除
	unset( $attrs['isFullscreen'] );
	unset( $attrs['heightUnitPC'] );
	unset( $attrs['heightUnitSP'] );
	unset( $attrs['padUnitPC'] );
	unset( $attrs['padUnitSP'] );

	return $attrs;
}


function cb( $attrs, $content ) {
	if ( ! isset( $attrs['version'] ) ) {
		$attrs = migrate( $attrs );
	}
	ob_start();
	render_section( $attrs, $content );
	return ob_get_clean();
}


function render_section( $attrs, $content ) {

	$height          = $attrs['height'] ?? 'content';
	$align           = $attrs['align'] ?? '';
	$contentPosition = str_replace( ' ', '-', $attrs['contentPosition'] );

	// class名
	$block_class = 'ark-block-section';
	if ( $attrs['mediaUrl'] ) {
		$block_class .= ' has-bg-img';
	}
	if ( $align ) {
		$block_class .= ' align' . $align;
	}

	// 属性
	// 'data-height': height || null,
	// 'data-inner': innerSize || null,
	// 'data-v': '2',

	$block_props = ' data-v="2" data-height="' . esc_attr( $height ) . '"';
	if ( 'full' === $align ) {
		$block_props .= ' data-inner="' . esc_attr( $attrs['innerSize'] ) . '"';
	}

	// style
	$block_style = get_block_style( $attrs );
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
	<div class="<?=esc_attr( $block_class )?>"<?=$block_props?>>
		<div class="ark-block-section__media arkb-absLayer">
			<?php render_media( $attrs ); ?>
		</div>
		<div class="ark-block-section__color arkb-absLayer" style="<?=esc_attr( $color_layer_style )?>"></div>
		<div class="ark-block-section__body" data-content="<?=esc_attr( $contentPosition )?>">
			<div class="ark-block-section__inner ark-keep-mt--s">
				<?=$content?>
			</div>
		</div>
	</div>
	<?php
	// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
}


// style生成
function get_block_style( $attrs ) {

	$height   = $attrs['height'];
	$heightPC = $attrs['heightPC'];
	$heightSP = $attrs['heightSP'];
	$padPC    = $attrs['padPC'];
	$padSP    = $attrs['padSP'];
	$mediaUrl = $attrs['mediaUrl'];

	// style
	$style = [
		'--arkb-slide-pad'     => "{$padPC['top']} {$padPC['right']} {$padPC['bottom']} {$padPC['left']}",
		'--arkb-slide-pad--sp' => "{$padSP['top']} {$padSP['right']} {$padSP['bottom']} {$padSP['left']}",
	];

	// 内部minheight
	if ( 'custom' === $height ) {
		if ( $heightPC ) $style['--arkb-section-minH']     = $heightPC;
		if ( $heightSP ) $style['--arkb-section-minH--sp'] = $heightSP;
	}

	if ( $attrs['textColor'] ) {
		$style['color'] = $attrs['textColor'];
	}

	// リピート背景画像
	if ( $attrs['isRepeat'] && $mediaUrl ) {
		$attrs['background-image']  = 'url(' . $mediaUrl . ')';
		$attrs['background-repeat'] = 'repeat';
	}

	return \Arkhe_Blocks::convert_style_props( $style );
}



function render_media( $attrs ) {

	if ( $attrs['isRepeat'] ) {
		return '';
	}
	if ( ! $attrs['mediaUrl'] ) {
		return '';
	}

	$mediaId     = $attrs['mediaId'];
	$mediaIdSP   = $attrs['mediaIdSP'] ?? '';
	$mediaUrl    = $attrs['mediaUrl'];
	$mediaUrlSP  = $attrs['mediaUrlSP'];
	$mediaType   = $attrs['mediaType'];
	$mediaTypeSP = $attrs['mediaTypeSP'];
	$mediaWidth  = $attrs['mediaWidth'] ?? 0;
	$mediaHeight = $attrs['mediaHeight'] ?? 0;
	// $alt         = $attrs['alt'];

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

	$mediaSrc = '';

	if ( 'video' === $mediaType && 'image' !== $mediaTypeSP ) {
		// videoタグの属性
		$video_props = ' autoPlay loop playsinline muted';
		if ( $mediaWidth ) {
			$video_props .= ' width="' . esc_attr( $mediaWidth ) . '"';
		}
		if ( $mediaHeight ) {
			$video_props .= ' height="' . esc_attr( $mediaHeight ) . '"';
		}
		if ( $style ) {
			$video_props .= ' style="' . esc_attr( $style ) . '"';
		}

		// 出力内容
		$mediaSrc = '<video class="ark-block-section__video arkb-obf-cover"' . $video_props . '>';
		if ( $mediaUrlSP ) {
			$mediaSrc .= '<source media="(max-width: 999px)" src="' . esc_attr( $mediaUrlSP ) . '" />';
		}
		$mediaSrc .= '<source src="' . esc_attr( $mediaUrl ) . '" class="ark-block-section__source" /></video>';

	} elseif ( 'image' === $mediaType && 'video' !== $mediaTypeSP ) {

		// pictureタグの属性
		$picture_props = '';
		if ( $style ) {
			$picture_props .= ' style="' . esc_attr( $style ) . '"';
		}

		// imgタグのクラス
		$img_class = 'ark-block-section__img';
		if ( $mediaId ) {
			$img_class .= " wp-image-{$mediaId}";
		}

		// imgタグの属性
		$img_props = ' alt=""';
		if ( $mediaWidth ) {
			$img_props .= ' width="' . esc_attr( $mediaWidth ) . '"';
		}
		if ( $mediaHeight ) {
			$img_props .= ' height="' . esc_attr( $mediaHeight ) . '"';
		}

		// 出力内容
		$mediaSrc = '<picture class="ark-block-section__picture arkb-obf-cover"' . $picture_props . '>';
		if ( $mediaUrlSP ) {
			$mediaSrc .= '<source media="(max-width: 999px)" srcset="' . esc_attr( $mediaUrlSP ) . '" />';
		}
		$mediaSrc .= '<img src="' . esc_attr( $mediaUrl ) . '" class="' . esc_attr( $img_class ) . '"' . $img_props . '></picture>';
	}

	$layer_class = 'ark-block-section__mediaLayer arkb-absLayer';

	// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
	// $mediaSrc = apply_filters( 'arkb_slide_media_src', $mediaSrc, $attrs );
	echo $mediaSrc;
	// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
}
