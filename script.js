$(document).ready(function() {
    // Background music
    const bgMusic = new Audio('sounds/background.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    
    // Codadka (15 seconds each)
    const voices = {
        1: new Audio('music/voice1.mp3'),
        2: new Audio('music/voice2.mp3'),
        3: new Audio('music/voice3.mp3')
    };

    // Set maximum duration for each voice
    const MAX_DURATION = 15; // seconds

    // State management
    const state = {
        1: { isPlaying: false },
        2: { isPlaying: false },
        3: { isPlaying: false }
    };

    // Format time function
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Update progress bar and time
    function updateProgress(voiceNumber) {
        const voice = voices[voiceNumber];
        const currentTime = Math.min(voice.currentTime, MAX_DURATION);
        const progressPercent = (currentTime / MAX_DURATION) * 100;

        $(`.progress-bar[data-voice="${voiceNumber}"]`).css('width', `${progressPercent}%`);
        $(`.progress-slider[data-voice="${voiceNumber}"]`).val(progressPercent);
        $(`.current-time[data-voice="${voiceNumber}"]`).text(formatTime(currentTime));
        $(`.duration[data-voice="${voiceNumber}"]`).text('0:15');
    }

    // Background music autoplay
    $(document).on('click', function() {
        bgMusic.play();
    });

    // Daar buttonka
    $('.play-btn').click(function() {
        const voiceNumber = $(this).data('voice');
        const voice = voices[voiceNumber];
        const voiceState = state[voiceNumber];

        if (voiceState.isPlaying) {
            voice.pause();
            $(this).html('▶️');
        } else {
            // Dami dhammaan codadka kale
            Object.entries(voices).forEach(([num, v]) => {
                if (num !== voiceNumber.toString()) {
                    v.pause();
                    v.currentTime = 0;
                    state[num].isPlaying = false;
                    $(`.play-btn[data-voice="${num}"]`).html('▶️');
                }
            });

            voice.currentTime = 0;
            voice.play();
            $(this).html('⏸️');
        }
        voiceState.isPlaying = !voiceState.isPlaying;
    });

    // Dami buttonka
    $('.stop-btn').click(function() {
        const voiceNumber = $(this).data('voice');
        const voice = voices[voiceNumber];
        voice.pause();
        voice.currentTime = 0;
        state[voiceNumber].isPlaying = false;
        $(`.play-btn[data-voice="${voiceNumber}"]`).html('▶️');
    });

    // Progress slider input with 15 second limit
    $('.progress-slider').on('input', function() {
        const voiceNumber = $(this).data('voice');
        const voice = voices[voiceNumber];
        const percentage = $(this).val();
        const time = Math.min((percentage / 100) * MAX_DURATION, MAX_DURATION);
        voice.currentTime = time;
        updateProgress(voiceNumber);
    });

    // Lock button click
    $('.lock-btn').click(function() {
        const voiceNumber = $(this).data('voice');
        state[voiceNumber].isLocked = !state[voiceNumber].isLocked;
        $(this).html(state[voiceNumber].isLocked ? '🔒' : '🔓');
    });

    // Repeat button click
    $('.repeat-btn').click(function() {
        const voiceNumber = $(this).data('voice');
        state[voiceNumber].isRepeating = !state[voiceNumber].isRepeating;
        voices[voiceNumber].loop = state[voiceNumber].isRepeating;
        $(this).toggleClass('text-blue-500');
    });

    // Previous button click (restart)
    $('.prev-btn').click(function() {
        const voiceNumber = $(this).data('voice');
        const voice = voices[voiceNumber];
        voice.currentTime = 0;
        updateProgress(voiceNumber);
    });

    // Next button click (end)
    $('.next-btn').click(function() {
        const voiceNumber = $(this).data('voice');
        const voice = voices[voiceNumber];
        voice.currentTime = voice.duration;
        updateProgress(voiceNumber);
    });

    // Update progress for all voices
    Object.keys(voices).forEach(voiceNumber => {
        const voice = voices[voiceNumber];
        voice.addEventListener('timeupdate', () => updateProgress(voiceNumber));
        voice.addEventListener('loadedmetadata', () => updateProgress(voiceNumber));
    });

    // Update duration display to show 15 seconds
    Object.keys(voices).forEach(voiceNumber => {
        $(`.duration[data-voice="${voiceNumber}"]`).text('0:15');
    });
});
