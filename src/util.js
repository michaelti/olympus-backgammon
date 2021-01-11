exports.range = (start, end, length = end - start + 1) =>
    Array.from({ length }, (_, i) => start + i);
