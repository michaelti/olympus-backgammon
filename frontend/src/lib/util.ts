export const getDistance = (fromX: number, fromY: number, toX: number, toY: number) => {
    const dX = fromX - toX;
    const dY = fromY - toY;
    const distance = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
    return { distance, dX, dY };
};
