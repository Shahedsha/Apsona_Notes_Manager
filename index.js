const mongoose=require("mongoose");
const bodyParser=require("body-parser")
const express=require("express");
const NotesModel=require("./models/notes");
const TrashModel=require("./models/trash");
const UserModel=require("./models/users");
const LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");
const cookieparser = require('cookie-parser')
const app=express();
const PORT=3050;

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(bodyParser.json())
app.use(cookieparser())

const dbUrl="mongodb+srv://Shahid:idiot@mongo.yv6djp0.mongodb.net/Apsona?retryWrites=true&w=majority";
const connectionParams={
    useNewUrlParser:true,
    useUnifiedTopology:true
};
mongoose
    .connect(dbUrl,connectionParams)
    .then(()=>{
        console.info("connected to db");
    })
    .catch(()=>{
        console.log("Errror:");
    });

  
app.listen(PORT,()=>{
        console.log(`Listening on PORT: ${PORT}`)
    })

     app.get("/", (req,res)=>{
        var user= req.cookies.Userstatus;
        
        NotesModel.find({userId:user})
        .then(result=>{
            res.render("index",{data:result,data1:user});
        })
     })

     app.get("/login",(req,res)=>{
        res.render("login")
     })
     app.get("/logout",(req,res)=>{
        var user = req.cookies.Userstatus;
          localStorage.removeItem(user)
          res.clearCookie("Userstatus");
            res.redirect("/");
    })



     app.post("/login",(req,res)=>
     {
        const email=req.body.email
        const password=req.body.password
        UserModel.findOne({email:req.body.email})
            .then((result)=>{
                if(result){
                    if(password==result.password){
                        const result1=result
                        res.cookie("Userstatus",email)
                        var user = req.cookies.Userstatus;
                        localStorage.setItem(email,JSON.stringify(result));
                        res.redirect('/')
                    }
                    else{
                        res.json("Enter correct password")
                    }
                }
                else{
                    res.render("register")
                }
            })
    })



    app.get("/register",(req,res)=>{
          
        res.render("register");
    })
    app.post("/register",(req,res)=>
    {
        UserModel.findOne({ email:req.body.email})
        .then((result)=>{
            if(result){
              res.render("login",{data:result})
            }
            else{
                  const user=new UserModel()
                  user.name=req.body.name;
                  user.email=req.body.email;
                  user.password=req.body.password;
                  user.save()
                  res.redirect("/login")
              }
            })
        })

 

    app.get("/delete/:id",(req,res)=>{
        NotesModel.findById(req.params.id)
        .then((result)=>{
            var trashModel=new TrashModel()
            trashModel.userId=result.userId;
            trashModel.note=result.note;
            trashModel.tags=result.tags;
            trashModel.save()
            .then(()=>{
                NotesModel.findByIdAndDelete(req.params.id)
                    .then(()=>{
                    res.redirect('/')
                })
        .catch((err)=>{
            res.status(500).send(err)
        })
            })
        })
        
    })


    app.get("/change/:id",(req,res)=>{
        let dumbo=req.params.id;
        NotesModel.findById(dumbo)
            .then((result)=>{
                var sha=result.backgroundColor
                if (sha=="#a4e8e8") {
                    let a="#e8a4d8";
                    NotesModel.findByIdAndUpdate(dumbo,{backgroundColor:a})
                    .then(()=>{
                        res.redirect('/')
                    })
                } else {
                    let a="#a4e8e8";
                    NotesModel.findByIdAndUpdate(dumbo,{backgroundColor:a})
                    .then(()=>{
                        res.redirect('/')
                    })
                }
                 
            })
            
    })


  app.get("/trash",(req,res)=>{
    var user= req.cookies.Userstatus;
        TrashModel.find({userId:user})
        .then(result=>{
            res.render("trash",{data:result,data1:user});
        })
  })


app.get("/new",(req,res)=>{
    var user= req.cookies.Userstatus;
    if (!user) {
        res.send("please login to continue")
    }
    res.render("add",{data1:user})
})


app.post("/new",(req,res)=>{
    var noteModel=new NotesModel()
    noteModel.userId=req.cookies.Userstatus;
    noteModel.note=req.body.note;
    noteModel.tags=req.body.tags.split(",");
    noteModel.save()
    .then((data)=>{
        res.redirect("/");
    })
    .catch((err)=>{
        res.send("Sorry, You can only give upto 9 Tags")
    })
})



app.post("/searchbar",(req,res)=>{
    var user= req.cookies.Userstatus;
    NotesModel.find({userId:user,$or: [{ note:{ $regex: req.body.search, $options: 'i' } },{tags: { $elemMatch: { $regex: req.body.search, $options: 'i' } }}]})
    .then((result)=>{
        res.render("index",{data:result,data1:user})
    })
    .catch((err)=>{
        console.log(err)
    })
})

app.post("/trashsearchbar",(req,res)=>{
    var user= req.cookies.Userstatus;
    TrashModel.find({userId:user,$or: [{ note:{ $regex: req.body.search, $options: 'i' } },{tags: { $elemMatch: { $regex: req.body.search, $options: 'i' } }}]})
    .then((result)=>{
        res.render("trash",{data:result,data1:user})
    })
    .catch((err)=>{
        console.log(err)
    })
})