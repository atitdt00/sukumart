import Category from "../../models/Category";

function clean(value) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
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

function getParentValue(row) {
  return clean(
    row.parent ||
      row.Parent ||
      row.parent_name ||
      row.parentName ||
      row.parent_slug ||
      ""
  );
}

function getCategoryName(row) {
  return clean(
    row.name ||
      row.Name ||
      row.category ||
      row.Category ||
      ""
  );
}

function getCategorySlug(row) {
  return clean(
    row.slug ||
      row.Slug ||
      ""
  );
}

export async function importCategories(rows, { preview = false } = {}) {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("No category data found");
  }

  const prepared = rows.map((row, index) => {
    const name = getCategoryName(row);

    const slug =
      getCategorySlug(row) ||
      createSlug(name);

    const parent = getParentValue(row);

    return {
      rowNumber: index + 2,
      name,
      slug,
      parent,
      originalRow: row,
    };
  });

  const errors = [];

  for (const item of prepared) {
    if (!item.name) {
      errors.push({
        row: item.rowNumber,
        message: "Category name is missing",
      });
    }

    if (!item.slug) {
      errors.push({
        row: item.rowNumber,
        message: "Category slug is missing",
      });
    }
  }

  if (errors.length > 0) {
    return {
      success: false,
      summary: {
        total: rows.length,
        created: 0,
        skipped: 0,
        failed: errors.length,
      },
      errors,
    };
  }

  /*
   * Preview mode:
   * Do not write anything to MongoDB.
   */
  if (preview) {
    return {
      success: true,
      preview: true,
      summary: {
        total: prepared.length,
        created: 0,
        skipped: 0,
        failed: 0,
      },
      categories: prepared.map((item) => ({
        row: item.rowNumber,
        name: item.name,
        slug: item.slug,
        parent: item.parent || "Main Category",
      })),
    };
  }

  let created = 0;
  let skipped = 0;
  const failed = [];

  /*
   * --------------------------------------------------
   * PASS 1
   * Create main categories first.
   * --------------------------------------------------
   */

  const mainCategories = prepared.filter(
    (item) => !item.parent
  );

  for (const item of mainCategories) {
    try {
      const existing = await Category.findOne({
        slug: item.slug,
      });

      if (existing) {
        skipped++;
        continue;
      }

      await Category.create({
        name: item.name,
        slug: item.slug,
        parent_id: null,
      });

      created++;
    } catch (error) {
      console.error(
        `Failed importing category: ${item.name}`,
        error
      );

      failed.push({
        row: item.rowNumber,
        name: item.name,
        message: error.message,
      });
    }
  }

  /*
   * --------------------------------------------------
   * PASS 2
   * Create child categories.
   * --------------------------------------------------
   */

  const childCategories = prepared.filter(
    (item) => item.parent
  );

  for (const item of childCategories) {
    try {
      let parentCategory = await Category.findOne({
        $or: [
          { slug: item.parent.toLowerCase() },
          { name: item.parent },
        ],
      });

      /*
       * Sometimes WooCommerce parent value may be
       * a category name while our DB contains a slug.
       */
      if (!parentCategory) {
        parentCategory = await Category.findOne({
          name: new RegExp(
            `^${escapeRegex(item.parent)}$`,
            "i"
          ),
        });
      }

      if (!parentCategory) {
        failed.push({
          row: item.rowNumber,
          name: item.name,
          message: `Parent category "${item.parent}" not found`,
        });

        continue;
      }

      const existing = await Category.findOne({
        slug: item.slug,
      });

      if (existing) {
        skipped++;
        continue;
      }

      await Category.create({
        name: item.name,
        slug: item.slug,
        parent_id: parentCategory._id,
      });

      created++;
    } catch (error) {
      console.error(
        `Failed importing child category: ${item.name}`,
        error
      );

      failed.push({
        row: item.rowNumber,
        name: item.name,
        message: error.message,
      });
    }
  }

  return {
    success: true,
    preview: false,
    summary: {
      total: prepared.length,
      created,
      skipped,
      failed: failed.length,
    },
    errors: failed,
  };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}