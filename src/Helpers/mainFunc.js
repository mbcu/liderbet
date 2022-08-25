export const generateArr = (menuId, menus) => {
	if (menuId !== "all") {
		let index = Object.keys(menus).filter(el => menus[el].name === menuId);
		let child = menus[index].children ? Object.keys(menus[index].children).map(el => menus[index].children[el].id) : [];
		child.push(menus[index].id);
		return child;
	} else {
		return [1000];
	}

};

export const checkRange = (arr1, min, max) => {
	arr1.filter(function (item) {
		console.log(item.prizeAmount, "<------");
		let result = item.prizeAmount > min && item.prizeAmount < max;
		return result;
	});

};

export const compareTwoArray = (arr1, arr2) => {
	if (typeof arr1 === "object") {
		return arr1.filter(e => arr2.includes(e)).length > 1 ? true : false;
	}
	else {
		return arr2.includes(arr1);
	}
};


export const getMinMax = (arr, n) => {
	let minmax = [];
	var i;
	if (n > 0) {

		if (n === 1) {
			minmax.max = arr[0].price;
			minmax.min = arr[0].price;
			return minmax;
		}

		if (arr[0].price > arr[1].price) {
			minmax.max = arr[0].price;
			minmax.min = arr[1].price;
		} else {
			minmax.max = arr[1].price;
			minmax.min = arr[0].price;
		}

		for (i = 2; i < n; i++) {
			if (arr[i].price > minmax.max) {
				minmax.max = arr[i].price;
			} else if (arr[i].price < minmax.min) {
				minmax.min = arr[i].price;
			}
		}
		return minmax;

	}
	return;
};
