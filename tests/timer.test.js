'use strict';

const { formatTime, initTimer } = require('../app/src/main/assets/timer');

function makeDom() {
    return {
        timeDisplay:     { textContent: '' },
        setCountDisplay: { textContent: '' },
        setTotalDisplay: { textContent: '' },
        timerLabel:      { style: { display: '' }, textContent: '' },
        completeSetBtn:  { disabled: false, style: { opacity: '', cursor: '', display: '' } },
        resetBtn:        { style: { display: '' } },
        resetAllBtn:     { style: { display: '' } },
    };
}

// ---------------------------------------------------------------------------
// formatTime
// ---------------------------------------------------------------------------

describe('formatTime', () => {
    test('formats 0 seconds as 00:00', () => expect(formatTime(0)).toBe('00:00'));
    test('formats seconds only',        () => expect(formatTime(45)).toBe('00:45'));
    test('formats 60 seconds as 01:00', () => expect(formatTime(60)).toBe('01:00'));
    test('formats minutes and seconds', () => expect(formatTime(90)).toBe('01:30'));
    test('pads single-digit seconds',   () => expect(formatTime(65)).toBe('01:05'));
    test('formats large values',        () => expect(formatTime(600)).toBe('10:00'));
});

// ---------------------------------------------------------------------------
// initTimer — state transitions
// ---------------------------------------------------------------------------

describe('initTimer state', () => {
    let dom;

    beforeEach(() => {
        jest.useFakeTimers();
        dom = makeDom();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('initial setCount is 0', () => {
        const timer = initTimer(dom);
        expect(timer.getState().setCount).toBe(0);
    });

    test('setTotalDisplay shows TARGET_SETS', () => {
        initTimer(dom, { targetSets: 5 });
        expect(dom.setTotalDisplay.textContent).toBe('5');
    });

    test('completeSet increments setCount', () => {
        const timer = initTimer(dom);
        timer.completeSet();
        expect(timer.getState().setCount).toBe(1);
    });

    test('completeSet starts rest timer', () => {
        const timer = initTimer(dom);
        timer.completeSet();
        expect(timer.getState().isResting).toBe(true);
    });

    test('completeSet is blocked while resting', () => {
        const timer = initTimer(dom);
        timer.completeSet();
        timer.completeSet(); // should be ignored
        expect(timer.getState().setCount).toBe(1);
    });

    test('resetExercise resets all state', () => {
        const timer = initTimer(dom);
        timer.completeSet();
        timer.resetExercise();
        const { setCount, isResting, restEndTime } = timer.getState();
        expect(setCount).toBe(0);
        expect(isResting).toBe(false);
        expect(restEndTime).toBeNull();
    });

    test('completing the final set fires onExerciseComplete', () => {
        const onExerciseComplete = jest.fn();
        const timer = initTimer(dom, { targetSets: 1, onExerciseComplete });
        timer.completeSet();
        expect(onExerciseComplete).toHaveBeenCalledTimes(1);
    });

    test('completing the final set hides completeSetBtn', () => {
        const timer = initTimer(dom, { targetSets: 1 });
        timer.completeSet();
        expect(dom.completeSetBtn.style.display).toBe('none');
    });

    test('setConfig resets and applies new constants', () => {
        const timer = initTimer(dom, { targetSets: 10, restSeconds: 60 });
        timer.completeSet();
        timer.setConfig({ restSeconds: 2, targetSets: 2 });
        const { setCount, isResting, REST_SECONDS, TARGET_SETS } = timer.getState();
        expect(setCount).toBe(0);
        expect(isResting).toBe(false);
        expect(REST_SECONDS).toBe(2);
        expect(TARGET_SETS).toBe(2);
    });
});

// ---------------------------------------------------------------------------
// initTimer — wall-clock timer accuracy
// ---------------------------------------------------------------------------

describe('wall-clock timer', () => {
    let dom;

    beforeEach(() => {
        jest.useFakeTimers();
        dom = makeDom();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('restEndTime is set to now + REST_SECONDS ms on rest start', () => {
        let fakeNow = 1_000_000;
        const timer = initTimer(dom, { restSeconds: 60, now: () => fakeNow });
        timer.completeSet();
        expect(timer.getState().restEndTime).toBe(1_060_000);
    });

    test('timeRemaining is derived from the wall clock', () => {
        let fakeNow = 1_000_000;
        const timer = initTimer(dom, { restSeconds: 60, now: () => fakeNow });
        timer.completeSet();

        fakeNow += 30_000; // jump ahead 30 s
        jest.advanceTimersByTime(250);

        expect(timer.getState().timeRemaining).toBe(30);
    });

    test('timer ends when wall clock passes restEndTime', () => {
        let fakeNow = 1_000_000;
        const timer = initTimer(dom, { restSeconds: 5, now: () => fakeNow });
        timer.completeSet();

        fakeNow += 5_001;
        jest.advanceTimersByTime(250);

        expect(timer.getState().isResting).toBe(false);
    });

    test('onRestEnd fires when rest expires while foregrounded (within 2 s)', () => {
        let fakeNow = 1_000_000;
        const onRestEnd = jest.fn();
        const timer = initTimer(dom, { restSeconds: 5, now: () => fakeNow, onRestEnd });
        timer.completeSet();

        fakeNow += 5_001; // 1 ms past end — well within 2 s window
        jest.advanceTimersByTime(250);

        expect(onRestEnd).toHaveBeenCalledTimes(1);
    });

    test('onRestEnd is suppressed when returning from background after rest expired', () => {
        let fakeNow = 1_000_000;
        const onRestEnd = jest.fn();
        const timer = initTimer(dom, { restSeconds: 5, now: () => fakeNow, onRestEnd });
        timer.completeSet();

        fakeNow += 10_000; // 5 s after rest ended — notification already fired
        jest.advanceTimersByTime(250);

        expect(onRestEnd).not.toHaveBeenCalled();
    });
});
