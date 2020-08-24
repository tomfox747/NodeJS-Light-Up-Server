const createVideoObject = (data, userName) =>{
    let videoObject = {
        ID:data.id, // youtube video ID
        title:data.snippet.title, // video title
        description:data.snippet.description, // video description
        publishedAt:data.snippet.publishedAt, // date time string
        author:userName, // light up username
        lightUps:0 // light up clicks
    }
    return videoObject
}

export default createVideoObject