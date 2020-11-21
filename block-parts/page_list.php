<?php
/**
 * 固定ページリスト
 */
$query_args = isset( $args['query_args'] ) ? $args['query_args'] : null;
$list_args  = isset( $args['list_args'] ) ? $args['list_args'] : [];

$the_query = new \WP_Query( $query_args );

if ( $the_query->have_posts() ) :
?>
	<ul class="p-postList -type-card">
	<?php
	while ( $the_query->have_posts() ) :
		$the_query->the_post();

		$the_id = get_the_ID();
		$url    = get_permalink( $the_id );
		$h_tag  = isset( $list_args['h_tag'] ) ? $list_args['h_tag'] : 'h2';
		?>
			<li class="p-postList__item">
				<a href="<?php the_permalink( $the_id ); ?>" class="p-postList__link">
				<?php
					\Arkhe::get_part(
						'post_list/item/thumb',
						[
							'post_id'     => $the_id,
							'list_type'   => 'card',
							'thumb_class' => 'p-postList__thumb',
						]
					);
				?>
					<div class="p-postList__body">
						<?php
							echo '<' . esc_attr( $h_tag ) . ' class="p-postList__title">';
							the_title();
							echo '</' . esc_attr( $h_tag ) . '>';
						?>
						<?php if ( \Arkhe::$excerpt_length ) : ?>
							<div class="p-postList__excerpt u-thin">
								<?php the_excerpt(); ?>
							</div>
						<?php endif; ?>
					</div>
				</a>
			</li>
		<?php endwhile; ?>
	</ul>
<?php else : ?>
	<p>
		<?php echo 'Not found.'; ?>
	</p>
<?php
endif;

wp_reset_postdata();
