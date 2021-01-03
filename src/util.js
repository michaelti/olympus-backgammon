// Return a random numeric string of length n
exports.randomNumeric = (length) => {
    const num = Math.floor(Math.random() * 10 ** length);
    return num.toString().padStart(length, 0);
};

exports.range = (start, end, length = end - start + 1) =>
    Array.from({ length }, (_, i) => start + i);
