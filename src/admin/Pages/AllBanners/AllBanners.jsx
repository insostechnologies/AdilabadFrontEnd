import React from 'react';
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft';
import { AdminSidebarContext } from '../../../context/adminSidebarContext';
import { useContext } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import './ToggleButton.css'
import './EditableCell.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './AllBanners.css'
import PageBanners from './PageBanners/PageBanners'
import CategoryBanners from './CategoryBanners/CategoryBanners'
import VendorBanners from './VendorBanners/VendorBanners'
import { useLocation } from 'react-router-dom';

function AllBanners() {
	const { isSidebar } = useContext(AdminSidebarContext);
	const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    }
    const query = useQuery();
    const defaultTab = parseInt(query.get('tab')) || 0;

	return (
		<>
			<div className="body">
				<ToastContainer />
				<div id="wrapper">
					<div id="page" className="">
						<div className="layout-wrap">
							<SectionMenuLeft />
							<div className="section-content-right">
								<div className="main-content" style={{ paddingLeft: isSidebar ? '280px' : '0px' }}>
									<div className="main-content-inner">
										<Tabs defaultIndex={defaultTab}>
											<TabList>
												<Tab>Home Banners</Tab>
												<Tab>Category Banners</Tab>
												<Tab>Vendor Banners</Tab>
											</TabList>
											<TabPanel>
												<PageBanners/>
											</TabPanel>
											<TabPanel>
												<CategoryBanners/>
											</TabPanel>
											<TabPanel>
												<VendorBanners/>
											</TabPanel>
										</Tabs>


									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

		</>
	)
}

export default AllBanners