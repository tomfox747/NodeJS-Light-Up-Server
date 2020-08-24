import moment from 'moment'
import { webinarPageError, webinarPageErrorConst } from '../errorHandling/pages/pages';

const verifyDateTime = (webinarObject) => {

    return new Promise((success, fail) => {
        const startTime = webinarObject.scheduledTime
        const endTime = webinarObject.expiredTime

        //get the unix value of the current date and time in seconds
        const now = Math.round(moment().valueOf() / 1000)
        const nowDate = moment() // get current date time

        //check that the start and end times are not in the past (before now)
        if (startTime < now || endTime < now) {
            //error
            fail(new webinarPageError('unable to verify webinar, invalid start or end times', 406, webinarPageErrorConst.identifier.dates, webinarPageErrorConst.context.invalidDates))
            return
        }

        //check that the start and end times are within a month of now
        const oneMonthFromNow = moment(nowDate).add(1, 'months') // add 1 month to current date time
        const oneMonthFromNowUnix = Math.round(moment(oneMonthFromNow).valueOf() / 1000) // get the unix value of 1 month in advance
        if (startTime > oneMonthFromNowUnix || endTime > oneMonthFromNowUnix) {
            //error
            fail(new webinarPageError('unable to verify webinar, invalid start or end times', 406, webinarPageErrorConst.identifier.dates, webinarPageErrorConst.context.invalidDates))
            return
        }

        //check that the end time is between 1 and 3 hours after the start time
        const startTimeString = moment.unix(startTime)
        const minimumEndTime = moment(startTimeString).add(1, 'hours') //timestamp of startTime + 1 hour
        const maximumEndTime = moment(startTimeString).add(3, 'hours') //timestamp of endTime + 3 hours
        const minimumEndTimeUnix = Math.round(moment(minimumEndTime).valueOf() / 1000) //converted to unix
        const maximumEndTimeUnix = Math.round(moment(maximumEndTime).valueOf() / 1000) //converted to unix

        if (endTime < minimumEndTimeUnix || endTime > maximumEndTimeUnix) {
            //error
            fail(new webinarPageError('unable to verify webinar, invalid start or end times', 406, webinarPageErrorConst.identifier.dates, webinarPageErrorConst.context.invalidDates))
            return
        }

        success(true)
    })

}

export default verifyDateTime