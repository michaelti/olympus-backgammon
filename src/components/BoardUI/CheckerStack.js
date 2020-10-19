import React from "react";
import Checker from "./Checker";
import useMeasure from "react-use-measure";
import { ResizeObserver } from "@juggle/resize-observer";
import styled from "styled-components";
import { useTransition, animated } from "react-spring";
import domRefs from "./domRefs";

const Stack = styled.div`
    height: 100%;
    display: flex;
    flex-direction: ${(props) => (props.reverse ? "column-reverse" : "column")};
`;

function CheckerStack({ size, top, bot, reverse, pipNum, recentMove, isSource }) {
    const checkers = Array.from({ length: size }, (_item, i) => ({
        color: i === 0 ? bot : top,
        index: i,
    }));

    const [divRef, divBounds] = useMeasure({ scroll: true, polyfill: ResizeObserver });

    const checkerSize = divBounds.width;
    const overflow = checkers.length * checkerSize - divBounds.height;
    const squishAmount = overflow > 0 ? overflow / (checkers.length - 1) : 0;

    let animateFrom = null;
    if (recentMove.to === pipNum) animateFrom = recentMove.from;
    else if (recentMove.subMove?.to === pipNum) animateFrom = recentMove.subMove.from;

    /** */
    const transitions = useTransition(checkers, (item) => `${item.index}${item.color}`, {
        from: (item) => {
            if (animateFrom === null) return;

            if (!domRefs[animateFrom][item.color]) return;
            const from = domRefs[animateFrom][item.color].getBoundingClientRect();

            const toLeft = divBounds.left;
            let toTop = reverse
                ? divBounds.bottom - checkerSize - (checkers.length - 1) * checkerSize
                : divBounds.top + (checkers.length - 1) * checkerSize;

            const translateX = from.left - toLeft;
            const translateY = from.top - toTop;

            return {
                top: translateY,
                left: translateX,
                zIndex: 1,
                position: "relative",
            };
        },
        enter: (item) => {
            if (!divBounds.height) return; // Don't animate on the first render
            return {
                top: reverse ? squishAmount * item.index : -squishAmount * item.index,
                left: 0,
                zIndex: 0,
                position: "relative",
            };
        },
        update: (item) => {
            return {
                top: reverse ? squishAmount * item.index : -squishAmount * item.index,
                left: 0,
                zIndex: 0,
                position: "relative",
            };
        },
        // Unmount instantly:
        leave: { visibility: "hidden" },
        config: (_key, state) => state === "leave" && { duration: 0 },
    });

    return (
        <Stack ref={divRef} reverse={reverse}>
            {transitions.map(({ item, props, key }, i) => (
                <animated.div
                    key={key}
                    style={props}
                    ref={(el) => {
                        if (i === checkers.length - 1) domRefs[pipNum][item.color] = el;
                    }}>
                    <Checker color={item.color} glow={isSource && i === checkers.length - 1} />
                </animated.div>
            ))}
        </Stack>
    );
}

export default CheckerStack;
