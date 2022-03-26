const mongoose=require('mongoose')

const menuSchema=mongoose.Schema({
    nom:{
        type:String,
        required:true
    },
    prix:{
        type:Number,
        required:true
    },
    dispo:{
        type:Boolean,
        required:true,
        default:true
    }
})

module.exports=mongoose.model('Menu',menuSchema)