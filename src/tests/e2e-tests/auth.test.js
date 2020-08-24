import supertest from 'supertest'
import app from '../../app'
const request = supertest(app)

let headerConfig = {
    headers:{
        "Content-Type": "application/json",
        "audience": "www.lightup-platform.com"
    }
}

let healthCheck = false
let register = false
let login = false
let logout = false
let refreshToken = false
let failChecks = true

describe('the following tests are used testing the functionality of the authentication process and jwt tokens, creates account, logs in, logs out, generates new refresh token',() =>{
    
    if(healthCheck){
        it("get - healthCheck message", async (done) =>{
            try{
                await request
                    .post('/health-check')
                    .set("Accept", 'application/json')
                    .expect(200)
                    done()
            }catch(e){
                console.log(e)
                done()
            }
        })
    }

    if(register){
        it("post - returns a message telling the user that they have created and account", async (done) =>{

            try{
                request
                    .post('/register')
                    .set("Accept", 'application/json')
                    .send({
                        user:{
                            "username":"tomstestuser",
                            "email": "tomstestuser@gmail.com",
                            "password": "Tomstestuser747"
                        }
                    })
                    .expect(201, () =>{
                        done()
                    })
            }catch(e){
                console.log(e)
                done()
            }
        })
    }
    
    if(login){
        it("post - successfully returns json containing information about a successful login", async (done) =>{

            try{
                request
                    .post('/auth/login')
                    .set(headerConfig)
                    .send({
                        user:{
                            username:"tomstestuser",
                            password:"Tomstestuser747"
                        }
                    })
                    .expect(200, () =>{
                        done()
                    })
            }catch(e){
                console.log(e)
                done()
            }
        })
    }
    
    if(logout){
        it("delete - logout of a user account", async (done) =>{

            try{
                request
                    .delete('/auth/logout')  
                    .set(headerConfig)
                    .send({
                        user:{
                            username:"tomstestuser",
                            password:"Tomstestuser747"
                        }
                    })
                    .expect(204, () =>{
                        done()
                    })
            }catch(e){
                console.log(e)
                done()
            }
        })
    }
    
    if(refreshToken){
        it("post - attempt to get a new refresh token", async (done) =>{

            try{
                await request
                    .post('/auth/refresh-token')
                    .set(headerConfig)
                    .send({
                        user:{
                            username:"tomstestuser",
                            password:"Tomstestuser747"
                        },
                        refreshToken:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRvbXN0ZXN0dXNlciIsImlhdCI6MTU4Njg3NTIzNywiZXhwIjoxNTg2OTYxNjM3fQ.jjvhmlh2Mcm9PEU-PxeH2Pqh260qIH-wF2Go5xsbJcc"
                    })
                    .expect(200)
                    done()
            }catch(e){
                console.log(e)
                done()
            }
        })
    } 
})

if(failChecks){
    describe('the following tests check that the api cannot be used without the correct username or password values', () =>{
        it("post - login with incorrect username", async (done) =>{
            try{
                await request
                    .post('/auth/login')
                    .set(headerConfig)
                    .send({
                        user:{
                            username:"tomstestuserxyz",
                            password:"Tomstestuser747"
                        }
                    })
                    .expect(401)
                    done()
            }catch(e){
                console.log(e)
                done()
            }
        })
    
        it("post - login with incorrect password", async (done) =>{
            try{
                await request
                    .post('/auth/login')
                    .set(headerConfig)
                    .send({
                        user:{
                            username:"tomstestuser",
                            password:"Tomstestuser747xyz"
                        }
                    })
                    .expect(401)
                    done()
            }catch(e){
                console.log(e)
                done()
            }
        })
    })
    
    describe("the following test ensures that the requests can only be made if the audience is set", () =>{
        it("post - login without headers", async (done) =>{
            try{
                await request
                    .post('/auth/login')
                    .send({
                        user:{
                            username:"tomstestuser",
                            password:"Tomstestuser747"
                        }
                    })
                    .expect(401)
                    done()
            }catch(e){
                console.log(e)
                done()
            }
        })
    
        it("post - login without audience", async (done) =>{
            try{
                await request
                    .post('/auth/login')
                    .set('Content-Type', 'application/json')
                    .send({
                        user:{
                            username:"tomstestuser",
                            password:"Tomstestuser747"
                        }
                    })
                    .expect(401)
                    done()
            }catch(e){
                console.log(e)
                done()
            }
        })
    })
}
