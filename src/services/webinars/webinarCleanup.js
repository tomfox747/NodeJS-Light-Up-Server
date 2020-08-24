import webinarModel from '../../schemas/webinarSchema'
import activeStatuses from '../../utils/helpers/constants/webinarActiveStatuses'
import { webinarPageError, webinarPageErrorConst } from '../../utils/helpers/errorHandling/pages/pages'
import moment from 'moment'
import { logger, formatErrorLog } from '../../logging/log'

const webinarCleanup = async () => {

    //get now moment, these return the local time stamp in dateString and unix
    //when getting test values from the online converter make sure you use local time
    let now = moment()
    let nowUnix = Math.round(moment().valueOf() / 1000)
    let sixHoursFromNow = moment(now).add(6, 'hours')
    let sixHoursFromNowUnix = Math.round(moment(sixHoursFromNow).valueOf() / 1000)

    try {
        /**
         * use mongoose to check for webinars that have scheduledTimes before now & expiredTimes after now
         * if webinar fits into this category, update the activeStatus to active
         */
        await webinarModel.updateMany(
            {
                $and: [
                    { scheduledTime: { $lte: nowUnix } },
                    { expiredTime: { $gt: nowUnix } }
                ]
            },
            {
                $set: { activeStatus: activeStatuses.active }
            }
        ).exec().then((doc, error) => doc);



        /**
         * use mongoose to check for webinars that have expiredTimes before now
         * if webinar fits into this category, update the activeStatus to expired
         * (optional) move webinar from webinars collection to webinarArchive
         */
        await webinarModel.updateMany(
            {
                expiredTime: { $lte: nowUnix }
            },
            {
                $set: { activeStatus: activeStatuses.expired }
            }
        ).exec().then((doc, error) => doc)

        /**
         * use mongoose to check for webinars that are starting less than 6 hours from now
         * if webinar fits into  this  catefory, update activeStatus to upcoming 
         */
        await webinarModel.updateMany(
            {
                $and:[
                    {scheduledTime: {$gte: nowUnix}},
                    {scheduledTime: {$lte: sixHoursFromNowUnix}}
                ]
            },
            {
                $set: { activeStatus: activeStatuses.upComing }
            }
        )

        return
    } catch (err) {
        throw (new webinarPageError('Error updating webinar statuses', 500, webinarPageErrorConst.identifier.webinar, webinarPageErrorConst.context.statusUpdateError))
    }
}

export default webinarCleanup