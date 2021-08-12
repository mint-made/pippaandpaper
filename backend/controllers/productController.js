import asyncHandler from 'express-async-handler';

import Product from '../models/productModel.js';

/**
 * @api {get} /api/products getProducts
 * @apiGroup Product
 * @apiPermission Public
 *
 * @apiParam {String} Keyword to search the database
 * @apiParam {Number} Page number of the results
 *
 * @apiSuccess {Array} Array of Products
 * @apiSuccess {Number} Page number of results that is being returned
 * @apiSuccess {Number} Pages Total number of pages of results
 */
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const subcategory = req.query.subcategory
    ? {
        subCategory: {
          $regex: req.query.subcategory,
          $options: 'i',
        },
      }
    : {};
  const category = req.query.category
    ? {
        category: {
          $regex: req.query.category,
          $options: 'i',
        },
      }
    : {};
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const sort = {};
  if (req.query.sort) {
    const sortArr = req.query.sort.split('_');
    const sortField = sortArr[0];
    let sortValue;
    if (sortArr[1] === 'asc') {
      sortValue = 1;
    } else if (sortArr[1] === 'desc') {
      sortValue = -1;
    }
    sort[sortField] = sortValue;
  }

  const count = await Product.countDocuments({
    ...keyword,
    ...category,
    ...subcategory,
  });
  const products = await Product.find({
    ...keyword,
    ...category,
    ...subcategory,
  })
    .sort(sort)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

/**
 * @api {get} /api/products/:id getProductById
 * @apiGroup Product
 * @apiPermission Public
 *
 * @apiParam {String} ID of the product to be returned
 *
 * @apiSuccess {Object} Product Single Product with that ID
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @description Delete a product
// @route DELETE /api/products/:id
// @access Private/Admin
/**
 * @api {delete} /api/products/:id deleteProduct
 * @apiGroup Product
 * @apiPermission Private/Admin
 *
 * @apiParam {String} ID of the product to be deleted
 *
 * @apiSuccess {Object} message "Product removed"
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @description Create a product
// @route POST /api/products
// @access Private/Admin
/**
 * @api {post} /api/products/ createProduct
 * @apiGroup Product
 * @apiPermission Private/Admin
 *
 * @apiParam {Object} Object Empty Object
 *
 * @apiSuccess {Object} product A template product created
 */
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    category: 'sample category',
    countInStock: 0,
    description: 'sample description',
    images: ['/images/sample.jpeg'],
    name: 'sample name',
    numReviews: 0,
    personalizations: [],
    price: 0,
    reviews: [],
    subCategory: 'sample sub-category',
    tags: [],
    user: req.user._id,
    variantId: '',
    variations: [],
    date: Date.now(),
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @description Update a product
// @route PUT /api/products/:id
// @access Private/Admin
/**
 * @api {put} /api/products/:id updateProduct
 * @apiGroup Product
 * @apiPermission Private/Admin
 *
 * @apiParam {String} name of the product
 * @apiParam {Number} price of the product
 * @apiParam {String} description of the product
 * @apiParam {String} image of the product
 * @apiParam {String} brand of the product
 * @apiParam {String} category of the product
 * @apiParam {Number} countInStock of the product
 * @apiParam {Object} variations of the product
 * @apiParam {Object} personalizations of the product
 *
 * @apiSuccess {Object} Product An object of the updated product
 */
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    images,
    brand,
    category,
    subCategory,
    tags,
    countInStock,
    variations,
    personalizations,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.images = images || product.images;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.subCategory = subCategory || product.subCategory;
    product.tags = tags || product.tags;
    product.countInStock = countInStock || product.countInStock;
    product.variations = variations || product.variations;
    product.personalizations = personalizations || product.personalizations;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @description create new review
// @route POST /api/products/:id/reviews
// @access Private
/**
 * @api {post} /api/products/:id createProductReview
 * @apiGroup Product
 * @apiPermission Private
 *
 * @apiParam {Number} rating review rating
 * @apiParam {String} comment review comment
 *
 * @apiSuccess {Object} product A template product created
 */
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment: comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @description Get top rated products
// @route GET /api/products/top
// @access Public
/**
 * @api {get} /api/products/top getTopProducts
 * @apiGroup Product
 * @apiPermission Public
 *
 * @apiSuccess {Object} products The top 3 rated products
 */
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});

/**
 * @api {get} /api/products/categories getProductCategories
 * @apiGroup Product
 * @apiPermission Public
 *
 * @apiSuccess {Object} Categories All the categories of all products in db
 */
const getProductCategories = asyncHandler(async (req, res) => {
  const products = await Product.find({});

  const categories = {
    parent: [],
    sub: [],
  };
  if (products) {
    products.forEach((product) => {
      if (!categories.parent.includes(product.category)) {
        categories.parent.push(product.category);
      }
      if (!categories.sub.includes(product.subCategory)) {
        categories.sub.push(product.subCategory);
      }
    });
    res.json(categories);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export {
  getProductById,
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  getProductCategories,
};
