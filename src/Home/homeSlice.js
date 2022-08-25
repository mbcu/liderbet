import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import axios from "axios";
import { compareTwoArray, getMinMax } from "../Helpers/mainFunc";

// const GET_ALL = "https://leader.bet/api/?app=test";
const GET_ALL = "http://localhost:2211/";

const initialState = {
	data: [],
	menuTags: [],
	leftMenuAction: [1000],
	topMenu: [],
	filterBarTags: [],
	product: [],
	range: [],
	minMax: [],
	sort: "down",
	active: [],
	currency: "GEL",
	status: "start",
	search: "",
	mobile: false,
	loading: true,
};

export const fetchData = createAsyncThunk("main/lists", async () => {
	try {
		const response = await axios.get(GET_ALL);
		return response.data;
	} catch (err) {
		return err.message;
	}
});

const homeSlice = createSlice({
	name: "allInfo",
	initialState,
	reducers: {
		changeCurrency(state, action) {
			state.currency = action.payload;
		},
		changeMobile(state, action) {
			state.mobile = action.payload;
		},
		changeProduct(state) {
			state.active = state.product[state.currency];
			selectTopFilter(state, state.topMenu);
			manageMinMax(state);
			sortingMethods(state);
		},
		changeSort(state, action) {
			state.sort = action.payload;
			sortingMethods(state);
		},
		makeSearch(state, action) {
			state.search = action.payload;
			selectTopFilter(state, state.topMenu);

			state.active = searchInfo(state);

		},
		filterTop(state, action) {
			state.topMenu = action.payload;

			if (action.payload === "all")
				selectLeftFilter(state, [1000]);
			else
				selectTopFilter(state, action.payload);

			if (state.active.length > 0) {
				filterRangeFunc(state);
			}
			sortingMethods(state);
		},
		filterLeft(state, action) {
			selectLeftFilter(state, action.payload);
			if (state.topMenu.length > 0) {
				selectTopFilter(state, state.topMenu);
			}
			manageMinMax(state);
			sortingMethods(state);

		},
		filterPrice(state, action) {
			state.range = [{ min: action.payload[0], max: action.payload[1] }];
			selectTopFilter(state, state.topMenu);

			state.active = state.active.filter((e) => e.price >= action.payload[0] && e.price <= action.payload[1]);
			sortingMethods(state);

		},
	},
	extraReducers(builder) {

		builder
			.addCase(fetchData.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchData.fulfilled, (state, action) => {
				const all = action.payload;
				const menuTags = all.tags;

				const menuItems = all.menuTags.map(el => {
					return {
						name: menuTags[el.id].name,
						id: el.id,
						children:
							el.children.length > 0
								? el.children.map(it => {
									return { name: menuTags[it].name, id: it };
								})
								: [],
					};
				});

				const filterMenu = all.filterBarTags.map(el => {
					return {
						name: menuTags[el.id].name,
						id: el.id,
					};
				});

				let productViewGEL = [];
				let productViewLBP = [];

				const filteredProduct = () => {
					Object.keys(all.marketItem).map(key => {
						let discId = all.marketItem[key].discountId;
						if (all.marketItem[key].currencyId === state.currency) {
							return productViewGEL.push({
								...all.marketItem[key],
								product: all.products[all.marketItem[key].productId],
								discount: discId ? all.discounts[discId] : null,
							});
						} else {
							return productViewLBP.push({
								...all.marketItem[key],
								product: all.products[all.marketItem[key].productId],
								discount: discId ? all.discounts[discId] : null,
							});
						}
					});
					return {
						GEL: productViewGEL,
						LBP: productViewLBP
					};
				};

				state.status = "succeeded";
				state.menuTags = menuItems;
				state.filterBarTags = filterMenu;
				state.product = filteredProduct();
				state.active = productViewGEL;
				state.data = action.payload;
				let rangeValues = getMinMax(
					state.product[state.currency],
					state.active.length
				);
				manageMinMax(state);
				state.range = [
					{ min: Number(rangeValues.min), max: Number(rangeValues.max) },
				];

				state.loading = false;
			});
	},
});

export const selectAll = state => state.info.data;
export const selectMenu = state => state.info.menuTags;
export const selectProducts = state => state.info.product;
export const currentCurrenct = state => state.info.currency;
export const activeProduct = state => state.info.active;

export const getRange = state =>
	state.info.range.length > 0 ? state.info.range[0] : [];

export const selectLeftActive = state => state.info.leftMenuAction;
export const selectTopActive = state => state.info.topMenu;

export const loadingState = state => state.info.loading;

export const selectFilter = state => state.info.filterBarTags;
export const getDataStatus = state => state.info.status;
export const getDataError = state => state.info.error;
export const mobileStatus = state => state.info.mobile;
export const sortList = state => state.info.sort;
export const searchStr = state => state.info.search;
export const minMaxRange = state => state.info.minMax;

export const {
	changeCurrency,
	changeProduct,
	filterLeft,
	changeMobile,
	filterTop,
	filterPrice,
	changeSort,
	makeSearch
} = homeSlice.actions;

export const selectTopFilter = (state, arrInc) => {
	state.topMenu = arrInc;
	if (arrInc.length === 0) state.active = state.product[state.currency];
	if (state.leftMenuAction.length > 0)
		selectLeftFilter(state, state.leftMenuAction);
	if (state.topMenu.length > 0)
		state.active = state.active.filter(el =>
			compareTwoArray(el.prizeType, state.topMenu)
		);
};

export const selectLeftFilter = (state, arrInc) => {
	state.leftMenuAction = arrInc;
	if (state.leftMenuAction[0] === 1000)
		state.active = state.product[state.currency];
	if (arrInc[0] !== 1000 && state.leftMenuAction.length > 0)
		state.active = state.product[state.currency].filter(el =>
			compareTwoArray(el.tags, arrInc)
		);
};

export const manageMinMax = state => {
	if (state.active && state.active.length > 0) {
		let rng = getMinMax(state.active, state.active.length);
		state.minMax = [Number(rng.min), Number(rng.max)];
		state.range = [{ min: Number(rng.min), max: Number(rng.max) }];
	}
};

const sortingMethods = state => {
	state.search = "";
	switch (state.sort) {
		case "up":
			state.active = state.active.sort((a, b) => a.discountPrice ? a.discountPrice - b.discountPrice : b.price - a.price
			);
			break;
		case "down":
			state.active.sort((a, b) => a.discountPrice ? b.discountPrice - a.discountPrice : b.prizeAmount - a.prizeAmount);
			break;

		case "az":
			state.active.sort(function (a, b) {
				if (a.product.name < b.product.name) { return -1; }
				if (a.product.name > b.product.name) { return 1; }
				return 0;
			});
			break;

		case "za":
			state.active.sort(function (a, b) {
				if (a.product.name > b.product.name) { return -1; }
				if (a.product.name < b.product.name) { return 1; }
				return 0;
			});

			break;

		default:
			state.active.sort((a, b) => a.discountPrice ? b.discountPrice - a.discountPrice : b.prizeAmount - a.prizeAmount);
	}
};

export const searchInfo = state => {

	return state.active.filter(el => {
		return el.name.toLowerCase().includes(state.search.toLowerCase());
	});

};


export const filterRangeFunc = (state) => {
	const rangeVals = current(state.range);
	state.active = state.active.filter((e) => e.price >= rangeVals[0].min && e.price <= rangeVals[0].max);

};

export default homeSlice.reducer;
