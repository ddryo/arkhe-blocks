<?php
/**
 * ブログカード
 */
$args = array_merge([
	'url'          => '',
	'excerpt'      => '',
	'title'        => '',
	'caption'      => '',
	'thumb_id'     => 0,
	'thumb_url'    => '',
	'icon'         => '',
	'is_newtab'    => false,
	'rel'          => '',
	'type'         => '',
	'class'        => '',
	'show_excerpt' => 'both',
], $args );

$url    = $args['url'];
$target = ( $args['is_newtab'] ) ? ' target="_blank"' : '';
$rel    = $args['rel'] ? ' rel="' . $args['rel'] . '"' : '';

$img_class = 'c-postThumb__img';
if ( $args['thumb_id'] ) {
	$img_class .= ' wp-image-' . $args['thumb_id'];
}

$favicon = '';
if ( 'external' === $args['type'] ) {
	$favicon = $args['icon'] ? esc_url( $args['icon'] ) : 'https://www.google.com/s2/favicons?domain_url=' . esc_url( $url );
}

$add_class     = $args['class'] ? ' ' . $args['class'] : '';
$excerpt_class = 'both' !== $args['show_excerpt'] ? ' u-only-' . $args['show_excerpt'] : '';

// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
?>
<div class="ark-block-blogCard arkb-boxLink<?=esc_attr( $add_class )?>">
	<a href="<?=esc_url( $url )?>" class="arkb-boxLink__inner" data-type="<?=$args['type']?>"<?=$target . $rel?>>
		<?php if ( $args['thumb_url'] ) : ?>
			<div class="arkb-boxLink__figure c-postThumb">
				<figure class="c-postThumb__figure">
					<img src="<?=esc_url( $args['thumb_url'] )?>" alt="" class="<?=esc_attr( $img_class )?>">
				</figure>
			</div>
		<?php endif; ?>
		<div class="arkb-boxLink__body">
			<div class="arkb-boxLink__title"><?=esc_html( $args['title'] )?></div>
			<?php if ( 'none' !== $args['show_excerpt'] ) : ?>
				<div class="arkb-boxLink__content<?=esc_attr( $excerpt_class )?>">
					<?=esc_html( $args['excerpt'] )?>
				</div>
			<?php endif; ?>
			<?php if ( $args['caption'] ) : ?>
				<div class="arkb-boxLink__more">
					<?php if ( $favicon ) : ?>
						<img class="arkb-boxLink__favicon" src="<?=$favicon?>" alt="" aria-hidden="true">
					<?php endif; ?>
					<span class="arkb-boxLink__caption"><?=esc_html( $args['caption'] )?></span>
				</div>
			<?php endif; ?>
		</div>
	</a>
</div>
