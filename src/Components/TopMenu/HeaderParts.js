import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, List } from "reactstrap";
import className from "classname";
import { changeCurrency, changeMobile, changeProduct, changeSort, currentCurrenct, filterTop, makeSearch, searchStr, selectFilter, selectTopActive, sortList } from "../../Home/homeSlice";
import "./TopMenu.scss";

const HeaderParts = () => {
	const menuFilter = useSelector(selectFilter);
	const leftMenuCheckList = useSelector(selectTopActive);
	const currentCur = useSelector(currentCurrenct);
	const searchString = useSelector(searchStr);

	const [checkedTop, setCheckedTop] = useState([...leftMenuCheckList ?? []]);
	const [mobile] = useState(false);
	const [sort, setSort] = useState(false);
	const checkSort = useSelector(sortList);
	const dispatch = useDispatch();

	const currenctChange = (cur) => {
		dispatch(changeCurrency(cur));
		dispatch(changeProduct());
	};


	const handleCheck = (menu) => {
		var updateListTop = [...checkedTop];

		if (checkedTop.indexOf(menu) === -1 || menu === "all") {
			updateListTop = [...checkedTop, menu];
		} else {
			updateListTop.splice(checkedTop.indexOf(menu), 1);
		}

		setCheckedTop(updateListTop);
		dispatch(filterTop(updateListTop));

	};

	var isCheckedTop = (item) =>
		checkedTop.includes(item) ? true : false;


	const changeOpenSort = () => {
		setSort(!sort);

	};

	const changeFilter = (e, fl) => {
		e.stopPropagation();
		dispatch(changeSort(fl));
	};


	return (
		<>
			<List className={"topmenu mobile"}>
				<li className='topmenuItems'>
					<i onClick={() => dispatch(changeMobile(!mobile))} className='menuBtn'></i>
				</li>

				<li className='topmenuItems search mobile-search '>
					<Input type={"search"} onChange={(e) => dispatch(makeSearch(e.currentTarget.value))} />
				</li>
			</List>
			<List className={"topmenu"}>
				{
					menuFilter && menuFilter.map((el, k) => (
						<li
							className={className("topmenuItems", "desktop", el.name, isCheckedTop(el.name) && "active")}
							onClick={() => handleCheck(el.name)}
							key={k}
						>
							<i className="form-check-input"></i>

							<span mbs={el.name} >{el.name}</span>
						</li>
					))
				}

				<li className={"topmenuItems"} >
					<span onClick={() => currenctChange("LBP")}>POINT</span>
					<span onClick={() => currenctChange(currentCur === "GEL" ? "LBP" : "GEL")} className='imageSwitcher' style={{ transform: currentCur === "LBP" ? "rotate(180deg)" : "rotate(0deg)" }}></span>
					<span onClick={() => currenctChange("GEL")}>GEL</span>
				</li>
				<li className='topmenuItems search-tools desktop' >
					<Input type={"search"} placeholder={"Search ..."} value={searchString} onChange={(e) => dispatch(makeSearch(e.currentTarget.value))} />
				</li>
				<li className='mobile'>
					<select onChange={(e) => dispatch(filterTop(e.target.value))} >
						<option value={"all"} >
							All
						</option>
						{
							menuFilter && menuFilter.map((el, k) => (
								<option
									value={el.name}
									key={k}
								>
									{el.name}
								</option>
							))
						}
					</select>
				</li>
				<li className={`sortPrice topmenuItems  ${sort ? "open" : ""}`} onClick={changeOpenSort} data-section={checkSort} data-info={"Filter"}>
					<ul>
						<li onClick={(e) => changeFilter(e, "az")} className="az">
							<i className="form-check-input"></i>
							A - Z alphabet
						</li>
						<li onClick={(e) => changeFilter(e, "za")} className="za">
							<i className="form-check-input"></i>
							Z - A alphabet
						</li>
						<li onClick={(e) => changeFilter(e, "up")} className="up">
							<i className="form-check-input"></i>
							Ascending price
						</li>
						<li onClick={(e) => changeFilter(e, "down")} className="down">
							<i className="form-check-input"></i>
							Descending price
						</li>
					</ul>
				</li>
			</List >
		</>


	);
};
export default React.memo(HeaderParts);