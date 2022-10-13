const db = require('../config/connection')
const bcrypt = require('bcrypt')
const { resolve } = require('path')
const { ObjectId } = require('mongodb')

module.exports = {
    doLogin:(admindata)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus = false
            let response = {}
            console.log(admindata);
            let admin = await db.get().collection('details').findOne({username:admindata.username})
            if(admin)
            {
                bcrypt.compare(admindata.password,admin.password).then((status)=>{
                    if(status){
                        response.user = admin
                        response.status = true
                        resolve(response)
                    }
                    else{
                      resolve({status:false})
                    }
                })
            }
            else{
                resolve({status:false})
            }
        })

    },
    insertUser:(userdata)=>{
        return new Promise(async(resolve,reject)=>{
            userdata.password = await bcrypt.hash(userdata.password,10)
            userdata.confirm_password = await bcrypt.hash(userdata.confirm_password,10)
         db.get().collection('userdatacollection').insertOne(userdata).then((data)=>{
            resolve.apply(data)
         })
        })
    },
    displayUser:()=>{
        return new Promise(async(resolve,reject)=>{
         let user = await db.get().collection('userdatacollection').find().toArray()
         resolve(user)
        })
    },
    getUserDetails:(userid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('userdatacollection').findOne({_id:ObjectId(userid)}).then((user)=>{
                resolve(user)
            })
        })
    },
    updateUser:(userId,userDetails)=>{
        return new Promise((resolve,reject)=>{
          db.get().collection('userdatacollection').updateOne({_id:ObjectId(userId)},{
            $set:{
              userFname: userDetails.userFname,
              userLname: userDetails.userLname,
              userEmail: userDetails.userEmail,
              userPassword: userDetails.userPassword,
              userConfirmPassword: userDetails.userConfirmPassword
            }
          }).then((response)=>{
            resolve()
         })
       })
    },
    deleteUser:(userId)=>{
        return new Promise(async(resolve,reject)=>{
          db.get().collection('userdatacollection').deleteOne({_id:ObjectId(userId)}).then((response)=>{
            resolve(response)
         })
      })
    }
}
