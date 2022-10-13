
const express = require('express')
const router = express.Router()
const adminHelper = require('../helper/admin-helper')

router.get('/',(req,res)=>{
    if(req.session.loggedin)
    {
        adminHelper.displayUser().then((user)=>{
        res.render('pages/admin-home',{admin:true,user})
    })}
    else{
        res.render('pages/admin-login',{admin:false})
    }    
    
})

router.post("/loginAction",(req,res)=>{
    adminHelper.doLogin(req.body).then((response)=>{
        if(response.status){
            req.session.loggedin = true
            adminHelper.displayUser().then((user)=>{
                res.render('pages/admin-home',{admin:true,user})
            })
            
        }
        else{
            res.redirect('/admin')
        }
    })
})

router.get('/logout',(req,res)=>{
    req.session.destroy(function(error){
        if(error){
          console.log(error)
          res.send("error")
        }else{
            res.redirect('/admin')

        }
      })
  })
   
router.get('/add-user',(req,res)=>{
    res.render('pages/add-user',{admin:true})
})

router.post('/add-user',(req,res)=>{
    console.log(req.body);
    adminHelper.insertUser(req.body,(response)=>{
        res.render('pages/add-home')
    })
})

router.get('/update-user',async(req,res)=>{
    let userid = req.query.id
    let user = await adminHelper.getUserDetails(userid)
    if(req.session.loggedin){
        res.render('pages/update-user',{admin:true,user})
    }
    else{
        res.render('pages/admin-login',{admin:true,user:false})
    }
})

router.post('/update-user/:id',(req,res)=>{
    adminHelper.updateUser(req.params.id,req.body).then(()=>{
      res.redirect('/admin')
    })
  })

  router.get('/delete',(req,res)=>{
    let userId = req.query.id
    adminHelper.deleteUser(userId).then((response)=>{
      res.redirect('/admin')
    })
  })
module.exports = router