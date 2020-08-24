import supertest from 'supertest'
import app from '../../app'
import moment from 'moment'
const request = supertest(app)

let now = moment()

let headerConfig = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRvbXN0ZXN0dXNlciIsImlhdCI6MTU4NjkzNDYyNywiYWNjZXNzTGV2ZWwiOlsic3RhbmRhcmQtdXNlciIsImFkbWluIl0sImV4cCI6MTU4NzAyMTAyN30.QbqkOF2NnrLuy_9VlyjZDIAjwkIlwEbCCJ_JKCSmmz0',
    'audience': 'www.lightup-platform.com'
}

let healthCheck = false
let uploadWebinar = true
let retrieveWebinars = true
let failChecks = true

describe("create a correct webinar", () =>{
    
    if(healthCheck){
        it("get - healthCheck message", async (done) =>{
            try{
                await request
                    .post('/health-check')
                    .set("Accept", 'application/json')
                    .expect(200)
                    .expect(({res}) =>{
                        expect(res.text).toBe("Health Check Success!")
                    })
                    done()
            }catch(e){
                console.log(e)
                done()
            }
        })
    }
    
    if(uploadWebinar){
        it("post - correct webinar", async (done) =>{

            const now = moment()
            let startTime = moment(now).add(10, 'hours')
            let endTime = moment(now).add(12,'hours')
            startTime = Math.round(moment(startTime).valueOf() / 1000)
            endTime = Math.round(moment(endTime).valueOf() / 1000)
    
            try{
                request
                    .post('/webinars/create')
                    .set(headerConfig)
                    .send({
                        "webinarObject":{
                            "host":"test host",
                            "url":"www.azoomsite.com",
                            "title":"correct webinar",
                            "description":"webinar description",
                            "scheduledTime":startTime,
                            "expiredTime":endTime,
                            "activeStatus":"upComing"   
                        }
                    })
                    .expect(406)
                    done()
            }catch(e){
                console.log(e)
                done()
            }
        })
    }
    
    if(retrieveWebinars){
        it("get - retrieve all webinars", async (done) =>{

            try{
                await request
                    .get('/webinars/retrieve')
                    .set(headerConfig)
                    .expect(200)
                    done()
            }catch(e){
                console.log(e)
                done()
            }
        })
    }

    if(failChecks){
        it("post - incorrect webinar, start date and end date are in the past", async (done) =>{

            const now = moment()
            let startTime = moment(now).subtract(12, 'hours')
            let endTime = moment(now).subtract(10,'hours')
            startTime = Math.round(moment(startTime).valueOf() / 1000)
            endTime = Math.round(moment(endTime).valueOf() / 1000)
    
            try{
                await request
                    .post('/webinars/create')
                    .set(headerConfig)
                    .send({
                        "webinarObject":{
                            "host":"test host",
                            "url":"www.azoomsite.com",
                            "title":"correct webinar",
                            "description":"webinar description",
                            "scheduledTime":startTime,
                            "expiredTime":endTime,
                            "activeStatus":"upComing"   
                        }
                    })
                    .expect(406)
                    done()
            }catch(e){
                console.log(e)
                done()
            }
        })
        
        
        it("post - incorrect webinar, start or end time is over 1 month in the future", async (done) =>{
    
            let now = moment()
            let startTime = moment(now).add(1, 'months')
            let endTime = moment(now).add(1, 'months').add(2, 'hours')
            startTime = Math.round(moment(startTime).valueOf() / 1000)
            endTime = Math.round(moment(endTime).valueOf() / 1000)
        
            try{
                await request
                    .post('/webinars/create')
                    .set(headerConfig)
                    .send({
                        "webinarObject":{
                            "host":"test host",
                            "url":"www.azoomsite.com",
                            "title":"correct webinar",
                            "description":"webinar description",
                            "scheduledTime":startTime,
                            "expiredTime":endTime,
                            "activeStatus":"upComing"
                        }
                    })
                    .expect(406)
                    done()
            }catch(e){
                console.log(e)
                done()
            }
        })
        
        
        it("post - create a webinar with the end time less than 1 hour from the start time", async (done)  =>{
    
            let now = moment()
            let startTime = moment(now).add(10, 'hours')
            let endTime = moment(startTime).add(30,'minutes')
            startTime = Math.round(moment(startTime).valueOf() / 1000)
            endTime  = Math.round(moment(endTime).valueOf() / 1000)
            
            try{
                await request
                    .post('/webinars/create')
                    .set(headerConfig)
                    .send({
                        "webinarObject":{
                            "host":"test host",
                            "url":"www.azoomsite.com",
                            "title":"correct webinar",
                            "description":"webinar description",
                            "scheduledTime":startTime,
                            "expiredTime":endTime,
                            "activeStatus":"upComing"
                        }
                    })
                    .expect(406)
                    done()
            }catch(e){
                console.log(e)
                done()
            }
    
        })
    
        it("post - create a webinar with the  end time over 3 hours after the start time", async (done) =>{
    
            let now = moment()
            let startTime = moment(now).add(10, 'hours')
            let endTime = moment(startTime).add(15, 'hours')
            startTime = Math.round(moment(startTime).valueOf() / 1000)
            endTime = Math.round(moment(endTime).valueOf() / 1000)
    
            try{
                await request
                    .post('/webinars/create')
                    .set(headerConfig)
                    .send({
                        "webinarObject":{
                            "host":"test host",
                            "url":"www.azoomsite.com",
                            "title":"correct webinar",
                            "description":"webinar description",
                            "scheduledTime":startTime,
                            "expiredTime":endTime,
                            "activeStatus":"upComing"
                        }
                    })
                    .expect(406)
                    done()
            }catch(e){
                console.log(e)
                done()
            }
        })
    }
    

    
})