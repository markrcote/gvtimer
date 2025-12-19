import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:gvtimer/main.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const GVTimerApp());

    // Verify app title is present
    expect(find.text('German Volume Training'), findsOneWidget);
    
    // Verify initial set count is 0
    expect(find.text('0'), findsOneWidget);
    
    // Verify Complete Set button exists
    expect(find.text('Complete Set'), findsOneWidget);
  });

  testWidgets('Complete set increments counter', (WidgetTester tester) async {
    await tester.pumpWidget(const GVTimerApp());

    // Tap the Complete Set button
    await tester.tap(find.text('Complete Set'));
    await tester.pump();

    // Wait a moment for state to update
    await tester.pump(const Duration(milliseconds: 100));

    // Verify set count incremented to 1
    expect(find.text('1'), findsOneWidget);
  });
}
