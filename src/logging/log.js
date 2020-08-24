import winston from 'winston'
import moment from 'moment'

export const errorlogger = winston.createLogger({
    transports:[
        new winston.transports.File({
            level:'error',
            filename:'errorLogs.log',
        })
    ]
})

export const eventLogger = winston.createLogger({
    transports:[
        new winston.transports.File({
            level:'info',
            filename:'eventLogs.log'
        })
    ]
})

export const routeLogger = winston.createLogger({
    transports:[
        new winston.transports.File({
            level:'info',
            filename:'routeCalls.log'
        })
    ]
})


export const createErrorLog = (route, message, method, parameters) =>{
    if(!route || !message || !method || !parameters){
        throw new Error("incorrect logging format")
    }
    parameters = JSON.stringify(parameters)
    return new errorLogSchema(route.path, message, method, parameters)
}


export const createEventLog = (eventDescription, eventData) =>{
    if(!eventDescription || !eventData){
        throw new Error("incorrect logging format")
    }
    eventData = JSON.stringify(eventData)
    return new eventLogSchema(eventDescription, eventData)
}


export const createRouteLog = (route) =>{
    if(!route){
        throw new Error("incorrect logging format")
    }
    return new routeLogSchema(route.path)
}


class errorLogSchema {
    constructor (route,message,method,parameters){
        this.timeStamp = moment().format()
        this.route = route,
        this.message = message,
        this.method = method,
        this.parameters = parameters
    }
}


class eventLogSchema {
    constructor(eventDescription,eventData){
        this.timeStamp = moment().format(),
        this.eventDescription = eventDescription,
        this.eventData = eventData
    }
}


class routeLogSchema {
    constructor(route){
        this.timeStamp = moment().format()
        this.route = route
    }
}