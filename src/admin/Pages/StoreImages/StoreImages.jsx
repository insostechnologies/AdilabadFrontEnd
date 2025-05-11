import React, { useEffect, useState } from 'react';
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
import './StoreImages.css'
import CoverImages from './CoverImages/CoverImages'
import BannerImages from './BannerImages/BannerImages';
import GallaryImages from './GallaryImages/GallaryImages';
import LogoImage from './LogoImage/LogoImage';
import ToutubeVideos from './YoutubeVideos/YoutubeVideos';
import { useLocation, useParams } from 'react-router-dom';
import { config } from '../../../config';

function StoreImages() {
    const { isSidebar } = useContext(AdminSidebarContext);
    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    }
    const query = useQuery();
    const defaultTab = parseInt(query.get('tab')) || 0;
    const {uid} = useParams();
    const [category, setCategory] = useState(null)

    const fetchCategory = async (uid) => {

		try {
			const response = await fetch(`${config.backEndBaseUrl}api/store/${uid}`, {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'GET',
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			
            

			if(result.status){
                console.log(result.data)
                setCategory(result.data)

            }
		} catch (error) {
			console.error('Fetching banners failed', error);
		}
    }   

    useEffect(()=>{
        fetchCategory(uid);
    },[uid])


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
                                                <Tab>Cover Images</Tab>
                                                <Tab>Banner Images</Tab>
                                                <Tab>Gallery Images</Tab>
                                                <Tab>Logo</Tab>
                                                <Tab>Videos</Tab>
                                            </TabList>
                                            <TabPanel>
                                                <CoverImages category={category}/>
                                            </TabPanel>
                                            <TabPanel>
                                                <BannerImages category={category} />
                                            </TabPanel>
                                            <TabPanel>
                                                <GallaryImages category={category}/>
                                            </TabPanel>
                                            <TabPanel>
                                                <LogoImage category={category}/>
                                            </TabPanel>
                                            <TabPanel>
                                                <ToutubeVideos category={category}/>
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

export default StoreImages