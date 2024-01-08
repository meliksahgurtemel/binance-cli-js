export const isRequired = input => (input === '' ? 'This value is required' : true);

export const isRequiredAndWithinRange = input => {
    if (input === '') {
        return 'This value is required';
    }
    if (!(input >= 1 && input <= 125)) {
        return 'This value should be between 1 and 125';
    }
    return true;
}

export const isRequiredAndCorrect = input => {
    if (input === '') {
        return 'This value is required';
    }
    if (
        input.toLowerCase() !== 'isolated' &&
        input.toLowerCase() !== 'crossed'
    ){
        return 'This value should be either crossed or isolated';
    }
    return true;
}
