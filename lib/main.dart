import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:async';

void main() {
  runApp(const GVTimerApp());
}

class GVTimerApp extends StatelessWidget {
  const GVTimerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GVTimer',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF21808D),
          brightness: Brightness.light,
        ).copyWith(
          surface: const Color(0xFFFFFFFD),
          primary: const Color(0xFF21808D),
        ),
        scaffoldBackgroundColor: const Color(0xFFFCFCF9),
        useMaterial3: true,
      ),
      darkTheme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF32B8C6),
          brightness: Brightness.dark,
        ).copyWith(
          surface: const Color(0xFF262828),
          primary: const Color(0xFF32B8C6),
        ),
        scaffoldBackgroundColor: const Color(0xFF1F2121),
        useMaterial3: true,
      ),
      themeMode: ThemeMode.system,
      home: const TimerPage(),
    );
  }
}

class TimerPage extends StatefulWidget {
  const TimerPage({super.key});

  @override
  State<TimerPage> createState() => _TimerPageState();
}

class _TimerPageState extends State<TimerPage> {
  int _setCount = 0;
  int _timeRemaining = 60;
  bool _isResting = false;
  Timer? _timer;

  String _formatTime(int seconds) {
    final mins = seconds ~/ 60;
    final secs = seconds % 60;
    return '${mins.toString().padLeft(2, '0')}:${secs.toString().padLeft(2, '0')}';
  }

  Future<void> _playBeep() async {
    // Play system sound (available on both iOS and Android)
    await SystemSound.play(SystemSoundType.alert);
  }

  void _startRestTimer() {
    setState(() {
      _isResting = true;
      _timeRemaining = 60;
    });

    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        _timeRemaining--;
      });

      if (_timeRemaining <= 0) {
        timer.cancel();
        setState(() {
          _isResting = false;
        });
        _playBeep();
      }
    });
  }

  void _completeSet() {
    if (_isResting) return;

    setState(() {
      _setCount++;
    });

    if (_setCount >= 10) {
      // Exercise complete
      _timer?.cancel();
      _playBeep();
    } else {
      // Start rest timer
      _startRestTimer();
    }
  }

  void _resetExercise() {
    _timer?.cancel();
    setState(() {
      _setCount = 0;
      _timeRemaining = 60;
      _isResting = false;
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final textColor = theme.colorScheme.onSurface;
    final textSecondaryColor = theme.colorScheme.onSurface.withOpacity(0.6);
    final primaryColor = theme.colorScheme.primary;

    return Scaffold(
      body: Center(
        child: Container(
          constraints: const BoxConstraints(maxWidth: 400),
          padding: const EdgeInsets.all(20),
          child: Card(
            elevation: 4,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 40),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'German Volume Training',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w600,
                      color: textColor,
                    ),
                  ),
                  const SizedBox(height: 30),
                  // Set display
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Set',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w500,
                          color: textSecondaryColor,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        _setCount.toString(),
                        style: TextStyle(
                          fontSize: 64,
                          fontWeight: FontWeight.w600,
                          color: primaryColor,
                          fontFeatures: const [FontFeature.tabularFigures()],
                        ),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        '/ 10',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w500,
                          color: textSecondaryColor,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  // Buttons
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      if (_setCount < 10) ...[
                        Expanded(
                          child: FilledButton(
                            onPressed: _isResting ? null : _completeSet,
                            style: FilledButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: const Text(
                              'Complete Set',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ),
                      ] else ...[
                        Expanded(
                          child: FilledButton.tonal(
                            onPressed: _resetExercise,
                            style: FilledButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: const Text(
                              'Reset for Next Exercise',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton.tonal(
                      onPressed: _resetExercise,
                      style: FilledButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'Reset',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ),
                  // Timer display
                  SizedBox(
                    height: 110,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        if (_setCount >= 10) ...[
                          Text(
                            'Done!',
                            style: TextStyle(
                              fontSize: 56,
                              fontWeight: FontWeight.w300,
                              color: textColor,
                              fontFeatures: const [FontFeature.tabularFigures()],
                              letterSpacing: 0.05,
                            ),
                          ),
                          const SizedBox(height: 10),
                          Text(
                            'Exercise Complete',
                            style: TextStyle(
                              fontSize: 14,
                              color: textSecondaryColor,
                            ),
                          ),
                        ] else if (_isResting) ...[
                          const SizedBox(height: 20),
                          Text(
                            _formatTime(_timeRemaining),
                            style: TextStyle(
                              fontSize: 56,
                              fontWeight: FontWeight.w300,
                              color: textColor,
                              fontFeatures: const [FontFeature.tabularFigures()],
                              letterSpacing: 0.05,
                            ),
                          ),
                          const SizedBox(height: 10),
                          Text(
                            'Rest Timer',
                            style: TextStyle(
                              fontSize: 14,
                              color: textSecondaryColor,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
