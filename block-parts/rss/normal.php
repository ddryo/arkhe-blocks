<?php
/**
 * RSSフィードの出力テンプレート
 */
$list_args = $args['list_args'] ?? null;
$feed_data = $args['feed_data'] ?? null;

// リスト情報
$list_type   = $list_args['list_type'] ?? ARKHE_LIST_TYPE;
$show_site   = $list_args['show_site'] ?? true;
$show_date   = $list_args['show_date'] ?? true;
$show_author = $list_args['show_author'] ?? false;
$show_thumb  = $list_args['show_thumb'] ?? true;
$site_title  = $list_args['site_title'] ?? '';
$favicon     = $list_args['favicon'] ?? '';
$h_tag       = $list_args['h_tag'] ?? 'h2';
$list_class  = $list_args['list_class'] ?? '';
$list_class  = $list_class ? 'p-postList__item ' . $list_class : 'p-postList__item';


// フィード情報
$feed_title  = $feed_data['title'] ?? '';
$feed_link   = $feed_data['link'] ?? '';
$feed_date   = $feed_data['date'] ?? '';
$feed_author = $feed_data['author'] ?? '';
$feed_thumb  = $feed_data['thumbnail'] ?? '';

$meta_args = [
	'show_site'   => $show_site,
	'show_date'   => $show_date,
	'show_author' => $show_author,
	'site_title'  => $site_title,
	'favicon'     => $favicon,
	'feed_date'   => $feed_date,
	'feed_author' => $feed_author,
];

?>
<li class="<?php echo esc_attr( $list_class ); ?>">
	<a href="<?php echo esc_url( $feed_link ); ?>" class="p-postList__link">
		<?php if ( $show_thumb && $feed_thumb ) : ?>
			<div class="p-postList__thumb c-postThumb">
				<figure class="c-postThumb__figure">
					<img class="c-postThumb__img" src="<?php echo esc_url( $feed_thumb ); ?>" alt="">
				</figure>
			</div>
		<?php endif; ?>

		<div class="p-postList__body">
			<?php
				echo '<' . esc_attr( $h_tag ) . ' class="p-postList__title">';
				echo esc_html( $feed_title );
				echo '</' . esc_attr( $h_tag ) . '>';
			?>
			<?php \Arkhe_Blocks::get_part( 'rss/item/meta', $meta_args ); ?>
		</div>
	</a>
</li>
