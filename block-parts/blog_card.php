<?php
/**
 * ブログカード
 */

// 初期値とマージ
$args = array_merge([
	'url'       => '',
	'excerpt'   => '',
	'title'     => '',
	'caption'   => '',
	'thumb_id'  => 0,
	'thumb_url' => '',
	'icon'      => '',
	'is_newtab' => false,
	'rel'       => '',
	'type'      => '',

], $args );

$url    = $args['url'];
$target = ( $args['is_newtab'] ) ? ' target="_blank"' : '';
$rel    = $args['rel'] ? ' rel="' . $args['rel'] . '"' : '';

$img_class = 'c-postThumb__img -no-lb';
if ( $args['thumb_id'] ) {
	$img_class .= ' wp-image-' . $args['thumb_id'];
}

$favicon = $args['icon'] ? esc_url( $args['icon'] ) : 'https://www.google.com/s2/favicons?domain_url=' . esc_url( $url );

// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
?>
<div class="ark-block-blogCard c-boxLink">
	<a href="<?=esc_url( $url )?>" class="c-boxLink__inner" data-type="<?=$args['type']?>"<?=$target . $rel?>>
	<!-- <div class="p-blogCard__inner"> -->
		<?php if ( $args['thumb_url'] ) : ?>
			<div class="c-boxLink__figure c-postThumb">
				<figure class="c-postThumb__figure">
					<img src="<?=esc_url( $args['thumb_url'] )?>" alt="" class="<?=esc_attr( $img_class )?>">
				</figure>
			</div>
		<?php endif; ?>
		<div class="c-boxLink__body">
			<div class="c-boxLink__title"><?=esc_html( $args['title'] )?></div>
			<div class="c-boxLink__content"><?=esc_html( $args['excerpt'] )?></div>
			<?php if ( $args['caption'] ) : ?>
				<div class="c-boxLink__more">
					<img class="c-boxLink__favicon" src="<?=$favicon?>" alt="">
					<span class="c-boxLink__caption"><?=esc_html( $args['caption'] )?></span>
				</div>
			<?php endif; ?>

				<!-- <span class="c-boxLink__more__text">READ MORE</span> -->

		</div>
	<!-- </div> -->
	</a>
</div>
