import React from "react";
import Card from './Card';
import Popup from './Popup';
import SearchBar from './SearchBar';

export default function Store(props) {
    const [sortValue, setSortValue] = React.useState('-');
    const [hideOutOfStock, setHideOutOfStock] = React.useState(false);
    const [searchInput, setSearchInput] = React.useState('');
    const [items, setItems] = React.useState(props.originalProducts.map(product => (
        <Card
        key = {product.id}
        id = {product.id}
        title = {product.title}
        url = {product.url}
        description = {product.description}
        price = {product.price}
        inStock = {product.inStock}
        addToCart = {props.addToCart}
        removeFromCart = {props.removeFromCart}
        quantity = {props.quantity}
        upQuantity = {props.upQuantity}
        downQuantity = {props.downQuantity}
        showPopup = {props.showPopup}
        filters = {[sortValue, hideOutOfStock, searchInput]}
        />
    )));

    // React.useEffect(() => {
    //     applyFilters();
    // }, [])

    React.useEffect(() => {
        applyFilters();
    }, [sortValue, hideOutOfStock, searchInput])

    React.useEffect(() => {
        setItems(props.products.map(product => (
            <Card
            key = {product.id}
            id = {product.id}
            title = {product.title}
            url = {product.url}
            description = {product.description}
            price = {product.price}
            inStock = {product.inStock}
            addToCart = {props.addToCart}
            removeFromCart = {props.removeFromCart}
            quantity = {props.quantity}
            upQuantity = {props.upQuantity}
            downQuantity = {props.downQuantity}
            showPopup = {showPopup}
            filters = {[sortValue, hideOutOfStock, searchInput]}
            />
        )))
    }, [props.products])

    function showPopup(id, quantity) {
        for (let i = 0; i < props.products.length; i++) {
            if (props.products[i].id = id) {
                let product = props.products[i];
                return (
                    <Popup
                        key = {product.id}
                        id = {product.id}
                        title = {product.title}
                        url = {product.url}
                        quantity = {quantity}
                        price = {product.price}
                        removeFromCart = {props.removeFromCart}
                        upQuantity = {props.upQuantity}
                        downQuantity = {props.downQuantity}
                    />
                )
            }
        }
    }

    function handleSortChange(e) {
        setSortValue(e.target.value);
    }

    function handleStockFilter(e) {
        if (e.target.checked === true) {
            setHideOutOfStock(true);
        } else if (e.target.checked === false) {
            setHideOutOfStock(false);
        }
    }

    function applyFilters() {
        props.setProducts([...props.originalProducts]);
        if (sortValue === 'a-z') {
            props.setProducts(prevProducts => {
                return prevProducts.sort(function (a, b) {
                    let titleA = a.title.toLowerCase();
                    let titleB = b.title.toLowerCase();
                    if (titleA < titleB) {
                        return -1;
                    } else if (titleB < titleA) {
                        return 1;
                    } else {
                        return 0
                    }
                });
            });
        } else if (sortValue === 'z-a') {
            props.setProducts(prevProducts => {
                return prevProducts.sort(function (a, b) {
                    let titleA = a.title.toLowerCase();
                    let titleB = b.title.toLowerCase();
                    if (titleB < titleA) {
                        return -1;
                    } else if (titleA < titleB) {
                        return 1;
                    } else {
                        return 0
                    }
                });
            });
        } else if (sortValue === 'priceHighest') {
            props.setProducts(prevProducts => {
                    return prevProducts.sort(function (a, b) {
                    if (b.price < a.price) {
                        return -1;
                    } else if (a.price < b.price) {
                        return 1;
                    } else {
                        return 0
                    }
                    });
            });
        } else if (sortValue === 'priceLowest') {
            props.setProducts(prevProducts => {
                return prevProducts.sort(function (a, b) {
                    if (a.price < b.price) {
                        return -1;
                    } else if (b.price < a.price) {
                        return 1;
                    } else {
                        return 0
                    }
                });
            });
        }
        if (hideOutOfStock) {
            props.setProducts(prevProducts => {
                for (let i = 0; i < prevProducts.length; i++) {
                    if (!prevProducts[i].inStock) prevProducts.splice(i, 1);
                }
                return prevProducts;
            })
        }
        if (searchInput.length > 0) {
            props.setProducts(prevProducts => prevProducts.filter(product => {
                let words = product.title.split(' ');
                let match = false;
                words.forEach(word => {
                    if (word.toLowerCase().startsWith(searchInput.toLowerCase())) match = true;
                })
                return match;
            }))
        }
    }

    return (
        <div>
            <div className="storeHeader">
                <div className="storeTitle">
                    <h1>Store</h1>
                </div>
                <div className="storeFilters">
                    <SearchBar
                        applyFilters = {applyFilters}
                        searchInput = {searchInput}
                        setSearchInput = {setSearchInput}
                    />
                    <div className="filter">
                        <label>Sort by:</label>
                        <select value={sortValue} onChange={handleSortChange}>
                            <option value="">-</option>
                            <option value="a-z">Product name A-Z</option>
                            <option value="z-a">Product name Z-A</option>
                            <option value="priceLowest">Price ascending</option>
                            <option value="priceHighest">Price descending</option>
                        </select>
                    </div>
                    <div className="filter">
                        <label>Only show products in stock</label>
                        <input type="checkbox" checked={hideOutOfStock} onChange={handleStockFilter}></input>
                    </div>
                </div>
            </div>
            <div className="storeCards">{items}</div>
        </div>
    )
}