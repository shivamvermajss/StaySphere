const express= require( "express");
const app = express();
const mongoose = require("mongoose");
const Listing = require( "./models/listing.js")
const path= require ( "path");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");



main().then(()=>{
    console.log( " connected to db");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/StaySphere')
} 
app.set( "view engine", "ejs");
app.set( "views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname ,"/public")));


    


app.get("/", (req,res)=>{
    res.send( " hi i am root ");
});
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
});

app.post ("/listings", async (req,res)=>{
    const newListing= new Listing (req.body.listing);
    await newListing.save();
    res.redirect("/listings")
    
});


app.get("/listings", async (req,res)=>{
   const allListings= await Listing.find({});
   res.render("listings/index.ejs",{allListings});
     

  
});

app.get("/listings/:id",async(req,res)=>{
    let{id}= req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});


// app.get("/testListing",  async(req,res)=>{
//     let sampleListing= new Listing({
//         title: "My new villa",
//         description: " by the beach ",
//         price: 21000,
//         location: " calangute , goa ",
//         country : " India",
//     });
//     await sampleListing.save();
//     console.log( "sample was saved");
//     res.send( " sucessful testing");

// edit route 
app.get("/listings/:id/edit",async(req,res)=>{
        let{id}= req.params;
        const listing= await Listing.findById(id);
        res.render("listings/edit.ejs", {listing});


});
app.put("/listings/:id",async(req,res)=>{
    let{id}= req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);

});
app.delete("/listings/:id",async(req,res)=>{
    let{id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});


// });
app.listen(8080,()=>{
    console.log( "server is listening on port 8080");
});
