import Product from "./Product";

export default class SimpleProduct extends Product{
    constructor(parentWrapper, wrapper){
        super(parentWrapper, wrapper);
    }
}

/*
*        <!-- inventory -->
                        <div>
                            <label for="inventory">Inventory</label>
                            <input type="text" placeholder="Inventory" id="inventory" name="inventory"
                                   data-simple-product-inventory
                                   class="w100" value="<%= getValueFromData('inventory') %>">
                        </div>

                        <!-- price-->
                        <div>
                            <label for="price">Price ($)</label>
                            <input type="text" placeholder="Price" id="price" name="price" data-simple-product-price
                                   class="w100" value="<%= getValueFromData('price') %>">
                        </div>

                        <!-- sale price-->
                        <div>
                            <label for="sale-price">Sale Price ($)</label>
                            <input type="text" placeholder="Sale price" id="sale-price" name="salePrice"
                                   data-simple-product-sale-price
                                   class="w100" value="<%= getValueFromData('salePrice') %>">
                        </div>
* */