
import LeftSide from "./Components/LeftSde/LeftSide";
import ProductPage from "./Components/Product/ProductPage";
import HeaderParts from "./Components/TopMenu/HeaderParts";
import "./App.scss";
import { useDispatch, useSelector } from "react-redux";
import { changeMobile, loadingState, mobileStatus } from "./Home/homeSlice";
function App() {
	const mobile = useSelector(mobileStatus);
	const loadingInfo = useSelector(loadingState);
	console.log(loadingInfo);
	const dispatch = useDispatch();
	{
		return loadingInfo ? "Loading....." :
			(
				<main >

					<div className='tb_wrap'>
						<div className='dialogWindow' style={{ display: mobile ? "block" : "none" }} onClick={() => mobile ? dispatch(changeMobile(false)) : ""}></div>
					</div>
					<div className="main-container">
						<div className={`leftSide ${mobile ? "mobile_hide" : ""}`}>
							<LeftSide />
						</div>
						<section className='product-container'>
							<HeaderParts />
							<div className='product-view'>
								{console.log("App list")}
								<ProductPage />
							</div>
						</section>
					</div>
				</main >);
	}

}

export default App;
