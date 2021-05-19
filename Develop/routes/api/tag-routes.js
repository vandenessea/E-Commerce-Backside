const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// GET - all tags
router.get('/', async (req, res) => {
  try {
    console.log(`\n Getting all Tag data \n`)

    const tagData = await Tag.findAll({
      //JOIN with Product
      include: {model: Product, through: ProductTag, as: 'related_products'} 
    })
    res.status(200).json(tagData);

  } catch (err) {
    res.status(500).json(err);
  }
});


// GET - one tag by its 'id' value
router.get('/:id', async (req, res) => {
  try {
    console.log(`\n Getting data with id: ${req.params.id} \n`)

    const tagData = await Tag.findByPk(req.params.id, {
      //JOIN with Product
      include: { model: Product, through: ProductTag, as: 'related_products'} 
    });

    //if wrong tag id is entered
    if (!tagData) {
      res.status(404).json({message: 'No tags found with this id!'});
    } else {
      res.status(200).json(tagData);
    }

  } catch (err) {
    res.status(500).json(err);
  }
});


// GET - one tag by its 'id' with no other associated data
router.get('/solo/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id);

    if (!tagData) {
      res.status(404).json({message: 'No tag found with this id! '});
    } else {
      res.status(200).json(tagData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});


// POST - create new tag
router.post('/', async (req, res) => {
  try {
    console.log(`\n Adding new tag: ${req.body.tag_name} \n`)
  
    const tagData = await Tag.create(req.body);

    res.status(200).json(tagData);

  } catch (err) {
    res.status(400).json(err);
  }
});


// PUT - Update tag name by its 'id' value
router.put('/:id', async (req, res) => {

  try {
    console.log(`\n Updating tag_name to: ${req.body.tag_name} \n`);
    
    //await tag.update to take place
    const tagData = await Tag.update(
      { tag_name: req.body.tag_name },
      { returning: true, where: {id: req.params.id} }
    )
    res.status(200).json(tagData);

  } catch(err) {
    res.status(500).json(err);
  }
});

// DELETE - one tag by its 'id' value
router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy({
      where: { id: req.params.id }
    });

    //if wrong id is entered
    if(!tagData) {
      res.status(404).json({message: 'No tag found with this id!'});
      return;
    } else {
      console.log(`\n Deleting tag with id: ${req.params.id} \n`);
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;