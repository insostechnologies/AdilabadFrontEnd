import './App.css';
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { createBrowserRouter, Navigate, Outlet, RouterProvider, useLocation } from 'react-router-dom';
import { AdminSidebarContextProvider } from './context/adminSidebarContext';
import Loading from './Loading/Loading';
import loadAssets from './utils/loadAssets';
import loadAssetsForVendor from './utils/loadAssetsForVendor';
import CallsChats from './admin/Pages/CallsChats/CallsChats';


// Lazy loaded components for frontend
const Feedback = lazy(() => import('./frontend/components/Feedback/Feedback'));
const UpdateStore = lazy(() => import('./admin/Pages/UpdateStore/UpdateStore'));
const Login = lazy(() => import('./frontend/pages/login/Login'));
const Signup = lazy(() => import('./frontend/pages/Signup/Signup'));
const Home = lazy(() => import('./frontend/pages/Home/Home'));
const FrontendNavbar = lazy(() => import('./frontend/components/Navbar/Navbar'));
const FrontendFooter = lazy(() => import('./frontend/components/Footer/Footer'));
const HomeAllCategory = lazy(() => import('./frontend/pages/Home/HomeAllCategory/HomeAllCategory'))
const SubcategoryCardList = lazy(() => import('./frontend/pages/SubcategoryCardList/SubcategoryCardList'))
const SubcategoryIconList = lazy(() => import('./frontend/pages/SubcategoryIconList/SubcategoryIconList'))
const StoresView = lazy(() => import('./frontend/pages/StoresView/StoresView'))
const StoreDetail = lazy(() => import('./frontend/pages/StoreDetail/StoreDetail'))
const ProductService = lazy(() => import('./frontend/pages/ProductService/ProductService'))
const OrderHistory = lazy(() => import('./frontend/pages/OrderHistory/OrderHistory'))
const Notification = lazy(() => import('./frontend/pages/Notification/Notification'))
const UserProfile = lazy(() => import('./frontend/pages/UserProfile/UserProfile'));
const OrderPlace = lazy(() => import('./frontend/pages/OrderPlace/OrderPlace'));

// Lazy loaded components for admin
const AdminLogin = lazy(() => import('./admin/Pages/AdminLogin/AdminLogin'));
const AdminNavbar = lazy(() => import('./admin/components/Navbar/Navbar'));
const AdminFooter = lazy(() => import('./admin/components/Footer/Footer'));
const Dashboard = lazy(() => import('./admin/Pages/Dashboard/Dashboard'));
const AdminComponents = lazy(() => import('./admin/Pages/AdminComponents/AdminComponents'));
const AddStore = lazy(() => import('./admin/Pages/AddStore/AddStore'));
const AddStoreKeywords = lazy(() => import('./admin/Pages/AddStoreKeywords/AddStoreKeywords'));
const StoreList = lazy(() => import('./admin/Pages/StoreList/StoreList'));
const CategoryList = lazy(() => import('./admin/Pages/CategoryList/CategoryList'));
const NewCategory = lazy(() => import('./admin/Pages/NewCategory/NewCategory'));
const SubCategory = lazy(() => import('./admin/Pages/SubCategory/SubCategory'));
const SubCategoryList = lazy(() => import('./admin/Pages/SubCategorylist/SubCategoryList'));
const AddBanners = lazy(() => import('./admin/Pages/AddBanners/AddBanners'));
const AllBanners = lazy(() => import('./admin/Pages/AllBanners/AllBanners'));
const CategoryUpdate = lazy(() => import('./admin/Pages/CategoryUpdate/CategoryUpdate'));
const SubCategoryUpdateForm = lazy(() => import('./admin/Pages/SubCategoryUpdate/SubCategoryUpdate'))
const Notifications = lazy(() => import('./admin/Pages/Notifications/Notifications'))
const BannersImages = lazy(() => import('./admin/Pages/BannersImages/BannersImages'))
const AdminSetting = lazy(() => import('./admin/Pages/AdminSetting/AdminSetting'))
const BannerUpdate = lazy(() => import('./admin/Pages/BannerUpdate/BannerUpdate'))
const AddBannerIamge = lazy(() => import('./admin/Pages/AddBannerIamge/AddBannerIamge'))
const BannersImagesUpdate = lazy(() => import('./admin/Pages/BannersImagesUpdate/BannersImagesUpdate'))
const AddCategoryBanner = lazy(() => import('./admin/Pages/AddCategoryBanner/AddCategoryBanner'))
const CategoryBannerImages = lazy(() => import('./admin/Pages/CategoryBannerImages/CategoryBannerImages'))
const UpdateCategoryBanner = lazy(() => import('./admin/Pages/UpdateCategoryBanner/UpdateCategoryBanner'))
const StoreImages = lazy(() => import('./admin/Pages/StoreImages/StoreImages'))
const AddCoverImage = lazy(() => import('./admin/Pages/StoreImages/CoverImages/AddCoverImage/AddCoverImage'))
const AddStoreBannerImage = lazy(() => import('./admin/Pages/StoreImages/BannerImages/AddStoreBannerImage/AddStoreBannerImage'))
const AddStoreGallaryImage = lazy(() => import('./admin/Pages/StoreImages/GallaryImages/AddGallaryImage/AddGallaryImage'))
const YoutubeVideosAdd = lazy(() => import('./admin/Pages/StoreImages/YoutubeVideos/YoutubeVideosAdd/YoutubeVideosAdd'))
const AddLogo = lazy(() => import('./admin/Pages/StoreImages/LogoImage/AddLogo/AddLogo'))
const StoreProducts = lazy(() => import('./admin/Pages/StoreProducts/StoreProducts'))
const AddProduct = lazy(() => import('./admin/Pages/StoreProducts/AddProduct/AddProduct'))
const UpdateProduct = lazy(() => import('./admin/Pages/StoreProducts/UpdateProduct/UpdateProduct'))
const UpdateStoreImage = lazy(() => import('./admin/Pages/StoreImages/UpdateStoreImage/UpdateStoreImage'))
const ProductImages = lazy(() => import('./admin/Pages/StoreProducts/ProductImages/ProductImages'))
const AddProductImage = lazy(() => import('./admin/Pages/StoreProducts/AddProductImage/AddProductImage'))
const UpdateProductImage = lazy(() => import('./admin/Pages/StoreProducts/UpdateProductImage/UpdateProductImage'))
const Orders = lazy(() => import('./admin/Pages/Orders/Orders'))
const Queries = lazy(() => import('./admin/Pages/Queries/Queries'))
const Vendors = lazy(() => import('./admin/Pages/Vendor/Vendors'))
const VendorsAdd = lazy(() => import('./admin/Pages/VendorsAdd/VendorsAdd'))
const OtpVerification = lazy(() => import('./frontend/pages/Otp_verification/OtpVerification'))
const StoreComments = lazy(() => import('./admin/Pages/StoreComments/StoreComments'))
const Leads = lazy(() => import('./admin/Pages/Leads/Leads'))
const UserLeads = lazy(() => import('./admin/Pages/UserLeads/UserLeads'))
const Search = lazy(() => import('./frontend/pages/Search/Search'))
const StoreSearch = lazy(() => import('./frontend/pages/StoreSearch/StoreSearch'))
const SignInDetails = lazy(() => import('./frontend/pages/SignInDetails/SignInDetails'))
const UpdateComment = lazy(() => import('./admin/Pages/StoreComments/UpdateComment/UpdateComment'))


/// Lazy loaded components for vendor
const VendorLogin = lazy(() => import('./vendor/pages/VendorLogin/VendorLogin'));
const VendorOnboard = lazy(() => import('./vendor/pages/VendorOnboard/VendorOnboard'));
const VendorNavbar = lazy(() => import('./vendor/components/Navbar/Navbar'));
const VendorFooter = lazy(() => import('./vendor/components/Footer/Footer'));
const VendorDashboard = lazy(() => import('./vendor/pages/Dashboard/Dashboard'));
const VendorProductsList = lazy(() => import('./vendor/pages/StoreProducts/StoreProducts'))
const UpdateProductVendor = lazy(() => import('./vendor/pages/StoreProducts/UpdateProduct/UpdateProductVendor'))
const ProductImagesVendor = lazy(() => import('./vendor/pages/StoreProducts/ProductImages/ProductImagesVendor'))
const AddProductImageVendor = lazy(() => import('./vendor/pages/StoreProducts/AddProductImage/AddProductImageVendor'))
const UpdateProductImageVendor = lazy(() => import('./vendor/pages/StoreProducts/UpdateProductImage/UpdateProductImageVendor'))
const VendorAddProduct = lazy(() => import('./vendor/pages/StoreProducts/AddProduct/AddProduct'))
const VendorSetting = lazy(() => import('./vendor/pages/AdminSetting/AdminSetting'))
const VendorNotifications = lazy(() => import('./vendor/pages/Notifications/Notifications'))
const VendorCustomerCare = lazy(() => import('./vendor/pages/CustomerCare/CustomerCare'))
const OtpVerificationVendor = lazy(() => import('./vendor/pages/Otp_verification/OtpVerificationVendor'))
const UpdateVendorStore = lazy(() => import('./vendor/pages/UpdateStore/UpdateAdminStore'))
const StoreImagesVendor = lazy(() => import('./vendor/pages/StoreImages/StoreImagesVendor'))
const AddCoverImageVendor = lazy(() => import('./vendor/pages/StoreImages/CoverImages/AddCoverImage/AddCoverImageVendor'))
const AddStoreBannerImageVendor = lazy(() => import('./vendor/pages/StoreImages/BannerImages/AddStoreBannerImage/AddStoreBannerImageVendor'))
const AddStoreGallaryImageVendor = lazy(() => import('./vendor/pages/StoreImages/GallaryImages/AddGallaryImage/AddGallaryImageVendor'))
const AddLogoVendor = lazy(() => import('./vendor/pages/StoreImages/LogoImage/AddLogo/AddLogoVendor'))
const UpdateStoreImageVendor = lazy(() => import('./vendor/pages/StoreImages/UpdateStoreImage/UpdateStoreImageVendor'))
const OrdersVendor = lazy(() => import('./vendor/pages/Orders/OrdersVendor'))
const QueriesVendors = lazy(() => import('./vendor/pages/Queries/QueriesVendor'))
const StoreCommentsVendor = lazy(() => import('./vendor/pages/StoreComments/StoreCommentsVendor'))
const UpdateCommentVendor = lazy(() => import('./vendor/pages/StoreComments/UpdateComment/UpdateCommentVendor'))
const VendorSignUp = lazy(() => import('./vendor/pages/VendorSignUp/VendorSignUp'))
const YoutubeVideosAddVendor = lazy(() => import('./vendor/pages/StoreImages/YoutubeVideos/YoutubeVideosAdd/YoutubeVideosAddVendor'))
const ChatCallLeads = lazy(() => import('./vendor/pages/Leads/ChatCallLeads/ChatCallLeads'))
const ChartLeads = lazy(() => import('./vendor/pages/Leads/ChartLeads/ChartLeads'))
const ProductsServiceLeads = lazy(() => import('./vendor/pages/Leads/ProductsServiceLeads/ProductsServiceLeads'))
const FollowersLeads = lazy(() => import('./vendor/pages/Leads/FollowersLeads/FollowersLeads'))
const NotificationVendor = lazy(() => import('./vendor/pages/NotificationVendor/NotificationVendor'))
const AddNotifucationVendor = lazy(() => import('./vendor/pages/NotificationVendor/AddNotifucationVendor/AddNotifucationVendor'))
const AdminAbout = lazy(() => import('./admin/Pages/AdminAbout/AdminAbout'))
const AddMember = lazy(() => import('./admin/Pages/AdminAbout/AddMember/AddMember'))
const UpdateAbout = lazy(() => import('./admin/Pages/AdminAbout/UpdateAbout/UpdateAbout'))
const AboutUs = lazy(() => import('./frontend/pages/UserProfile/AboutUs/AboutUs'))
const VendorData = lazy(() => import('./admin/Pages/Vendor/VendorData/VendorData'))
const ChartsAdmin = lazy(() => import('./admin/Pages/Vendor/VendorData/ChartsAdmin/ChartsAdmin'))
const CommentReply = lazy(() => import('./admin/Pages/Vendor/VendorData/Comments/CommentReply'))
const Policy = lazy(() => import('./admin/Pages/Policy/Policy'))
const Terms = lazy(() => import('./frontend/pages/Terms/Terms'))
const TermsVendor = lazy(() => import('./vendor/pages/TermsVendor/TermsVendor'))
const StoreAnalitycs = lazy(() => import('./admin/Pages/StoreAnalitycs/StoreAnalitycs'))
const Users = lazy(() => import('./admin/Pages/Users/Users'))
function App() {
	useEffect(() => {
		const isAdmin = window.location.href.includes('admin');
		loadAssets(isAdmin);
	}, []);
	useEffect(() => {
		const isVendor = window.location.href.includes('vendor');
		loadAssetsForVendor(isVendor);
	}, []);

	const [feedbackOn, setFeedbackOn] = useState(false);

	let currentUser = localStorage.getItem('userAuthToken');
	let currentAdmin = localStorage.getItem('adminAuthToken');
	let currentVendor = localStorage.getItem('vendorAuthToken');
	// let currentVendor = true;

	// Frontend layout start
	const ProtectedRouteFrontend = ({ children }) => {
		if (currentUser) {
			return children;
		}
		return <Navigate to="/sign-in" />;
	};

	const LayoutFrontEnd = () => {
		const location = useLocation();
		useEffect(() => {
			window.scrollTo(0, 0);
		}, [location.pathname]);

		return (
			<>
				<Suspense fallback={<Loading type={'user'} />}>
					{/* <Feedback feedbackOn={feedbackOn} setFeedbackOn={setFeedbackOn} /> */}
					<FrontendNavbar />
					<Outlet />
					{/* <FrontendFooter /> */}
				</Suspense>
			</>
		);
	};
	// Frontend layout end

	// Admin layout start
	const ProtectedRouteAdmin = ({ children }) => {
		if (currentAdmin) {
			return children;
		}
		return <Navigate to="/admin/login" />;
	};

	const LayoutAdmin = () => {
		const location = useLocation();
		useEffect(() => {
			window.scrollTo(0, 0);
		}, [location.pathname]);

		return (
			<>
				<Suspense fallback={<Loading type={'user'} />}>
					<AdminNavbar />
					<Outlet />
					<AdminFooter />
				</Suspense>
			</>
		);
	};
	// Admin layout end

	// Vendor layout start
	const ProtectedRouteVendor = ({ children }) => {
		if (currentVendor) {
			return children;
		}
		return <Navigate to="/vendor/onboard" />;
	};

	const LayoutVendor = () => {
		const location = useLocation();
		useEffect(() => {
			window.scrollTo(0, 0);
		}, [location.pathname]);

		return (
			<>
				<Suspense fallback={<Loading type={'vendor'} />}>
					<VendorNavbar />
					<Outlet />
					<FrontendFooter site={'vendor'} />
				</Suspense>
			</>
		);
	};
	// Vendor layout end


	// ----All Routes---
	const router = createBrowserRouter([
		// ----frontendRoutes-----
		{
			path: '/',
			element: (<LayoutFrontEnd />),
			children: [
				{
					path: '/',
					element: (
						<>
							<Home />
							<FrontendFooter />
						</>
					),
				},
				{
					path: '/all-categories',
					element: (
						<ProtectedRouteFrontend>
							<HomeAllCategory />
						</ProtectedRouteFrontend>
					)
				},
				{
					path: '/sub-categories/list/:id',
					element: (
						<ProtectedRouteFrontend>
							<SubcategoryIconList />
						</ProtectedRouteFrontend>
					)
				},
				{
					path: '/sub-categories/:id',
					element: (
						<ProtectedRouteFrontend>
							<SubcategoryCardList />
						</ProtectedRouteFrontend>
					)
				},
				{
					path: '/stores/view/:id',
					element: (
						<ProtectedRouteFrontend>
							<StoresView />
						</ProtectedRouteFrontend>
					),
				},
				{
					path: '/search',
					element: (
						<ProtectedRouteFrontend>
							<Search />
						</ProtectedRouteFrontend>
					),
				},
				{
					path: '/store/search',
					element: (
						<ProtectedRouteFrontend>
							<StoreSearch />
						</ProtectedRouteFrontend>
					),
				},
				{
					path: '/store/:id',
					element: (
						<ProtectedRouteFrontend>
							<StoreDetail />
						</ProtectedRouteFrontend>
					),
				},
				{
					path: '/product/service/:id',
					element: (
						<ProtectedRouteFrontend>
							<ProductService />
						</ProtectedRouteFrontend>
					),
				},
				{
					path: '/order/history',
					element: (
						<ProtectedRouteFrontend>
							<OrderHistory />
						</ProtectedRouteFrontend>
					),
				},
				{
					path: '/notifications',
					element: (
						<ProtectedRouteFrontend>
							<Notification />
						</ProtectedRouteFrontend>
					),
				},
				{
					path: '/profile',
					element: (
						<ProtectedRouteFrontend>
							<UserProfile />
						</ProtectedRouteFrontend>
					),
				},
				{
					path: '/about',
					element: (
						<ProtectedRouteFrontend>
							<AboutUs />
						</ProtectedRouteFrontend>
					),
				},
				{
					path: '/order/place/:id',
					element: (
						<ProtectedRouteFrontend>
							<OrderPlace />
						</ProtectedRouteFrontend>
					),
				},

			],
		},
		{
			path: '/terms',
			element: (
				<Suspense fallback={<Loading />}>
					<Terms />
				</Suspense>
			),

		},
		{
			path: '/sign-in',
			element: (
				<Suspense fallback={<Loading />}>
					<Login />
				</Suspense>
			),
		},
		{
			path: '/signup',
			element: (
				<Suspense fallback={<Loading />}>
					<Signup />
				</Suspense>
			),
		},
		{
			path: 'sign-in/verify-otp/:uid',
			element: (
				<Suspense fallback={<Loading />}>
					<OtpVerification />
				</Suspense>
			),
		},
		{
			path: 'sign-in/details/:uid',
			element: (
				<Suspense fallback={<Loading />}>
					<SignInDetails />
				</Suspense>
			),
		},

		// ------admin routes--------
		{
			path: '/admin',
			element: (
				<ProtectedRouteAdmin>
					<LayoutAdmin />
				</ProtectedRouteAdmin>
			),
			children: [
				{
					path: '/admin',
					element: <Dashboard />,
				},
				{
					path: '/admin/store/add',
					element: <AddStore />,
				},
				{
					path: '/admin/store/keywords/add',
					element: <AddStoreKeywords />,
				},
				{
					path: '/admin/store/update/:uid',
					element: <UpdateStore />,
				},
				{
					path: '/admin/store/list',
					element: <StoreList />,
				},
				{
					path: '/admin/banner/add',
					element: <AddBanners />,
				},
				{
					path: '/admin/banner/list',
					element: <AllBanners />,
				},
				{
					path: '/admin/category/banner/image/:uid',
					element: <CategoryBannerImages />,
				},
				{
					path: '/admin/banner/image/add/:uid',
					element: <AddBannerIamge />,
				},
				{
					path: '/admin/store/comments/',
					element: <StoreComments />
				},
				{
					path: '/admin/store/comments/:uid',
					element: <StoreComments />
				},
				{
					path: '/admin/banner/image/update/:uid/',
					element: <BannersImagesUpdate />,
				},
				{
					path: '/admin/product/update/:uid/',
					element: <UpdateProduct />,
				},
				{
					path: '/admin/store/image/update/:uid/',
					element: <UpdateStoreImage />,
				},
				{
					path: '/admin/product/images/:uid',
					element: <ProductImages />,
				},
				{
					path: '/admin/store/product/image/add/:uid',
					element: <AddProductImage />,
				},
				{
					path: '/admin/product/image/update/:uid',
					element: <UpdateProductImage />,
				},
				{
					path: '/admin/banner/update/:uid',
					element: <BannerUpdate />,
				},
				{
					path: '/admin/banner/image/:uid',
					element: <BannersImages />,
				},
				{
					path: '/admin/category/list',
					element: <CategoryList />,
				},
				{
					path: '/admin/components',
					element: <AdminComponents />,
				},
				{
					path: '/admin/category/add',
					element: <NewCategory />,
				},
				{
					path: '/admin/store/images/:uid',
					element: <StoreImages />
				},
				{
					path: '/admin/store/product/add/:uid',
					element: <AddProduct />
				},
				{
					path: '/admin/customers',
					element: <Users />
				},
				{
					path: '/admin/store/call-chats',
					element: <CallsChats />
				},
				{
					path: '/admin/store/products/:uid',
					element: <StoreProducts />
				},
				{
					path: '/admin/store/cover/add/:uid',
					element: <AddCoverImage />
				},
				{
					path: '/admin/store/logo/add/:uid',
					element: <AddLogo />
				},
				{
					path: '/admin/store/video/add/:uid',
					element: <YoutubeVideosAdd />
				},
				{
					path: '/admin/store/banner/add/:uid',
					element: <AddStoreBannerImage />
				},
				{
					path: '/admin/store/gallary/add/:uid',
					element: <AddStoreGallaryImage />
				},
				{
					path: '/admin/store/orders',
					element: <Orders />
				},
				{
					path: '/admin/queries',
					element: <Queries />
				},
				{
					path: '/admin/vendors',
					element: <Vendors />
				},
				{
					path: '/admin/vendors/add',
					element: <VendorsAdd />
				},
				{
					path: '/admin/category/update/:uid',
					element: <CategoryUpdate />,
				},
				{
					path: '/admin/sub-category/update/:uid',
					element: <SubCategoryUpdateForm />,
				},
				{
					path: '/admin/sub-category/add/:uid',
					element: <SubCategory />,
				},
				{
					path: '/admin/sub-category/add/',
					element: <SubCategory />,
				},
				{
					path: '/admin/sub-category/list',
					element: <SubCategoryList />,
				},
				{
					path: '/admin/sub-category/list/:uid',
					element: <SubCategoryList />,
				},
				{
					path: '/admin/notifications',
					element: <Notifications />,
				},
				{
					path: '/admin/setting',
					element: <AdminSetting />,
				},
				{
					path: '/admin/category/banner/add',
					element: <AddCategoryBanner />
				},
				{
					path: '/admin/category/banner/add/:uid',
					element: <AddCategoryBanner />
				},
				{
					path: '/admin/category/banner/image/update/:uid',
					element: <UpdateCategoryBanner />
				},
				{
					path: '/admin/leads/:uid',
					element: <Leads />
				},
				{
					path: '/admin/user/leads/:uid',
					element: <UserLeads />
				},
				{
					path: '/admin/store/comments/reply/:uid',
					element: <UpdateComment />
				},
				{
					path: '/admin/store/analitycs/:uid',
					element: <StoreAnalitycs />
				},
				{
					path: '/admin/about',
					element: <AdminAbout />
				},
				{
					path: '/admin/about/team/add',
					element: <AddMember />
				},
				{
					path: '/admin/about/update',
					element: <UpdateAbout />
				},
				{
					path: '/admin/vendor/data/:uid',
					element: <VendorData />
				},
				{
					path: '/admin/leads/chart/:uid',
					element: <ChartsAdmin />
				},
				{
					path: '/admin/store/comments/reply/:uid',
					element: <CommentReply />
				},
				{
					path: '/admin/about/policy',
					element: <Policy />
				}
			],
		},
		{
			path: '/admin/login',
			element: (
				<Suspense fallback={<Loading />}>
					<AdminLogin />
				</Suspense>
			),
		},

		// ------vendor routes--------
		{
			path: '/vendor',
			element: (
				<ProtectedRouteVendor>
					<LayoutVendor />
				</ProtectedRouteVendor>
			),
			children: [
				{
					path: '/vendor',
					element: <VendorDashboard />

				},
				{
					path: '/vendor/store/products/:uid',
					element: <VendorProductsList />
				},
				{
					path: '/vendor/store/product/add/:uid',
					element: <VendorAddProduct />
				},
				{
					path: '/vendor/notification',
					element: <NotificationVendor />
				},
				{
					path: '/vendor/notification/add',
					element: <AddNotifucationVendor />
				},
				{
					path: '/vendor/notifications',
					element: <VendorNotifications />
				},
				{
					path: '/vendor/customer-Care',
					element: <VendorCustomerCare />
				},
				{
					path: '/vendor/setting',
					element: <VendorSetting />,
				},
				{
					path: '/vendor/store/update/:uid',
					element: <UpdateVendorStore />,
				},
				{
					path: '/vendor/store/images/:uid',
					element: <StoreImagesVendor />,
				},
				{
					path: '/vendor/store/cover/add/:uid',
					element: <AddCoverImageVendor />
				},
				{
					path: '/vendor/store/logo/add/:uid',
					element: <AddLogoVendor />
				},
				{
					path: '/vendor/store/banner/add/:uid',
					element: <AddStoreBannerImageVendor />
				},
				{
					path: '/vendor/store/gallary/add/:uid',
					element: <AddStoreGallaryImageVendor />
				},
				{
					path: '/vendor/store/image/update/:uid',
					element: <UpdateStoreImageVendor />
				},
				{
					path: '/vendor/orders/:uid',
					element: <OrdersVendor />
				},
				{
					path: '/vendor/enquiries/:uid',
					element: <QueriesVendors />
				},
				{
					path: '/vendor/comments/:uid',
					element: <StoreCommentsVendor />
				},
				{
					path: '/vendor/product/images/:uid',
					element: <ProductImagesVendor />
				},
				{
					path: '/vendor/product/update/:uid',
					element: <UpdateProductVendor />
				},
				{
					path: '/vendor/store/product/image/add/:uid',
					element: <AddProductImageVendor />
				},
				{
					path: '/vendor/product/image/update/:uid',
					element: <UpdateProductImageVendor />
				},
				{
					path: '/vendor/store/comments/reply/:uid',
					element: <UpdateCommentVendor />
				},
				{
					path: '/vendor/store/video/add/:uid',
					element: <YoutubeVideosAddVendor />
				},
				{
					path: '/vendor/leads/followers',
					element: <FollowersLeads />
				},
				{
					path: '/vendor/leads/chat-call',
					element: <ChatCallLeads />
				},
				{
					path: '/vendor/leads/products-services',
					element: <ProductsServiceLeads />
				},
				{
					path: '/vendor/leads/chart/:uid',
					element: <ChartLeads />
				},
				{
					path: '/vendor/terms',
					element: <TermsVendor />
				}
			],
		},
		{
			path: '/vendor/onboard',
			element: (
				<Suspense fallback={<Loading />}>
					<VendorOnboard />
				</Suspense>
			),
		},
		{
			path: '/vendor/login',
			element: (
				<Suspense fallback={<Loading />}>
					<VendorLogin />
				</Suspense>
			),
		},
		{
			path: '/vendor/sing-up',
			element: (
				<Suspense fallback={<Loading />}>
					<VendorSignUp />
				</Suspense>
			),
		},
		{
			path: '/vendor/verify-otp/:uid',
			element: (
				<Suspense fallback={<Loading />}>
					<OtpVerificationVendor />
				</Suspense>
			),
		},

	]);

	return (
		<>
			<AdminSidebarContextProvider>
				<RouterProvider router={router} />
			</AdminSidebarContextProvider>
		</>
	);
}

export default App;
