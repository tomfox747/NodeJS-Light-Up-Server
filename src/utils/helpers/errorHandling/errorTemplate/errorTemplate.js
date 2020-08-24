
class TemplateError {
    constructor(name, message, statusCode, identifier, context) {
        this.message = `API Response: ${message}`
        this.name = name;
        this.errorType = 'custom';
        statusCode ? this.statusCode = statusCode : this.statusCode = 500;
        identifier ? this.identifier = identifier : this.identifier = undefined;
        context ? this.context = context : this.context = undefined;
    }
}

export default TemplateError;