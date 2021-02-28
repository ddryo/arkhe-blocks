<?php
namespace Arkhe_Blocks;

defined( 'ABSPATH' ) || exit;

trait Admin_Menu {

	/**
	 * 設定メニューの項目を追加
	 */
	public static function add_menu_section( $args ) {

		// phpcs:ignore WordPress.PHP.DontExtract.extract_extract
		extract( array_merge( [
			'title'      => '',
			'key'        => '',
			'section_cb' => '',
			'page_name'  => '',
			'page_cb'    => '',
			'db'         => '',
		], $args ) );

		$section_name = 'arkb_' . $key . '_section';

		add_settings_section(
			$section_name,
			$title,
			$section_cb,
			$page_name
		);

		// コールバック関数の指定が特になければ、ファイルを読み込む
		// $page_cb = $page_cb ?: function( $cb_args ) {
		// 	include ARKHE_BLOCKS_PATH . 'inc/admin_menu/tab/' . $cb_args['db'] . '/' . $cb_args['section_key'] . '.php';
		// };

		add_settings_field(
			$section_name . '_fields',
			'',
			$page_cb,
			$page_name,
			$section_name,
			[
				'db'          => $db,
				'section_key' => $key,
			]
		);
	}



	/**
	 * チェックボックス
	 */
	public static function output_checkbox( $args = [] ) {

		// phpcs:ignore WordPress.PHP.DontExtract.extract_extract
		extract( array_merge( [
			'db'    => '',
			'label' => '',
			'key'   => '',
			'desc'  => '',
		], $args ) );

		$name = \Arkhe_Blocks::DB_NAMES[ $db ] . '[' . $key . ']';
		$val  = (string) \Arkhe_Blocks::get_data( $db, $key );

		?>
		<div class="arkhe-menu__field -checkbox">
			<input type="hidden" name="<?=esc_attr( $name )?>" value="">
			<input type="checkbox" id="<?=esc_attr( $key )?>" name="<?=esc_attr( $name )?>" value="1" <?php checked( $val, '1' ); ?> />
			<label for="<?=esc_attr( $key )?>"><?=esc_html( $label )?></label>
			<?php if ( $desc ) : ?>
				<p class="arkhe-menu__description"><?=wp_kses_post( $desc )?></p>
			<?php endif; ?>
		</div>
		<?php
	}


	/**
	 * テキストフィールド
	 */
	public static function output_text_field( $args ) {

		// phpcs:ignore WordPress.PHP.DontExtract.extract_extract
		extract( array_merge( [
			'db'    => '',
			'label' => '',
			'key'   => '',
			'size'  => '',
		], $args ) );

		$name = \Arkhe_Blocks::DB_NAMES[ $db ] . '[' . $key . ']';
		$val  = \Arkhe_Blocks::get_data( $db, $key );

		?>
			<div class="arkhe-menu__field -text">
				<span class="arkhe-menu__label"><?=esc_html( $label )?></span>
				<div class="arkhe-menu__item">
					<input type="text" id="<?=esc_attr( $key )?>" name="<?=esc_attr( $name )?>" value="<?=esc_attr( $val )?>" size="40" />
				</div>
			</div>
		<?php
	}


	/**
	 * テキストエリア
	 */
	public static function output_textarea( $args ) {

		// phpcs:ignore WordPress.PHP.DontExtract.extract_extract
		extract( array_merge( [
			'db'      => '',
			'label'   => '',
			'key'     => '',
			'rows'    => '4',
			'is_wide' => false,
			'desc'    => '',
		], $args ) );

		$name = \Arkhe_Blocks::DB_NAMES[ $db ] . '[' . $key . ']';
		$val  = \Arkhe_Blocks::get_data( $db, $key );

		$textarea_class = $is_wide ? 'large-text' : 'regular-text';
		?>
			<div class="arkhe-menu__field -textarea">
				<?php if ( $label ) : ?>
					<span class="arkhe-menu__label"><?=esc_html( $label )?></span>
				<?php endif; ?>
				<textarea id="<?=esc_attr( $key )?>" class="<?=esc_attr( $textarea_class )?>" name="<?=esc_attr( $name )?>" rows="<?=esc_attr( $rows )?>" ><?=esc_html( $val )?></textarea>
				<?php if ( $desc ) : ?>
					<p class="arkhe-menu__description"><?=wp_kses_post( $desc )?></p>
				<?php endif; ?>
			</div>
		<?php
	}


	/**
	 * ラジオボタン
	 */
	public static function output_radio( $args ) {

		// phpcs:ignore WordPress.PHP.DontExtract.extract_extract
		extract( array_merge( [
			'db'      => '',
			'key'     => '',
			'choices' => '',
		], $args ) );

		$name = \Arkhe_Blocks::DB_NAMES[ $db ] . '[' . $key . ']';
		$val  = \Arkhe_Blocks::get_data( $db, $key );

		?>
		<div class="arkhe-menu__field -radio">
			<?php
				foreach ( $choices as $value => $label ) :
				$radio_id = $key . '_' . $value;
				$checked  = checked( $val, $value );
			?>
					<label for="<?=esc_attr( $radio_id )?>" class="arkhe-menu__label">
						<input type="radio" id="<?=esc_attr( $radio_id )?>" name="<?=esc_attr( $name )?>" value="<?=esc_attr( $value )?>" <?php checked( $val, $value ); ?> >
						<span><?=esc_html( $label )?></span>
					</label>
			<?php endforeach; ?>
		</div>
		<?php
	}

}
