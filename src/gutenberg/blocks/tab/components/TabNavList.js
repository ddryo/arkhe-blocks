/* _eslint jsx-a11y/click-events-have-key-events: 0 */
/* _eslint jsx-a11y/no-static-element-interactions: 0 */
/* _eslint jsx-a11y/role-supports-aria-props: 0 */

/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import { Tooltip } from '@wordpress/components';
import { Icon, plus, chevronLeft, chevronRight, closeSmall } from '@wordpress/icons';
import { memo } from '@wordpress/element';

/**
 * @Inner dependencies
 */

/**
 * TabNavList
 */
export default memo((props) => {
	const {
		tabHeaders,
		actTab,
		setActTab,
		updateTabsHeader,
		moveUpTab,
		moveDownTab,
		addTab,
		removeTab,
	} = props;

	return (
		<>
			{tabHeaders.map((item, index) => (
				<li
					key={index}
					className={`arkb-tabList__item ${actTab === index ? 'is-active' : ''}`}
				>
					<button
						role='tab'
						className='arkb-tabList__button'
						aria-selected={actTab === index ? 'true' : 'false'}
						onClick={() => {
							setActTab(index);
						}}
					>
						{updateTabsHeader ? (
							<RichText
								tagName='p'
								placeholder={__('Tab', 'arkhe-blocks') + '...'}
								value={item}
								onChange={(value) => updateTabsHeader(value, index)}
								// unstableOnSplit={() => null} // ?
							/>
						) : (
							<span>{item}</span>
						)}
					</button>
					<div className='arkb-tab__tooltips'>
						<Tooltip text={__('Move tab forward', 'arkhe-blocks')}>
							<button
								className='arkb-tabBtn--moveUp'
								data-active={0 === index ? 'false' : 'true'}
								onClick={() => {
									moveUpTab(index);
								}}
							>
								<Icon icon={chevronLeft} />
							</button>
						</Tooltip>
						{/* 一個以上の時、削除ボタンも追加 */}
						{1 < tabHeaders.length && (
							<Tooltip text={__('Delete tab', 'arkhe-blocks')}>
								<button
									className='arkb-tabBtn--remove'
									onClick={() => {
										removeTab(index);
									}}
								>
									<Icon icon={closeSmall} />
								</button>
							</Tooltip>
						)}
						<Tooltip text={__('Move tab back', 'arkhe-blocks')}>
							<button
								className='arkb-tabBtn--moveDown'
								data-active={tabHeaders.length - 1 === index ? 'false' : 'true'}
								onClick={() => {
									moveDownTab(index);
								}}
							>
								<Icon icon={chevronRight} />
							</button>
						</Tooltip>
					</div>
				</li>
			))}
			{/* ナビ追加ボタン */}
			<li className='arkb-tabList__item--add'>
				<Tooltip text={__('Add tab', 'arkhe-blocks')}>
					<button
						className='arkb-tabBtn--add'
						onClick={() => {
							addTab();
						}}
					>
						<Icon icon={plus} />
					</button>
				</Tooltip>
			</li>
		</>
	);
});
