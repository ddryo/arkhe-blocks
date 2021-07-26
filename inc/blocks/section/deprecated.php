<?php
namespace Arkhe_Blocks\Block\Section;

defined( 'ABSPATH' ) || exit;

// 出力内容
function render_section_old( $attrs, $content ) {
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
		<?php echo render_media( $attrs ); ?>
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
	<?php
}
