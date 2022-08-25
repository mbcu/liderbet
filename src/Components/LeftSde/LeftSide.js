import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { List } from "reactstrap";
import { generateArr } from "../../Helpers/mainFunc";
import { filterLeft, selectLeftActive, selectMenu } from "../../Home/homeSlice";
import className from "classname";
import "./leftSide.scss";


const LeftSide = () => {
	const menus = useSelector(selectMenu);
	const leftMenuCheckList = useSelector(selectLeftActive);
	const dispatch = useDispatch();
	const [checked, setChecked] = useState([...leftMenuCheckList ?? []]);
	const [menuChanges, setMenuChanges] = useState(null);
	var isChecked = (item) =>
		checked.includes(item) ? true : false;

	const topMenuHandler = (menu) => {
		let updatedList = [...checked];
		let includeEll = updatedList.indexOf(Number(menu.id));
		setMenuChanges(menu.id);
		if (updatedList[includeEll] === menu.id || menu === "all")
			updatedList = [1000];
		else
			updatedList = generateArr(menu.name, menus);

		setChecked([...updatedList]);
		dispatch(filterLeft(updatedList));
	};

	const subMenuHandler = (sub) => {
		let topArr = [...checked];
		let menuId = checked.indexOf(Number(sub));
		let lastId = topArr[topArr.length - 1];

		if (menuId !== -1)
			topArr.length > 3 && lastId === menuChanges ?
				topArr = [sub, lastId] :
				topArr.splice(menuId, 1);
		else
			topArr = [...checked, sub];

		setChecked(topArr);
		dispatch(filterLeft(topArr));

	};

	return (
		<List className="left-menu">
			<li mbs={1000} className={className("all", "leftMenu", isChecked(1000) && "active")}  >
				<div onClick={() => topMenuHandler("all")}>
					<span mbs={1000} name="all" >all</span>
				</div>
			</li>
			{
				menus.length > 0 && menus.map((el, k) => {
					if (el.children) {
						return (
							<li className={className("leftMenu", el.name.toLowerCase(), isChecked(el.id) && "active")} key={k} name={el.name} >
								<div onClick={() => topMenuHandler(el)}>
									<span name={el.name} >{el.name}</span>
								</div>
								{el.children.length > 0 && (
									<List style={{ display: isChecked(el.id) ? "block" : "none" }} >
										{Object.keys(el.children).map((it, i) => (
											<li className={className((el.children[it].name).toLowerCase(), "leftMenuchild", isChecked(el.children[it].id) && "active")} onClick={() => subMenuHandler(el.children[it].id)} key={i}>
												<i className="form-check-input"></i>

												<span mbs={el.children[it].id} className='childMenu'>{el.children[it] ? el.children[it].name : ""}</span>
											</li>
										))}
									</List>
								)}
							</li>
						);
					}
				})
			}
		</List>
	);
};

export default React.memo(LeftSide);