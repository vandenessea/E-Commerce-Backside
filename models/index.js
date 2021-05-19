// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

//define associations. This is how each model is related to one another

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: 'category_id'
});

// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'category_id',       //IS THIS NEEDED?
  onDelete: 'CASCADE',
});

// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {
  //define third table needed to store foreign keys
  through: {
    model: ProductTag  //ProductTag has a fk for both product and tag models
  },
  //define an alias for when data is retrieved
  as: 'related_tags'
});

// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, {
  through: {
    model: ProductTag
  },
  as: 'related_products'
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};