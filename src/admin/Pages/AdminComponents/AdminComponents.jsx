import React from 'react'
import SectionMenuLeft from '../../components/SectionMenuLeft/SectionMenuLeft';
import AlertButtonBadges from './AlertButtonBadges';
import ChartDropdowns from './ChartDropdowns';
import FormFormtext from './FormFormtext';
import AddImg from './AddImg';
import OffcanvasPaginationProgress from './OffcanvasPaginationProgress';
import TabsTypographyOthers from './TabsTypographyOthers';
import BoxIconBreadcrumdGalleryItem from './BoxIconBreadcrumdGalleryItem';
import ProductCountryShopItem from './ProductCountryShopItem';
import CommentAttributeItem from './CommentAttributeItem';
import Roadmap from './Roadmap';


function AdminComponents() {

  return (
    <>
      <div className="body">

        {/* #wrapper */}
        <div id="wrapper">
          {/* #page */}
          <div id="page" className="">
            {/* layout-wrap */}
            <div className="layout-wrap">
           
              <SectionMenuLeft />
              <div className="section-content-right">
                {/* main-content */}
                <div className="main-content">
                  {/* main-content-wrap */}
                  <div className="main-content-inner">
                    {/* main-content-wrap */}
                    <div className="main-content-wrap">
                      <div className="themesflat-container full">
                        <div className="row">
                          <AlertButtonBadges />
                          <ChartDropdowns />
                          <FormFormtext />
                          <AddImg />
                          <OffcanvasPaginationProgress />
                          <TabsTypographyOthers />
                          <BoxIconBreadcrumdGalleryItem />
                          <ProductCountryShopItem />
                          <CommentAttributeItem />
                          <Roadmap />
                        </div>
                      </div>
                    </div>
                    {/* /main-content-wrap */}
                  </div>
                  {/* /main-content-wrap */}
                </div>
                {/* /main-content */}
              </div>
              {/* /section-content-right */}
            </div>
            {/* /layout-wrap */}
          </div>
          {/* /#page */}

          {/* <div className="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight1">
            <div className="offcanvas-header">
              <h6>Offcanvas</h6>
              <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
              <p>Offcanvas Right</p>
            </div>
          </div>
          <div className="offcanvas offcanvas-start" tabindex="-1" id="offcanvasStart1">
            <div className="offcanvas-header">
              <h6>Offcanvas</h6>
              <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
              <p>Offcanvas Left</p>
            </div>
          </div>
          <div className="offcanvas offcanvas-top" tabindex="-1" id="offcanvasTop1">
            <div className="offcanvas-header">
              <h6>Offcanvas</h6>
              <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
              <p>Offcanvas Top</p>
            </div>
          </div>
          <div className="offcanvas offcanvas-bottom" tabindex="-1" id="offcanvasBottom1">
            <div className="offcanvas-header">
              <h6>Offcanvas</h6>
              <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
              <p>Offcanvas Bottom</p>
            </div>
          </div> */}

        </div>
        {/* /#wrapper */}

      </div>
    </>
  )
}

export default AdminComponents