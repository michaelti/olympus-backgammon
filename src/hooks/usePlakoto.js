import { useState } from "react";

const usePlakoto = () => {
    const [boardState, setBoardState] = useState({
        pips: [
            { size: 0, top: '', bot: '' },
            { size: 15, top: 'white', bot: 'white' },
            { size: 0, top: 'empty', bot: 'empty' },
            { size: 0, top: 'empty', bot: 'empty' },
            { size: 0, top: 'empty', bot: 'empty' },
            { size: 0, top: 'empty', bot: 'empty' },
            { size: 0, top: 'empty', bot: 'empty' },
            { size: 0, top: 'empty', bot: 'empty' },
            { size: 0, top: 'empty', bot: 'empty' },
            { size: 0, top: 'empty', bot: 'empty' },
            { size: 0, top: 'empty', bot: 'empty' },
            { size: 0, top: 'empty', bot: 'empty' },
            { size: 0, top: 'empty', bot: 'empty' },
            { size: 0, top: 'empty', bot: 'empty' },
            { size: 0, top: 'empty', bot: 'empty' },
            { size: 0, top: 'empty', bot: 'empty' },
            { size: 0, top: 'empty', bot: 'empty' },
            { size: 0, top: 'empty', bot: 'empty' },
            { size: 0, top: 'empty', bot: 'empty' },
            { size: 0, top: 'empty', bot: 'empty' },
            { size: 0, top: 'empty', bot: 'empty' },
            { size: 0, top: 'empty', bot: 'empty' },
            { size: 0, top: 'empty', bot: 'empty' },
            { size: 0, top: 'empty', bot: 'empty' },
            { size: 15, top: 'black', bot: 'black' },
        ],
        offWhite: 0,
        offBlack: 0,
        barWhite: 0,
        barBlack: 0,
    });

    const [moving, setMoving] = useState(false);
    const [sourcePip, setSourcePip] = useState(undefined);

    const moveChecker = (source, dest) => {
        let pips = [ ...boardState.pips ];
        let sourcePip = { ...pips[source] };
        let destPip = { ...pips[dest] };

        // Add checker to the destination pip
        destPip.size++;
        destPip.top = sourcePip.top;
        destPip.bot = destPip.size > 1 ? destPip.bot : sourcePip.top;
        pips[dest] = destPip;
        
        // Remove checker from the source pip
        sourcePip.size--;
        sourcePip.top = sourcePip.size > 1 ? sourcePip.top : sourcePip.bot;
        sourcePip.bot = sourcePip.size > 0 ? sourcePip.bot : 'empty';
        pips[source] = sourcePip;

        // Update the pips object in boardState with our mutated copy
        setBoardState({
            ...boardState,
            pips: pips
        });
    };

    const handleClickPip = (clickedPip) => {
        const clickedPipObj = boardState.pips[clickedPip];
        const sourcePipObj = boardState.pips[sourcePip];

        if (!moving) {
            if (clickedPipObj.size > 0) {
                // Start a move
                setMoving(true);
                setSourcePip(clickedPip);
            }
        } else if (sourcePip !== clickedPip ) {
            if (clickedPipObj.size <= 1 || (clickedPipObj.size > 1 && clickedPipObj.top === sourcePipObj.top)) {
                // Complete the started move
                moveChecker(sourcePip, clickedPip);
                setSourcePip(undefined);
                setMoving(false);
            }
        }
    };
    
    return [boardState, handleClickPip];
};

export default usePlakoto;
