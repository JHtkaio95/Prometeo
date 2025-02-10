import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_application/src/pages/home_page.dart';
//import 'src/pages/splash_page.dart';

void main() {
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    systemNavigationBarColor:Colors.black,
  ));
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter App',
      //home: SplashPage());
      home: HomePage());
  }
}

