
export const hasSpecialChars = (input, invalidChars) => {
    var result = false;
    for (let i = 0; i < input.length; i++) {
        if (invalidChars.includes(input.charAt(i))) {
            result = true;
            break;
        }
    }

    return result;
}

export const specialChars = {
    chars: ['!', '@', '€', '#', '£', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '{', '[', '}', ']', ':', ';', '"', "'", '|', '<', ',', '>', '.', '?', '/', '\\', '~', '`'],
    webinarChars: ['@', '€', '#', '£', '$', '%', '^', '&', '*', '_', '+', '=', '{', '[', '}', ']', ';', '"', '|', '<', '>', '/', '\\', '~', '`']

}
