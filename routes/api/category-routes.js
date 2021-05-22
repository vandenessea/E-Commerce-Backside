const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

// GET - all categories
router.get("/", async (req, res) => {
  try {
    const categoriesData = await Category.findAll({
      // JOIN with products
      include: [{ model: Product }],
    }).then((result) => {
      //return JSON response of result
      res.status(200).json(result);
    });
  } catch (err) {
    //console log error if status = 500
    res.status(500).json(err);
  }
});



// GET - one category by its id value
router.get("/:id", async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      //JOIN with Products
      include: [{ model: Product }],
    });

    if (!categoryData) {
      res.status(404).json({ message: "No category found with this id!" });
    } else {
      res.status(200).json(categoryData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});



// GET - one category by its category_name value
router.get("/category/:category_name", async (req, res) => {
  try {
    const categoryData = await Category.findAll({
      where: { category_name: req.params.category_name },
      // JOIN with Product
      include: [{ model: Product }],
    });

    if (categoryData.length == 0) {
      res.status(404).json({ message: "No category found with this id!" });
    } else {
      res.status(200).json(categoryData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});



// POST - to create a new category
router.post("/", async (req, res) => {
  try {
    const categoryData = await Category.create(req.body);

    console.log(`\n Adding new category: ${req.body.category_name} \n`);

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});



// PUT - update a category by its `id` value
router.put("/:id", async (req, res) => {
  try {
    console.log(`\n Updating category_name to: ${req.body.category_name} \n`);

    const categoryData = await Category.update(
      { category_name: req.body.category_name },
      { returning: true, where: { id: req.params.id } }
    ).then((result) => {
      res.status(200).json(result);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});



// DELETE - delete a category by its id value
router.delete("/:id", async (req, res) => {
  try {
    const categoryData = await Category.destroy({
      where: { id: req.params.id },
    });

    //if wrong id entered
    if (!categoryData) {
      res.status(404).json({ message: "No category found with this id!" });
      return;
    } else {
      console.log(`\n Deleting category with id: ${req.params.id} \n`);
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
