function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function playTones(tones) {
    const AudioCtx = (typeof window !== 'undefined') && (window.AudioContext || window.webkitAudioContext);
    if (!AudioCtx) return;
    const audioContext = new AudioCtx();
    const lastEnd = Math.max(...tones.map(t => t.start + t.duration));
    tones.forEach(({ freq, start, duration }) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.type = 'square';
        oscillator.frequency.value = freq;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + start);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + start + duration);
        oscillator.start(audioContext.currentTime + start);
        oscillator.stop(audioContext.currentTime + start + duration);
    });
    setTimeout(() => audioContext.close(), (lastEnd + 0.1) * 1000);
}

// Three ascending beeps: rest is over, time for the next set
function playRestEnd() {
    playTones([
        { freq: 220, start: 0.0,  duration: 0.12 },
        { freq: 220, start: 0.15, duration: 0.12 },
        { freq: 330, start: 0.32, duration: 0.35 },
    ]);
}

// Rising arpeggio fanfare: all sets complete
function playExerciseComplete() {
    playTones([
        { freq: 196, start: 0.0,  duration: 0.15 },
        { freq: 247, start: 0.18, duration: 0.15 },
        { freq: 294, start: 0.36, duration: 0.15 },
        { freq: 392, start: 0.54, duration: 0.6  },
    ]);
}

// opts: { restSeconds, targetSets, now, onRestEnd, onExerciseComplete }
//   now            – injectable clock function (defaults to Date.now); used for testing
//   onRestEnd      – called when rest ends while foregrounded (defaults to playRestEnd)
//   onExerciseComplete – called when all sets done (defaults to playExerciseComplete)
function initTimer(els, opts = {}) {
    const now = opts.now || (() => Date.now());
    const onRestEnd = opts.onRestEnd !== undefined ? opts.onRestEnd : playRestEnd;
    const onExerciseComplete = opts.onExerciseComplete !== undefined ? opts.onExerciseComplete : playExerciseComplete;

    let setCount = 0;
    let REST_SECONDS = opts.restSeconds !== undefined ? opts.restSeconds : 60;
    let TARGET_SETS = opts.targetSets !== undefined ? opts.targetSets : 10;
    let timeRemaining = REST_SECONDS;
    let timerInterval = null;
    let isResting = false;
    let restEndTime = null;

    els.setTotalDisplay.textContent = String(TARGET_SETS);

    function updateDisplay() {
        if (isResting) {
            els.timeDisplay.textContent = formatTime(timeRemaining);
        }
        els.setCountDisplay.textContent = String(setCount);
    }

    function enableCompleteSetBtns() {
        els.completeSetBtn.disabled = false;
        els.completeSetBtn.style.opacity = '1';
        els.completeSetBtn.style.cursor = 'pointer';
    }

    function startRestTimer() {
        isResting = true;
        timeRemaining = REST_SECONDS;
        restEndTime = now() + REST_SECONDS * 1000;
        els.timerLabel.style.display = 'block';
        updateDisplay();
        els.completeSetBtn.disabled = true;
        els.completeSetBtn.style.opacity = '0.5';
        els.completeSetBtn.style.cursor = 'not-allowed';

        if (typeof Android !== 'undefined') {
            Android.scheduleNotification(REST_SECONDS);
        }

        timerInterval = setInterval(() => {
            // Compute from wall clock so backgrounding can't cause drift
            timeRemaining = Math.max(0, Math.ceil((restEndTime - now()) / 1000));
            updateDisplay();

            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                // Cancel alarm if user stayed in-app and it hasn't fired yet
                if (typeof Android !== 'undefined') {
                    Android.cancelNotification();
                }
                els.timeDisplay.textContent = '';
                els.timerLabel.style.display = 'none';
                isResting = false;
                enableCompleteSetBtns();
                // Skip chime if returning from background — notification already alerted the user
                if (now() - restEndTime < 2000) {
                    onRestEnd();
                }
            }
        }, 250);
    }

    function completeSet() {
        if (isResting) return;
        setCount++;
        updateDisplay();

        if (setCount >= TARGET_SETS) {
            clearInterval(timerInterval);
            els.completeSetBtn.style.display = 'none';
            els.resetBtn.style.display = 'block';
            els.resetAllBtn.style.display = 'none';
            els.timeDisplay.textContent = 'Done!';
            els.timerLabel.textContent = 'Exercise Complete';
            els.timerLabel.style.display = 'block';
            onExerciseComplete();
        } else {
            startRestTimer();
        }
    }

    function resetExercise() {
        clearInterval(timerInterval);
        if (typeof Android !== 'undefined') {
            Android.cancelNotification();
        }
        setCount = 0;
        timeRemaining = REST_SECONDS;
        restEndTime = null;
        isResting = false;
        els.completeSetBtn.style.display = '';
        enableCompleteSetBtns();
        els.resetBtn.style.display = 'none';
        els.resetAllBtn.style.display = '';
        els.timeDisplay.textContent = '';
        els.timerLabel.style.display = 'none';
        els.timerLabel.textContent = 'Rest Timer';
        updateDisplay();
    }

    function setConfig({ restSeconds, targetSets } = {}) {
        if (restSeconds !== undefined) REST_SECONDS = restSeconds;
        if (targetSets !== undefined) {
            TARGET_SETS = targetSets;
            els.setTotalDisplay.textContent = String(TARGET_SETS);
        }
        resetExercise();
    }

    updateDisplay();

    return {
        completeSet,
        resetExercise,
        setConfig,
        getState: () => ({ setCount, timeRemaining, isResting, restEndTime, REST_SECONDS, TARGET_SETS }),
    };
}

if (typeof module !== 'undefined') {
    module.exports = { formatTime, initTimer };
}
