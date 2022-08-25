import { format } from "date-fns";
import React from "react";
import { useSelector } from "react-redux";
import { Card, CardBody } from "reactstrap";
import { activeProduct } from "../../Home/homeSlice";
import OfferTitle from "./OfferTitle";
import "./ProductList.scss";

const ProductPage = () => {

	const filterProduct = useSelector(activeProduct);
	return <>
		<OfferTitle product={filterProduct} />
		{filterProduct ? filterProduct.map((el, k) => (
			<Card className={"product-list"} key={k} data-title={`${el.prizeAmount} ${el.prizeType} `}
				style={{ backgroundImage: "url(https://staticdata.lider-bet.com/images/market/12343.png)" }}>
				<CardBody>
					{el.discount && <p className='discount' data-discount={`-${el.discount.percent}%`}> {format(new Date(el.discount.end_date), "dd MMM yyyy")}</p>}
					<p className='product-discountName'>
						<span>{el.discaunt ? el.discaunt.name : ""}</span>
					</p>
					<div className='product-list-hover'>
						<p>{el.name}</p>
						<p className='product-list-price' data-info={el.name}>
							<span className="mainview">
								{el.discountPrice ?? el.prizeAmount} {el.currencyId === "LBP" ? "POINTS" : el.currencyId}
							</span>
							{el.discount && <span className='discountHover' data-discount={`-${el.discount.percent}%`}>
								{el.price} {el.currencyId}
							</span>}

						</p>
					</div>
				</CardBody>
			</Card>)) : ""}
	</>;
};

export default React.memo(ProductPage);