import supertest from 'supertest'
import app from '../../app'
const request = supertest(app)

let headerConfig = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRvbXN0ZXN0dXNlciIsImlhdCI6MTU4NjkzNDYyNywiYWNjZXNzTGV2ZWwiOlsic3RhbmRhcmQtdXNlciIsImFkbWluIl0sImV4cCI6MTU4NzAyMTAyN30.QbqkOF2NnrLuy_9VlyjZDIAjwkIlwEbCCJ_JKCSmmz0',
    'audience':'www.lightup-platform.com' 
}

let healthCheck = false
let getPodcasts = true
let getAccessToken = true
let saveVideoObject = true
let failChecks = false

describe("these tests will test the functionality of retrieving videos, and adding videos to the database", () =>{

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

    if(getPodcasts){
        it("get - get all of the podcast videos from the database", async (done) =>{

            try{
                await request
                    .get('/video/retrieve-podcasts')
                    .set(headerConfig)
                    .expect(200)
                    done()
            }catch(e){
                console.log(e)
                done()
            }
        })    
    }
    
    if(getAccessToken){
        it("get - get a new access token from the google api", async (done) =>{
            try{
                await request
                    .get('/video/get-youtube-access-token')
                    .set(headerConfig)
                    .send({
                        "pageName":"podcast"
                    })
                    .expect(200)
                    done()
            }catch(e){
                console.log(e)
                done()
            }
        })
    }
    
    if(saveVideoObject){
        it("post - save a video object to the database", async (done) =>{
            try{
                await request
                    .post('/video/save-video-object')
                    .set(headerConfig)
                    .send({
                        "videoObject":{
                            "ID":"123h4jkl",
                            "title":"title",
                            "description":"description",
                            "publishedAt":"date goes here",
                            "author":"tomfox",
                            "lightUps":"0"
                        },
                        "pageName":"podcasts"
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