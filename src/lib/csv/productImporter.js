
import mongoose from "mongoose";
import Product from "../../models/Product";
import Category from "../../models/Category";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function clean(value) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
}

function toNumber(value) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return 0;
  }

  const cleaned = String(value)
    .replace(/,/g, "")
    .trim();

  const number = Number(cleaned);

  return Number.isFinite(number) ? number : 0;
}

function toBoolean(value) {
  const normalized = clean(value).toLowerCase();

  return [
    "yes",
    "true",
    "1",
    "on",
  ].includes(normalized);
}

function createSlug(value) {
  return clean(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function escapeRegex(value) {
  return String(value).replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}

/*
|--------------------------------------------------------------------------
| Product Field Readers
|--------------------------------------------------------------------------
*/

function getName(row) {
  return clean(
    row.name ??
      row.Name ??
      row["Product Name"] ??
      ""
  );
}

function getSlug(row, name) {
  return (
    clean(
      row.slug ??
        row.Slug ??
        ""
    ) || createSlug(name)
  );
}

function getSku(row) {
  return clean(
    row.sku ??
      row.SKU ??
      row["Product SKU"] ??
      ""
  );
}

function getPrice(row) {
  return toNumber(
    row["Regular price"] ??
      row["Regular Price"] ??
      row.regular_price ??
      row.price ??
      row.Price
  );
}

function getDiscountPrice(row) {
  return toNumber(
    row["Sale price"] ??
      row["Sale Price"] ??
      row.sale_price ??
      row.discountPrice ??
      row["Discount Price"]
  );
}

function getStock(row) {
  return toNumber(
    row.Stock ??
      row.stock ??
      row["Stock quantity"] ??
      row.stock_quantity ??
      row.Quantity ??
      row.quantity
  );
}

function getDescription(row) {
  return clean(
    row.Description ??
      row.description ??
      row["Short description"] ??
      ""
  );
}

/*
|--------------------------------------------------------------------------
| CATEGORY
|--------------------------------------------------------------------------
|
| Supports:
|
| category
| Category
| categories
| Categories
| category_id
| Category ID
|
*/

function getCategoryValues(row) {
  const value =
    row.category_id ??
    row["Category ID"] ??
    row.CategoryID ??
    row.Categories ??
    row.categories ??
    row.Category ??
    row.category ??
    "";

  return clean(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/*
|--------------------------------------------------------------------------
| IMAGES
|--------------------------------------------------------------------------
|
| Supports:
|
| thumbnail
| Thumbnail
| images
| Images
| Image URL
| Image URLs
| gallery
|
*/

function getImages(row) {
  const thumbnail = clean(
    row.thumbnail ??
      row.Thumbnail ??
      ""
  );

  const gallery = clean(
    row.gallery ??
      row.Gallery ??
      ""
  );

  const imagesValue =
    row.Images ??
    row.images ??
    row["Image URL"] ??
    row["Image URLs"] ??
    "";

  let images = [];

  /*
   * If Images column exists
   */
  if (clean(imagesValue)) {
    images = clean(imagesValue)
      .split(/[|,]/)
      .map((url) => url.trim())
      .filter(Boolean);
  }

  /*
   * If thumbnail exists, put it first.
   */
  if (thumbnail) {
    images = [
      thumbnail,
      ...images.filter(
        (image) => image !== thumbnail
      ),
    ];
  }

  /*
   * Add gallery images.
   */
  if (gallery) {
    const galleryImages = gallery
      .split(/[|,]/)
      .map((image) => image.trim())
      .filter(Boolean);

    images = [
      ...images,
      ...galleryImages.filter(
        (image) => !images.includes(image)
      ),
    ];
  }

  return images;
}

/*
|--------------------------------------------------------------------------
| FEATURED
|--------------------------------------------------------------------------
*/

function getFeatured(row) {
  return toBoolean(
    row["Is featured?"] ??
      row["Is Featured?"] ??
      row.IsFeatured ??
      row.isFeatured ??
      row.Featured ??
      row.featured
  );
}

/*
|--------------------------------------------------------------------------
| DEAL
|--------------------------------------------------------------------------
*/

function getDeal(row) {
  return toBoolean(
    row.IsDeal ??
      row.isDeal ??
      row.Deal ??
      row.deal
  );
}

/*
|--------------------------------------------------------------------------
| SALE
|--------------------------------------------------------------------------
*/

function getSale(row, price, discountPrice) {
  /*
   * If CSV explicitly provides isSale,
   * use it.
   */
  if (
    row.isSale !== undefined ||
    row.IsSale !== undefined ||
    row.Sale !== undefined
  ) {
    return toBoolean(
      row.isSale ??
        row.IsSale ??
        row.Sale
    );
  }

  /*
   * Otherwise automatically determine sale.
   */
  return (
    discountPrice > 0 &&
    discountPrice < price
  );
}

/*
|--------------------------------------------------------------------------
| VARIANTS / ATTRIBUTES
|--------------------------------------------------------------------------
|
| Expected:
|
| Color:Red,Blue | Size:S,M,L
|
| Or:
|
| Color:Black,White;Size:Standard
|
*/

function getAttributes(row) {
  const value = clean(
    row.Attributes ??
      row.attributes ??
      row.variants ??
      row.Variants ??
      ""
  );

  if (!value) {
    return [];
  }

  return String(value)
    .split("|")
    .flatMap((attributeGroup) =>
      attributeGroup
        .split(";")
        .map((attribute) => {
          const separatorIndex =
            attribute.indexOf(":");

          if (separatorIndex === -1) {
            return null;
          }

          const name = attribute
            .slice(0, separatorIndex)
            .trim();

          const options = attribute
            .slice(separatorIndex + 1)
            .split(",")
            .map((option) => option.trim())
            .filter(Boolean);

          if (!name || options.length === 0) {
            return null;
          }

          return {
            name,
            options,
          };
        })
        .filter(Boolean)
    );
}

/*
|--------------------------------------------------------------------------
| NORMALIZE PRODUCT
|--------------------------------------------------------------------------
*/

function normalizeProduct(row, index) {
  const name = getName(row);

  const price = getPrice(row);

  const discountPrice =
    getDiscountPrice(row);

  return {
    rowNumber: index + 2,

    name,

    slug: getSlug(row, name),

    sku: getSku(row),

    price,

    discountPrice,

    stock: getStock(row),

    categories:
      getCategoryValues(row),

    description:
      getDescription(row),

    images:
      getImages(row),

    variants:
      getAttributes(row),

    isFeatured:
      getFeatured(row),

    isDeal:
      getDeal(row),

    isSale:
      getSale(
        row,
        price,
        discountPrice
      ),
  };
}

/*
|--------------------------------------------------------------------------
| FIND CATEGORY
|--------------------------------------------------------------------------
|
| Supports:
|
| 1. MongoDB ObjectId
| 2. Category slug
| 3. Category name
|
*/

async function findCategory(
  categoryValue
) {
  const value = clean(categoryValue);

  if (!value) {
    return null;
  }

  /*
   * 1. Try MongoDB ObjectId
   */
  if (
    mongoose.Types.ObjectId.isValid(value)
  ) {
    const categoryById =
      await Category.findById(value);

    if (categoryById) {
      return categoryById;
    }
  }

  /*
   * 2. Try slug
   */
  const slug = createSlug(value);

  const categoryBySlug =
    await Category.findOne({
      slug,
    });

  if (categoryBySlug) {
    return categoryBySlug;
  }

  /*
   * 3. Try exact category name
   */
  const categoryByName =
    await Category.findOne({
      name: new RegExp(
        `^${escapeRegex(value)}$`,
        "i"
      ),
    });

  return categoryByName;
}

/*
|--------------------------------------------------------------------------
| FIND EXISTING PRODUCT
|--------------------------------------------------------------------------
*/

async function findExistingProduct(
  product
) {
  /*
   * First priority:
   * SKU
   */
  if (product.sku) {
    const existingBySku =
      await Product.findOne({
        sku: product.sku,
      });

    if (existingBySku) {
      return existingBySku;
    }
  }

  /*
   * Second priority:
   * Slug
   */
  const existingBySlug =
    await Product.findOne({
      slug: product.slug,
    });

  if (existingBySlug) {
    return existingBySlug;
  }

  /*
   * Third priority:
   * Name
   */
  const existingByName =
    await Product.findOne({
      name: product.name,
    });

  return existingByName;
}

/*
|--------------------------------------------------------------------------
| IMPORT PRODUCTS
|--------------------------------------------------------------------------
*/

export async function importProducts(
  rows,
  { preview = false } = {}
) {
  if (
    !Array.isArray(rows) ||
    rows.length === 0
  ) {
    throw new Error(
      "No product data found"
    );
  }

  /*
   * Normalize all rows
   */
  const products = rows.map(
    (row, index) =>
      normalizeProduct(
        row,
        index
      )
  );

  /*
  |--------------------------------------------------------------------------
  | VALIDATE
  |--------------------------------------------------------------------------
  */

  const validationErrors = [];

  for (const product of products) {
    if (!product.name) {
      validationErrors.push({
        row: product.rowNumber,
        name: "",
        message:
          "Product name is missing",
      });
    }

    if (!product.slug) {
      validationErrors.push({
        row: product.rowNumber,
        name: product.name,
        message:
          "Product slug is missing",
      });
    }

    if (product.price < 0) {
      validationErrors.push({
        row: product.rowNumber,
        name: product.name,
        message:
          "Product price cannot be negative",
      });
    }

    if (product.discountPrice < 0) {
      validationErrors.push({
        row: product.rowNumber,
        name: product.name,
        message:
          "Product discount price cannot be negative",
      });
    }

    if (product.stock < 0) {
      validationErrors.push({
        row: product.rowNumber,
        name: product.name,
        message:
          "Product stock cannot be negative",
      });
    }

    if (
      product.discountPrice > 0 &&
      product.discountPrice >=
        product.price
    ) {
      validationErrors.push({
        row: product.rowNumber,
        name: product.name,
        message:
          "Discount price must be lower than regular price",
      });
    }

    if (product.images.length === 0) {
      validationErrors.push({
        row: product.rowNumber,
        name: product.name,
        message:
          "Product image is missing",
      });
    }

    if (
      product.categories.length === 0
    ) {
      validationErrors.push({
        row: product.rowNumber,
        name: product.name,
        message:
          "Product category is missing",
      });
    }
  }

  if (validationErrors.length > 0) {
    return {
      success: false,

      summary: {
        total: products.length,
        created: 0,
        updated: 0,
        skipped: 0,
        failed:
          validationErrors.length,
      },

      errors: validationErrors,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | PREVIEW
  |--------------------------------------------------------------------------
  */

  if (preview) {
    const previewProducts = [];

    for (const product of products) {
      /*
       * Find category
       */
      let category = null;

      for (const categoryValue of
        product.categories) {
        category =
          await findCategory(
            categoryValue
          );

        if (category) {
          break;
        }
      }

      /*
       * Find duplicate
       */
      const existing =
        await findExistingProduct(
          product
        );

      previewProducts.push({
        row: product.rowNumber,

        name: product.name,

        slug: product.slug,

        sku:
          product.sku || "",

        price: product.price,

        discountPrice:
          product.discountPrice,

        stock: product.stock,

        categories:
          product.categories.map(
            (categoryValue) => ({
              value: categoryValue,

              name:
                category?.name ||
                categoryValue,

              found:
                Boolean(category),

              categoryId:
                category?._id ||
                null,
            })
          ),

        categoryFound:
          Boolean(category),

        categoryId:
          category?._id || null,

        categoryName:
          category?.name || null,

        existingProduct:
          Boolean(existing),

        currentStock:
          existing?.stock || 0,

        stockAfterImport:
          existing
            ? Number(
                existing.stock || 0
              ) +
              Number(
                product.stock || 0
              )
            : product.stock,

        images:
          product.images,

        thumbnail:
          product.images[0] || "",

        gallery:
          product.images.slice(1),

        variants:
          product.variants,

        isFeatured:
          product.isFeatured,

        isSale:
          product.isSale,

        isDeal:
          product.isDeal,
      });
    }

    return {
      success: true,

      preview: true,

      summary: {
        total:
          products.length,

        ready:
          previewProducts.filter(
            (product) =>
              product.categoryFound
          ).length,

        categoryMissing:
          previewProducts.filter(
            (product) =>
              !product.categoryFound
          ).length,

        duplicates:
          previewProducts.filter(
            (product) =>
              product.existingProduct
          ).length,
      },

      products:
        previewProducts,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | ACTUAL IMPORT
  |--------------------------------------------------------------------------
  */

  let created = 0;

  let updated = 0;

  let skipped = 0;

  const errors = [];

  for (const product of products) {
    try {
      /*
       * Find category
       */
      let category = null;

      for (const categoryValue of
        product.categories) {
        category =
          await findCategory(
            categoryValue
          );

        if (category) {
          break;
        }
      }

      /*
       * Product requires category
       */
      if (!category) {
        errors.push({
          row: product.rowNumber,

          name: product.name,

          message:
            product.categories.length
              ? `Category "${product.categories[0]}" not found`
              : "Product category is missing",
        });

        continue;
      }

      /*
       * Find duplicate
       */
      const existing =
        await findExistingProduct(
          product
        );

      /*
      |--------------------------------------------------------------------------
      | DUPLICATE PRODUCT
      |--------------------------------------------------------------------------
      |
      | Existing product:
      | increase stock only
      |
      */

      if (existing) {
        existing.stock =
          Number(
            existing.stock || 0
          ) +
          Number(
            product.stock || 0
          );

        /*
         * Fill missing category
         */
        if (!existing.category_id) {
          existing.category_id =
            category._id;
        }

        /*
         * Fill missing description
         */
        if (
          !existing.description &&
          product.description
        ) {
          existing.description =
            product.description;
        }

        /*
         * Fill missing thumbnail
         */
        if (
          !existing.thumbnail &&
          product.images.length > 0
        ) {
          existing.thumbnail =
            product.images[0];
        }

        /*
         * Fill missing gallery
         */
        if (
          (!existing.gallery ||
            existing.gallery.length ===
              0) &&
          product.images.length > 1
        ) {
          existing.gallery =
            product.images.slice(1);
        }

        /*
         * Fill missing variants
         */
        if (
          (!existing.variants ||
            existing.variants.length ===
              0) &&
          product.variants.length > 0
        ) {
          existing.variants =
            product.variants;
        }

        /*
         * Fill missing flags
         */
        if (
          existing.isFeatured ===
          undefined
        ) {
          existing.isFeatured =
            product.isFeatured;
        }

        if (
          existing.isDeal ===
          undefined
        ) {
          existing.isDeal =
            product.isDeal;
        }

        if (
          existing.isSale ===
          undefined
        ) {
          existing.isSale =
            product.isSale;
        }

        await existing.save();

        updated++;

        continue;
      }

      /*
      |--------------------------------------------------------------------------
      | NEW PRODUCT
      |--------------------------------------------------------------------------
      */

      await Product.create({
        name: product.name,

        slug: product.slug,

        category_id:
          category._id,

        price:
          product.price,

        discountPrice:
          product.discountPrice,

        stock:
          product.stock,

        thumbnail:
          product.images[0] || "",

        gallery:
          product.images.slice(1),

        description:
          product.description,

        variants:
          product.variants,

        /*
         * IMPORTANT:
         * Save product flags.
         */
        isFeatured:
          product.isFeatured,

        isDeal:
          product.isDeal,

        isSale:
          product.isSale,
      });

      created++;
    } catch (error) {
      console.error(
        `Product import failed: ${product.name}`,
        error
      );

      errors.push({
        row: product.rowNumber,

        name: product.name,

        message:
          error.message ||
          "Unknown error",
      });
    }
  }

  /*
  |--------------------------------------------------------------------------
  | RESULT
  |--------------------------------------------------------------------------
  */

  return {
    success: true,

    preview: false,

    summary: {
      total:
        products.length,

      created,

      updated,

      skipped,

      failed:
        errors.length,
    },

    errors,
  };
}

