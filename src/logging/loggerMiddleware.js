import {routeLogger, createRouteLog} from './log'

const loggerMiddleware = (req,res,next) =>{
    routeLogger.log({
        level:"info",
        message:createRouteLog(req.originalUrl)
    })
    next()
}

export default loggerMiddleware