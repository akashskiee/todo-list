var today = new Date();
exports.getDate = () => {
var options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
}
return today.toLocaleDateString('en-IN', options);
}

exports.getYear = () => {
    return today.getFullYear();
}