/* eslint-disable eqeqeq */
import { db } from "../database.config"
import { addDoc,query,where,collection,getDocs } from "firebase/firestore"

export const CheckVendorData = (name,email,mobile,password,securityOne,securityQuestionOne,securityTwo,securityQuestionTwo,securityKey) => {
    if(!name||!email||!mobile||!password||!securityKey)
    {
        alert("Fill information first!!")
        return false
    }
    if(email.includes("@gmail.com") === false) {
        if(email.includes("@thapar.edu") === false) {
            if(email.includes("@outlook.com") === false) {
                alert("Error: E Mail format not correct/not supported!!")
                return false
            }
        }
    }
    for(let i=0;i<mobile.length;i++)
    {
        if(isNaN(mobile[i]))
        {
            console.log(isNaN(mobile[i]))
            alert("Mobile Number should contain only numbers")
            return false
        }
    }

    if(mobile.length!=10)
    {
        alert("Length of mobile number should be 10")
        return false
    }

    if(password.match(/[A-Z]/g) != null) {
      if(password.match(/[a-z]/g) != null) {
        if(password.match(/[0-9]/g) != null) {
          if(password.length >= 8) { }
            else {
              alert( "Error: Length of password should be greater than or equal to 8!!");
              return false
            }
          }
        else {
          alert("Error: Password should contain atleast one number!!");
          return false
        }
      }
      else {
        alert("Error: Password should contain atleast one lowercase letter!!");
        return false
      }
    }
    else {
      alert("Error: Password should contain atleast one uppercase letter!!");
      return false
    }

    if(securityQuestionOne==""||securityQuestionOne==null||securityQuestionOne==undefined)
    {
      alert("Error: Security Question 1 not filled!!")
      return false
    }

    if(securityQuestionTwo==""||securityQuestionTwo==null||securityQuestionTwo==undefined)
    {
      alert("Error: Security Question 2 not filled!!")
      return false
    }

    if(securityQuestionOne==securityQuestionTwo)
    {
      alert("Error: Security Questions need to be different!!")
      return false
    }

    if(securityOne==""||securityOne==null||securityOne==undefined)
    {
      alert("Error: Answer of security question 1 not filled!!")
      return false
    }

    if(securityTwo==""||securityTwo==null||securityTwo==undefined)
    {
      alert("Error: Answer of security question 2 not filled!!")
      return false
    }

    return true
}

export const EnterVendorData = (name,email,mobile,password,securityOne,securityQuestionOne,securityTwo,securityQuestionTwo,securityKey) => {
  return new Promise(async(resolve,reject)=>{
    var flag=0;
    let q = query(collection(db, "vendors"), where("userName", "==", name))
    let dupUser = await getDocs(q);
    dupUser.forEach(doc => {
      flag=1
      alert("User Name already exists!!")
      reject("User Name already exists!!")
      return
    })
    if(flag===1) return
    flag=0
    q = query(collection(db, "vendors"), where("email", "==", email))
    dupUser = await getDocs(q);
    dupUser.forEach(doc => {
        flag=1
        alert("E-Mail already exists!!")
        reject("E-Mail already exists!!")
        return
    })
    if(flag===1) return
    let data={
      userName:name,
      email:email,
      mobileNo:mobile,
      password:password,
      restaurant:"null",
      token:"null",
      securityOne:securityQuestionOne+" "+securityOne,
      securityTwo:securityQuestionTwo+" "+securityTwo,
      securityKey:securityKey
    }
    await addDoc(collection(db,"vendors"),data).then(res=>{
      resolve("Vendor successfully registered")
      return
    }).catch(e=>{
      reject("Problem registering vendor. Please try again")
      return
    })
  })
}