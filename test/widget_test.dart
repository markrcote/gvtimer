// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter_test/flutter_test.dart';

import 'package:gvtimer/main.dart';

void main() {
  testWidgets('GVTimerApp renders correctly', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const GVTimerApp());
    await tester.pumpAndSettle();

    // Verify that the app title is displayed.
    expect(find.text('German Volume Training'), findsOneWidget);

    // Verify that the timer page is displayed.
    expect(find.byType(TimerPage), findsOneWidget);

    // Verify that the set count starts at 0.
    expect(find.text('0'), findsOneWidget);
  });

  testWidgets('Complete Set button increments set count', (
    WidgetTester tester,
  ) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const GVTimerApp());
    await tester.pumpAndSettle();

    // Verify initial set count is 0.
    expect(find.text('0'), findsOneWidget);

    // Tap the Complete Set button.
    await tester.tap(find.text('Complete Set'));
    await tester.pump();

    // Verify that the set count has incremented.
    expect(find.text('1'), findsOneWidget);
  });
}
