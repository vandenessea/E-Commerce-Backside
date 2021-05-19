const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// GET - all products
router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll({
      //JOIN with Category, Tag through ProductTag
      include: [ { model: Category },
                 { model: Tag, through: ProductTag, as: 'related_tags' }]
    })
    .then((result) => {
      //return JSON response of result
      res.status(200).json(result);
    })
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET - one product by its 'id' value
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      //JOIN with Category, Tag through ProductTag
      include: [ { model: Category },
                 { model: Tag, through: ProductTag, as: 'related_tags' }]
    });

    if (!productData) {
      res.status(404).json({ message: 'No product found with this id!' });
    } else {
      res.status(200).json(productData);
    }

  } catch (err) {
    res.status(500).json(err)
  }
});


// GET - one product by its 'id' value with no other associated data
router.get('/solo/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id);

    if (!productData) {
      res.status(404).json({ message: 'No product found with this id!' });
    } else {
      res.status(200).json(productData);
    }

  } catch (err) {
    res.status(500).json(err)
  }
});


// POST - create new product
router.post('/',  (req, res) => {
  /* req.body should look like this...
    {
      "product_name": "Basketball",
      "price": 20.00,
      "stock": 3,
      "tagIds": [1, 2, 3, 4]
    }
  */

  Product.create(req.body)
    .then((product) => {

      console.log(req.body)
      console.log(`\n Adding new product: ${req.body.product_name}, price: $${req.body.price}, stock: ${req.body.stock} \n`);

      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length > 0) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});


// PUT - Update product tags
router.put('/:id', (req, res) => {

  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      console.log(`\n Product Tags ${productTags} \n`);
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      console.log('\n Ids:', productTagIds, '\n');
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});


// DELETE - one product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const productData = await Product.destroy({
      where: { id: req.params.id }
    });

    //if wrong id entered
    if (!productData) {
      res.status(404).json({message: 'No product found with this id!'});
      return;
    } else {
      console.log(`\n Deleting product with id: ${req.params.id} \n`);
    }

    res.status(200).json(productData);
  } catch {
    res.status(500).json(err);
  }
});

module.exports = router;