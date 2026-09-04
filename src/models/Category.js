import mongoose from "mongoose";


const categorySchema= new mongoose.Schema({
    name: {
        type:String,
        required: true,
        unique: true,
        trim: true,
    },
    slug:{
        type:String,
        required: true,
        lowercase:true,
        trim: true,
        unique: true,
    },
    image: {
        type: String,
        default: "/image/products/health_tool_1.jpg",
    },
    parent_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null,
    }

},
    {
        timestamps:true
    }
)

const Category= mongoose.models.Category || mongoose.model('Category', categorySchema)

export default Category;