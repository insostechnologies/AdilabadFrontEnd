import './CategoryIcon.css'
import * as Icons from 'react-icons/fa';

const CategoryRoundIcon = ({imgPath}) => {

	return(
		<img className='img' src={imgPath} alt="" />
	)
}

const DynamicFaIcon = ({ iconName }) => {
	const IconComponent = Icons[iconName]; // Access the corresponding icon component
	if (IconComponent) {
		return (
			<div className="category_icon" >
				<IconComponent />
			</div>
		)
	} else {
		return <Icons.FaBeer />; // Default icon if name does not match
	}
};

export {CategoryRoundIcon,DynamicFaIcon}
