import { createServer, Model } from "miragejs"


createServer({
    models: {
        products: Model,
    },

    seeds(server) {
        server.create("product", {
            id: 1,
            title: 'Headphones',
            description: 'Noise cancelling headphones, perfect for loud commutes',
            url: 'headphones.jpg',
            price: 149.99,
            inStock: true,
        })
        server.create("product", {
            id: 2,
            title: 'Sunglasses',
            description: 'Stylish and comfortable',
            url: 'sunglasses.jpg',
            price: 59.99,
            inStock: true,
            })
        server.create("product", {
            id: 3,
            title: 'Vintage car',
            description: 'Straight from the 1960s',
            url: 'car.jpg',
            price: 7500.00,
            inStock: false,
        })
        server.create("product", {
            id: 4,
            title: 'Plant',
            description: 'Freshen up your home',
            url: 'plant.jpg',
            price: 24.49,
            inStock: true,
        })
        server.create("product", {
            id: 5,
            title: 'Drink bottle',
            description: 'Sleek and ergonomic',
            url: 'bottle.jpg',
            price: 20.99,
            inStock: false,
        })
        server.create("product", {
            id: 6,
            title: 'Backpack',
            description: 'Made with the finest materials',
            url: 'bag.jpg',
            price: 55.00,
            inStock: true,
        })
        server.create("product", {
            id: 7,
            title: 'Watch',
            description: 'Beautifully crafted',
            url: 'watch.jpg',
            price: 250.00,
            inStock: false,
        })
        server.create("product", {
            id: 8,
            title: 'Bicycle',
            description: 'Perfect for city commutes or countryside adventures',
            url: 'bike.jpg',
            price: 330.00,
            inStock: false,
        })
        server.create("product", {
            id: 9,
            title: 'Running shoes',
            description: 'Providing ultimate comfort for your run',
            url: 'shoes.jpg',
            price: 59.49,
            inStock: true,
        })
        server.create("product", {
            id: 10,
            title: 'Drone',
            description: 'The possibilies are endless',
            url: 'drone.jpg',
            price: 1099.99,
            inStock: true,
        })
        server.create("product", {
            id: 11,
            title: 'Lamp',
            description: 'Brighten up your room',
            url: 'lamp.jpg',
            price: 39.99,
            inStock: true,
        })
        server.create("product", {
            id: 12,
            title: 'Camera',
            description: 'Capture your memories forever',
            url: 'camera.jpg',
            price: 129.50,
            inStock: true,
        })
        server.create("product", {
            id: 13,
            title: 'Coffee machine',
            description: 'The perfect way to start your day',
            url: 'coffee-machine.jpg',
            price: 149.99,
            inStock: true,
        })
        server.create("product", {
            id: 14,
            title: 'Chair',
            description: 'Stylish and comfortable',
            url: 'chair.jpg',
            price: 47.00,
            inStock: false,
        })
        server.create("product", {
            id: 15,
            title: 'Smartphone',
            description: 'Stay in touch with the world',
            url: 'phone.jpg',
            price: 479.99,
            inStock: true,
        })
        server.create("product", {
            id: 16,
            title: 'Laptop',
            description: 'Browse, work or play',
            url: 'laptop.jpg',
            price: 679.99,
            inStock: true,
        })
        server.create("product", {
            id: 17,
            title: 'Calculator',
            description: 'Simple and functional',
            url: 'calculator.jpg',
            price: 5.99,
            inStock: true,
        })
        server.create("product", {
            id: 18,
            title: 'Tennis racket',
            description: 'Comes with ball',
            url: 'tennis-racket.jpg',
            price: 32.50,
            inStock: true,
        })
        server.create("product", {
            id: 19,
            title: 'Cocktail glass',
            description: 'Sleek and stylish',
            url: 'cocktail-glass.jpg',
            price: 3.99,
            inStock: true,
        })
        server.create("product", {
            id: 20,
            title: 'Painting',
            description: 'Brighten up your home with art',
            url: 'painting.jpg',
            price: 139.99,
            inStock: true,
        })
    },

    routes() {
        this.namespace = "api"
        this.logging = false

        this.get("/products", (schema, request) => {
            return schema.products.all()
        })

        this.get("/products/:id", (schema, request) => {
            const id = request.params.id
            return schema.products.find(id)
        })
    }
})