import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Product from "../../../models/Product";
import Category from "../../../models/Category";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category_id = searchParams.get("category_id");
    const search = searchParams.get("search");
    const filter = {};
    if (category_id) {
      filter.category_id = category_id;
    }
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }
    const products = await Product.find(filter)
      .populate({
        path: "category_id",
        select: "name slug parent_id",
        populate: {
          path: "parent_id",
          select: "name slug",
        },
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const formData= await request.formData();
    
    const name= formData.get("name");
    const slug= formData.get("slug");
    const price= Number(formData.get("price"));
    const stock= Number(formData.get("stock"));
    const category_id= formData.get("category_id") || null;

  const file = formData.get("thumbnail");
  let thumbnail= "";
  if(file && file.size> 0){
    const bytes= await file.arrayBuffer();
    const buffer= Buffer.from(bytes);
  }



    //required field
    if (!name || !slug || !category_id || price === undefined || !thumbnail) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, Slug, Category_id, Price and thumbnail are required",
        },
        {
          status: 400,
        },
      );
    }

    // check category
    const category = await Category.findById(category_id);
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        {
          status: 404,
        },
      );
    }

    //check duplicate slug

    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Product already exists",
        },
        {
          status: 409,
        },
      );
    }

    const product = await Product.create({
      name,
      slug,
      category_id,
      price,
      discountPrice,
      thumbnail,
      gallery,
      stock,
      description,
    });

    //Populate category in response

    const populatedProduct = await Product.findById(product._id).populate({
      path: "category_id",
      select: "name slug parent_id",
      populate: {
        path: "parent_id",
        select: "name slug",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "product created successfully",
        product: populatedProduct,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
