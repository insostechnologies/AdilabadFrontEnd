import React from 'react';
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft';
// import BreadCrumbs from '../../components/BreadCrumbs/BreadCrumbs';
import CategoryForm from './CategoryForm';
import { AdminSidebarContext } from '../../../context/adminSidebarContext';
import { useContext } from 'react';

function NewCategory() {
	const { isSidebar } = useContext(AdminSidebarContext);

	return (
		<>
			<div class="body">

				{/*  #wrapper  */}
				<div id="wrapper">
					{/*  #page  */}
					<div id="page" class="">
						{/*  layout-wrap  */}
						<div class="layout-wrap">

							<SectionMenuLeft />
							{/*  /section-menu-left  */}
							{/*  section-content-right  */}
							<div class="section-content-right">
								{/*  main-content  */}
								<div class="main-content" style={{ paddingLeft: isSidebar ? '280px' : '0px' }}>
									{/*  main-content-wrap  */}
									<div class="main-content-inner">
										{/*  main-content-wrap  */}
										<div class="main-content-wrap">
											<div class="flex items-center flex-wrap justify-between gap20 mb-27">
												<h3>Category information</h3>
												{/* <BreadCrumbs /> */}
											</div>
											{/*  new-category  */}
											<CategoryForm />
											{/*  /new-category  */}
										</div>
										{/*  /main-content-wrap  */}
									</div>
									{/*  /main-content-wrap  */}
								</div>
								{/*  /main-content  */}
							</div>
							{/*  /section-content-right  */}
						</div>
						{/*  /layout-wrap  */}
					</div>
					{/*  /#page  */}
				</div>
				{/*  /#wrapper  */}
			</div>

		</>
	)
}

export default NewCategory