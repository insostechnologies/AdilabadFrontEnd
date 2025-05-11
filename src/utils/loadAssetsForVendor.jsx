// src/utils/loadAssets.js
import { config } from "../config";
const loadCSS = (href) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
};

const loadJS = (src) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
};

const loadAssetsForVendor = (isVendor) => {
    const baseUrl = config.frontEndBaseUrl;
    const adminAssets = [
        // `${baseUrl}adminAssets/css/animate.min.css`,
        // `${baseUrl}adminAssets/css/animation.css`,
        `${baseUrl}adminAssets/css/bootstrap.css`,
        `${baseUrl}adminAssets/css/bootstrap-select.min.css`,
        `${baseUrl}adminAssets/css/style.css`,
        // `${baseUrl}adminAssets/css/login.css`,
        // `${baseUrl}adminAssets/css/adminAddProductsForSocial.css`,
        `${baseUrl}adminAssets/font/fonts.css`,
        // `${baseUrl}adminAssets/icon/style.css`,
        `${baseUrl}adminAssets/images/logo_trans.png`,
    ];



    const commonAssets = [
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
        // 'https://cdn.quilljs.com/1.3.6/quill.snow.css',
        `${baseUrl}js/jquery.min.js`,
        `${baseUrl}js/bootstrap.min.js`,
        // `${baseUrl}js/bootstrap-select.min.js`,
        // `${baseUrl}js/zoom.js`,
        // `${baseUrl}js/jvectormap-1.2.2.min.js`,
        // `${baseUrl}js/jvectormap-us-lcc.js`,
        // `${baseUrl}js/jvectormap.js`,
        // `${baseUrl}js/morris.min.js`,
        // `${baseUrl}js/raphael.min.js`,
        // `${baseUrl}js/morris.js`,
        // `${baseUrl}js/apexcharts/apexcharts.js`,
        // `${baseUrl}js/apexcharts/line-chart-1.js`,
        // `${baseUrl}js/apexcharts/line-chart-2.js`,
        // `${baseUrl}js/apexcharts/line-chart-3.js`,
        // `${baseUrl}js/apexcharts/line-chart-4.js`,
        // `${baseUrl}js/apexcharts/line-chart-7.js`,
        // `${baseUrl}js/apexcharts/line-chart-6.js`,
        // `${baseUrl}js/apexcharts/line-chart-9.js`,
        // `${baseUrl}js/apexcharts/line-chart-14.js`,
        // `${baseUrl}js/apexcharts/line-chart-15.js`,
        // `${baseUrl}js/apexcharts/line-chart-18.js`,
        // `${baseUrl}js/switcher.js`,
        // `${baseUrl}js/theme-settings.js`,
        // `${baseUrl}js/main.js`,
        // 'https://cdn.quilljs.com/1.3.6/quill.js',
        // `${baseUrl}js/adminAddProductsForSocial.js`,
    ];

    const assetsToLoad = isVendor ? adminAssets.concat(commonAssets) : []

    assetsToLoad.forEach((asset) => {
        if (asset.endsWith('.css')) {
            loadCSS(asset);
        } else if (asset.endsWith('.js')) {
            loadJS(asset);
        }
    });
};

export default loadAssetsForVendor;
