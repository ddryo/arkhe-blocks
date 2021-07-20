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

?>
<li class="<?php echo esc_attr( $list_class ); ?>">
	<a href="<?php echo esc_url( $feed_link ); ?>" class="p-postList__link">
		<div class="p-postList__body">
			<?php
				\Arkhe_Blocks::get_part( 'rss/item/meta', [
					'show_site'   => $show_site,
					'show_date'   => $show_date,
					'show_author' => $show_author,
					'site_title'  => $site_title,
					'favicon'     => $favicon,
					'feed_date'   => $feed_date,
					'feed_author' => $feed_author,
				] );

				echo '<' . esc_attr( $h_tag ) . ' class="p-postList__title">';
				echo esc_html( $feed_title );
				echo '</' . esc_attr( $h_tag ) . '>';
			?>
		</div>
	</a>
</li>
