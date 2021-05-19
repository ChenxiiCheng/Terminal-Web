function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export const handleCSVFile = jsonData => {
  const map = new Map();

  for (const item of jsonData) {
    if (!map.has(item?.Vendor)) {
      map.set(item?.Vendor, []);
    }
    map.set(item?.Vendor, [...map.get(item?.Vendor), item]);
  }

  for (const [key, products] of map) {
    const handledProductList = [];

    // product node are sorted alphabetically
    products.sort((a, b) => a.Product.localeCompare(b.Product));
    products.forEach(item => (item.Amount = Number(item.Amount)));
    map.set(key, products);

    for (const product of products) {
      const sameProducts = products.filter(
        pro => product.Product === pro.Product
      );

      if (sameProducts.length > 1) {
        if (handledProductList.includes(product.Product)) break;

        let totalAmount = 0;
        for (const item of sameProducts) {
          totalAmount += Number(item.Amount);
        }
        sameProducts[0].Amount = totalAmount;
        const newProducts = [
          ...products.filter(pro => product.Product !== pro.Product),
          sameProducts[0],
        ];

        map.set(key, newProducts);
      }

      handledProductList.push(product.Product);
    }
  }

  for (const [key, values] of map) {
    let totalAmount = 0;
    for (const item of values) {
      totalAmount += item.Amount;
    }

    map.set(key, [...values, totalAmount]);
  }

  const mapSortByKey = new Map(
    [...map].sort((a, b) => a[0].localeCompare(b[0]))
  );

  let output = '';
  for (const [key, items] of mapSortByKey) {
    let row = `${key} ${formatter.format(items[items.length - 1])}`;
    for (const item of items) {
      if (isObject(item)) {
        row = `${row} \n   ${item.Product} ${formatter.format(item.Amount)}`;
      }
    }

    output = `${output} \n ${row}`;
  }

  return output;
};
