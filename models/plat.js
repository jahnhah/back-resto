const mongoose=require('mongoose')
const Restaurant = require('./restaurant')

const platSchema=mongoose.Schema({
    nom:{
        type:String,
        required:true
    },
    prix:{
        type:Number,
        required:true
    },
    restaurant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'restaurant',
        required:true
    }
    // image
})

module.exports=mongoose.model('Plat',platSchema)