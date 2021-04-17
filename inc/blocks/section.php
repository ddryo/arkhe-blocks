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


/**
 * 旧データからの変換処理
 */
add_filter( 'render_block_data', function ( $block ) {

	// section ブロックのみ処理する
	if ( 'arkhe-blocks/section' !== $block['blockName'] ) return $block;

	$attrs = $block['attrs'];

	// echo '<pre style="margin-left: 100px;">';
	// var_dump( $attrs );
	// echo '</pre>';

	// height関連
	if ( isset( $attrs['heightPC'] ) && is_numeric( $attrs['heightPC'] ) ) {
		$heightUnitPC      = $attrs['heightUnitPC'] ?? 'px';
		$attrs['heightPC'] = $attrs['heightPC'] . $heightUnitPC;
		$attrs['height']   = 'custom';
		unset( $attrs['heightUnitPC'] );
	}
	if ( isset( $attrs['heightSP'] ) && is_numeric( $attrs['heightSP'] ) ) {
		$heightUnitSP      = $attrs['heightUnitSP'] ?? 'px';
		$attrs['heightSP'] = $attrs['heightSP'] . $heightUnitSP;
		$attrs['height']   = 'custom';
		unset( $attrs['heightUnitSP'] );
	}

	// padding関連
	if ( isset( $attrs['padPC'] ) ) {
		$padUnitPC          = $attrs['padUnitPC'] ?? 'rem';
		$attrs['paddingPC'] = [
			'top'    => $attrs['padPC'] . $padUnitPC,
			'left'   => '2rem',
			'right'  => '2rem',
			'bottom' => $attrs['padPC'] . $padUnitPC,
		];
		unset( $attrs['padPC'] );
		unset( $attrs['padUnitPC'] );
	}

	if ( isset( $attrs['padSP'] ) ) {
		$padUnitSP          = $attrs['padUnitSP'] ?? 'rem';
		$attrs['paddingSP'] = [
			'top'    => $attrs['padSP'] . $padUnitSP,
			'left'   => '2rem',
			'right'  => '2rem',
			'bottom' => $attrs['padSP'] . $padUnitSP,
		];
		unset( $attrs['padSP'] );
		unset( $attrs['padUnitSP'] );
	}

	// svg関連
	if ( isset( $attrs['svgLevelTop'] ) ) {
		$attrs['svgTop'] = [
			'type'    => $attrs['svgTypeTop'] ?? 'line',
			'level'   => $attrs['svgLevelTop'],
			'color'   => $attrs['svgColorTop'] ?? '',
		];
		unset( $attrs['svgTypeTop'] );
		unset( $attrs['svgLevelTop'] );
		unset( $attrs['svgColorTop'] );
	}
	if ( isset( $attrs['svgLevelBottom'] ) ) {
		$attrs['svgBottom'] = [
			'type'    => $attrs['svgTypeBottom'] ?? 'line',
			'level'   => $attrs['svgLevelBottom'],
			'color'   => $attrs['svgColorBottom'] ?? '',
		];
		unset( $attrs['svgTypeBottom'] );
		unset( $attrs['svgLevelBottom'] );
		unset( $attrs['svgColorBottom'] );
	}

	$block['attrs'] = $attrs;
	return $block;
});


// 古いバージョンからの変換
function migrate_content( $content ) {

	$content = mb_convert_encoding( $content, 'HTML-ENTITIES', 'auto' );

	$dom = new \DOMDocument( '1.0', 'UTF-8' );
	libxml_use_internal_errors( true );
	$dom->loadHTML( $content );
	libxml_clear_errors();
	$xpath = new \DOMXpath( $dom );

	$innerBlocks = $xpath->query( '//div[@class="ark-block-section__inner ark-keep-mt"]' )->item( 0 )->childNodes;

	$return = '';
	foreach ( $innerBlocks as $block ) {
		$return .= $dom->saveHTML( $block );
	}
	return $return;
}

function cb( $attrs, $content ) {
	if ( false !== strpos( $content, 'class="ark-block-section__inner' ) ) {
		$content = migrate_content( $content );
	}
	ob_start();
	render_section( $attrs, $content );
	return ob_get_clean();
}


function render_section( $attrs, $content ) {

	$height          = $attrs['height'] ?? 'content';
	$align           = $attrs['align'] ?? '';
	$contentPosition = $attrs['contentPosition'] ?? 'center left';
	$contentPosition = str_replace( ' ', '-', $contentPosition );

	// echo '<pre style="margin-left: 100px;">';
	// var_dump( $attrs );
	// echo '</pre>';

	// svgデータ
	$svgDataTop    = get_svg_data( $attrs['svgTop'] );
	$svgDataBottom = get_svg_data( $attrs['svgBottom'] );

	// class名
	$block_class = 'ark-block-section';
	if ( $attrs['mediaUrl'] ) {
		$block_class .= ' has-bg-img';
	}
	if ( $align ) {
		$block_class .= ' align' . $align;
	}

	// 属性
	$block_props = ' data-height="' . esc_attr( $height ) . '"';
	if ( 'full' === $align ) {
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
	<div class="<?=esc_attr( $block_class )?>"<?=$block_props?>>
		<div class="ark-block-section__media arkb-absLayer">
			<?php render_media( $attrs ); ?>
		</div>
		<div class="ark-block-section__color arkb-absLayer" style="<?=esc_attr( $color_layer_style )?>"></div>
		<div class="ark-block-section__body" data-content="<?=esc_attr( $contentPosition )?>">
			<div class="ark-block-section__inner ark-keep-mt">
				<?=$content?>
			</div>
		</div>
		<?php render_svg( 'top', $svgDataTop ); ?>
		<?php render_svg( 'bottom', $svgDataBottom ); ?>
	</div>
	<?php
	// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
}


// style生成
function get_block_style( $attrs ) {

	$height   = $attrs['height'];
	$heightPC = $attrs['heightPC'];
	$heightSP = $attrs['heightSP'];
	$padPC    = $attrs['paddingPC'];
	$padSP    = $attrs['paddingSP'];
	$mediaUrl = $attrs['mediaUrl'];

	// style
	$style = [
		'--arkb-section-padding'     => "{$padPC['top']} {$padPC['right']} {$padPC['bottom']} {$padPC['left']}",
		'--arkb-section-padding--sp' => "{$padSP['top']} {$padSP['right']} {$padSP['bottom']} {$padSP['left']}",
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
		$style['background-image']  = 'url(' . $mediaUrl . ')';
		$style['background-repeat'] = 'repeat';
	}

	return $style;
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
		$img_class = 'ark-block-section__img arkb-obf-cover';
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
		$mediaSrc = '<picture class="ark-block-section__picture"' . $picture_props . '>';
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

function get_svg_data( $svgData ) {
	$svgLevel = $svgData['level'];

	if ( 0 === $svgLevel ) {
		$svgData['isReverse'] = false;
		$svgData['height']    = 0;
	} else {
		$svgData['isReverse'] = 0 > $svgLevel;
		$svgData['height']    = abs( $svgLevel * 0.1 );
	}

	return $svgData;
};


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
	?>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"
			class="ark-block-section__svg -<?=esc_attr( $position )?>"
			aria-hidden="true" focusable="false" style="<?=esc_attr( $style )?>">
			<?php echo $path; // phpcs:ignore ?>
		</svg>
	);
	<?php
}



// const getPath = (type, isReverse) => {
// 	if ('line' === type) {
// 		return isReverse ? (
// 			<polygon points='0,0 100,0 100,100' />
// 		) : (
// 			<polygon points='0,0 0,100 100,0' />
// 		);
// 	} else if ('circle' === type) {
// 		return isReverse ? (
// 			<path d='M0,0c20.1,133.4,79.9,133.3,100,0H0z' />
// 		) : (
// 			<g>
// 				<path d='M0,100V0h50C30,0,10,33.3,0,100z' />
// 				<path d='M50,0h50v100C90,33.3,70,0,50,0z' />
// 			</g>
// 		);
// 	} else if ('wave' === type) {
// 		return isReverse ? (
// 			<path d='M0,50.3c0.1,0.1,0.1,0.4,0.2,0.6C6.3,75,12.6,100,25,100s18.7-25,24.8-49C56,26.5,62.4,1.3,75,1.3c12.5,0,18.9,24.9,25,49V0 L25,0L0,0L0,50.3z' />
// 		) : (
// 			<path d='M100,0H75H0v50.3c6.1-24.2,12.5-49,25-49c12.6,0,19,25.3,25.2,49.7c6.1,24,12.4,49,24.8,49s18.7-25,24.8-49.2 c0.1-0.1,0.1-0.4,0.2-0.6V0z' />
// 		);
// 	} else if ('zigzag' === type) {
// 		return isReverse ? (
// 			<path d='M0,50.3L25,100c0,0,50-100.3,50-98.8l25,49V0H25H0V50.3z' />
// 		) : (
// 			<path d='M100,50.3L75,100c0,0-50-100.3-50-98.8l-25,49V0h75h25V50.3z' />
// 		);
// 	}
// };

// export const SectionSVG = ({ position, type, height, isReverse, fillColor }) => {
// 	const svgStyle = { height: `${height}vw` };
// 	if (fillColor) {
// 		svgStyle.fill = fillColor;
// 	}

// 	return (
// 		<svg
// 			xmlns='http://www.w3.org/2000/svg'
// 			viewBox='0 0 100 100'
// 			preserveAspectRatio='none'
// 			className={`ark-block-section__svg -${position}`}
// 			aria-hidden='true'
// 			focusable='false'
// 			style={svgStyle}
// 		>
// 			{getPath(type, isReverse)}
// 		</svg>
// 	);
// };
